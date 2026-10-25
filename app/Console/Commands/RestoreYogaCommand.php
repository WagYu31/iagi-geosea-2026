<?php

namespace App\Console\Commands;

use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RestoreYogaCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ticket:restore-yoga {--category=iagi_member_professional} {--unique-code=765}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pulihkan / buatkan langsung tiket atas nama Yoga Adriana (UNPAD)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = 'Yoga Adriana';
        $email = 'yoga@unpad.ac.id';
        $phone = '+62 812-2166-8872';
        $institution = 'Universitas Padjadjaran (UNPAD)';
        $category = $this->option('category') ?: 'iagi_member_professional';
        $uniqueCode = (int) ($this->option('unique-code') ?: 765);

        $this->info("=================================================");
        $this->info("MEMULIHKAN / MEMBUAT TIKET: {$name}");
        $this->info("Email: {$email} | Phone: {$phone} | Kode Unik: {$uniqueCode}");
        $this->info("=================================================");

        $price = match($category) {
            'iagi_member_professional' => 3000000,
            'non_iagi_member_professional' => 4000000,
            'iagi_member_expatriate' => 6000000,
            'non_iagi_member_expatriate' => 7000000,
            'student_undergraduate', 'student' => 1000000,
            'iagi_member' => 1500000,
            'non_iagi_member' => 2000000,
            default => 3000000
        };

        $prefix = match($category) {
            'iagi_member_professional' => 'TKT-IPRO',
            'non_iagi_member_professional' => 'TKT-NPRO',
            'student_undergraduate', 'student', 'presenter' => 'TKT-STUD',
            'iagi_member' => 'TKT-MBR',
            'non_iagi_member' => 'TKT-NON',
            default => 'TKT-VIS'
        };

        $totalAmount = $price + $uniqueCode;

        // Check if already exists
        $existing = VisitorTicket::where('visitor_email', $email)->first();
        if ($existing) {
            $this->warn("⚠️  Tiket dengan email {$email} sudah ada di database. Memperbarui nominal & kode unik...");
            $existing->update([
                'visitor_name' => $name,
                'visitor_phone' => $phone,
                'visitor_institution' => $institution,
                'visitor_type' => $category,
                'individual_price' => $price,
                'status' => 'active',
            ]);

            if ($existing->payment_id) {
                $pay = VisitorPayment::find($existing->payment_id);
                if ($pay) {
                    $pay->update([
                        'unique_code' => $uniqueCode,
                        'total_amount' => $totalAmount,
                        'price_per_ticket' => $price,
                        'payment_method' => 'bank_transfer',
                        'status' => 'approved',
                    ]);
                }
            }

            $this->info("✅ SUKSES! Data Yoga Adriana telah diperbarui dengan kode unik {$uniqueCode} (Total: Rp " . number_format($totalAmount, 0, ',', '.') . ")");
            return 0;
        }

        DB::beginTransaction();
        try {
            $payId = null;
            if ($price > 0) {
                $pay = VisitorPayment::create([
                    'payment_code' => 'ONSITE-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3))),
                    'payment_method' => 'bank_transfer',
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
                    'notes' => 'Restored via CLI with unique code ' . $uniqueCode,
                ]);
                $payId = $pay->id;
            }

            $ticketCode = $prefix . '-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));

            $ticket = VisitorTicket::create([
                'payment_id' => $payId,
                'registration_source' => 'admin_onsite',
                'visitor_name' => $name,
                'visitor_email' => $email,
                'visitor_phone' => $phone,
                'visitor_institution' => $institution,
                'ticket_code' => $ticketCode,
                'visitor_type' => $category,
                'individual_price' => $price,
                'status' => 'active',
            ]);

            DB::commit();

            $this->info("✅ SUKSES! TIKET YOGA ADRIANA TELAH DITAMBAHKAN:");
            $this->table(
                ['Field', 'Value'],
                [
                    ['Kode Tiket', $ticket->ticket_code],
                    ['Nama Pengunjung', $ticket->visitor_name],
                    ['Email', $ticket->visitor_email],
                    ['Nomor Handphone', $ticket->visitor_phone],
                    ['Institusi', $ticket->visitor_institution],
                    ['Kategori', $ticket->visitor_type],
                    ['Harga', 'Rp ' . number_format($ticket->individual_price, 0, ',', '.')],
                    ['Status Tiket', $ticket->status],
                    ['Invoice ID', $payId ? VisitorPayment::find($payId)?->payment_code : '-'],
                ]
            );

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("❌ Gagal memulihkan tiket: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
