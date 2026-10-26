<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use App\Mail\VisitorPaymentPending;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class UpdatePertaminaPicCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pertamina:update-pic 
                            {email? : Alamat Email PIC / HRD}
                            {--name= : Nama PIC / HRD (default: M. Reza Ramadhan)}
                            {--phone= : Nomor HP / WhatsApp PIC (default: -)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update data PIC (Email HRD, Nama PIC, No WA) untuk rombongan PT Pertamina EP Cepu';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=====================================================================");
        $this->info("UPDATE DATA PIC / HRD: PT PERTAMINA EP CEPU (HC TAL)");
        $this->info("=====================================================================");

        // Find existing payment for Pertamina EP Cepu
        $payment = VisitorPayment::where('pic_institution', 'LIKE', '%Pertamina EP Cepu%')
            ->orWhere('notes', 'LIKE', '%Pertamina EP Cepu%')
            ->latest()
            ->first();

        if (!$payment) {
            $this->error("Pendaftaran untuk PT Pertamina EP Cepu belum ditemukan.");
            return 1;
        }

        $email = $this->argument('email');
        if (empty($email)) {
            $email = $this->ask("Masukkan Alamat Email PIC / HRD Pertamina (untuk invoice):");
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error("Format email PIC tidak valid: {$email}");
            return 1;
        }

        $name = $this->option('name') ?: 'M. Reza Ramadhan (HC TAL)';
        $phone = $this->option('phone') ?: ($payment->pic_phone ?: '-');

        $oldEmail = $payment->pic_email;
        $oldName = $payment->pic_name;

        $payment->update([
            'pic_name' => $name,
            'pic_email' => $email,
            'pic_phone' => $phone,
        ]);

        $this->info("BERHASIL MEMPERBARUI DATA PIC / HRD!");
        $this->info("---------------------------------------------------------------------");
        $this->info("Payment Code : " . $payment->payment_code);
        $this->info("Instansi     : " . $payment->pic_institution);
        $this->info("Nama PIC     : {$name} (sebelumnya: {$oldName})");
        $this->info("Email PIC/HRD: {$email} (sebelumnya: {$oldEmail})");
        $this->info("No. HP/WA    : " . $phone);
        $this->info("---------------------------------------------------------------------");
        $this->info("Link Invoice : https://pitiagi.cloud/payment/status/" . $payment->payment_code);
        $this->info("=====================================================================");

        // Try re-sending email to the new HRD email if pending
        if ($payment->status === 'pending') {
            try {
                Mail::to($email)->send(new VisitorPaymentPending($payment));
                $this->info("-> Notifikasi invoice dan konfirmasi pendaftaran berhasil dikirim ke: {$email}");
            } catch (\Exception $e) {
                Log::warning("Gagal mengirim email ke HRD: " . $e->getMessage());
                $this->warn("-> Catatan: Gagal mengirim email otomatis ({$e->getMessage()})");
            }
        }

        return 0;
    }
}
