<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VisitorTicket;
use App\Models\VisitorPayment;
use App\Models\LandingPageSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\EmailSetting;
use App\Mail\VisitorTicketIssued;
use App\Mail\VisitorPaymentPending;

class VisitorTicketController extends Controller
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
     * Display public visitor ticket registration page
     */
    public function index()
    {
        $settings = LandingPageSetting::whereIn('key', [
            'visitor_ticket_price_exclusive',
            'visitor_ticket_price_non_exclusive',
            'visitor_registration_enabled',
            'visitor_qris_image',
            'visitor_bank_transfer_info',
            'visitor_event_date',
            'visitor_event_venue',
        ])->pluck('value', 'key');

        $priceExclusive = floatval($settings['visitor_ticket_price_exclusive'] ?? 150000);
        $priceNonExclusive = floatval($settings['visitor_ticket_price_non_exclusive'] ?? 0);
        $enabled = ($settings['visitor_registration_enabled'] ?? '1') === '1';
        $qrisImage = !empty($settings['visitor_qris_image']) ? Storage::url($settings['visitor_qris_image']) : null;
        $bankTransferInfo = $settings['visitor_bank_transfer_info'] ?? "Bank Mandiri\nNo. Rek: 123-456-7890\na.n. Panitia PIT IAGI 2026";
        $eventDate = $settings['visitor_event_date'] ?? '3-5 November 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta';

        return Inertia::render('VisitorTickets/Register', [
            'priceExclusive' => $priceExclusive,
            'priceNonExclusive' => $priceNonExclusive,
            'enabled' => $enabled,
            'qrisImage' => $qrisImage,
            'bankTransferInfo' => $bankTransferInfo,
            'eventDate' => $eventDate,
            'eventVenue' => $eventVenue,
            'settings' => [
                'priceExclusive' => $priceExclusive,
                'priceNonExclusive' => $priceNonExclusive,
                'enabled' => $enabled,
                'qrisImage' => $qrisImage,
                'bankTransferInfo' => $bankTransferInfo,
                'bankInfo' => $bankTransferInfo,
                'eventDate' => $eventDate,
                'eventVenue' => $eventVenue,
            ]
        ]);
    }

    /**
     * Store new visitor ticket registration (Single or Group)
     */
    public function store(Request $request)
    {
        $request->validate([
            'visitor_type' => 'required|in:exclusive,non_exclusive',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:150',
            'members.*.email' => 'required|email|max:150',
            'members.*.phone' => 'nullable|string|max:50',
            'members.*.institution' => 'nullable|string|max:150',
            'proof_of_payment' => 'required_if:visitor_type,exclusive|nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ], [
            'members.*.name.required' => 'Full name is required for all participants.',
            'members.*.email.required' => 'Email address is required for all participants.',
            'proof_of_payment.required_if' => 'Payment proof is required for Exclusive VIP registration.',
        ]);

        $visitorType = $request->visitor_type;
        $members = $request->members;
        $totalMembers = count($members);

        return DB::transaction(function () use ($request, $visitorType, $members, $totalMembers) {
            $groupCode = $totalMembers > 1 ? 'GRP-' . strtoupper(Str::random(8)) : null;

            if ($visitorType === 'exclusive') {
                $priceSetting = LandingPageSetting::where('key', 'visitor_ticket_price_exclusive')->value('value');
                $pricePerTicket = floatval($priceSetting ?: 150000);
                $uniqueCode = rand(100, 999);
                $totalAmount = ($pricePerTicket * $totalMembers) + $uniqueCode;

                $proofPath = null;
                if ($request->hasFile('proof_of_payment')) {
                    $proofPath = $request->file('proof_of_payment')->store('visitor_proofs', 'public');
                }

                $payment = VisitorPayment::create([
                    'payment_code' => 'VPAY-' . date('ymd') . '-' . strtoupper(Str::random(6)),
                    'payment_method' => 'bank_transfer',
                    'total_members' => $totalMembers,
                    'price_per_ticket' => $pricePerTicket,
                    'unique_code' => $uniqueCode,
                    'total_amount' => $totalAmount,
                    'proof_of_payment' => $proofPath,
                    'status' => 'pending',
                ]);

                $firstTicket = null;
                foreach ($members as $index => $member) {
                    $ticket = VisitorTicket::create([
                        'payment_id' => $payment->id,
                        'registration_source' => 'online_self',
                        'visitor_name' => $member['name'],
                        'visitor_email' => $member['email'],
                        'visitor_phone' => $member['phone'] ?? null,
                        'visitor_institution' => $member['institution'] ?? null,
                        'ticket_code' => VisitorTicket::generateTicketCode('exclusive'),
                        'visitor_type' => 'exclusive',
                        'is_group_leader' => $index === 0,
                        'group_code' => $groupCode,
                        'status' => 'pending',
                        'checked_in' => false,
                        'card_printed' => false,
                    ]);

                    if ($index === 0) {
                        $firstTicket = $ticket;
                    }
                }

                // Send Pending Payment Email to the primary registrant immediately
                if (!empty($members[0]['email'])) {
                    try {
                        $this->applySmtpSettings();
                        Mail::to($members[0]['email'])->send(new VisitorPaymentPending($payment));
                    } catch (\Exception $e) {
                        Log::error('Failed to send visitor payment pending email: ' . $e->getMessage());
                    }
                }

                return redirect()->route('visitor.payment.status', ['payment_code' => $payment->payment_code])
                    ->with('success', 'Visitor Exclusive registration submitted successfully! Please wait for committee verification.');
            } else {
                // Non-Exclusive (Free)
                $firstTicket = null;
                $createdTickets = [];

                foreach ($members as $index => $member) {
                    $ticket = VisitorTicket::create([
                        'payment_id' => null,
                        'registration_source' => 'online_self',
                        'visitor_name' => $member['name'],
                        'visitor_email' => $member['email'],
                        'visitor_phone' => $member['phone'] ?? null,
                        'visitor_institution' => $member['institution'] ?? null,
                        'ticket_code' => VisitorTicket::generateTicketCode('non_exclusive'),
                        'visitor_type' => 'non_exclusive',
                        'is_group_leader' => $index === 0,
                        'group_code' => $groupCode,
                        'status' => 'active', // Active immediately
                        'checked_in' => false,
                        'card_printed' => false,
                    ]);

                    $createdTickets[] = $ticket;
                    if ($index === 0) {
                        $firstTicket = $ticket;
                    }

                    // Send E-Ticket email to each registered member immediately
                    try {
                        $this->applySmtpSettings();
                        Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                    } catch (\Exception $e) {
                        Log::error("Failed to send visitor ticket email to {$ticket->visitor_email}: " . $e->getMessage());
                    }
                }

                return redirect()->route('visitor.ticket.show', ['ticket_code' => $firstTicket->ticket_code])
                    ->with('success', 'Visitor Non-Exclusive registration successful! Your E-Ticket has been issued.');
            }
        });
    }

    /**
     * Display digital E-Ticket with QR Code
     */
    public function showTicket($ticket_code)
    {
        $ticket = VisitorTicket::with('payment')->where('ticket_code', $ticket_code)->firstOrFail();

        $settings = LandingPageSetting::whereIn('key', [
            'visitor_event_date',
            'visitor_event_venue',
        ])->pluck('value', 'key');

        $eventDate = $settings['visitor_event_date'] ?? '3-5 November 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta';

        // Fetch companion group tickets if any
        $groupTickets = [];
        if ($ticket->group_code) {
            $groupTickets = VisitorTicket::where('group_code', $ticket->group_code)
                ->where('id', '!=', $ticket->id)
                ->get(['id', 'visitor_name', 'visitor_email', 'ticket_code', 'visitor_type', 'status']);
        }

        return Inertia::render('VisitorTickets/ShowTicket', [
            'ticket' => $ticket,
            'groupTickets' => $groupTickets,
            'eventDate' => $eventDate,
            'eventVenue' => $eventVenue,
        ]);
    }

    /**
     * Display payment status tracking for Exclusive visitors
     */
    public function paymentStatus($payment_code)
    {
        $payment = VisitorPayment::with('tickets')->where('payment_code', $payment_code)->firstOrFail();

        return Inertia::render('VisitorTickets/PaymentStatus', [
            'payment' => $payment,
            'tickets' => $payment->tickets,
        ]);
    }
}
