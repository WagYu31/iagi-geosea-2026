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
    protected $signature = 'ticket:restore-yoga {--category=student_undergraduate : student_undergraduate, student, presenter, non_iagi_member, iagi_member}';

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
        $category = $this->option('category') ?: 'student_undergraduate';

        $this->info("=================================================");
        $this->info("MEMULIHKAN / MEMBUAT TIKET: {$name}");
        $this->info("Email: {$email} | Phone: {$phone}");
        $this->info("=================================================");

        // Check if already exists
        $existing = VisitorTicket::where('visitor_email', $email)->first();
        if ($existing) {
            $this->warn("⚠️  Tiket dengan email {$email} SUDAH ADA di database:");
            $this->line("• ID          : {$existing->id}");
            $this->line("• Kode Tiket  : {$existing->ticket_code}");
            $this->line("• Nama        : {$existing->visitor_name}");
            $this->line("• Kategori    : {$existing->visitor_type}");
            $this->line("• Status      : {$existing->status}");
            return 0;
        }

        $price = match($category) {
            'student_undergraduate' => 1000000,
            'iagi_member' => 1500000,
            'non_iagi_member' => 2000000,
            default => 0
        };

        $prefix = match($category) {
            'student_undergraduate', 'student', 'presenter' => 'TKT-STUD',
            'iagi_member' => 'TKT-MBR',
            'non_iagi_member' => 'TKT-NON',
            default => 'TKT-VIS'
        };

        DB::beginTransaction();
        try {
            $payId = null;
            if ($price > 0) {
                $pay = VisitorPayment::create([
                    'payment_code' => 'ONSITE-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3))),
                    'payment_method' => 'cash_onsite',
                    'total_members' => 1,
                    'price_per_ticket' => $price,
                    'unique_code' => 0,
                    'total_amount' => $price,
                    'status' => 'approved',
                    'verified_at' => now(),
                    'pic_name' => $name,
                    'pic_email' => $email,
                    'pic_phone' => $phone,
                    'pic_institution' => $institution,
                    'is_mixed_category' => false,
                    'notes' => 'Restored via CLI',
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
