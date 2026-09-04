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
            'visitor_price_iagi_member_pro',
            'visitor_price_non_iagi_member_pro',
            'visitor_price_iagi_member_expat',
            'visitor_price_non_iagi_member_expat',
            'visitor_price_student',
            'visitor_registration_enabled',
            'visitor_qris_image',
            'visitor_bank_transfer_info',
            'visitor_event_date',
            'visitor_event_venue',
        ])->pluck('value', 'key');

        $priceExclusive = floatval($settings['visitor_ticket_price_exclusive'] ?? 500000);
        $priceNonExclusive = floatval($settings['visitor_ticket_price_non_exclusive'] ?? 0);
        $enabled = ($settings['visitor_registration_enabled'] ?? '1') === '1';
        $qrisImage = !empty($settings['visitor_qris_image']) ? Storage::url($settings['visitor_qris_image']) : null;
        $bankTransferInfo = $settings['visitor_bank_transfer_info'] ?? "Bank Mandiri\nNo. Rek: 123-456-7890\na.n. Panitia PIT IAGI 2026";
        $eventDate = $settings['visitor_event_date'] ?? '3-5 November 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta';

        // Full category configuration list matching official conference pricing & early bird poster
        $categories = [
            [
                'id' => 'iagi_member_professional',
                'name' => 'IAGI Member Professional',
                'badge' => 'IAGI MEMBER',
                'normalPrice' => 3000000,
                'price' => floatval($settings['visitor_price_iagi_member_pro'] ?? 2500000),
                'tag' => 'SPECIAL EARLY BIRD',
                'tagColor' => '#047857',
                'tagBg' => '#dcfce7',
                'description' => 'Full access to conference sessions, exhibition arena, seminar kit, official lanyard & lunches.',
                'perks' => ['Full Conference Access', 'Seminar Kit & Lanyard', 'Exhibition & Lunches'],
            ],
            [
                'id' => 'non_iagi_member_professional',
                'name' => 'Non IAGI Member Professional',
                'badge' => 'PROFESSIONAL',
                'normalPrice' => 4000000,
                'price' => floatval($settings['visitor_price_non_iagi_member_pro'] ?? 3000000),
                'tag' => 'SPECIAL EARLY BIRD',
                'tagColor' => '#0284c7',
                'tagBg' => '#e0f2fe',
                'description' => 'Full access to conference sessions, exhibition arena, seminar kit, official lanyard & lunches.',
                'perks' => ['Full Conference Access', 'Seminar Kit & Lanyard', 'Exhibition & Lunches'],
            ],
            [
                'id' => 'iagi_member_expatriate',
                'name' => 'IAGI Member Expatriate',
                'badge' => 'IAGI EXPATRIATE',
                'normalPrice' => 6000000,
                'price' => floatval($settings['visitor_price_iagi_member_expat'] ?? 5000000),
                'tag' => 'SPECIAL EARLY BIRD',
                'tagColor' => '#b45309',
                'tagBg' => '#fef3c7',
                'description' => 'Full international delegate access, technical sessions, exhibition, VIP lanyard & gala dinner.',
                'perks' => ['International Delegate', 'VIP Lanyard & Kit', 'Plenary & Gala Dinner'],
            ],
            [
                'id' => 'non_iagi_member_expatriate',
                'name' => 'Non IAGI Member Expatriate',
                'badge' => 'INTERNATIONAL DELEGATE',
                'normalPrice' => 7000000,
                'price' => floatval($settings['visitor_price_non_iagi_member_expat'] ?? 6000000),
                'tag' => 'SPECIAL EARLY BIRD',
                'tagColor' => '#7c3aed',
                'tagBg' => '#ede9fe',
                'description' => 'Full international delegate access, technical sessions, exhibition, VIP lanyard & gala dinner.',
                'perks' => ['International Delegate', 'VIP Lanyard & Kit', 'Plenary & Gala Dinner'],
            ],
            [
                'id' => 'student_undergraduate',
                'name' => 'Student Undergraduate',
                'badge' => 'STUDENT PASS',
                'normalPrice' => 1000000,
                'price' => floatval($settings['visitor_price_student'] ?? 750000),
                'tag' => 'SPECIAL EARLY BIRD',
                'tagColor' => '#4338ca',
                'tagBg' => '#e0e7ff',
                'description' => 'Undergraduate student pass (valid student ID required), technical sessions & certificate.',
                'perks' => ['Student ID Required', 'Technical Sessions', 'Exhibition & E-Certificate'],
            ],
            [
                'id' => 'non_exclusive',
                'name' => 'Visitor Non-Exclusive',
                'badge' => 'FREE PASS',
                'normalPrice' => 0,
                'price' => 0,
                'tag' => 'FREE PASS',
                'tagColor' => '#059669',
                'tagBg' => '#d1fae5',
                'description' => 'Access to general geological exhibition arena & scientific poster exhibition sessions.',
                'perks' => ['General Exhibition', 'Poster Sessions', 'Instant E-Ticket & Badge'],
            ],
            [
                'id' => 'exclusive',
                'name' => 'Visitor Exclusive',
                'badge' => 'VIP PASS',
                'normalPrice' => $priceExclusive,
                'price' => $priceExclusive,
                'tag' => 'VIP PASS',
                'tagColor' => '#d97706',
                'tagBg' => '#fef3c7',
                'description' => 'Plenary Session access, VIP Lounge entry, Gold Lanyard badge & official Seminar Kit.',
                'perks' => ['Plenary Session Access', 'VIP Lounge & Gold Lanyard', 'Official Seminar Kit'],
            ],
        ];

        return Inertia::render('VisitorTickets/Register', [
            'priceExclusive' => $priceExclusive,
            'priceNonExclusive' => $priceNonExclusive,
            'categories' => $categories,
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
        $allowedTypes = [
            'non_exclusive',
            'exclusive',
            'iagi_member_professional',
            'non_iagi_member_professional',
            'iagi_member_expatriate',
            'non_iagi_member_expatriate',
            'student_undergraduate',
        ];

        $request->validate([
            'visitor_type' => 'required|string|in:' . implode(',', $allowedTypes),
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:150',
            'members.*.email' => 'required|email|max:150',
            'members.*.phone' => 'nullable|string|max:50',
            'members.*.institution' => 'nullable|string|max:150',
            'proof_of_payment' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ], [
            'members.*.name.required' => 'Full name is required for all participants.',
            'members.*.email.required' => 'Email address is required for all participants.',
        ]);

        $visitorType = $request->visitor_type;
        $members = $request->members;
        $totalMembers = count($members);

        $settings = LandingPageSetting::whereIn('key', [
            'visitor_ticket_price_exclusive',
            'visitor_ticket_price_non_exclusive',
            'visitor_price_iagi_member_pro',
            'visitor_price_non_iagi_member_pro',
            'visitor_price_iagi_member_expat',
            'visitor_price_non_iagi_member_expat',
            'visitor_price_student',
        ])->pluck('value', 'key');

        $pricingMap = [
            'non_exclusive' => 0,
            'exclusive' => floatval($settings['visitor_ticket_price_exclusive'] ?? 500000),
            'iagi_member_professional' => floatval($settings['visitor_price_iagi_member_pro'] ?? 2500000),
            'non_iagi_member_professional' => floatval($settings['visitor_price_non_iagi_member_pro'] ?? 3000000),
            'iagi_member_expatriate' => floatval($settings['visitor_price_iagi_member_expat'] ?? 5000000),
            'non_iagi_member_expatriate' => floatval($settings['visitor_price_non_iagi_member_expat'] ?? 6000000),
            'student_undergraduate' => floatval($settings['visitor_price_student'] ?? 750000),
        ];

        $pricePerTicket = $pricingMap[$visitorType] ?? 0;
        $isPaid = $pricePerTicket > 0;

        if ($isPaid && !$request->hasFile('proof_of_payment')) {
            return back()->withErrors(['proof_of_payment' => 'Payment proof is required for paid registration categories.']);
        }

        return DB::transaction(function () use ($request, $visitorType, $members, $totalMembers, $pricePerTicket, $isPaid) {
            $groupCode = $totalMembers > 1 ? 'GRP-' . strtoupper(Str::random(8)) : null;

            if ($isPaid) {
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
                        'ticket_code' => VisitorTicket::generateTicketCode($visitorType),
                        'visitor_type' => $visitorType,
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
                    ->with('success', 'Registration submitted successfully! Please wait for committee verification.');
            } else {
                // Free Registration (Non-Exclusive)
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
                        'ticket_code' => VisitorTicket::generateTicketCode($visitorType),
                        'visitor_type' => $visitorType,
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
                    ->with('success', 'Registration successful! Your E-Ticket has been issued.');
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
