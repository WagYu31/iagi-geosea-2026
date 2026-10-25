<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FindDeletedTicketCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ticket:find-deleted {query=yoga : Nama, email, atau no HP} {--restore : Otomatis pulihkan tiket jika ditemukan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cari dan pulihkan data tiket pengunjung yang terhapus dari activity_logs dan database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = trim($this->argument('query'));
        $shouldRestore = $this->option('restore');

        $this->info("=================================================================");
        $this->info("🔍 MENCARI DATA TERHAPUS / TIKET: '{$query}'");
        $this->info("=================================================================\n");

        $foundFromLogs = [];

        // 1. Search in activity_logs
        if (Schema::hasTable('activity_logs')) {
            $this->comment("1. Memeriksa tabel activity_logs...");
            $logs = ActivityLog::where(function ($q) use ($query) {
                $q->where('description', 'like', "%{$query}%")
                  ->orWhere('target_code', 'like', "%{$query}%")
                  ->orWhere('snapshot', 'like', "%{$query}%");
            })->orderBy('created_at', 'desc')->get();

            $this->line("   Ditemukan " . $logs->count() . " log aktivitas terkait.\n");

            foreach ($logs as $log) {
                $snapshot = $log->snapshot;
                if (!$snapshot || !is_array($snapshot)) continue;

                // Single ticket delete
                if (isset($snapshot['ticket']) && is_array($snapshot['ticket'])) {
                    $t = $snapshot['ticket'];
                    $textCorpus = json_encode($t) . ' ' . $log->description;
                    if (stripos($textCorpus, $query) !== false) {
                        $foundFromLogs[] = [
                            'source' => "ActivityLog #{$log->id} ({$log->action})",
                            'log_id' => $log->id,
                            'ticket' => $t,
                            'payment' => $snapshot['payment'] ?? null,
                            'deleted_at' => $log->created_at->format('Y-m-d H:i:s'),
                            'deleted_by' => $log->user_name . " ({$log->user_email})",
                        ];
                    }
                }

                // Bulk tickets delete
                if (isset($snapshot['tickets']) && is_array($snapshot['tickets'])) {
                    foreach ($snapshot['tickets'] as $t) {
                        $textCorpus = json_encode($t) . ' ' . $log->description;
                        if (stripos($textCorpus, $query) !== false) {
                            $foundFromLogs[] = [
                                'source' => "ActivityLog #{$log->id} ({$log->action})",
                                'log_id' => $log->id,
                                'ticket' => $t,
                                'payment' => null,
                                'deleted_at' => $log->created_at->format('Y-m-d H:i:s'),
                                'deleted_by' => $log->user_name . " ({$log->user_email})",
                            ];
                        }
                    }
                }
            }
        }

        // Display results from Activity Logs
        if (!empty($foundFromLogs)) {
            $this->info("✅ DITEMUKAN " . count($foundFromLogs) . " DATA TIKET TERHAPUS DI AUDIT LOG:\n");
            foreach ($foundFromLogs as $idx => $item) {
                $t = $item['ticket'];
                $num = $idx + 1;
                $this->warn("--- [HASIL #{$num}] Sumber: {$item['source']} ---");
                $this->line("• ID Asli       : " . ($t['id'] ?? '-'));
                $this->line("• Kode Tiket    : " . ($t['ticket_code'] ?? ($t['code'] ?? '-')));
                $this->line("• Nama Lengkap  : " . ($t['visitor_name'] ?? ($t['name'] ?? '-')));
                $this->line("• Email         : " . ($t['visitor_email'] ?? ($t['email'] ?? '-')));
                $this->line("• No. Handphone : " . ($t['visitor_phone'] ?? ($t['phone'] ?? '-')));
                $this->line("• Institusi     : " . ($t['visitor_institution'] ?? ($t['institution'] ?? '-')));
                $this->line("• Kategori/Type : " . ($t['visitor_type'] ?? ($t['type'] ?? '-')));
                $this->line("• Harga Tiket   : Rp " . number_format((float) ($t['individual_price'] ?? ($t['price'] ?? 0)), 0, ',', '.'));
                $this->line("• Status Tiket  : " . ($t['status'] ?? 'active'));
                $this->line("• Waktu Hapus   : " . $item['deleted_at']);
                $this->line("• Dihapus Oleh  : " . $item['deleted_by']);

                if (!empty($item['payment'])) {
                    $p = $item['payment'];
                    $this->line("• Kode Invoice  : " . ($p['payment_code'] ?? '-'));
                    $this->line("• Status Bayar  : " . ($p['payment_status'] ?? '-'));
                    $this->line("• Bukti Bayar   : " . ($p['payment_proof'] ?? '-'));
                }
                $this->line("");

                // Restore if requested
                if ($shouldRestore || $this->confirm("Apakah Anda ingin MEMULIHKAN (RESTORE) tiket {$num} ini ke database?", true)) {
                    $this->restoreTicketItem($t, $item['payment']);
                }
            }
        } else {
            $this->warn("⚠️  Tidak ditemukan tiket dengan kata kunci '{$query}' di activity_logs.");
        }

        // 2. Search in current visitor_tickets table (in case still exists with different status)
        $this->comment("\n2. Memeriksa tabel visitor_tickets yang ada saat ini...");
        $activeTickets = VisitorTicket::where(function ($q) use ($query) {
            $q->where('visitor_name', 'like', "%{$query}%")
              ->orWhere('visitor_email', 'like', "%{$query}%")
              ->orWhere('visitor_phone', 'like', "%{$query}%")
              ->orWhere('ticket_code', 'like', "%{$query}%");
        })->get();

        if ($activeTickets->isNotEmpty()) {
            $this->info("ℹ️  Ditemukan " . $activeTickets->count() . " tiket aktif/eksisting di tabel visitor_tickets:");
            foreach ($activeTickets as $at) {
                $this->line("   - [{$at->ticket_code}] {$at->visitor_name} ({$at->visitor_email}) - Status: {$at->status}");
            }
        } else {
            $this->line("   Tidak ada data yang cocok di tabel visitor_tickets saat ini.");
        }

        // 3. Search in visitor_payments table
        $this->comment("\n3. Memeriksa tabel visitor_payments...");
        $payments = VisitorPayment::where(function ($q) use ($query) {
            $q->where('pic_email', 'like', "%{$query}%")
              ->orWhere('pic_name', 'like', "%{$query}%")
              ->orWhere('pic_phone', 'like', "%{$query}%")
              ->orWhere('payment_code', 'like', "%{$query}%")
              ->orWhere('debt_notes', 'like', "%{$query}%");
        })->get();

        if ($payments->isNotEmpty()) {
            $this->info("ℹ️  Ditemukan " . $payments->count() . " data di tabel visitor_payments:");
            foreach ($payments as $p) {
                $this->line("   - [{$p->payment_code}] {$p->pic_name} ({$p->pic_email}) - Rp " . number_format($p->total_amount, 0, ',', '.') . " - Status: {$p->status}");
            }
        } else {
            $this->line("   Tidak ada data di tabel visitor_payments.");
        }

        // 4. Search in users table
        if (Schema::hasTable('users')) {
            $this->comment("\n4. Memeriksa tabel users (Akun Terdaftar)...");
            $users = DB::table('users')->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%");
            })->get();

            if ($users->isNotEmpty()) {
                $this->info("ℹ️  Ditemukan " . $users->count() . " akun pengguna di tabel users:");
                foreach ($users as $u) {
                    $this->line("   - [ID: {$u->id}] {$u->name} ({$u->email}) - Phone: " . ($u->phone ?? '-'));
                }
            } else {
                $this->line("   Tidak ada data di tabel users.");
            }
        }

        // 5. Fallback helper for Yoga Adriana
        if (empty($foundFromLogs) && $activeTickets->isEmpty() && (stripos($query, 'yoga') !== false || stripos($query, 'unpad') !== false)) {
            $this->warn("\n💡 Data Yoga Adriana tidak ditemukan di riwayat log terhapus.");
            if ($this->confirm("Apakah Anda ingin mendaftarkan / membuatkan kembali tiket untuk Yoga Adriana (yoga@unpad.ac.id) sekarang?", true)) {
                $category = $this->choice("Pilih Kategori Tiket:", [
                    'student_undergraduate' => 'Student Undergraduate (Rp 1.000.000)',
                    'student' => 'Student Technical (Free / Invited)',
                    'presenter' => 'Student / Presenter',
                    'non_iagi_member' => 'Non-IAGI Member (Rp 2.000.000)',
                    'iagi_member' => 'IAGI Member (Rp 1.500.000)',
                ], 'student_undergraduate');

                $price = match($category) {
                    'student_undergraduate' => 1000000,
                    'iagi_member' => 1500000,
                    'non_iagi_member' => 2000000,
                    default => 0
                };

                $prefix = match($category) {
                    'student_undergraduate', 'student', 'presenter' => 'TKT-STUD',
                    'iagi_member' => 'TKT-MBR',
                    'non_iagi_member' => 'TKT-NON',
                    default => 'TKT-VIS'
                };

                // Generate random unique code
                $tCode = $prefix . '-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));

                // Create payment if price > 0
                $payId = null;
                if ($price > 0) {
                    $pay = VisitorPayment::create([
                        'payment_code' => 'INV-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(2))),
                        'pic_name' => 'Yoga Adriana',
                        'pic_email' => 'yoga@unpad.ac.id',
                        'pic_phone' => '+62 812-2166-8872',
                        'pic_institution' => 'Universitas Padjadjaran (UNPAD)',
                        'total_amount' => $price,
                        'status' => 'verified',
                        'is_mixed_category' => false,
                    ]);
                    $payId = $pay->id;
                }

                $newTicket = VisitorTicket::create([
                    'payment_id' => $payId,
                    'registration_source' => 'restored_onsite_terminal',
                    'visitor_name' => 'Yoga Adriana',
                    'visitor_email' => 'yoga@unpad.ac.id',
                    'visitor_phone' => '+62 812-2166-8872',
                    'visitor_institution' => 'Universitas Padjadjaran (UNPAD)',
                    'ticket_code' => $tCode,
                    'visitor_type' => $category,
                    'individual_price' => $price,
                    'status' => 'active',
                ]);

                $this->info("\n🎉 TIKET YOGA ADRIANA BERHASIL DIBUAT / DIPULIHKAN:");
                $this->info("   • Kode Tiket : {$newTicket->ticket_code}");
                $this->info("   • Nama       : {$newTicket->visitor_name}");
                $this->info("   • Email      : {$newTicket->visitor_email}");
                $this->info("   • No. HP     : {$newTicket->visitor_phone}");
                $this->info("   • Institusi  : {$newTicket->visitor_institution}");
                $this->info("   • Kategori   : {$newTicket->visitor_type}");
                $this->info("   • Status     : {$newTicket->status}");
            }
        }

        $this->info("\n=================================================================");
        $this->info("SELESAI.");
        $this->info("=================================================================");

        return 0;
    }

    /**
     * Restore ticket item back into database
     */
    private function restoreTicketItem(array $t, ?array $p = null)
    {
        $code = $t['ticket_code'] ?? ($t['code'] ?? null);
        $name = $t['visitor_name'] ?? ($t['name'] ?? null);
        $email = $t['visitor_email'] ?? ($t['email'] ?? null);

        if (!$name || !$email) {
            $this->error("Gagal memulihkan: Data nama atau email tidak lengkap.");
            return;
        }

        // Check if ticket already exists
        if ($code && VisitorTicket::where('ticket_code', $code)->exists()) {
            $this->warn("Tiket dengan kode {$code} sudah ada di database!");
            return;
        }

        DB::beginTransaction();
        try {
            $paymentId = null;

            // Restore payment if available and needed
            if ($p && !empty($p['payment_code'])) {
                $payment = VisitorPayment::where('payment_code', $p['payment_code'])->first();
                if (!$payment) {
                    $paymentData = $p;
                    unset($paymentData['id'], $paymentData['created_at'], $paymentData['updated_at']);
                    $payment = VisitorPayment::create($paymentData);
                    $this->info("   -> Payment invoice {$payment->payment_code} berhasil dipulihkan.");
                }
                $paymentId = $payment->id;
            } elseif (!empty($t['payment_id'])) {
                if (VisitorPayment::where('id', $t['payment_id'])->exists()) {
                    $paymentId = $t['payment_id'];
                }
            }

            // Restore visitor ticket
            $ticket = VisitorTicket::create([
                'payment_id' => $paymentId,
                'registered_by_admin_id' => $t['registered_by_admin_id'] ?? null,
                'registration_source' => $t['registration_source'] ?? 'restored_from_trash',
                'visitor_name' => $name,
                'visitor_email' => $email,
                'visitor_phone' => $t['visitor_phone'] ?? ($t['phone'] ?? null),
                'visitor_institution' => $t['visitor_institution'] ?? ($t['institution'] ?? 'Universitas Padjadjaran'),
                'ticket_code' => $code ?? ('TKT-RESTORE-' . strtoupper(bin2hex(random_bytes(3)))),
                'visitor_type' => $t['visitor_type'] ?? ($t['type'] ?? 'student_undergraduate'),
                'individual_price' => $t['individual_price'] ?? ($t['price'] ?? 0),
                'is_group_leader' => $t['is_group_leader'] ?? false,
                'group_code' => $t['group_code'] ?? null,
                'status' => 'active',
                'checked_in' => $t['checked_in'] ?? false,
                'checked_in_at' => $t['checked_in_at'] ?? null,
                'card_printed' => $t['card_printed'] ?? false,
            ]);

            DB::commit();

            $this->info("🎉 TIKET BERHASIL DIPULIHKAN!");
            $this->info("   Kode Tiket : {$ticket->ticket_code}");
            $this->info("   Nama       : {$ticket->visitor_name}");
            $this->info("   Email      : {$ticket->visitor_email}");
            $this->info("   Status     : {$ticket->status}\n");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Gagal memulihkan tiket: " . $e->getMessage());
        }
    }
}
