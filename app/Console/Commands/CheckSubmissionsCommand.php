<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Submission;

class CheckSubmissionsCommand extends Command
{
    protected $signature = 'check:submissions';
    protected $description = 'Pengecekan 5 paper dari Gambar 2 di database live submissions';

    public function handle()
    {
        $this->info("======================================================================");
        $this->info(" PENGECEKAN 5 JUDUL DARI GAMBAR 2 TERHADAP DATABASE LIVE");
        $this->info("======================================================================\n");

        $targets = [
            [
                'code' => 'POIG-001W',
                'title' => 'LEVERAGING GEOSPATIAL TECHNOLOGIES TO MANAGE GEOLOGICAL COMPLEXITY IN RESOURCE ESTIMATION OF ION ADSORPTION CLAY RARE EARTH ELEMENT DEPOSIT (IAC-REE) MINING',
                'keywords' => ['geospatial', 'adsorption', 'iac-ree', 'rare earth element']
            ],
            [
                'code' => 'SOIG-013',
                'title' => 'Geology, Alteration, and Ore Mineralogy Characteristics in Prospects "A" and "B", Bakan District, Bolaang Mongondow, North Sulawesi',
                'keywords' => ['bakan', 'bolaang', 'mongondow', 'prospects']
            ],
            [
                'code' => 'POIG-152',
                'title' => 'AN ADAPTIVE GEOLOGICAL–OPERATIONAL RISK INDEX FOR CONTAMINATION CONTROL IN MULTI-SEAM COAL MINING: A DATA-CALIBRATED DECISION-SUPPORT FRAMEWORK FROM TANJUNG ENIM, INDONESIA',
                'keywords' => ['adaptive geological', 'contamination', 'multi-seam', 'tanjung enim']
            ],
            [
                'code' => 'POIG-086',
                'title' => 'Granitoids Characteristics and Its Implocation on Rare Earth Elements (REEs) Mineralisation: Case Study of Granitoid Fm. Embuoi in Sanggau, West Kalimantan, Indonesia',
                'keywords' => ['granitoid', 'embuoi', 'sanggau', 'implocation']
            ],
            [
                'code' => 'POIG-003W',
                'title' => 'Integrating Igneous Thermal Anomaly into Basin Modeling Pre-Tertiary Source Rock Maturity Assessment in the Salawati Basin, SouthWest Papua',
                'keywords' => ['igneous thermal', 'basin modeling', 'pre-tertiary', 'salawati']
            ]
        ];

        foreach ($targets as $i => $target) {
            $num = $i + 1;
            $code = $target['code'];
            $cleanCode = str_replace('W', '', $code);

            $this->line("<fg=yellow;options=bold>[{$num}] KODE GAMBAR 2: {$code}</>");
            $this->line("Judul Gambar 2: {$target['title']}");

            // 1. Search by exact code or clean code
            $byCode = Submission::with('user')
                ->where('submission_code', $code)
                ->orWhere('submission_code', $cleanCode)
                ->get();

            // 2. Search by keyword in title
            $byTitle = Submission::with('user')
                ->where(function ($q) use ($target) {
                    foreach ($target['keywords'] as $kw) {
                        $q->orWhere('title', 'LIKE', '%' . $kw . '%');
                    }
                })
                ->get();

            // Merge & unique
            $allMatches = $byCode->merge($byTitle)->unique('id');

            if ($allMatches->isEmpty()) {
                $this->error("-> STATUS: TIDAK DITEMUKAN DI DATABASE (Sama sekali tidak ada)");
            } else {
                foreach ($allMatches as $m) {
                    $isExactCode = (strcasecmp($m->submission_code, $code) === 0);
                    $isCleanCode = (strcasecmp($m->submission_code, $cleanCode) === 0);
                    $authorName = $m->author_full_name ?: ($m->user ? $m->user->name : '-');
                    $authorEmail = $m->corresponding_author_email ?: ($m->user ? $m->user->email : '-');

                    if ($isExactCode) {
                        $this->info("-> STATUS: MATCH PERSIS KODE ({$m->submission_code})");
                    } elseif ($isCleanCode) {
                        $this->comment("-> STATUS: DITEMUKAN KODE MIRIP ({$m->submission_code})");
                    } else {
                        $this->line("-> MATCH KATA KUNCI: ({$m->submission_code})");
                    }

                    $this->table(
                        ['Field', 'Nilai di Database Live'],
                        [
                            ['ID Submission', '#' . $m->id],
                            ['Kode Submission', $m->submission_code ?? '-'],
                            ['Judul di DB', $m->title],
                            ['Author', $authorName . ' (' . $authorEmail . ')'],
                            ['Status', $m->status ?? '-'],
                            ['Tipe Presentasi', $m->presentation_preference ?? '-'],
                            ['Tema Paper', $m->paper_theme ?? '-'],
                        ]
                    );
                }
            }
            $this->line("----------------------------------------------------------------------\n");
        }

        return 0;
    }
}
