<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class FixJuriLoginCommand extends Command
{
    protected $signature = 'fix:juri-login {--password=Juri123. : Password yang ingin diset}';
    protected $description = 'Perbaiki password dan verifikasi akun juri Bagaskara agar bisa login langsung';

    public function handle()
    {
        $this->info("======================================================================");
        $this->info(" PERBAIKAN LOGIN AKUN JURI: BAGASKARA WAHYU PURNOMO PUTRA");
        $this->info("======================================================================\n");

        $email = 'juri.bagaskara@undip.ac.id';
        $newPass = $this->option('password') ?: 'Juri123.';

        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            $this->warn("User {$email} belum ada. Membuat user juri baru...");
            $userId = DB::table('users')->insertGetId([
                'name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng (Juri)',
                'full_name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng',
                'email' => $email,
                'password' => Hash::make($newPass),
                'role' => 'Juri',
                'affiliation' => 'Universitas Diponegoro (UNDIP)',
                'institution_affiliation' => 'Universitas Diponegoro (UNDIP)',
                'category' => 'Professional',
                'email_verified_at' => now(),
                'whatsapp' => '082230921670',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->info("User Juri berhasil dibuat dengan ID #{$userId}!");
        } else {
            // Update password cleanly and set verified
            DB::table('users')->where('email', $email)->update([
                'password' => Hash::make($newPass),
                'email_verified_at' => now(),
                'role' => 'Juri',
                'updated_at' => now(),
            ]);
            $this->info("User {$email} berhasil diupdate password dan verifikasi emailnya!");
        }

        // Verify password hash
        $updatedUser = DB::table('users')->where('email', $email)->first();
        $isMatch = Hash::check($newPass, $updatedUser->password);

        $this->line("\n[HASIL VERIFIKASI SISTEM]:");
        $this->line("   - Email               : {$updatedUser->email}");
        $this->line("   - Role                : {$updatedUser->role}");
        $this->line("   - Email Verified At   : " . ($updatedUser->email_verified_at ?: 'BELUM'));
        $this->line("   - Tes Password Cocok  : " . ($isMatch ? 'YA, COCOK 100% (BISA LOGIN)' : 'GAGAL'));

        $this->info("\n======================================================================");
        $this->info(" KREDENSIAL LOGIN AKUN JURI:");
        $this->line(" Portal Login : https://pit55.iagi.or.id/login");
        $this->line(" Email        : {$email}");
        $this->line(" Password     : {$newPass}");
        $this->info("======================================================================\n");

        return 0;
    }
}
