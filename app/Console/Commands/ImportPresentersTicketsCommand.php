<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VisitorTicket;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use ZipArchive;

class ImportPresentersTicketsCommand extends Command
{
    protected $signature = 'import:presenters-tickets {--dry-run : Test run without inserting to database}';
    protected $description = 'Import 186 presenter dari FIX PRESENTER fixxx.xlsx ke Visitor Tickets';

    public function handle()
    {
        $this->info("======================================================================");
        $this->info(" IMPORT PRESENTER TICKETS (186 ORAL & POSTER)");
        $this->info("======================================================================\n");

        $isDryRun = $this->option('dry-run');
        if ($isDryRun) {
            $this->warn("MODUS DRY-RUN: Data tidak akan disimpan ke database.\n");
        }

        $xlsxPath = base_path('.well-known/FIX PRESENTER fixxx.xlsx');
        $csvPath = base_path('import_presenters_ready.csv');

        $presenters = [];

        if (file_exists($csvPath)) {
            $this->line("Membaca data dari: import_presenters_ready.csv");
            $presenters = $this->readFromCsv($csvPath);
        } elseif (file_exists($xlsxPath)) {
            $this->line("Membaca data dari: .well-known/FIX PRESENTER fixxx.xlsx");
            $presenters = $this->readFromXlsx($xlsxPath);
        } else {
            $this->error("File sumber tidak ditemukan di project root!");
            return 1;
        }

        $total = count($presenters);
        $this->info("Total data ditemukan: {$total} peserta presenter.\n");

        $created = 0;
        $skipped = 0;

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($presenters as $p) {
            $email = trim($p['email']);
            $name = trim($p['name']);
            $phone = trim($p['phone']);
            $institution = trim($p['institution']);

            // Cek duplikasi berdasarkan email
            $existing = VisitorTicket::where('visitor_email', $email)
                ->where('visitor_type', 'presenter')
                ->first();

            if ($existing) {
                $skipped++;
                $bar->advance();
                continue;
            }

            if (!$isDryRun) {
                $ticketCode = VisitorTicket::generateTicketCode('presenter');
                VisitorTicket::create([
                    'registered_by_admin_id' => 1,
                    'registration_source' => 'admin_import_excel',
                    'visitor_name' => $name,
                    'visitor_email' => !empty($email) ? $email : null,
                    'visitor_phone' => !empty($phone) ? $phone : null,
                    'visitor_institution' => !empty($institution) ? $institution : null,
                    'ticket_code' => $ticketCode,
                    'visitor_type' => 'presenter',
                    'status' => 'active',
                    'checked_in' => false,
                    'card_printed' => false,
                    'is_group_leader' => true,
                ]);
            }

            $created++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("======================================================================");
        $this->info(" HASIL IMPORT:");
        $this->info(" Berhasil ditambahkan : {$created} tiket presenter (Status: ACTIVE, FREE)");
        $this->info(" Dilewati (Sudah ada) : {$skipped}");
        $this->info(" Total diproses       : {$total}");
        $this->info("======================================================================\n");

        if (!$isDryRun && $created > 0) {
            ActivityLog::record(
                action: 'import_tickets_excel',
                module: 'visitor_tickets',
                description: "Import {$created} data presenter dari FIX PRESENTER fixxx.xlsx",
                snapshot: [
                    'created' => $created,
                    'skipped' => $skipped,
                    'total' => $total,
                ]
            );
        }

        return 0;
    }

    private function readFromCsv(string $path): array
    {
        $rows = [];
        if (($handle = fopen($path, 'r')) !== false) {
            $header = fgetcsv($handle);
            while (($data = fgetcsv($handle)) !== false) {
                if (!empty($data[0])) {
                    $rows[] = [
                        'name' => $data[0] ?? '',
                        'email' => $data[1] ?? '',
                        'phone' => $data[2] ?? '',
                        'institution' => $data[3] ?? '',
                        'category' => $data[4] ?? 'Presenter',
                    ];
                }
            }
            fclose($handle);
        }
        return $rows;
    }

    private function readFromXlsx(string $path): array
    {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) return [];

        $sharedStrings = [];
        $sharedXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($sharedXml) {
            $sXml = @simplexml_load_string($sharedXml);
            if ($sXml && isset($sXml->si)) {
                foreach ($sXml->si as $si) {
                    if (isset($si->t)) {
                        $sharedStrings[] = (string)$si->t;
                    } elseif (isset($si->r)) {
                        $tParts = [];
                        foreach ($si->r as $r) { $tParts[] = (string)$r->t; }
                        $sharedStrings[] = implode('', $tParts);
                    } else {
                        $sharedStrings[] = '';
                    }
                }
            }
        }

        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();
        if (!$sheetXml) return [];

        $xml = @simplexml_load_string($sheetXml);
        $rows = [];
        foreach ($xml->sheetData->row as $rowXml) {
            $row = [];
            foreach ($rowXml->c as $cell) {
                $cellRef = (string)$cell['r'];
                preg_match('/^([A-Z]+)/', strtoupper($cellRef), $m);
                $colIdx = 0;
                if (!empty($m[1])) {
                    $colStr = $m[1];
                    for ($j = 0; $j < strlen($colStr); $j++) {
                        $colIdx = $colIdx * 26 + (ord($colStr[$j]) - ord('A') + 1);
                    }
                    $colIdx -= 1;
                }

                $val = (string)$cell->v;
                $type = (string)$cell['t'];
                if ($type === 's' && isset($sharedStrings[(int)$val])) {
                    $val = $sharedStrings[(int)$val];
                } elseif ($type === 'inlineStr' && isset($cell->is->t)) {
                    $val = (string)$cell->is->t;
                }
                $row[$colIdx] = trim($val);
            }

            $c0 = $row[0] ?? '';
            if (is_numeric($c0) && !empty($row[1])) {
                $rows[] = [
                    'name' => $row[1] ?? '',
                    'email' => $row[2] ?? '',
                    'phone' => $row[3] ?? '',
                    'institution' => $row[4] ?? '',
                    'category' => $row[5] ?? 'Presenter',
                ];
            }
        }

        return $rows;
    }
}
