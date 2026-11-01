<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Submission;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class CheckBagaskaraCommand extends Command
{
    protected $signature = 'check:bagaskara';
    protected $description = 'Cek akun, submissions, dan payments untuk Bagaskara Wahyu Purnomo Putra';

    public function handle()
    {
        $this->info("======================================================================");
        $this->info(" PENGECEKAN AKUN & SUBMISSIONS: BAGASKARA WAHYU PURNOMO PUTRA");
        $this->info("======================================================================\n");

        $email = 'bagaskarawpp@live.undip.ac.id';
        $user = User::where('email', $email)->first();

        if ($user) {
            $this->info("1. DATA USER DITEMUKAN:");
            $this->line("   - ID: {$user->id}");
            $this->line("   - Name: {$user->name}");
            $this->line("   - Email: {$user->email}");
            $this->line("   - Role: {$user->role}");
            $this->line("   - Affiliation: {$user->institution_affiliation}");
            $this->line("   - Category: {$user->category}");
            $this->line("   - Phone: {$user->whatsapp}\n");

            // Submissions by this user
            $userSubmissions = Submission::where('user_id', $user->id)->get();
            $this->info("2. SUBMISSIONS ATAS NAMA USER INI (user_id = {$user->id}): " . $userSubmissions->count() . " submission");
            foreach ($userSubmissions as $sub) {
                $this->line("   - ID: {$sub->id} | Code: {$sub->submission_code} | Status: {$sub->status}");
                $this->line("     Judul: {$sub->title}");
                $this->line("     Authors: {$sub->author_full_name} | Co-Authors: {$sub->co_authors}");
            }
            $this->line("");

            // Payments by this user
            $userPayments = Payment::where('user_id', $user->id)->get();
            $this->info("3. PAYMENTS ATAS NAMA USER INI: " . $userPayments->count() . " transaksi");
            foreach ($userPayments as $pay) {
                $subTitle = $pay->submission?->title ?? 'N/A';
                $this->line("   - Payment ID: #{$pay->id} | Amount: Rp " . number_format($pay->amount, 0, ',', '.') . " | Status: {$pay->status} | Verified: " . ($pay->verified ? 'YES' : 'NO'));
                $this->line("     Submission Linked ID: {$pay->submission_id} ({$subTitle})");
            }
            $this->line("");
        } else {
            $this->warn("User dengan email {$email} TIDAK DITEMUKAN!");
        }

        // Search for title keywords across ALL submissions in DB
        $this->info("4. PENCARIAN KATA KUNCI DI SELURUH SUBMISSION DATABASE:");
        $keywords = ['abandoned', 'geothermal', 'low-temperature', 'preliminary feasibility', 'mojokerto', 'bagaskara'];
        
        foreach ($keywords as $kw) {
            $matches = Submission::where('title', 'like', "%{$kw}%")
                ->orWhere('author_full_name', 'like', "%{$kw}%")
                ->orWhere('co_authors', 'like', "%{$kw}%")
                ->orWhere('co_author_1', 'like', "%{$kw}%")
                ->orWhere('co_author_2', 'like', "%{$kw}%")
                ->orWhere('co_author_3', 'like', "%{$kw}%")
                ->get();
            
            $this->line("   Keyword [{$kw}]: ditemukan " . $matches->count() . " submission");
            foreach ($matches as $m) {
                $submitter = $m->user?->name ?? 'Unknown';
                $submitterEmail = $m->user?->email ?? 'Unknown';
                $this->line("     -> ID: {$m->id} | Submitter: {$submitter} ({$submitterEmail})");
                $this->line("        Judul: {$m->title}");
                $this->line("        Main Author: {$m->author_full_name} | Co-authors: {$m->co_authors}");
            }
        }

        return 0;
    }
}
