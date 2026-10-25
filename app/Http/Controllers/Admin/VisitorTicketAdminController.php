<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VisitorTicket;
use App\Models\VisitorPayment;
use App\Models\LandingPageSetting;
use App\Models\EmailSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Mail\VisitorTicketIssued;
use App\Mail\VisitorPaymentRejected;
use App\Models\ActivityLog;
use ZipArchive;

class VisitorTicketAdminController extends Controller
{
    /**
     * Helper to apply SMTP configuration before sending
     */
    private function applySmtpSettings()
    {
        try {
            $emailSetting = EmailSetting::getActive();
            if ($emailSetting) {
                $emailSetting->applyToConfig();
            }
        } catch (\Exception $e) {
            Log::warning('Failed applying SMTP settings: ' . $e->getMessage());
        }
    }

    /**
     * Helper query builder for filtering visitor tickets
     */
    private function filterTicketsQuery(Request $request)
    {
        $query = VisitorTicket::with(['payment.tickets', 'registeredBy', 'checkedInBy', 'cardPrintedBy']);

        // Search filter
        if ($search = trim((string) $request->input('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('visitor_name', 'like', "%{$search}%")
                  ->orWhere('visitor_email', 'like', "%{$search}%")
                  ->orWhere('visitor_phone', 'like', "%{$search}%")
                  ->orWhere('visitor_institution', 'like', "%{$search}%")
                  ->orWhere('ticket_code', 'like', "%{$search}%")
                  ->orWhereHas('payment', function ($pq) use ($search) {
                      $pq->where('payment_code', 'like', "%{$search}%")
                         ->orWhere('debt_notes', 'like', "%{$search}%")
                         ->orWhere('pic_name', 'like', "%{$search}%")
                         ->orWhere('pic_email', 'like', "%{$search}%")
                         ->orWhere('pic_institution', 'like', "%{$search}%")
                         ->orWhere('id', 'like', "%{$search}%");

                      // Extract numeric sequence if search is like "013", "13", "014", etc.
                      if (preg_match('/(\d+)/', $search, $matches)) {
                          $numericId = (int) $matches[1];
                          if ($numericId >= 13) {
                              $targetRank = $numericId - 12;
                              $matchingPaymentId = VisitorPayment::orderBy('id', 'asc')
                                  ->skip($targetRank - 1)
                                  ->take(1)
                                  ->value('id');
                              if ($matchingPaymentId) {
                                  $pq->orWhere('id', $matchingPaymentId);
                              }
                          } elseif ($numericId > 0) {
                              $pq->orWhere('id', $numericId);
                          }
                      }
                  });
            });
        }

        // Visitor Type filter
        if ($type = $request->input('type')) {
            if ($type !== 'all') {
                $query->where('visitor_type', $type);
            }
        }

        // Registration Type filter (All / Individual / Mixed Group)
        if ($regType = $request->input('registration_type')) {
            if ($regType === 'mixed' || $regType === 'group') {
                $query->whereHas('payment', function ($pq) {
                    $pq->where('is_mixed_category', true);
                });
            } elseif ($regType === 'single' || $regType === 'individual') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('payment')
                      ->orWhereHas('payment', function ($pq) {
                          $pq->where('is_mixed_category', false);
                      });
                });
            }
        }

        // Check-in filter
        if ($checkedIn = $request->input('checked_in')) {
            if ($checkedIn === 'yes') {
                $query->where('checked_in', true);
            } elseif ($checkedIn === 'no') {
                $query->where('checked_in', false);
            }
        }

        // Status filter
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Debt filter
        if ($debt = $request->input('debt')) {
            if ($debt === 'debt') {
                $query->whereHas('payment', function ($pq) {
                    $pq->where('is_debt', true);
                });
            } elseif ($debt === 'no_debt') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('payment')
                      ->orWhereHas('payment', function ($pq) {
                          $pq->where('is_debt', false);
                      });
                });
            }
        }

        return $query;
    }

    /**
     * Display visitor tickets management dashboard
     */
    public function index(Request $request)
    {
        $query = $this->filterTicketsQuery($request);

        $tickets = $query->latest()->paginate(25)->withQueryString();

        // Cleanup any orphan payments that have no associated visitor tickets
        try {
            VisitorPayment::whereDoesntHave('tickets')->delete();
        } catch (\Exception $e) {
            Log::warning('Orphan visitor payments cleanup: ' . $e->getMessage());
        }

        // Calculate global summary stats linked to actual visitor tickets
        $stats = [
            'totalVisitors' => VisitorTicket::count(),
            'exclusivePaidCount' => VisitorTicket::where('visitor_type', 'exclusive')->where('status', 'active')->count(),
            'nonExclusiveCount' => VisitorTicket::whereIn('visitor_type', ['non_exclusive', 'visitor'])->count(),
            'checkedInCount' => VisitorTicket::where('checked_in', true)->count(),
            'pendingVerificationCount' => VisitorTicket::where('status', 'pending')->count(),
            'debtCount' => VisitorTicket::whereHas('payment', function ($pq) {
                $pq->where('is_debt', true);
            })->count(),
            'debtTotalRevenue' => (float) VisitorPayment::where('is_debt', true)->whereHas('tickets')->sum('total_amount'),
            'totalRevenue' => (float) VisitorPayment::where('status', 'approved')->whereHas('tickets')->sum('total_amount'),
            'groupRegistrationCount' => VisitorPayment::where('is_mixed_category', true)->count(),
        ];

        // Lanyard Templates from settings
        $settings = LandingPageSetting::whereIn('key', [
            'visitor_exclusive_lanyard_template',
            'visitor_non_exclusive_lanyard_template',
            'visitor_ticket_price_exclusive',
        ])->pluck('value', 'key');

        return Inertia::render('Admin/VisitorTickets/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'settings' => [
                'exclusiveTemplate' => $settings['visitor_exclusive_lanyard_template'] ?? null,
                'nonExclusiveTemplate' => $settings['visitor_non_exclusive_lanyard_template'] ?? null,
                'priceExclusive' => floatval($settings['visitor_ticket_price_exclusive'] ?? 150000),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', 'all'),
                'registration_type' => $request->input('registration_type', 'all'),
                'checked_in' => $request->input('checked_in', 'all'),
                'status' => $request->input('status', 'all'),
                'debt' => $request->input('debt', 'all'),
            ],
        ]);
    }

    /**
     * Onsite assistive registration by Admin
     */
    public function storeOnsite(Request $request)
    {
        $request->validate([
            'visitor_name' => 'required|string|max:150',
            'visitor_email' => 'required|email|max:150',
            'visitor_phone' => 'nullable|string|max:50',
            'visitor_institution' => 'nullable|string|max:150',
            'visitor_type' => 'required|string|max:100',
            'payment_status' => 'nullable|in:paid_cash,free_bypass,pending',
        ]);

        return DB::transaction(function () use ($request) {
            $paymentId = null;
            $type = $request->visitor_type;

            $paidCategories = [
                'iagi_member_professional' => 3000000,
                'non_iagi_member_professional' => 4000000,
                'iagi_member_expatriate' => 6000000,
                'non_iagi_member_expatriate' => 7000000,
                'student_undergraduate' => 1000000,
            ];

            $isPaidCategory = isset($paidCategories[$type]);

            if ($isPaidCategory && $request->payment_status !== 'free_bypass') {
                $settingKey = "visitor_ticket_price_{$type}";
                $priceSetting = LandingPageSetting::where('key', $settingKey)->value('value');
                $price = floatval($priceSetting ?: $paidCategories[$type]);

                $payment = VisitorPayment::create([
                    'payment_code' => 'ONSITE-' . date('ymd') . '-' . strtoupper(Str::random(6)),
                    'payment_method' => 'cash_onsite',
                    'total_members' => 1,
                    'price_per_ticket' => $price,
                    'unique_code' => 0,
                    'total_amount' => $price,
                    'status' => $request->payment_status === 'pending' ? 'pending' : 'approved',
                    'verified_at' => $request->payment_status === 'pending' ? null : now(),
                    'verified_by_admin_id' => Auth::id(),
                    'notes' => 'Onsite registration by Admin: ' . (Auth::user()->name ?? 'Admin'),
                ]);

                $paymentId = $payment->id;
            }

            $ticket = VisitorTicket::create([
                'payment_id' => $paymentId,
                'registered_by_admin_id' => Auth::id(),
                'registration_source' => 'admin_onsite',
                'visitor_name' => $request->visitor_name,
                'visitor_email' => $request->visitor_email,
                'visitor_phone' => $request->visitor_phone,
                'visitor_institution' => $request->visitor_institution,
                'ticket_code' => VisitorTicket::generateTicketCode($type),
                'visitor_type' => $type,
                'is_group_leader' => true,
                'status' => ($isPaidCategory && $request->payment_status === 'pending') ? 'pending' : 'active',
                'checked_in' => false,
                'card_printed' => false,
            ]);

            // Send E-Ticket email if active
            if ($ticket->status === 'active' && !empty($ticket->visitor_email)) {
                try {
                    $this->applySmtpSettings();
                    Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                } catch (\Exception $e) {
                    Log::error("Failed to send onsite visitor ticket email: " . $e->getMessage());
                }
            }

            ActivityLog::record(
                action: 'create_onsite_ticket',
                module: 'visitor_tickets',
                description: "Registrasi onsite tiket {$ticket->ticket_code} atas nama {$ticket->visitor_name} ({$ticket->visitor_type})",
                targetId: $ticket->id,
                targetCode: $ticket->ticket_code,
                snapshot: $ticket->toArray()
            );

            return back()->with('success', "Onsite registration successful! Ticket Code: {$ticket->ticket_code}");
        });
    }

    /**
     * Verify Exclusive Visitor Payment
     */
    public function verifyPayment(Request $request, $id)
    {
        $payment = VisitorPayment::findOrFail($id);
        
        $isDebt = $request->boolean('is_debt');
        $debtNotes = $request->input('debt_notes');

        $payment->update([
            'status' => 'approved',
            'is_debt' => $isDebt,
            'debt_notes' => $isDebt ? $debtNotes : null,
            'debt_settled_at' => $isDebt ? null : ($payment->is_debt ? now() : $payment->debt_settled_at),
            'verified_at' => now(),
            'verified_by_admin_id' => Auth::id(),
        ]);

        // Activate all associated tickets
        VisitorTicket::where('payment_id', $payment->id)->update([
            'status' => 'active',
        ]);

        // Send E-Ticket email to all verified tickets immediately
        $tickets = VisitorTicket::where('payment_id', $payment->id)->get();
        $this->applySmtpSettings();
        foreach ($tickets as $t) {
            if (!empty($t->visitor_email)) {
                try {
                    Mail::to($t->visitor_email)->send(new VisitorTicketIssued($t));
                } catch (\Exception $e) {
                    Log::error("Failed to send visitor ticket email to {$t->visitor_email}: " . $e->getMessage());
                }
            }
        }

        $msg = $isDebt 
            ? 'Pembayaran berhasil diverifikasi dengan TAG HUTANG (Tanggungan). Tiket aktif & E-Tiket telah dikirim.' 
            : 'Pembayaran visitor berhasil diverifikasi, tiket telah diaktifkan, dan email E-Tiket telah dikirimkan ke pengunjung.';

        ActivityLog::record(
            action: 'verify_payment',
            module: 'payments',
            description: "Verifikasi pembayaran invoice {$payment->payment_code} (Rp " . number_format($payment->total_amount, 0, ',', '.') . ")" . ($isDebt ? " [TAG HUTANG]" : ""),
            targetId: $payment->id,
            targetCode: $payment->payment_code,
            snapshot: $payment->toArray()
        );

        return back()->with('success', $msg);
    }

    /**
     * Update Payment Proof image and/or manage Debt status by Admin
     */
    public function updatePaymentProof(Request $request, $id)
    {
        $payment = VisitorPayment::findOrFail($id);

        $request->validate([
            'proof_of_payment' => 'nullable|file|mimes:jpeg,png,jpg,webp,pdf|max:10240',
            'is_debt' => 'nullable|boolean',
            'debt_notes' => 'nullable|string|max:1000',
            'settle_debt' => 'nullable|boolean',
            'status' => 'nullable|in:pending,approved,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        $dataToUpdate = [];

        if ($request->hasFile('proof_of_payment')) {
            $file = $request->file('proof_of_payment');
            $originalSize = (int) round($file->getSize() / 1024);
            $path = $file->store('visitor_proofs', 'public');
            $dataToUpdate['proof_of_payment'] = $path;
            $dataToUpdate['original_file_size_kb'] = $originalSize;
            $dataToUpdate['compressed_file_size_kb'] = $originalSize;
        }

        if ($request->has('notes')) {
            $dataToUpdate['notes'] = $request->input('notes');
        }

        // Handle debt status
        if ($request->boolean('settle_debt')) {
            $dataToUpdate['is_debt'] = false;
            $dataToUpdate['debt_settled_at'] = now();
        } elseif ($request->has('is_debt')) {
            $isDebt = $request->boolean('is_debt');
            $dataToUpdate['is_debt'] = $isDebt;
            if ($isDebt) {
                $dataToUpdate['debt_notes'] = $request->input('debt_notes');
                $dataToUpdate['debt_settled_at'] = null;
            } else {
                $dataToUpdate['debt_settled_at'] = now();
            }
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            $dataToUpdate['status'] = $status;
            if ($status === 'approved' && !$payment->verified_at) {
                $dataToUpdate['verified_at'] = now();
                $dataToUpdate['verified_by_admin_id'] = Auth::id();
            }
        }

        $payment->update($dataToUpdate);

        // If status is approved, ensure tickets are active
        if ($payment->status === 'approved') {
            VisitorTicket::where('payment_id', $payment->id)->where('status', '!=', 'active')->update([
                'status' => 'active',
            ]);
        }

        return back()->with('success', 'Bukti bayar dan status pembayaran berhasil diperbarui.');
    }

    /**
     * Toggle Debt status directly
     */
    public function toggleDebt(Request $request, $id)
    {
        $payment = VisitorPayment::findOrFail($id);
        
        $isDebt = $request->boolean('is_debt');
        $debtNotes = $request->input('debt_notes');

        $payment->update([
            'is_debt' => $isDebt,
            'debt_notes' => $isDebt ? $debtNotes : null,
            'debt_settled_at' => $isDebt ? null : now(),
        ]);

        $msg = $isDebt ? 'Pembayaran berhasil ditandai sebagai HUTANG / TANGGUNGAN.' : 'Tag Hutang berhasil dicabut (Pembayaran Lunas).';
        return back()->with('success', $msg);
    }

    /**
     * Reject Exclusive Visitor Payment
     */
    public function rejectPayment(Request $request, $id)
    {
        $payment = VisitorPayment::findOrFail($id);
        $notes = $request->input('notes', 'Pembayaran ditolak oleh admin.');
        
        $payment->update([
            'status' => 'rejected',
            'notes' => $notes,
        ]);

        VisitorTicket::where('payment_id', $payment->id)->update([
            'status' => 'cancelled',
        ]);

        // Send Rejection email to primary booker immediately
        $firstTicket = VisitorTicket::where('payment_id', $payment->id)->first();
        if ($firstTicket && !empty($firstTicket->visitor_email)) {
            try {
                $this->applySmtpSettings();
                Mail::to($firstTicket->visitor_email)->send(new VisitorPaymentRejected($payment, $notes));
            } catch (\Exception $e) {
                Log::error("Failed to send payment rejection email: " . $e->getMessage());
            }
        }

        ActivityLog::record(
            action: 'reject_payment',
            module: 'payments',
            description: "Menolak pembayaran invoice {$payment->payment_code}. Catatan: {$notes}",
            targetId: $payment->id,
            targetCode: $payment->payment_code,
            snapshot: $payment->toArray()
        );

        return back()->with('success', 'Pembayaran visitor telah ditolak dan email pemberitahuan telah dikirimkan.');
    }

    /**
     * Quick update ticket status directly from table chip (active, pending, cancelled)
     */
    public function updateTicketStatus(Request $request, $id)
    {
        $ticket = VisitorTicket::findOrFail($id);

        $request->validate([
            'status' => 'required|in:active,pending,cancelled',
        ]);

        $oldStatus = $ticket->status;
        $newStatus = $request->status;

        $ticket->update(['status' => $newStatus]);

        // If newly activated and has email, send E-Ticket email
        if ($newStatus === 'active' && $oldStatus !== 'active' && !empty($ticket->visitor_email)) {
            try {
                $this->applySmtpSettings();
                Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
            } catch (\Exception $e) {
                Log::error("Failed to send ticket email on quick activation: " . $e->getMessage());
            }
        }

        ActivityLog::record(
            action: 'update_ticket_status',
            module: 'visitor_tickets',
            description: "Mengubah status tiket {$ticket->ticket_code} ({$ticket->visitor_name}) dari " . strtoupper($oldStatus) . " menjadi " . strtoupper($newStatus),
            targetId: $ticket->id,
            targetCode: $ticket->ticket_code,
            snapshot: ['old_status' => $oldStatus, 'new_status' => $newStatus]
        );

        return back()->with('success', "Status tiket {$ticket->ticket_code} ({$ticket->visitor_name}) berhasil diubah menjadi " . strtoupper($newStatus) . ".");
    }

    /**
     * Quick update ticket category directly from table chip
     */
    public function updateTicketCategory(Request $request, $id)
    {
        $ticket = VisitorTicket::findOrFail($id);

        $request->validate([
            'visitor_type' => 'required|string|max:100',
        ]);

        $newType = $request->visitor_type;
        $oldType = $ticket->visitor_type;

        $paidCategories = [
            'iagi_member_professional' => 3000000,
            'non_iagi_member_professional' => 4000000,
            'iagi_member_expatriate' => 6000000,
            'non_iagi_member_expatriate' => 7000000,
            'student_undergraduate' => 1000000,
            'exclusive' => 500000,
        ];

        $prefixMap = [
            'vip' => 'TKT-VIP',
            'speaker' => 'TKT-SPK',
            'keynote_speech' => 'TKT-SPK',
            'keynote_speaker' => 'TKT-SPK',
            'panelist' => 'TKT-PNL',
            'moderator' => 'TKT-MOD',
            'exhibition' => 'TKT-EXH',
            'committee' => 'TKT-COM',
            'student_volunteer' => 'TKT-VOL',
            'board' => 'TKT-BRD',
            'sponsorship' => 'TKT-SPN',
            'sponsor' => 'TKT-SPN',
            'delegate' => 'TKT-DLG',
            'non_exclusive' => 'TKT-VIS',
            'exclusive' => 'TKT-EXC',
            'iagi_member_professional' => 'TKT-IPRO',
            'non_iagi_member_professional' => 'TKT-NPRO',
            'iagi_member_expatriate' => 'TKT-IEXP',
            'non_iagi_member_expatriate' => 'TKT-NEXP',
            'student_undergraduate' => 'TKT-STUD',
            // Technical
            'student' => 'TKT-STUD',
            'presenter' => 'TKT-STUD',
            'invited_speaker' => 'TKT-ISPK',
            'session_chair_judge' => 'TKT-JDG',
            'session_chair' => 'TKT-JDG',
            'judge' => 'TKT-JDG',
            'oral' => 'TKT-ORL',
            'oral_presenter' => 'TKT-ORL',
            'poster' => 'TKT-PST',
            'poster_presenter' => 'TKT-PST',
        ];

        $newPrice = $paidCategories[$newType] ?? 0;

        // Update ticket code prefix if needed
        $newCode = $ticket->ticket_code;
        if (isset($prefixMap[$newType])) {
            $newPrefix = $prefixMap[$newType];
            $parts = explode('-', $ticket->ticket_code);
            if (count($parts) >= 4) {
                $prefParts = explode('-', $newPrefix);
                $parts[0] = $prefParts[0];
                $parts[1] = $prefParts[1];
                $newCode = implode('-', $parts);
            } else {
                $newCode = VisitorTicket::generateTicketCode($newType);
            }
        }

        $ticket->update([
            'visitor_type' => $newType,
            'individual_price' => $newPrice,
            'ticket_code' => $newCode,
        ]);

        // Recalculate payment total if payment exists
        if ($ticket->payment_id) {
            $payment = $ticket->payment;
            if ($payment) {
                $subtotal = $payment->tickets()->sum('individual_price');
                $uniqueCode = (int) ($payment->unique_code ?? 0);
                $payment->update([
                    'total_amount' => $subtotal + $uniqueCode,
                ]);
            }
        }

        ActivityLog::record(
            action: 'change_ticket_category',
            module: 'visitor_tickets',
            description: "Mengubah kategori tiket {$newCode} ({$ticket->visitor_name}) dari '{$oldType}' menjadi '{$newType}'",
            targetId: $ticket->id,
            targetCode: $newCode,
            snapshot: [
                'old_type' => $oldType,
                'new_type' => $newType,
                'ticket_code' => $newCode,
            ]
        );

        return back()->with('success', "Kategori tiket {$ticket->visitor_name} berhasil diubah.");
    }

    /**
     * Quick update payment status directly from table chip (approved, pending, rejected)
     */
    public function updatePaymentStatus(Request $request, $id)
    {
        $payment = VisitorPayment::findOrFail($id);

        $request->validate([
            'status' => 'required|in:approved,pending,rejected',
            'is_debt' => 'nullable|boolean',
            'debt_notes' => 'nullable|string|max:1000',
        ]);

        $newStatus = $request->status;

        if ($newStatus === 'approved') {
            $payment->update([
                'status' => 'approved',
                'verified_at' => $payment->verified_at ?: now(),
                'verified_by_admin_id' => Auth::id(),
            ]);

            // Activate all tickets for this payment
            VisitorTicket::where('payment_id', $payment->id)->update([
                'status' => 'active',
            ]);

            // Send E-Ticket emails
            $tickets = VisitorTicket::where('payment_id', $payment->id)->get();
            $this->applySmtpSettings();
            foreach ($tickets as $t) {
                if (!empty($t->visitor_email)) {
                    try {
                        Mail::to($t->visitor_email)->send(new VisitorTicketIssued($t));
                    } catch (\Exception $e) {
                        Log::error("Failed sending visitor ticket email on quick approval: " . $e->getMessage());
                    }
                }
            }
        } elseif ($newStatus === 'rejected') {
            $payment->update([
                'status' => 'rejected',
                'notes' => $request->input('notes', 'Pembayaran ditolak oleh admin.'),
            ]);

            VisitorTicket::where('payment_id', $payment->id)->update([
                'status' => 'cancelled',
            ]);
        } else { // pending
            $payment->update([
                'status' => 'pending',
                'verified_at' => null,
            ]);

            VisitorTicket::where('payment_id', $payment->id)->update([
                'status' => 'pending',
            ]);
        }

        return back()->with('success', "Status pembayaran berhasil diubah menjadi " . strtoupper($newStatus) . ".");
    }

    /**
     * Resend E-Ticket email to visitor
     */
    public function resendEmail($id)
    {
        $ticket = VisitorTicket::findOrFail($id);

        if ($ticket->status !== 'active') {
            return back()->with('error', 'Hanya tiket berstatus AKTIF yang dapat dikirimkan E-Tiket.');
        }

        if (empty($ticket->visitor_email)) {
            return back()->with('error', 'Pengunjung ini tidak memiliki alamat email terdaftar.');
        }

        try {
            $this->applySmtpSettings();
            Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
            return back()->with('success', "E-Tiket berhasil dikirim ke email: {$ticket->visitor_email}");
        } catch (\Exception $e) {
            Log::error("Manual resend email failed for {$ticket->visitor_email}: " . $e->getMessage());
            return back()->with('error', "Gagal mengirim email: " . $e->getMessage() . ". Pastikan pengaturan SMTP di menu Email Settings sudah benar.");
        }
    }

    /**
     * Display Gate QR Code Scanner Page
     */
    public function gateScanner()
    {
        $settings = LandingPageSetting::whereIn('key', [
            'visitor_exclusive_lanyard_template',
            'visitor_non_exclusive_lanyard_template',
            'visitor_event_venue',
        ])->pluck('value', 'key');

        return Inertia::render('Admin/VisitorTickets/GateScanner', [
            'exclusiveTemplate' => $settings['visitor_exclusive_lanyard_template'] ?? null,
            'nonExclusiveTemplate' => $settings['visitor_non_exclusive_lanyard_template'] ?? null,
            'eventVenue' => $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta',
        ]);
    }

    /**
     * Process Check-In from Gate Scanner API
     */
    public function processCheckIn(Request $request)
    {
        $request->validate([
            'ticket_code' => 'required|string',
        ]);

        $ticketCode = trim($request->ticket_code);

        return DB::transaction(function () use ($ticketCode) {
            $ticket = VisitorTicket::with('payment')
                ->where('ticket_code', $ticketCode)
                ->lockForUpdate()
                ->first();

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'status' => 'not_found',
                    'message' => 'Tiket tidak ditemukan dalam sistem.',
                ], 404);
            }

            // Check if ticket is pending/cancelled
            if ($ticket->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'status' => 'inactive',
                    'message' => $ticket->status === 'pending' 
                        ? 'Tiket masih dalam status PENDING (Pembayaran belum diverifikasi).' 
                        : 'Tiket telah DIBATALKAN.',
                    'ticket' => $ticket,
                ], 422);
            }

            // Check if already checked in (Anti double-entry)
            if ($ticket->checked_in) {
                $checkedTime = $ticket->checked_in_at ? $ticket->checked_in_at->format('d/m/Y H:i:s') : '-';
                return response()->json([
                    'success' => false,
                    'status' => 'already_checked_in',
                    'message' => 'PERINGATAN: Tiket ini SUDAH PERNAH CHECK-IN pada ' . $checkedTime . '.',
                    'ticket' => $ticket,
                ], 409);
            }

            // Valid Check-In
            $ticket->update([
                'checked_in' => true,
                'checked_in_at' => now(),
                'checked_in_by_admin_id' => Auth::id(),
            ]);

            $templatePath = self::getBadgeTemplateForType($ticket->visitor_type);

            return response()->json([
                'success' => true,
                'status' => 'checked_in',
                'message' => 'Check-in BERHASIL! Selamat datang.',
                'ticket' => $ticket,
                'templatePath' => $templatePath,
            ]);
        });
    }

    /**
     * Resolve badge template SVG for visitor type
     */
    public static function getBadgeTemplateForType($type)
    {
        $map = [
            'vip' => '/images/badges/VIP.png',
            'speaker' => '/images/badges/Speaker.png',
            'keynote_speech' => '/images/badges/Speaker.png',
            'keynote_speaker' => '/images/badges/Speaker.png',
            'panelist' => '/images/badges/Panelist.png',
            'moderator' => '/images/badges/Moderator.png',
            'exhibition' => '/images/badges/Exhibitor.png',
            'committee' => '/images/badges/Committee.png',
            'student_volunteer' => '/images/badges/Student_Volunteer.png',
            'board' => '/images/badges/Board.png',
            'sponsorship' => '/images/badges/Sponsorship.png',
            'sponsor' => '/images/badges/Sponsorship.png',
            'delegate' => '/images/badges/Sponsorship.png',
            'iagi_member_professional' => '/images/badges/Participant.png',
            'non_iagi_member_professional' => '/images/badges/Participant.png',
            'iagi_member_expatriate' => '/images/badges/Participant.png',
            'non_iagi_member_expatriate' => '/images/badges/Participant.png',
            'student_undergraduate' => '/images/badges/Student.png',
            'student' => '/images/badges/Student.png',
            'student_postgraduate' => '/images/badges/Participant.png',
            'general_ticket' => '/images/badges/Participant.png',
            'exclusive' => '/images/badges/VIP.png',
            'non_exclusive' => '/images/badges/Visitor.png',
            // Technical
            'student' => '/images/badges/Student.png',
            'presenter' => '/images/badges/Student.png',
            'invited_speaker' => '/images/badges/Invited_Speaker.png',
            'session_chair_judge' => '/images/badges/Session_Chair_Judge.png',
            'session_chair' => '/images/badges/Session_Chair.png',
            'judge' => '/images/badges/Judge.png',
            'oral' => '/images/badges/Oral_Presenter.png',
            'oral_presenter' => '/images/badges/Oral_Presenter.png',
            'poster' => '/images/badges/Poster_Presenter.png',
            'poster_presenter' => '/images/badges/Poster_Presenter.png',
        ];

        $path = $map[$type] ?? '/images/badges/Participant.png';
        return $path . '?v=20261025_student_badge';
    }

    /**
     * Mark Card Printed & Return Badge Print View
     */
    public function printBadge($id)
    {
        $ticket = VisitorTicket::with('payment')->findOrFail($id);

        $ticket->update([
            'card_printed' => true,
            'card_printed_at' => now(),
            'card_printed_by_admin_id' => Auth::id(),
        ]);

        $templatePath = self::getBadgeTemplateForType($ticket->visitor_type);

        return Inertia::render('Admin/VisitorTickets/PrintBadge', [
            'ticket' => $ticket,
            'tickets' => [$ticket],
            'templatePath' => $templatePath,
            'isBulk' => false,
        ]);
    }

    /**
     * Bulk Print Lanyard Badges (Selected or Filtered)
     */
    public function printBadgesBulk(Request $request)
    {
        $mode = $request->input('mode', 'selected'); // 'selected' or 'filtered'
        $ids = $request->input('ids');

        if ($mode === 'selected' || !empty($ids)) {
            $idArray = is_array($ids) ? $ids : array_filter(explode(',', (string)$ids));
            $tickets = VisitorTicket::with('payment')
                ->whereIn('id', $idArray)
                ->latest()
                ->get();
        } else {
            $query = $this->filterTicketsQuery($request);
            $tickets = $query->latest()->get();
        }

        if ($tickets->isEmpty()) {
            return redirect()->route('admin.visitorTickets')->with('error', 'Tidak ada tiket yang dipilih atau sesuai filter untuk dicetak.');
        }

        // Mark all as card printed
        VisitorTicket::whereIn('id', $tickets->pluck('id'))->update([
            'card_printed' => true,
            'card_printed_at' => now(),
            'card_printed_by_admin_id' => Auth::id(),
        ]);

        // Map templatePath for each ticket
        $tickets->transform(function ($ticket) {
            $ticket->templatePath = self::getBadgeTemplateForType($ticket->visitor_type);
            return $ticket;
        });

        return Inertia::render('Admin/VisitorTickets/PrintBadge', [
            'tickets' => $tickets,
            'isBulk' => true,
            'totalCount' => $tickets->count(),
        ]);
    }

    /**
     * Bulk Resend E-Ticket Emails (Selected or Filtered)
     */
    public function resendEmailsBulk(Request $request)
    {
        $mode = $request->input('mode', 'selected'); // 'selected' or 'filtered'
        $ticketIds = $request->input('ticket_ids', []);

        if ($mode === 'selected' || !empty($ticketIds)) {
            $idArray = is_array($ticketIds) ? $ticketIds : array_filter(explode(',', (string)$ticketIds));
            $tickets = VisitorTicket::whereIn('id', $idArray)
                ->where('status', 'active')
                ->whereNotNull('visitor_email')
                ->where('visitor_email', '!=', '')
                ->get();
        } else {
            $query = $this->filterTicketsQuery($request);
            $tickets = $query->where('status', 'active')
                ->whereNotNull('visitor_email')
                ->where('visitor_email', '!=', '')
                ->get();
        }

        if ($tickets->isEmpty()) {
            return back()->with('error', 'Tidak ada tiket berstatus AKTIF dengan email valid yang ditemukan.');
        }

        $this->applySmtpSettings();

        $successCount = 0;
        $failCount = 0;

        foreach ($tickets as $ticket) {
            try {
                Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                $successCount++;
            } catch (\Exception $e) {
                $failCount++;
                Log::error("Bulk resend email failed for {$ticket->visitor_email}: " . $e->getMessage());
            }
        }

        if ($failCount === 0) {
            return back()->with('success', "E-Tiket berhasil dikirimkan ke {$successCount} email pengunjung.");
        } else {
            return back()->with('warning', "E-Tiket terkirim ke {$successCount} email ({$failCount} email gagal dikirim). Pastikan pengaturan SMTP sudah aktif.");
        }
    }

    /**
     * Export Visitor Tickets to CSV
     */
    public function exportCsv()
    {
        $tickets = VisitorTicket::with(['payment', 'checkedInBy'])->latest()->get();

        $filename = 'visitor_tickets_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');

        fputcsv($handle, [
            'Ticket Code',
            'Invoice / Receipt No',
            'Payment Code',
            'Visitor Name',
            'Email',
            'Phone / WhatsApp',
            'Institution',
            'Category',
            'Registration Source',
            'Status',
            'Payment Method',
            'Payment Status',
            'Amount (IDR)',
            'Checked In',
            'Checked In Time',
            'Card Printed',
            'Registered At',
        ]);

        foreach ($tickets as $t) {
            fputcsv($handle, [
                $t->ticket_code,
                $t->payment ? ($t->payment->receipt_no ?? '-') : '-',
                $t->payment ? $t->payment->payment_code : '-',
                $t->visitor_name,
                $t->visitor_email,
                $t->visitor_phone ?? '-',
                $t->visitor_institution ?? '-',
                $t->category_label ?? strtoupper($t->visitor_type),
                $t->registration_source === 'admin_onsite' ? 'Onsite (Admin)' : 'Online Self',
                strtoupper($t->status),
                $t->payment ? strtoupper($t->payment->payment_method) : 'FREE',
                $t->payment ? strtoupper($t->payment->status) : 'FREE',
                $t->payment ? $t->payment->total_amount : 0,
                $t->checked_in ? 'YES' : 'NO',
                $t->checked_in_at ? $t->checked_in_at->format('Y-m-d H:i:s') : '-',
                $t->card_printed ? 'YES' : 'NO',
                $t->created_at->format('Y-m-d H:i:s'),
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Download Excel / CSV template for importing visitor tickets (especially Technical roles)
     */
    public function downloadImportTemplate()
    {
        $filename = 'template_import_peserta_technical_' . date('Ymd') . '.csv';
        $handle = fopen('php://memory', 'w');

        // UTF-8 BOM so Excel opens it with proper encoding
        fputs($handle, "\xEF\xBB\xBF");

        // Header Row
        fputcsv($handle, [
            'Nama Lengkap',
            'Email',
            'Nomor HP / WhatsApp',
            'Institusi / Perusahaan',
            'Kategori',
        ]);

        // Sample Data Rows showcasing the 5 technical roles
        $samples = [
            [
                'Dr. Budi Santoso, M.Sc.',
                'budi.santoso@ugm.ac.id',
                '081234567890',
                'Universitas Gadjah Mada',
                'Presenter',
            ],
            [
                'Prof. John Smith, Ph.D.',
                'john.smith@petrocorp.org',
                '+62811223344',
                'Pertamina Hulu Rokan',
                'Invited Speaker',
            ],
            [
                'Dr. Ir. Ahmad Dahlan',
                'ahmad.dahlan@itb.ac.id',
                '085678901234',
                'Institut Teknologi Bandung',
                'Session Chair / Judge',
            ],
            [
                'Rian Pratama, S.T.',
                'rian.pratama@energy.co.id',
                '087788990011',
                'Schlumberger Indonesia',
                'Oral',
            ],
            [
                'Siti Nurhaliza, S.Si.',
                'siti.nurhaliza@upn.ac.id',
                '081398765432',
                'UPN Veteran Yogyakarta',
                'Poster',
            ],
        ];

        foreach ($samples as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Import visitor tickets from Excel / CSV
     */
    public function importTickets(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:15360', // max 15MB
            'send_email' => 'nullable',
        ]);

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());
        $path = $file->getRealPath();

        $rows = [];

        if (in_array($ext, ['xlsx', 'xlsm'])) {
            $rows = $this->parseXlsxFile($path);
        } else {
            $rows = $this->parseCsvFile($path);
        }

        if (empty($rows)) {
            return back()->with('error', 'File Excel/CSV kosong atau format tidak dapat dibaca.');
        }

        // Process rows
        $firstRow = array_shift($rows); // Header row
        $colMap = $this->detectImportColumns($firstRow);

        $successCount = 0;
        $skippedCount = 0;
        $sendEmail = $request->boolean('send_email', false);

        DB::beginTransaction();
        try {
            foreach ($rows as $lineIdx => $row) {
                // Skip empty row
                if (empty(array_filter($row, fn($v) => trim((string)$v) !== ''))) {
                    continue;
                }

                $name = trim((string)($row[$colMap['name']] ?? ''));
                $email = trim((string)($row[$colMap['email']] ?? ''));
                $phone = trim((string)($row[$colMap['phone']] ?? ''));
                $institution = trim((string)($row[$colMap['institution']] ?? ''));
                $rawCategory = trim((string)($row[$colMap['category']] ?? ''));

                if (empty($name)) {
                    $skippedCount++;
                    continue;
                }

                $visitorType = self::normalizeVisitorType($rawCategory);
                $ticketCode = VisitorTicket::generateTicketCode($visitorType);

                $ticket = VisitorTicket::create([
                    'registered_by_admin_id' => Auth::id(),
                    'registration_source' => 'admin_import_excel',
                    'visitor_name' => $name,
                    'visitor_email' => !empty($email) ? $email : null,
                    'visitor_phone' => !empty($phone) ? $phone : null,
                    'visitor_institution' => !empty($institution) ? $institution : null,
                    'ticket_code' => $ticketCode,
                    'visitor_type' => $visitorType,
                    'status' => 'active',
                    'checked_in' => false,
                    'card_printed' => false,
                    'is_group_leader' => true,
                ]);

                if ($sendEmail && !empty($ticket->visitor_email)) {
                    try {
                        $this->applySmtpSettings();
                        Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                    } catch (\Throwable $me) {
                        Log::warning("Email send error on import ticket {$ticket->ticket_code}: " . $me->getMessage());
                    }
                }

                $successCount++;
            }

            DB::commit();

            // Record audit log
            ActivityLog::record(
                action: 'import_tickets_excel',
                module: 'visitor_tickets',
                description: "Import {$successCount} data peserta dari file {$file->getClientOriginalName()}",
                snapshot: [
                    'count' => $successCount,
                    'skipped' => $skippedCount,
                    'filename' => $file->getClientOriginalName(),
                    'admin_name' => Auth::user()->name ?? 'Admin',
                ]
            );

            return back()->with('success', "Berhasil mengimpor {$successCount} peserta! Tiket dan lanyard badge sudah siap dicetak.");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Import Excel error: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->with('error', "Gagal mengimpor data: " . $e->getMessage());
        }
    }

    /**
     * Parse CSV file with auto-delimiter detection and UTF-8 BOM removal
     */
    private function parseCsvFile(string $path): array
    {
        $rows = [];
        if (!file_exists($path)) return $rows;
        
        $content = file_get_contents($path);
        // Strip UTF-8 BOM if present
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content);
        $lines = explode("\n", str_replace("\r\n", "\n", $content));

        if (empty($lines)) return $rows;

        // Auto detect delimiter from first non-empty line
        $firstLine = '';
        foreach ($lines as $l) {
            if (trim($l) !== '') {
                $firstLine = $l;
                break;
            }
        }

        $sep = (substr_count($firstLine, ';') > substr_count($firstLine, ',')) ? ';' : ',';
        if (substr_count($firstLine, "\t") > substr_count($firstLine, $sep)) {
            $sep = "\t";
        }

        foreach ($lines as $line) {
            if (trim($line) === '') continue;
            $data = str_getcsv($line, $sep, '"', '\\');
            $rows[] = array_map('trim', $data);
        }

        return $rows;
    }

    /**
     * Lightweight native XLSX file parser using ZipArchive (no external dependencies)
     */
    private function parseXlsxFile(string $path): array
    {
        if (!class_exists('ZipArchive')) {
            return [];
        }

        $zip = new \ZipArchive();
        if ($zip->open($path) !== true) {
            return [];
        }

        $sharedStrings = [];
        $sharedXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($sharedXml) {
            $sXml = @simplexml_load_string($sharedXml);
            if ($sXml && isset($sXml->si)) {
                foreach ($sXml->si as $si) {
                    if (isset($si->t)) {
                        $sharedStrings[] = (string)$si->t;
                    } elseif (isset($si->r)) {
                        $tParts = [];
                        foreach ($si->r as $r) { $tParts[] = (string)$r->t; }
                        $sharedStrings[] = implode('', $tParts);
                    } else {
                        $sharedStrings[] = '';
                    }
                }
            }
        }

        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();
        if (!$sheetXml) return [];

        $xml = @simplexml_load_string($sheetXml);
        if (!$xml || !isset($xml->sheetData->row)) return [];

        $rows = [];
        foreach ($xml->sheetData->row as $rowXml) {
            $row = [];
            foreach ($rowXml->c as $cell) {
                $cellRef = (string)$cell['r'];
                preg_match('/^([A-Z]+)/', strtoupper($cellRef), $m);
                $colIdx = 0;
                if (!empty($m[1])) {
                    $colStr = $m[1];
                    for ($i = 0; $i < strlen($colStr); $i++) {
                        $colIdx = $colIdx * 26 + (ord($colStr[$i]) - ord('A') + 1);
                    }
                    $colIdx -= 1;
                }

                $val = (string)$cell->v;
                $type = (string)$cell['t'];
                if ($type === 's' && isset($sharedStrings[(int)$val])) {
                    $val = $sharedStrings[(int)$val];
                } elseif ($type === 'inlineStr' && isset($cell->is->t)) {
                    $val = (string)$cell->is->t;
                }
                $row[$colIdx] = trim($val);
            }

            if (!empty(array_filter($row, fn($v) => trim((string)$v) !== ''))) {
                $max = max(array_keys($row));
                $denseRow = [];
                for ($i = 0; $i <= $max; $i++) {
                    $denseRow[$i] = $row[$i] ?? '';
                }
                $rows[] = $denseRow;
            }
        }

        return $rows;
    }

    /**
     * Dynamically detect column indexes from header row
     */
    private function detectImportColumns(array $headerRow): array
    {
        $nameCol = null;
        $emailCol = null;
        $phoneCol = null;
        $instCol = null;
        $catCol = null;

        foreach ($headerRow as $idx => $rawName) {
            $col = strtolower(trim((string)$rawName));
            if ($nameCol === null && (str_contains($col, 'name') || str_contains($col, 'nama'))) {
                $nameCol = $idx;
            } elseif ($emailCol === null && str_contains($col, 'mail')) {
                $emailCol = $idx;
            } elseif ($phoneCol === null && (str_contains($col, 'phone') || str_contains($col, 'hp') || str_contains($col, 'wa') || str_contains($col, 'telp') || str_contains($col, 'mobile') || str_contains($col, 'kontak'))) {
                $phoneCol = $idx;
            } elseif ($instCol === null && (str_contains($col, 'inst') || str_contains($col, 'univ') || str_contains($col, 'afiliasi') || str_contains($col, 'comp') || str_contains($col, 'perusahaan') || str_contains($col, 'lembaga') || str_contains($col, 'kampus'))) {
                $instCol = $idx;
            } elseif ($catCol === null && (str_contains($col, 'cat') || str_contains($col, 'kat') || str_contains($col, 'role') || str_contains($col, 'type') || str_contains($col, 'jenis'))) {
                $catCol = $idx;
            }
        }

        // Check if first column is numeric or 'no'
        $firstIsIndex = false;
        $firstCol = strtolower(trim((string)($headerRow[0] ?? '')));
        if ($firstCol === 'no' || $firstCol === 'no.' || $firstCol === '#' || is_numeric($firstCol)) {
            $firstIsIndex = true;
        }

        return [
            'name' => $nameCol ?? ($firstIsIndex ? 1 : 0),
            'email' => $emailCol ?? ($firstIsIndex ? 2 : 1),
            'phone' => $phoneCol ?? ($firstIsIndex ? 3 : 2),
            'institution' => $instCol ?? ($firstIsIndex ? 4 : 3),
            'category' => $catCol ?? ($firstIsIndex ? 5 : 4),
        ];
    }

    /**
     * Normalize any textual category into standard system visitor_type
     */
    public static function normalizeVisitorType(string $input): string
    {
        $clean = strtolower(trim($input));
        $clean = preg_replace('/\(.*?\)/', '', $clean);
        $clean = trim(preg_replace('/[^a-z0-9_\-\s\/]/', '', $clean));

        // 1. Oral
        if (str_contains($clean, 'oral')) {
            return 'oral';
        }

        // 2. Poster
        if (str_contains($clean, 'poster')) {
            return 'poster';
        }

        // 3. Session Chair / Judge
        if (str_contains($clean, 'chair') || str_contains($clean, 'judge')) {
            return 'session_chair_judge';
        }

        // 4. Invited Speaker
        if (str_contains($clean, 'invited') || (str_contains($clean, 'speaker') && !str_contains($clean, 'keynote'))) {
            return 'invited_speaker';
        }

        // 5. Presenter
        if (str_contains($clean, 'presenter')) {
            return 'presenter';
        }

        // Keynote Speaker
        if (str_contains($clean, 'keynote')) {
            return 'keynote_speaker';
        }

        // VIP / Exclusive
        if (str_contains($clean, 'vip')) {
            return 'vip';
        }

        // Committee
        if (str_contains($clean, 'committee') || str_contains($clean, 'panitia')) {
            return 'committee';
        }

        // Volunteer
        if (str_contains($clean, 'volunteer') || str_contains($clean, 'relawan')) {
            return 'student_volunteer';
        }

        // Board
        if (str_contains($clean, 'board') || str_contains($clean, 'pengurus')) {
            return 'board';
        }

        // Delegate / Sponsor
        if (str_contains($clean, 'delegate') || str_contains($clean, 'sponsor')) {
            return 'delegate';
        }

        // Participant types
        if (str_contains($clean, 'student') || str_contains($clean, 'mahasiswa')) {
            return 'student_undergraduate';
        }
        if (str_contains($clean, 'expatriate') || str_contains($clean, 'expat')) {
            return 'non_iagi_member_expatriate';
        }
        if (str_contains($clean, 'member') && !str_contains($clean, 'non')) {
            return 'iagi_member_professional';
        }
        if (str_contains($clean, 'professional') || str_contains($clean, 'peserta')) {
            return 'non_iagi_member_professional';
        }

        return 'oral';
    }

    /**
     * Toggle Check-In status manually by Admin
     */
    public function toggleCheckIn($id)
    {
        $ticket = VisitorTicket::findOrFail($id);

        if ($ticket->status !== 'active') {
            return back()->with('error', 'Hanya tiket berstatus AKTIF yang dapat di-check in.');
        }

        $newStatus = !$ticket->checked_in;

        $ticket->update([
            'checked_in' => $newStatus,
            'checked_in_at' => $newStatus ? now() : null,
            'checked_in_by_admin_id' => $newStatus ? Auth::id() : null,
        ]);

        $msg = $newStatus 
            ? "Tiket {$ticket->ticket_code} ({$ticket->visitor_name}) berhasil di-Check In!" 
            : "Check-In untuk tiket {$ticket->ticket_code} dibatalkan.";

        return back()->with('success', $msg);
    }

    /**
     * Update Visitor details (supports single & group/multi-participant edit)
     */
    public function updateVisitor(Request $request, $id)
    {
        $ticket = VisitorTicket::findOrFail($id);

        // Check if this is a multi-participant / group edit
        if ($request->boolean('is_group_edit') && is_array($request->input('members'))) {
            $request->validate([
                'members' => 'required|array|min:1',
                'members.*.visitor_name' => 'required|string|max:150',
                'members.*.visitor_email' => 'required|email|max:150',
                'members.*.visitor_phone' => 'nullable|string|max:50',
                'members.*.visitor_institution' => 'nullable|string|max:150',
                'members.*.visitor_type' => 'required|string|max:100',
                'members.*.status' => 'required|in:active,pending,cancelled',
                'pic_name' => 'nullable|string|max:150',
                'pic_email' => 'nullable|email|max:150',
                'pic_phone' => 'nullable|string|max:50',
                'pic_institution' => 'nullable|string|max:150',
            ]);

            return DB::transaction(function () use ($request, $ticket) {
                $payment = $ticket->payment;
                $members = $request->input('members');
                $removedIds = $request->input('removed_ticket_ids', []);

                $paidCategories = [
                    'iagi_member_professional' => 3000000,
                    'non_iagi_member_professional' => 4000000,
                    'iagi_member_expatriate' => 6000000,
                    'non_iagi_member_expatriate' => 7000000,
                    'student_undergraduate' => 1000000,
                    'exclusive' => 500000,
                ];

                $prefixMap = [
                    'vip' => 'TKT-VIP',
                    'speaker' => 'TKT-SPK',
                    'keynote_speech' => 'TKT-SPK',
                    'keynote_speaker' => 'TKT-SPK',
                    'panelist' => 'TKT-PNL',
                    'moderator' => 'TKT-MOD',
                    'exhibition' => 'TKT-EXH',
                    'committee' => 'TKT-COM',
                    'student_volunteer' => 'TKT-VOL',
                    'board' => 'TKT-BRD',
                    'sponsorship' => 'TKT-SPN',
                    'sponsor' => 'TKT-SPN',
                    'delegate' => 'TKT-DLG',
                    'non_exclusive' => 'TKT-VIS',
                    'exclusive' => 'TKT-EXC',
                    'iagi_member_professional' => 'TKT-IPRO',
                    'non_iagi_member_professional' => 'TKT-NPRO',
                    'iagi_member_expatriate' => 'TKT-IEXP',
                    'non_iagi_member_expatriate' => 'TKT-NEXP',
                    'student_undergraduate' => 'TKT-STUD',
                    // Technical
                    'student' => 'TKT-STUD',
                    'presenter' => 'TKT-STUD',
                    'invited_speaker' => 'TKT-ISPK',
                    'session_chair_judge' => 'TKT-JDG',
                    'session_chair' => 'TKT-JDG',
                    'judge' => 'TKT-JDG',
                    'oral' => 'TKT-ORL',
                    'oral_presenter' => 'TKT-ORL',
                    'poster' => 'TKT-PST',
                    'poster_presenter' => 'TKT-PST',
                ];

                // 1. Delete removed tickets safely
                if (!empty($removedIds) && is_array($removedIds)) {
                    foreach ($removedIds as $remId) {
                        $remTicket = VisitorTicket::find($remId);
                        if ($remTicket) {
                            if ($payment && $remTicket->payment_id === $payment->id) {
                                if ($payment->tickets()->count() > 1) {
                                    ActivityLog::record(
                                        action: 'delete_ticket',
                                        module: 'visitor_tickets',
                                        description: "Menghapus peserta tiket {$remTicket->ticket_code} ({$remTicket->visitor_name}) dari rombongan pendaftaran grup {$payment->payment_code}",
                                        targetId: $remTicket->id,
                                        targetCode: $remTicket->ticket_code,
                                        snapshot: $remTicket->toArray()
                                    );
                                    $remTicket->delete();
                                }
                            }
                        }
                    }
                }

                $primaryTicket = null;

                // 2. Process each member in the list
                foreach ($members as $index => $m) {
                    $isLeader = !empty($m['is_group_leader']) || ($index === 0 && !collect($members)->contains('is_group_leader', true));
                    $vType = $m['visitor_type'] ?? 'non_exclusive';
                    $indPrice = $paidCategories[$vType] ?? 0;
                    $status = $m['status'] ?? $ticket->status;

                    if (!empty($m['id'])) {
                        // Existing ticket update
                        $existing = VisitorTicket::find($m['id']);
                        if ($existing) {
                            $newCode = $existing->ticket_code;
                            if ($existing->visitor_type !== $vType && isset($prefixMap[$vType])) {
                                $newPrefix = $prefixMap[$vType];
                                $parts = explode('-', $existing->ticket_code);
                                if (count($parts) >= 4) {
                                    $prefParts = explode('-', $newPrefix);
                                    $parts[0] = $prefParts[0];
                                    $parts[1] = $prefParts[1];
                                    $newCode = implode('-', $parts);
                                } else {
                                    $newCode = VisitorTicket::generateTicketCode($vType);
                                }
                            }

                            $existing->update([
                                'visitor_name' => $m['visitor_name'],
                                'visitor_email' => $m['visitor_email'],
                                'visitor_phone' => $m['visitor_phone'] ?? null,
                                'visitor_institution' => $m['visitor_institution'] ?? null,
                                'visitor_type' => $vType,
                                'individual_price' => $indPrice,
                                'ticket_code' => $newCode,
                                'status' => $status,
                                'is_group_leader' => $isLeader,
                            ]);
                            if ($isLeader) {
                                $primaryTicket = $existing;
                            }
                        }
                    } else {
                        // Create newly added member ticket
                        $newTicket = VisitorTicket::create([
                            'payment_id' => $payment ? $payment->id : null,
                            'registration_source' => $ticket->registration_source ?? 'online_self',
                            'visitor_name' => $m['visitor_name'],
                            'visitor_email' => $m['visitor_email'],
                            'visitor_phone' => $m['visitor_phone'] ?? null,
                            'visitor_institution' => $m['visitor_institution'] ?? ($ticket->visitor_institution ?? null),
                            'ticket_code' => VisitorTicket::generateTicketCode($vType),
                            'visitor_type' => $vType,
                            'individual_price' => $indPrice,
                            'is_group_leader' => $isLeader,
                            'group_code' => $ticket->group_code ?? ($payment ? $payment->payment_code : null),
                            'status' => $status,
                            'checked_in' => false,
                            'card_printed' => false,
                        ]);
                        if ($isLeader) {
                            $primaryTicket = $newTicket;
                        }
                    }
                }

                // If no primary ticket was designated, use the first ticket
                if (!$primaryTicket && $payment) {
                    $primaryTicket = $payment->tickets()->first();
                    if ($primaryTicket) {
                        $primaryTicket->update(['is_group_leader' => true]);
                    }
                }

                // 3. Update payment PIC & totals
                if ($payment) {
                    $paymentTickets = $payment->tickets()->get();
                    $totalMembers = $paymentTickets->count();

                    $picName = $request->input('pic_name');
                    $picEmail = $request->input('pic_email');
                    $picPhone = $request->input('pic_phone');
                    $picInstitution = $request->input('pic_institution');

                    if ($request->boolean('sync_pic_with_primary', true) && $primaryTicket) {
                        $picName = $primaryTicket->visitor_name;
                        $picEmail = $primaryTicket->visitor_email;
                        $picPhone = $primaryTicket->visitor_phone;
                        $picInstitution = $primaryTicket->visitor_institution;
                    }

                    $updatePayment = [
                        'total_members' => $totalMembers,
                        'pic_name' => $picName ?? $payment->pic_name,
                        'pic_email' => $picEmail ?? $payment->pic_email,
                        'pic_phone' => $picPhone ?? $payment->pic_phone,
                        'pic_institution' => $picInstitution ?? $payment->pic_institution,
                    ];

                    if ($request->boolean('recalculate_total', true)) {
                        $subtotal = $paymentTickets->sum('individual_price');
                        $uniqueCode = (int) ($payment->unique_code ?? 0);
                        if ($subtotal > 0) {
                            $updatePayment['total_amount'] = $subtotal + $uniqueCode;
                        }
                    }

                    $payment->update($updatePayment);
                }

                $msg = $payment 
                    ? "Data pendaftaran & " . count($members) . " tiket peserta berhasil diperbarui." 
                    : "Data peserta berhasil diperbarui.";

                return back()->with('success', $msg);
            });
        }

        // Standard Single Ticket update fallback
        $request->validate([
            'visitor_name' => 'required|string|max:150',
            'visitor_email' => 'required|email|max:150',
            'visitor_phone' => 'nullable|string|max:50',
            'visitor_institution' => 'nullable|string|max:150',
            'visitor_type' => 'required|string|max:100',
            'status' => 'required|in:active,pending,cancelled',
        ]);

        $vType = $request->visitor_type;
        $paidCategories = [
            'iagi_member_professional' => 3000000,
            'non_iagi_member_professional' => 4000000,
            'iagi_member_expatriate' => 6000000,
            'non_iagi_member_expatriate' => 7000000,
            'student_undergraduate' => 1000000,
            'exclusive' => 500000,
        ];
        $indPrice = $paidCategories[$vType] ?? 0;

        $prefixMap = [
            'vip' => 'TKT-VIP',
            'speaker' => 'TKT-SPK',
            'keynote_speech' => 'TKT-SPK',
            'keynote_speaker' => 'TKT-SPK',
            'panelist' => 'TKT-PNL',
            'moderator' => 'TKT-MOD',
            'exhibition' => 'TKT-EXH',
            'committee' => 'TKT-COM',
            'student_volunteer' => 'TKT-VOL',
            'board' => 'TKT-BRD',
            'sponsorship' => 'TKT-SPN',
            'sponsor' => 'TKT-SPN',
            'delegate' => 'TKT-DLG',
            'non_exclusive' => 'TKT-VIS',
            'exclusive' => 'TKT-EXC',
            'iagi_member_professional' => 'TKT-IPRO',
            'non_iagi_member_professional' => 'TKT-NPRO',
            'iagi_member_expatriate' => 'TKT-IEXP',
            'non_iagi_member_expatriate' => 'TKT-NEXP',
            'student_undergraduate' => 'TKT-STUD',
            // Technical
            'student' => 'TKT-STUD',
            'presenter' => 'TKT-STUD',
            'invited_speaker' => 'TKT-ISPK',
            'session_chair_judge' => 'TKT-JDG',
            'session_chair' => 'TKT-JDG',
            'judge' => 'TKT-JDG',
            'oral' => 'TKT-ORL',
            'oral_presenter' => 'TKT-ORL',
            'poster' => 'TKT-PST',
            'poster_presenter' => 'TKT-PST',
        ];

        $newCode = $ticket->ticket_code;
        if ($ticket->visitor_type !== $vType && isset($prefixMap[$vType])) {
            $newPrefix = $prefixMap[$vType];
            $parts = explode('-', $ticket->ticket_code);
            if (count($parts) >= 4) {
                $prefParts = explode('-', $newPrefix);
                $parts[0] = $prefParts[0];
                $parts[1] = $prefParts[1];
                $newCode = implode('-', $parts);
            } else {
                $newCode = VisitorTicket::generateTicketCode($vType);
            }
        }

        $ticket->update([
            'visitor_name' => $request->visitor_name,
            'visitor_email' => $request->visitor_email,
            'visitor_phone' => $request->visitor_phone,
            'visitor_institution' => $request->visitor_institution,
            'visitor_type' => $vType,
            'individual_price' => $indPrice,
            'ticket_code' => $newCode,
            'status' => $request->status,
        ]);

        if ($ticket->payment_id && $ticket->payment) {
            $subtotal = $ticket->payment->tickets()->sum('individual_price');
            $uniqueCode = (int) ($ticket->payment->unique_code ?? 0);
            if ($subtotal > 0) {
                $ticket->payment->update([
                    'total_amount' => $subtotal + $uniqueCode,
                ]);
            }
        }

        return back()->with('success', "Data pengunjung {$ticket->visitor_name} berhasil diperbarui.");
    }

    /**
     * Delete/Destroy single visitor ticket
     */
    public function destroyVisitor($id)
    {
        $ticket = VisitorTicket::with('payment')->findOrFail($id);
        $name = $ticket->visitor_name;
        $code = $ticket->ticket_code;
        $paymentId = $ticket->payment_id;
        $payment = $ticket->payment;

        // Record activity audit log BEFORE deleting
        ActivityLog::record(
            action: 'delete_ticket',
            module: 'visitor_tickets',
            description: "Menghapus tiket {$code} atas nama {$name} ({$ticket->visitor_email})",
            targetId: $ticket->id,
            targetCode: $code,
            snapshot: [
                'ticket' => $ticket->toArray(),
                'payment' => $payment ? $payment->toArray() : null,
            ]
        );

        $ticket->delete();

        if ($paymentId && VisitorTicket::where('payment_id', $paymentId)->count() === 0) {
            ActivityLog::record(
                action: 'delete_payment',
                module: 'payments',
                description: "Menghapus invoice pembayaran {$payment?->payment_code} karena seluruh tiket anggotanya telah dihapus",
                targetId: $paymentId,
                targetCode: $payment?->payment_code,
                snapshot: $payment ? $payment->toArray() : null
            );
            VisitorPayment::where('id', $paymentId)->delete();
        }

        return back()->with('success', "Tiket {$code} ({$name}) berhasil dihapus.");
    }

    /**
     * Process Bulk Actions on Selected Tickets
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:verify_payment,check_in,undo_check_in,cancel_ticket,delete,resend_email',
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'integer|exists:visitor_tickets,id',
        ]);

        $action = $request->action;
        $ticketIds = $request->ticket_ids;
        $tickets = VisitorTicket::whereIn('id', $ticketIds)->get();

        switch ($action) {
            case 'resend_email':
                $activeTickets = $tickets->where('status', 'active')->filter(fn($t) => !empty($t->visitor_email));
                if ($activeTickets->isEmpty()) {
                    return back()->with('error', 'Tidak ada tiket berstatus AKTIF dengan email valid dari item yang dipilih.');
                }
                $this->applySmtpSettings();
                $successCount = 0;
                $failCount = 0;
                foreach ($activeTickets as $ticket) {
                    try {
                        Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                        $successCount++;
                    } catch (\Exception $e) {
                        $failCount++;
                        Log::error("Bulk resend email failed for {$ticket->visitor_email}: " . $e->getMessage());
                    }
                }
                if ($failCount === 0) {
                    return back()->with('success', "E-Tiket berhasil dikirim ke {$successCount} email pengunjung.");
                } else {
                    return back()->with('warning', "E-Tiket terkirim ke {$successCount} email ({$failCount} email gagal).");
                }

            case 'verify_payment':
                $paymentIds = $tickets->pluck('payment_id')->filter()->unique();
                VisitorPayment::whereIn('id', $paymentIds)->update([
                    'status' => 'approved',
                    'verified_at' => now(),
                    'verified_by_admin_id' => Auth::id(),
                ]);
                VisitorTicket::whereIn('payment_id', $paymentIds)->update(['status' => 'active']);
                return back()->with('success', count($paymentIds) . ' pembayaran berhasil diverifikasi secara massal!');

            case 'check_in':
                VisitorTicket::whereIn('id', $ticketIds)->where('status', 'active')->update([
                    'checked_in' => true,
                    'checked_in_at' => now(),
                    'checked_in_by_admin_id' => Auth::id(),
                ]);
                return back()->with('success', count($ticketIds) . ' tiket berhasil di-Check In secara massal!');

            case 'undo_check_in':
                VisitorTicket::whereIn('id', $ticketIds)->update([
                    'checked_in' => false,
                    'checked_in_at' => null,
                    'checked_in_by_admin_id' => null,
                ]);
                return back()->with('success', 'Status check-in untuk ' . count($ticketIds) . ' tiket berhasil dibatalkan.');

            case 'cancel_ticket':
                VisitorTicket::whereIn('id', $ticketIds)->update(['status' => 'cancelled']);
                return back()->with('success', count($ticketIds) . ' tiket berhasil dibatalkan.');

            case 'delete':
                $paymentIds = $tickets->pluck('payment_id')->filter()->unique();
                $deletedSnapshots = [];
                foreach ($tickets as $t) {
                    $deletedSnapshots[] = [
                        'id' => $t->id,
                        'name' => $t->visitor_name,
                        'code' => $t->ticket_code,
                        'email' => $t->visitor_email,
                        'type' => $t->visitor_type,
                        'price' => $t->individual_price,
                        'payment_id' => $t->payment_id,
                    ];
                }

                ActivityLog::record(
                    action: 'bulk_delete_tickets',
                    module: 'visitor_tickets',
                    description: "Menghapus massal " . count($tickets) . " tiket pengunjung (" . implode(', ', $tickets->pluck('ticket_code')->take(5)->toArray()) . (count($tickets) > 5 ? '...' : '') . ")",
                    targetId: null,
                    targetCode: 'BULK-DELETE',
                    snapshot: [
                        'count' => count($tickets),
                        'tickets' => $deletedSnapshots,
                    ]
                );

                VisitorTicket::whereIn('id', $ticketIds)->delete();
                foreach ($paymentIds as $pid) {
                    if (VisitorTicket::where('payment_id', $pid)->count() === 0) {
                        VisitorPayment::where('id', $pid)->delete();
                    }
                }
                return back()->with('success', count($ticketIds) . ' tiket berhasil dihapus dari sistem.');
        }

        return back();
    }
}

