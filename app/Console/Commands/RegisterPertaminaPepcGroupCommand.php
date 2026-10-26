<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use App\Mail\VisitorPaymentPending;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RegisterPertaminaPepcGroupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'register:pertamina-pepc {--approve : Langsung setujui (approve) status tiket dan pembayaran}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Register Mixed-Category Group for PT Pertamina EP Cepu (HC TAL) with 4 Non-Member participants';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=====================================================================");
        $this->info("PENDAFTARAN ROMBONGAN: PT PERTAMINA EP CEPU (HC TAL)");
        $this->info("=====================================================================");

        $isApproved = $this->option('approve');

        // Check if proof image exists
        $proofFilename = 'visitor_proofs/proof_pertamina_pepc_1793037441.jpg';
        $proofPath = storage_path('app/public/' . $proofFilename);

        if (!file_exists($proofPath)) {
            $srcPublic = public_path('images/visitor_proofs/proof_pertamina_pepc_1793037441.jpg');
            if (file_exists($srcPublic)) {
                @mkdir(dirname($proofPath), 0755, true);
                copy($srcPublic, $proofPath);
            }
        }

        // Also ensure public/storage copy exists for web access
        $pubStoragePath = public_path('storage/' . $proofFilename);
        if (!file_exists($pubStoragePath) && file_exists($proofPath)) {
            @mkdir(dirname($pubStoragePath), 0755, true);
            @copy($proofPath, $pubStoragePath);
        }

        // PIC Details
        $picData = [
            'institution' => 'PT Pertamina EP Cepu (HC TAL) - M. Reza Ramadhan',
            'name' => 'PT Pertamina EP Cepu (HC TAL)',
            'email' => 'ferdy.phe@pertamina.com',
            'phone' => '08111464449',
        ];

        // 4 Participants (All Non-Member Professional @ IDR 4,000,000)
        $participants = [
            [
                'name' => 'Ferdy',
                'email' => 'ferdy.phe@pertamina.com',
                'phone' => '08111464449',
                'institution' => 'Upstream Reg 4 Head Office',
                'visitor_type' => 'non_iagi_member_professional',
                'price' => 4000000,
            ],
            [
                'name' => 'Reza Armanda',
                'email' => 'reza.armanda@pertamina.com',
                'phone' => '081227504272',
                'institution' => 'Upstream Reg 4 Head Office',
                'visitor_type' => 'non_iagi_member_professional',
                'price' => 4000000,
            ],
            [
                'name' => 'Olif Akbar Kurniawan',
                'email' => 'olif.kurniawan@pertamina.com',
                'phone' => '081293330900',
                'institution' => 'Upstream Reg 4 Head Office',
                'visitor_type' => 'non_iagi_member_professional',
                'price' => 4000000,
            ],
            [
                'name' => 'Ryan Bobby Andika',
                'email' => 'ryan.andika@pertamina.com',
                'phone' => '081919100696',
                'institution' => 'Upstream Reg 4 Head Office',
                'visitor_type' => 'non_iagi_member_professional',
                'price' => 4000000,
            ],
        ];

        $totalMembers = count($participants);
        $subtotal = 0;
        foreach ($participants as $p) {
            $subtotal += $p['price'];
        }

        $uniqueCode = rand(100, 999);
        $totalAmount = $subtotal + $uniqueCode;
        $status = $isApproved ? 'approved' : 'pending';

        DB::beginTransaction();

        try {
            $groupCode = 'GRP-' . strtoupper(Str::random(8));
            $paymentCode = 'VPAY-' . date('ymd') . '-' . strtoupper(Str::random(6));

            $payment = VisitorPayment::create([
                'payment_code' => $paymentCode,
                'payment_method' => 'bank_transfer',
                'total_members' => $totalMembers,
                'price_per_ticket' => 4000000,
                'unique_code' => $uniqueCode,
                'total_amount' => $totalAmount,
                'proof_of_payment' => $proofFilename,
                'status' => $status,
                'is_mixed_category' => true,
                'pic_name' => $picData['name'],
                'pic_email' => $picData['email'],
                'pic_phone' => $picData['phone'],
                'pic_institution' => $picData['institution'],
                'notes' => 'Pendaftaran Rombongan PT Pertamina EP Cepu (HC TAL). Terlampir bukti PO / Konfirmasi Chat WhatsApp (4 Peserta Non-Member).',
                'verified_at' => $isApproved ? now() : null,
            ]);

            $createdTickets = [];

            foreach ($participants as $index => $member) {
                $ticket = VisitorTicket::create([
                    'payment_id' => $payment->id,
                    'registration_source' => 'online_self',
                    'visitor_name' => $member['name'],
                    'visitor_email' => $member['email'],
                    'visitor_phone' => $member['phone'],
                    'visitor_institution' => $member['institution'],
                    'ticket_code' => VisitorTicket::generateTicketCode($member['visitor_type']),
                    'visitor_type' => $member['visitor_type'],
                    'individual_price' => $member['price'],
                    'is_group_leader' => ($index === 0),
                    'group_code' => $groupCode,
                    'status' => $isApproved ? 'active' : 'pending',
                    'checked_in' => false,
                    'card_printed' => false,
                ]);

                $createdTickets[] = $ticket;
            }

            DB::commit();

            // Send notification email to PIC if pending
            if ($status === 'pending') {
                try {
                    Mail::to($picData['email'])->send(new VisitorPaymentPending($payment));
                    $this->info("-> Email konfirmasi pendaftaran berhasil dikirim ke: " . $picData['email']);
                } catch (\Exception $e) {
                    Log::warning("Gagal mengirim email notifikasi ke PIC: " . $e->getMessage());
                    $this->warn("-> Catatan: Email notifikasi dilewati (" . $e->getMessage() . ")");
                }
            }

            $this->info("");
            $this->info("BERHASIL MENDAFTARKAN ROMBONGAN!");
            $this->info("---------------------------------------------------------------------");
            $this->info("Group Code       : " . $groupCode);
            $this->info("Payment Code     : " . $paymentCode);
            $this->info("Status           : " . strtoupper($status));
            $this->info("Total Peserta    : " . $totalMembers . " Orang");
            $this->info("Subtotal Tiket   : IDR " . number_format($subtotal, 0, ',', '.'));
            $this->info("Kode Unik        : " . $uniqueCode);
            $this->info("Total Tagihan    : IDR " . number_format($totalAmount, 0, ',', '.'));
            $this->info("Bukti Bayar/PO   : " . $proofFilename);
            $this->info("---------------------------------------------------------------------");
            $this->info("STATUS PEMBAYARAN LINK: https://pitiagi.cloud/payment/status/" . $paymentCode);
            $this->info("---------------------------------------------------------------------");

            $this->info("Daftar Peserta & E-Ticket:");
            foreach ($createdTickets as $idx => $t) {
                $no = $idx + 1;
                $this->line(" [{$no}] {$t->visitor_name} | {$t->ticket_code} | {$t->visitor_email} | {$t->visitor_phone}");
                $this->line("     Link Tiket: https://pitiagi.cloud/ticket/{$t->ticket_code}");
            }
            $this->info("=====================================================================");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("GAGAL MENDAFTARKAN ROMBONGAN: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
