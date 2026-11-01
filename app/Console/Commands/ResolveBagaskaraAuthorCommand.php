<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Submission;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;

class ResolveBagaskaraAuthorCommand extends Command
{
    protected $signature = 'resolve:bagaskara-author {--switch-author : Kembalikan akun live.undip.ac.id menjadi Author} {--create-juri : Buatkan akun baru khusus Juri} {--juri-email=juri.bagaskara@undip.ac.id : Email untuk akun Juri baru}';
    protected $description = 'Solusi pemisahan akun Author dan Juri untuk Bagaskara Wahyu Purnomo Putra serta pelacakan judul paper';

    public function handle()
    {
        $this->info("======================================================================");
        $this->info(" PENANGANAN AKUN AUTHOR & JURI: BAGASKARA WAHYU PURNOMO PUTRA");
        $this->info("======================================================================\n");

        $authorEmail = 'bagaskarawpp@live.undip.ac.id';
        $user = User::where('email', $authorEmail)->first();

        if (!$user) {
            $this->error("User dengan email {$authorEmail} tidak ditemukan di database!");
            return 1;
        }

        $this->info("1. STATUS AKUN SAAT INI ({$authorEmail}):");
        $this->line("   - User ID  : {$user->id}");
        $this->line("   - Nama     : {$user->name}");
        $this->line("   - Role     : {$user->role}");
        $instansi = $user->affiliation ? $user->affiliation : ($user->institution_affiliation ? $user->institution_affiliation : '-');
        $this->line("   - Instansi : {$instansi}");
        $this->line("   - Kategori : {$user->category}\n");

        // Submissions & Payments
        $submissions = Submission::where('user_id', $user->id)->get();
        $this->info("2. SUBMISSIONS TERDAFTAR ATAS USER INI (user_id = {$user->id}): " . $submissions->count());
        foreach ($submissions as $sub) {
            $this->line("   [#{$sub->id}] {$sub->title}");
            $this->line("       Status: {$sub->status} | Code: {$sub->submission_code}");
        }

        $payments = Payment::where('user_id', $user->id)->get();
        $this->info("\n3. RIWAYAT PEMBAYARAN ATAS USER INI: " . $payments->count());
        foreach ($payments as $pay) {
            $this->line("   [Payment #{$pay->id}] Nominal: Rp " . number_format($pay->amount, 0, ',', '.') . " | Status: {$pay->status} | Verified: " . ($pay->verified ? 'YES' : 'NO'));
            if ($pay->submission) {
                $this->line("       Terkait Submission: [#{$pay->submission_id}] {$pay->submission->title}");
            }
        }

        // Search for the paper title keywords in database
        $this->info("\n4. PENCARIAN PAPER 'Preliminary Feasibility Assessment' DI DATABASE:");
        $searchTerms = ['abandoned', 'geothermal', 'low-temperature', 'preliminary feasibility', 'wells'];
        $foundPapers = Submission::where(function($q) use ($searchTerms) {
            foreach ($searchTerms as $term) {
                $q->orWhere('title', 'like', "%{$term}%")
                  ->orWhere('abstract', 'like', "%{$term}%")
                  ->orWhere('keywords', 'like', "%{$term}%");
            }
        })->get();

        if ($foundPapers->count() > 0) {
            $this->info("   DITEMUKAN " . $foundPapers->count() . " PAPER TERKAIT GEOTHERMAL / ABANDONED WELLS:");
            foreach ($foundPapers as $fp) {
                $submitter = $fp->user ? "{$fp->user->name} ({$fp->user->email})" : "No User";
                $this->line("   -> [#{$fp->id}] {$fp->title}");
                $this->line("      Submitter: {$submitter}");
                $this->line("      Main Author: {$fp->author_full_name} | Co-Authors: {$fp->co_authors}");
                $this->line("      Status: {$fp->status}\n");
            }
        } else {
            $this->warn("   Tidak ada paper yang mengandung kata kunci 'abandoned', 'geothermal', atau 'preliminary feasibility'.");
            $this->line("   Artinya paper tersebut kemungkinan:");
            $this->line("   a. Belum di-submit ke web portal konferensi (hanya ada naskah offline / bukti transfer).");
            $this->line("   b. Atau di-submit dengan judul yang sangat berbeda.");
        }

        // EXECUTE SWITCH TO AUTHOR
        if ($this->option('switch-author')) {
            $user->role = 'Author';
            $user->save();
            $this->info("\n[BERHASIL] Role akun {$authorEmail} telah dikembalikan menjadi 'Author'!");
            $this->line("Sekarang Pak Bagaskara dapat login kembali dan mengakses Dashboard Author miliknya.");
        }

        // EXECUTE CREATE DEDICATED JURI ACCOUNT
        if ($this->option('create-juri')) {
            $juriEmail = $this->option('juri-email');
            $existingJuri = User::where('email', $juriEmail)->first();
            
            if ($existingJuri) {
                $existingJuri->role = 'Juri';
                $existingJuri->password = Hash::make('Juri123.');
                $existingJuri->save();
                $this->info("\n[BERHASIL] Akun Juri {$juriEmail} sudah ada dan telah di-refresh (Password: Juri123.).");
            } else {
                $newJuri = User::create([
                    'name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng (Juri)',
                    'full_name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng',
                    'email' => $juriEmail,
                    'password' => Hash::make('Juri123.'),
                    'role' => 'Juri',
                    'institution_affiliation' => 'Universitas Diponegoro (UNDIP)',
                    'affiliation' => 'Universitas Diponegoro (UNDIP)',
                    'category' => 'Professional',
                    'email_verified_at' => now(),
                    'whatsapp' => '082230921670',
                ]);
                $this->info("\n[BERHASIL] Akun Juri baru berhasil dibuat!");
                $this->line("   - Email    : {$juriEmail}");
                $this->line("   - Password : Juri123.");
                $this->line("   - Role     : Juri");
            }
        }

        $this->line("\n======================================================================");
        return 0;
    }
}
