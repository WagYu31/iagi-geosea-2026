<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SetupWhatsAppOtp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otp:setup {--token=UbuVE56oykGTCjh1irUG} {--phone=085771593522}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically configure Fonnte WhatsApp OTP settings in .env and database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $token = $this->option('token');
        $phone = $this->option('phone');

        $envPath = base_path('.env');
        if (!file_exists($envPath)) {
            $this->error('.env file not found!');
            return 1;
        }

        $envContent = file_get_contents($envPath);

        $configs = [
            'WHATSAPP_PROVIDER' => 'fonnte',
            'FONNTE_TOKEN' => $token,
            'WHATSAPP_MANUAL_MODE' => 'false',
            'ADMIN_WHATSAPP' => $phone,
            'ADMIN_2FA_ENABLED' => 'true',
        ];

        foreach ($configs as $key => $value) {
            if (preg_match('/^' . preg_quote($key, '/') . '=.*/m', $envContent)) {
                $envContent = preg_replace('/^' . preg_quote($key, '/') . '=.*/m', "{$key}={$value}", $envContent);
            } else {
                $envContent .= PHP_EOL . "{$key}={$value}";
            }
        }

        file_put_contents($envPath, $envContent);
        $this->info("✅ File .env berhasil diperbarui dengan konfigurasi Fonnte WhatsApp!");

        // Update admin user in database if accessible
        try {
            $updated = User::where('role', 'admin')->update(['whatsapp' => $phone]);
            $this->info("✅ Database updated: {$updated} akun admin berhasil disinkronkan ke nomor {$phone}.");
        } catch (\Throwable $e) {
            $this->warn("⚠️ Catatan Database: " . $e->getMessage());
        }

        $this->info("🚀 Semua konfigurasi 2FA WhatsApp Fonnte telah aktif dan siap digunakan!");
        return 0;
    }
}
