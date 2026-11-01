<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Submission;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CheckPaperCommand extends Command
{
    protected $signature = 'check:paper {query? : Judul atau kata kunci paper yang ingin dicari}';
    protected $description = 'Cek keberadaan file dan data paper di database & storage server';

    public function handle()
    {
        $search = $this->argument('query') ?: 'Preliminary Feasibility';

        $this->info("======================================================================");
        $this->info(" PENGECEKAN DATA & FILE PAPER DI DATABASE & STORAGE SERVER");
        $this->info(" Kata Kunci Pencarian: '{$search}'");
        $this->info("======================================================================\n");

        // 1. CEK SUBMISSION BERDASARKAN EMAIL BAGASKARA
        $bagaskara = User::where('email', 'like', '%bagaskarawpp%')->first();
        if ($bagaskara) {
            $this->info("1. HASIL CEK AKUN BAGASKARA WAHYU PURNOMO PUTRA:");
            $this->line("   - User ID  : {$bagaskara->id}");
            $this->line("   - Nama     : {$bagaskara->name}");
            $this->line("   - Email    : {$bagaskara->email}");
            $this->line("   - Role     : {$bagaskara->role}");
            $this->line("   - WhatsApp : {$bagaskara->whatsapp}");

            $bagaskaraSubs = Submission::where('user_id', $bagaskara->id)->get();
            $this->line("   - Total Submission Terdaftar : " . $bagaskaraSubs->count() . " judul");
            foreach ($bagaskaraSubs as $sub) {
                $this->line("     * [ID: #{$sub->id}] Kode: {$sub->submission_code} | Status: {$sub->status}");
                $this->line("       Judul     : {$sub->title}");
                $this->line("       Presenter : {$sub->author_full_name}");
                $this->line("       Co-Authors: " . ($sub->co_authors ?: '-'));
                $this->line("       File Paper: " . ($sub->full_paper_file ?: ($sub->abstract_file ?: 'TIDAK ADA FILE')));
                
                // Cek fisik file di storage
                $filePath = $sub->full_paper_file ?: $sub->abstract_file;
                if ($filePath) {
                    $existsDisk = Storage::disk('public')->exists($filePath);
                    $this->line("       Status Fisik File di Storage: " . ($existsDisk ? "[ADA DI DISK]" : "[TIDAK DITEMUKAN DI DISK]"));
                }
            }

            // Payment check
            $bagaskaraPay = Payment::where('user_id', $bagaskara->id)->get();
            $this->line("\n   - Riwayat Pembayaran (Payments): " . $bagaskaraPay->count() . " transaksi");
            foreach ($bagaskaraPay as $p) {
                $this->line("     * [Payment #{$p->id}] Rp " . number_format($p->amount, 0, ',', '.') . " | Status: {$p->status} | Verified: " . ($p->verified ? 'SUDAH DIVERIFIKASI' : 'BELUM'));
                $this->line("       Bukti Transfer File: " . ($p->payment_proof_url ?: '-'));
                if ($p->submission) {
                    $this->line("       Terhubung ke Submission: [#{$p->submission_id}] {$p->submission->title}");
                }
            }
            $this->line("");
        } else {
            $this->warn("1. User dengan email bagaskarawpp@live.undip.ac.id tidak ditemukan di database users.\n");
        }

        // 2. CARI KATA KUNCI DI SELURUH DATABASE SUBMISSIONS
        $this->info("2. PENCARIAN DI SELURUH TABEL 'submissions':");
        $keywords = array_filter(explode(' ', strtolower($search)));
        
        $query = Submission::query();
        $query->where(function($q) use ($search, $keywords) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('abstract', 'like', "%{$search}%")
              ->orWhere('author_full_name', 'like', "%{$search}%")
              ->orWhere('co_authors', 'like', "%{$search}%");
            
            // Cek kata-kata kunci utama
            foreach (['geothermal', 'abandoned', 'wells', 'low-temperature'] as $kw) {
                $q->orWhere('title', 'like', "%{$kw}%");
            }
        });

        $results = $query->with('user')->get();

        if ($results->count() > 0) {
            $this->info("   DITEMUKAN " . $results->count() . " DATA SUBMISSION YANG COCOK / TERKAIT:");
            foreach ($results as $r) {
                $submitterName = $r->user ? $r->user->name : 'Tanpa Akun';
                $submitterEmail = $r->user ? $r->user->email : '-';
                
                $this->line("   ------------------------------------------------------------------");
                $this->line("   [Submission #{$r->id}] Kode: {$r->submission_code}");
                $this->line("   Judul      : {$r->title}");
                $this->line("   Akun Pemilik: {$submitterName} ({$submitterEmail})");
                $this->line("   Presenter  : {$r->author_full_name}");
                $this->line("   Co-Authors : " . ($r->co_authors ?: '-'));
                $this->line("   Status     : {$r->status}");
                
                // Cek file
                $paperFile = $r->full_paper_file ?: $r->abstract_file;
                $this->line("   File Paper : " . ($paperFile ?: 'TIDAK ADA FILE'));
                if ($paperFile) {
                    $exists = Storage::disk('public')->exists($paperFile);
                    $this->line("   Cek Storage: " . ($exists ? "File fisik ADA di server" : "File fisik TIDAK ADA di server"));
                }
            }
            $this->line("   ------------------------------------------------------------------\n");
        } else {
            $this->warn("   TIDAK DITEMUKAN submission dengan judul '{$search}' ataupun kata kunci (geothermal, abandoned, wells).\n");
            $this->line("   Kesimpulan: Paper tersebut BELUM PERNAH di-upload / di-submit ke sistem web konferensi.");
        }

        // 3. SCAN DIREKTORI STORAGE submissions/papers DI SERVER
        $this->info("3. SCANNING DIREKTORI STORAGE 'submissions/' DI SERVER:");
        $paperDirs = ['submissions/papers', 'submissions/layouting', 'submissions/revisions', 'submissions/feedback'];
        $foundFileCount = 0;

        foreach ($paperDirs as $dir) {
            if (Storage::disk('public')->exists($dir)) {
                $files = Storage::disk('public')->files($dir);
                foreach ($files as $f) {
                    $fLower = strtolower($f);
                    if (str_contains($fLower, 'geothermal') || str_contains($fLower, 'abandoned') || str_contains($fLower, 'bagaskara')) {
                        $this->line("   [DITEMUKAN FILE]: {$f}");
                        $foundFileCount++;
                    }
                }
            }
        }

        if ($foundFileCount === 0) {
            $this->line("   Tidak ada nama file fisik di direktori submissions/ yang mengandung kata 'geothermal', 'abandoned', atau 'bagaskara'.\n");
        }

        $this->info("======================================================================");
        $this->info(" REKOMENDASI TINDAKAN:");
        $this->line(" 1. Jika paper 'Preliminary Feasibility Assessment...' memang naskah yang sah dan");
        $this->line("    ingin beliau presentasikan (menggantikan naskah Flash Flood Mojokerto):");
        $this->line("    -> Di menu Manage Submissions, klik Edit (ikon pensil) pada Submission #ID beliau,");
        $this->line("       lalu ganti judulnya menjadi judul Geothermal tersebut.");
        $this->line(" 2. Kembalikan akun bagaskarawpp@live.undip.ac.id menjadi role 'Author':");
        $this->line("    php artisan resolve:bagaskara-author --switch-author --create-juri");
        $this->info("======================================================================\n");

        return 0;
    }
}
