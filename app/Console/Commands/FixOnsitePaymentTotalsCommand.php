<?php

namespace App\Console\Commands;

use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixOnsitePaymentTotalsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tickets:fix-onsite-payment-totals {--code= : Optional specific payment code to fix (e.g. ONSITE-261102-TQUKPB)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix and recalculate total_amount and individual_price for group and onsite visitor payments';

    public function handle()
    {
        $specificCode = $this->option('code');

        $paidCategories = [
            'iagi_member_professional' => 3000000,
            'non_iagi_member_professional' => 4000000,
            'iagi_member_expatriate' => 6000000,
            'non_iagi_member_expatriate' => 7000000,
            'student_undergraduate' => 1000000,
            'dosen' => 1500000,
            'professional' => 1500000,
            'professional_1500' => 1500000,
            'exclusive' => 500000,
            'non_exclusive' => 0,
        ];

        $query = VisitorPayment::with('tickets');
        if ($specificCode) {
            $query->where('payment_code', $specificCode);
        } else {
            // Find payments where tickets count > 1 or payments with desynchronized totals
            $query->has('tickets', '>', 1);
        }

        $payments = $query->get();

        if ($payments->isEmpty()) {
            $this->info("Tidak ada pembayaran yang perlu diperbaiki.");
            return 0;
        }

        $this->info("Ditemukan " . $payments->count() . " pembayaran untuk diperiksa...");

        $fixedCount = 0;

        foreach ($payments as $payment) {
            $tickets = $payment->tickets;
            if ($tickets->isEmpty()) continue;

            $subtotal = 0;
            $ticketUpdated = false;

            foreach ($tickets as $ticket) {
                $vType = $ticket->visitor_type;
                $indPrice = (float) $ticket->individual_price;

                if ($indPrice <= 0 && isset($paidCategories[$vType])) {
                    $indPrice = (float) $paidCategories[$vType];
                    $ticket->update(['individual_price' => $indPrice]);
                    $ticketUpdated = true;
                }

                $subtotal += $indPrice;
            }

            $uniqueCode = (int) ($payment->unique_code ?? 0);
            $discountAmount = (float) ($payment->discount_amount ?? 0);
            $expectedTotal = max(0, $subtotal - $discountAmount) + $uniqueCode;
            $currentTotal = (float) $payment->total_amount;

            if (abs($currentTotal - $expectedTotal) > 1 || $payment->total_members !== $tickets->count() || $ticketUpdated) {
                $this->warn("Memperbaiki Payment: {$payment->payment_code}");
                $this->line("  - Total Peserta: {$payment->total_members} -> {$tickets->count()} orang");
                $this->line("  - Total Amount: Rp " . number_format($currentTotal, 0, ',', '.') . " -> Rp " . number_format($expectedTotal, 0, ',', '.'));
                foreach ($tickets as $t) {
                    $this->line("    • {$t->ticket_code} | {$t->visitor_name} ({$t->visitor_type}): Rp " . number_format($t->individual_price, 0, ',', '.'));
                }

                $payment->update([
                    'total_members' => $tickets->count(),
                    'total_amount' => $expectedTotal,
                ]);

                $fixedCount++;
            }
        }

        $this->info("Selesai! {$fixedCount} pembayaran berhasil diperbaiki & disinkronkan.");
        return 0;
    }
}
