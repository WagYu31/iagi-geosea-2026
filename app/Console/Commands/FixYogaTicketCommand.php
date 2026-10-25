<?php

namespace App\Console\Commands;

use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixYogaTicketCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ticket:fix-yoga {--code=765 : Unique code (default 765)} {--method=bank_transfer : Payment method}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set atau perbaiki kode unik 765 dan nominal total tiket Yoga Adriana (UNPAD)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $uniqueCode = (int) ($this->option('code') ?: 765);
        $method = $this->option('method') ?: 'bank_transfer';
        $email = 'yoga@unpad.ac.id';
        $name = 'Yoga Adriana';
        $phone = '+62 812-2166-8872';
        $institution = 'Universitas Padjadjaran (UNPAD)';
        $category = 'iagi_member_professional';
        $price = 3000000;
        $totalAmount = $price + $uniqueCode;

        $this->info("=================================================");
        $this->info("MEMPERBAIKI KODE UNIK & TOTAL TIKET YOGA ADRIANA");
        $this->info("Target: {$name} ({$email})");
        $this->info("Kode Unik: {$uniqueCode} | Total: Rp " . number_format($totalAmount, 0, ',', '.'));
        $this->info("=================================================");

        DB::beginTransaction();
        try {
            $ticket = VisitorTicket::where('visitor_email', $email)
                ->orWhere('ticket_code', 'TKT-IPR0-261025-3C48')
                ->first();

            $payment = null;

            if ($ticket) {
                $ticket->update([
                    'visitor_name' => $name,
                    'visitor_phone' => $phone,
                    'visitor_institution' => $institution,
                    'visitor_type' => $category,
                    'individual_price' => $price,
                    'status' => 'active',
                ]);

                if ($ticket->payment_id) {
                    $payment = VisitorPayment::find($ticket->payment_id);
                }
            }

            if (!$payment) {
                $payment = VisitorPayment::where('pic_email', $email)
                    ->orWhere('payment_code', 'LIKE', 'ONSITE-261025-97EEF7%')
                    ->first();
            }

            if ($payment) {
                $payment->update([
                    'payment_method' => $method,
                    'unique_code' => $uniqueCode,
                    'total_amount' => $totalAmount,
                    'price_per_ticket' => $price,
                    'status' => 'approved',
                    'verified_at' => $payment->verified_at ?: now(),
                    'pic_name' => $name,
                    'pic_email' => $email,
                    'pic_phone' => $phone,
                    'pic_institution' => $institution,
                ]);

                if ($ticket && !$ticket->payment_id) {
                    $ticket->update(['payment_id' => $payment->id]);
                }
            } else {
                $payment = VisitorPayment::create([
                    'payment_code' => 'ONSITE-261025-97EEF7',
                    'payment_method' => $method,
                    'total_members' => 1,
                    'price_per_ticket' => $price,
                    'unique_code' => $uniqueCode,
                    'total_amount' => $totalAmount,
                    'status' => 'approved',
                    'verified_at' => now(),
                    'pic_name' => $name,
                    'pic_email' => $email,
                    'pic_phone' => $phone,
                    'pic_institution' => $institution,
                    'is_mixed_category' => false,
                    'notes' => 'Restored with unique code ' . $uniqueCode,
                ]);

                if (!$ticket) {
                    $ticket = VisitorTicket::create([
                        'payment_id' => $payment->id,
                        'registration_source' => 'admin_onsite',
                        'visitor_name' => $name,
                        'visitor_email' => $email,
                        'visitor_phone' => $phone,
                        'visitor_institution' => $institution,
                        'ticket_code' => 'TKT-IPR0-261025-3C48',
                        'visitor_type' => $category,
                        'individual_price' => $price,
                        'status' => 'active',
                    ]);
                } else {
                    $ticket->update(['payment_id' => $payment->id]);
                }
            }

            DB::commit();

            $this->info("✅ SUKSES! TIKET & PEMBAYARAN TELAH DIPERBARUI:");
            $this->table(
                ['Item', 'Detail'],
                [
                    ['Kode Tiket', $ticket->ticket_code],
                    ['Nama Peserta', $ticket->visitor_name],
                    ['Email', $ticket->visitor_email],
                    ['Kategori', 'PRO (MEMBER) - iagi_member_professional'],
                    ['Subtotal Tiket', 'Rp ' . number_format($price, 0, ',', '.')],
                    ['Kode Unik Transfer', '+' . $uniqueCode],
                    ['TOTAL PEMBAYARAN', 'Rp ' . number_format($payment->total_amount, 0, ',', '.')],
                    ['Metode Pembayaran', $payment->payment_method === 'bank_transfer' ? 'Mandiri Bank Transfer' : $payment->payment_method],
                    ['Status Pembayaran', strtoupper($payment->status)],
                    ['Invoice / Payment Code', $payment->payment_code],
                    ['Receipt URL', route('visitor.receipt.show', $payment->payment_code)],
                ]
            );

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("❌ Gagal memperbarui data: " . $e->getMessage());
            return 1;
        }
    }
}
