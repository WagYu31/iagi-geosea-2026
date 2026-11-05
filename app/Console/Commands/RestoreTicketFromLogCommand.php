<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RestoreTicketFromLogCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ticket:restore {query=80ACA8 : Kode tiket, nama, email, atau ID log}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pulihkan tiket pengunjung yang terhapus langsung dari Activity Log snapshot';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = trim($this->argument('query'));

        $this->info("=================================================================");
        $this->info("🔄 MEMULIHKAN TIKET TERHAPUS DARI ACTIVITY LOG: '{$query}'");
        $this->info("=================================================================\n");

        // 1. Search matching log in ActivityLog
        $log = ActivityLog::where('action', 'like', '%delete%')
            ->where(function ($q) use ($query) {
                $q->where('target_code', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhere('id', $query)
                  ->orWhere('snapshot', 'like', "%{$query}%");
            })
            ->latest('id')
            ->first();

        if (!$log) {
            $this->error("❌ Tidak ditemukan rekaman log penghapusan tiket dengan kata kunci '{$query}'.");
            return 1;
        }

        $snapshot = $log->snapshot;
        if (empty($snapshot) || !is_array($snapshot)) {
            $this->error("❌ Log #{$log->id} ditemukan namun tidak memiliki payload snapshot data.");
            return 1;
        }

        $ticketData = $snapshot['ticket'] ?? $snapshot;
        $paymentData = $snapshot['payment'] ?? null;
        $targetCode = $ticketData['ticket_code'] ?? ($ticketData['code'] ?? $log->target_code);

        $this->comment("Log Teridentifikasi:");
        $this->line("• ID Log        : #{$log->id}");
        $this->line("• Waktu Log     : {$log->created_at}");
        $this->line("• Aktor         : {$log->user_name} ({$log->user_email})");
        $this->line("• Kode Tiket    : {$targetCode}");
        $this->line("• Nama Peserta  : " . ($ticketData['visitor_name'] ?? '-'));
        $this->line("• Email         : " . ($ticketData['visitor_email'] ?? '-'));
        $this->line("• Instansi      : " . ($ticketData['visitor_institution'] ?? '-'));
        $this->line("• Kategori      : " . ($ticketData['visitor_type'] ?? '-'));
        $this->line("• Nilai Tiket   : Rp " . number_format((float)($ticketData['individual_price'] ?? 0), 0, ',', '.'));

        // Check if ticket already active
        if ($targetCode) {
            $existing = VisitorTicket::where('ticket_code', $targetCode)->first();
            if ($existing) {
                $this->warn("\n⚠️ Tiket dengan kode {$targetCode} sudah ada / aktif di database (ID #{$existing->id})!");
                return 0;
            }
        }

        DB::beginTransaction();
        try {
            // Restore Payment if needed
            $paymentId = $ticketData['payment_id'] ?? ($paymentData['id'] ?? null);
            if ($paymentData && is_array($paymentData)) {
                $existingPayment = null;
                if ($paymentId) {
                    $existingPayment = VisitorPayment::find($paymentId);
                }
                if (!$existingPayment && !empty($paymentData['payment_code'])) {
                    $existingPayment = VisitorPayment::where('payment_code', $paymentData['payment_code'])->first();
                }

                if (!$existingPayment) {
                    $pInsert = [
                        'payment_code' => $paymentData['payment_code'] ?? ('ONSITE-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)))),
                        'payment_method' => $paymentData['payment_method'] ?? 'manual_bank_transfer',
                        'total_members' => $paymentData['total_members'] ?? 1,
                        'price_per_ticket' => $paymentData['price_per_ticket'] ?? ($paymentData['total_amount'] ?? 0),
                        'unique_code' => $paymentData['unique_code'] ?? 0,
                        'total_amount' => $paymentData['total_amount'] ?? 0,
                        'proof_of_payment' => $paymentData['proof_of_payment'] ?? null,
                        'status' => $paymentData['status'] ?? 'approved',
                        'is_mixed_category' => $paymentData['is_mixed_category'] ?? false,
                        'pic_name' => $paymentData['pic_name'] ?? ($ticketData['visitor_name'] ?? 'Peserta'),
                        'pic_email' => $paymentData['pic_email'] ?? ($ticketData['visitor_email'] ?? null),
                        'pic_phone' => $paymentData['pic_phone'] ?? ($ticketData['visitor_phone'] ?? null),
                        'pic_institution' => $paymentData['pic_institution'] ?? ($ticketData['visitor_institution'] ?? null),
                        'is_debt' => $paymentData['is_debt'] ?? false,
                        'debt_notes' => $paymentData['debt_notes'] ?? null,
                        'notes' => ($paymentData['notes'] ?? '') . ' [Restored via CLI from Log #' . $log->id . ']',
                        'verified_at' => $paymentData['verified_at'] ?? now(),
                    ];
                    if (!empty($paymentData['id']) && !VisitorPayment::where('id', $paymentData['id'])->exists()) {
                        $pInsert['id'] = $paymentData['id'];
                    }
                    $createdPayment = VisitorPayment::create($pInsert);
                    $paymentId = $createdPayment->id;
                    $this->info("   -> Payment Invoice {$createdPayment->payment_code} berhasil dipulihkan.");
                } else {
                    $paymentId = $existingPayment->id;
                }
            }

            // Restore Ticket
            $tInsert = [
                'payment_id' => $paymentId,
                'registered_by_admin_id' => $ticketData['registered_by_admin_id'] ?? null,
                'registration_source' => $ticketData['registration_source'] ?? 'admin_onsite',
                'visitor_name' => $ticketData['visitor_name'] ?? ($ticketData['name'] ?? 'Peserta'),
                'visitor_email' => $ticketData['visitor_email'] ?? ($ticketData['email'] ?? ''),
                'visitor_phone' => $ticketData['visitor_phone'] ?? ($ticketData['phone'] ?? null),
                'visitor_institution' => $ticketData['visitor_institution'] ?? ($ticketData['institution'] ?? null),
                'ticket_code' => $targetCode ?: ('TKT-RESTORE-' . strtoupper(bin2hex(random_bytes(3)))),
                'visitor_type' => $ticketData['visitor_type'] ?? ($ticketData['type'] ?? 'non_iagi_member_professional'),
                'individual_price' => $ticketData['individual_price'] ?? ($ticketData['price'] ?? 0),
                'is_group_leader' => $ticketData['is_group_leader'] ?? false,
                'group_code' => $ticketData['group_code'] ?? null,
                'status' => $ticketData['status'] ?? 'active',
                'checked_in' => $ticketData['checked_in'] ?? false,
                'checked_in_at' => $ticketData['checked_in_at'] ?? null,
                'card_printed' => $ticketData['card_printed'] ?? false,
                'card_printed_at' => $ticketData['card_printed_at'] ?? null,
                'email_sent_at' => $ticketData['email_sent_at'] ?? null,
                'email_sent_count' => $ticketData['email_sent_count'] ?? 0,
            ];

            if (!empty($ticketData['id']) && !VisitorTicket::where('id', $ticketData['id'])->exists()) {
                $tInsert['id'] = $ticketData['id'];
            }

            $restoredTicket = VisitorTicket::create($tInsert);

            ActivityLog::record(
                action: 'restore_ticket',
                module: 'visitor_tickets',
                description: "Memulihkan tiket {$restoredTicket->ticket_code} ({$restoredTicket->visitor_name}) dari CLI",
                targetId: $restoredTicket->id,
                targetCode: $restoredTicket->ticket_code,
                snapshot: $restoredTicket->toArray()
            );

            DB::commit();

            $this->info("\n🎉 SUKSES! TIKET BERHASIL DIPULIHKAN:");
            $this->info("   • Kode Tiket : {$restoredTicket->ticket_code}");
            $this->info("   • Nama       : {$restoredTicket->visitor_name}");
            $this->info("   • Email      : {$restoredTicket->visitor_email}");
            $this->info("   • Instansi   : {$restoredTicket->visitor_institution}");
            $this->info("   • Kategori   : {$restoredTicket->visitor_type}");
            $this->info("   • Status     : {$restoredTicket->status}");
            $this->info("   • Payment ID : #" . ($restoredTicket->payment_id ?? '-'));
            $this->info("=================================================================");

            return 0;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("\n❌ Gagal memulihkan tiket: " . $e->getMessage());
            return 1;
        }
    }
}
