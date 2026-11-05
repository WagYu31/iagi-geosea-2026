<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class ChangeInvoiceNumberCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ticket:change-invoice 
                            {target=ONSITE-261103-Z9HUX9 : Payment code, ticket code, sequence (e.g. 114), or visitor name} 
                            {new_number=115 : New invoice sequence number or full receipt number}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ubah nomor invoice / receipt pembayaran peserta (contoh: lompat nomor 114 ke 115)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $target = trim((string) $this->argument('target'));
        $newNumberInput = trim((string) $this->argument('new_number'));

        $this->info("==================================================");
        $this->info("🔧 MODIFIKASI NOMOR INVOICE / RECEIPT PENJUALAN");
        $this->info("Target: {$target} | Nomor Baru: {$newNumberInput}");
        $this->info("==================================================");

        // 1. Pastikan kolom receipt_no ada di database
        if (!Schema::hasColumn('visitor_payments', 'receipt_no')) {
            $this->warn("⚠️  Kolom 'receipt_no' belum ditemukan pada tabel 'visitor_payments'.");
            $this->line("Menambahkan kolom 'receipt_no' secara otomatis...");
            Schema::table('visitor_payments', function (Blueprint $table) {
                $table->string('receipt_no', 150)->nullable()->after('payment_code');
            });
            $this->info("✅ Kolom 'receipt_no' berhasil dibuat.");
        }

        // 2. Cari data pembayaran berdasarkan target
        $payment = null;

        // a. Coba cari via payment_code
        $payment = VisitorPayment::where('payment_code', $target)->first();

        // b. Coba cari via ticket_code
        if (!$payment) {
            $ticket = VisitorTicket::where('ticket_code', $target)->first();
            if ($ticket && $ticket->payment) {
                $payment = $ticket->payment;
            }
        }

        // c. Coba jika target adalah ID payment
        if (!$payment && is_numeric($target)) {
            $payment = VisitorPayment::find((int) $target);
        }

        // d. Coba jika target adalah nomor urut invoice lama (misal 114)
        if (!$payment && is_numeric($target)) {
            $numericId = (int) $target;
            if ($numericId >= 13) {
                $targetRank = $numericId - 12;
                $paymentId = VisitorPayment::orderBy('id', 'asc')
                    ->skip($targetRank - 1)
                    ->take(1)
                    ->value('id');
                if ($paymentId) {
                    $payment = VisitorPayment::find($paymentId);
                }
            }
        }

        // e. Coba cari via nama pengunjung
        if (!$payment) {
            $ticket = VisitorTicket::where('visitor_name', 'like', "%{$target}%")
                ->whereNotNull('payment_id')
                ->latest('id')
                ->first();
            if ($ticket && $ticket->payment) {
                $payment = $ticket->payment;
            }
        }

        if (!$payment) {
            $this->error("❌ Pembayaran untuk target '{$target}' tidak ditemukan di database!");
            return Command::FAILURE;
        }

        // 3. Format nomor invoice baru
        $date = $payment->created_at ?? now();
        $romanMonths = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        $month = (int) $date->format('n');
        $romanMonth = $romanMonths[$month] ?? 'XI';
        $year = $date->format('Y');

        $oldReceipt = $payment->receipt_no;

        if (is_numeric($newNumberInput)) {
            $formattedNum = str_pad($newNumberInput, 3, '0', STR_PAD_LEFT);
            $newReceiptFormatted = "{$formattedNum}/PIT-IAGI/PY-R/{$romanMonth}/{$year}";
        } else {
            $cleanInput = str_replace('Receipt No. ', '', $newNumberInput);
            $newReceiptFormatted = $cleanInput;
        }

        // 4. Update data pembayaran
        $payment->receipt_no = $newReceiptFormatted;
        $payment->save();

        // 5. Catat ke Activity Log
        $primaryTicket = $payment->tickets()->first();
        $participantName = $primaryTicket ? $primaryTicket->visitor_name : 'N/A';

        ActivityLog::record(
            action: 'change_invoice_number',
            module: 'visitor_payments',
            description: "Mengubah nomor invoice pembayaran {$payment->payment_code} ({$participantName}) dari '{$oldReceipt}' menjadi '{$newReceiptFormatted}' (Invoice 114 dibatalkan / salah input, dialihkan ke 115)",
            targetId: $payment->id,
            targetCode: $payment->payment_code,
            snapshot: [
                'payment_id' => $payment->id,
                'payment_code' => $payment->payment_code,
                'participant' => $participantName,
                'old_receipt_no' => $oldReceipt,
                'new_receipt_no' => $newReceiptFormatted,
                'amount' => $payment->total_amount,
            ]
        );

        $this->info("✅ BERHASIL MEMPERBARUI NOMOR INVOICE!");
        $this->table(
            ['Field', 'Keterangan'],
            [
                ['ID Pembayaran', $payment->id],
                ['Kode Pembayaran', $payment->payment_code],
                ['Nama Peserta', $participantName],
                ['Nomor Invoice Lama', $oldReceipt],
                ['Nomor Invoice Baru', $newReceiptFormatted],
                ['Nominal Pembayaran', 'Rp ' . number_format($payment->total_amount, 0, ',', '.')],
                ['Status', strtoupper($payment->status)],
            ]
        );

        return Command::SUCCESS;
    }
}

