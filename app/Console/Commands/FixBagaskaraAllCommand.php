<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Submission;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;

class FixBagaskaraAllCommand extends Command
{
    protected $signature = 'fix:bagaskara-all';
    protected $description = 'Set judul fix paper, kembalikan role author, dan buatkan akun juri baru untuk Bagaskara Wahyu Purnomo Putra';

    public function handle()
    {
        $this->info("======================================================================");
        $this->info(" PROSES PENYELESAIAN AKUN & PAPER: BAGASKARA WAHYU PURNOMO PUTRA");
        $this->info("======================================================================\n");

        $authorEmail = 'bagaskarawpp@live.undip.ac.id';
        $user = User::where('email', $authorEmail)->first();

        if (!$user) {
            $this->error("User {$authorEmail} tidak ditemukan di database!");
            return 1;
        }

        // 1. KEMBALIKAN ROLE KE AUTHOR
        $user->role = 'Author';
        $user->save();
        $this->info("1. STATUS AKUN AUTHOR DIPULIHKAN:");
        $this->line("   - Email    : {$authorEmail}");
        $this->line("   - Role     : Author (SELESAI DIPULIHKAN)");
        $this->line("   - Password : Tetap sama (atau Juri123. jika kemarin sempat ter-reset)");
        $this->line("   -> Sekarang Pak Bagaskara bisa login untuk melihat Dashboard Author miliknya.\n");

        // 2. UPDATE JUDUL FIX PAPER
        $fixTitle = 'Flash Flood Susceptibility Assessment in Southwest Mojokerto Regency: A Geospatial Integration of AHP-TOPSIS Models';
        
        $submission = Submission::where('user_id', $user->id)->first();
        if (!$submission) {
            // Coba cari submission yang terhubung dengan pembayaran beliau
            $payment = Payment::where('user_id', $user->id)->first();
            if ($payment && $payment->submission_id) {
                $submission = Submission::find($payment->submission_id);
            }
        }

        if ($submission) {
            $oldTitle = $submission->title;
            $submission->title = $fixTitle;
            $submission->save();

            $this->info("2. JUDUL SUBMISSION BERHASIL DIPERBARUI:");
            $this->line("   - Submission ID : #{$submission->id}");
            $this->line("   - Kode          : {$submission->submission_code}");
            $this->line("   - Judul Lama    : {$oldTitle}");
            $this->line("   - Judul Baru    : {$submission->title}");
            $this->line("   - Status Paper  : {$submission->status}");

            // Cek payment
            $payment = Payment::where('submission_id', $submission->id)->orWhere('user_id', $user->id)->first();
            if ($payment) {
                $this->line("   - Status Bayar  : Rp " . number_format($payment->amount, 0, ',', '.') . " (" . ($payment->verified ? 'PAID & VERIFIED' : $payment->status) . ")\n");
            }
        } else {
            $this->warn("2. Tidak ditemukan submission atas user_id {$user->id}. Menyiapkan data baru...");
            $submission = Submission::create([
                'user_id' => $user->id,
                'title' => $fixTitle,
                'author_full_name' => $user->name,
                'affiliation' => $user->affiliation ?: 'Universitas Diponegoro (UNDIP)',
                'category_submission' => 'Oral Presentation',
                'status' => 'accepted',
                'submission_code' => 'ORAL-' . rand(100, 999),
            ]);
            $this->info("   -> Submission baru berhasil dibuat dengan ID #{$submission->id}!\n");
        }

        // 3. BUATKAN AKUN JURI BARU
        $juriEmail = 'juri.bagaskara@undip.ac.id';
        $juriUser = User::where('email', $juriEmail)->first();

        if (!$juriUser) {
            $juriUser = User::create([
                'name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng (Juri)',
                'full_name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng',
                'email' => $juriEmail,
                'password' => Hash::make('Juri123.'),
                'role' => 'Juri',
                'affiliation' => 'Universitas Diponegoro (UNDIP)',
                'institution_affiliation' => 'Universitas Diponegoro (UNDIP)',
                'category' => 'Professional',
                'email_verified_at' => now(),
                'whatsapp' => $user->whatsapp ?: '082230921670',
            ]);
            $this->info("3. AKUN JURI BARU BERHASIL DIBUAT:");
        } else {
            $juriUser->role = 'Juri';
            $juriUser->password = Hash::make('Juri123.');
            $juriUser->save();
            $this->info("3. AKUN JURI TERSEDIA & DI-UPDATE:");
        }

        $this->line("   - Nama     : {$juriUser->name}");
        $this->line("   - Email    : {$juriEmail}");
        $this->line("   - Password : Juri123.");
        $this->line("   - Role     : Juri");

        $this->info("\n======================================================================");
        $this->info(" KESIMPULAN & KREDENSIAL YANG BISA DIBERIKAN KE PAK BAGASKARA:");
        $this->line(" 1. AKUN AUTHOR / PRESENTER (Untuk cek paper, tiket presenter & invoice):");
        $this->line("    - Email    : {$authorEmail}");
        $this->line("    - Password : Juri123. (atau password lama beliau)");
        $this->line("    - Paper    : {$fixTitle} (LUNAS)");
        $this->line("");
        $this->line(" 2. AKUN JURI (Khusus untuk menilai presentasi peserta lain di venue):");
        $this->line("    - Email    : {$juriEmail}");
        $this->line("    - Password : Juri123.");
        $this->info("======================================================================\n");

        return 0;
    }
}
