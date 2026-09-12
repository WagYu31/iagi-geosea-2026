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
        $rawBankTransferInfo = $settings['visitor_bank_transfer_info'] ?? "Mandiri Bank\nAccount Number: 137-00-1234567-8\nAccount Holder: Ikatan Ahli Geologi Indonesia (IAGI)";
        $bankTransferInfo = preg_replace('/Bank\s+Mandiri/i', 'Mandiri Bank', $rawBankTransferInfo);
        $bankTransferInfo = preg_replace('/No\.\s*Rek\s*:/i', 'Account Number:', $bankTransferInfo);
        $bankTransferInfo = preg_replace('/a\.\s*n\.\s*:?/i', 'Account Holder: ', $bankTransferInfo);
        $bankTransferInfo = preg_replace('/atas\s*nama\s*:?/i', 'Account Holder: ', $bankTransferInfo);
        $eventDate = $settings['visitor_event_date'] ?? '3-5 November 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta';
        $enabled = ($settings['visitor_registration_enabled'] ?? '1') === '1';
        $qrisImage = $settings['visitor_qris_image'] ?? null;

        // Standard regular price mapping
        $priceIagiPro = floatval($settings['visitor_ticket_price_iagi_member_professional'] ?? ($settings['visitor_price_iagi_member_pro'] == '2500000' ? 3000000 : ($settings['visitor_price_iagi_member_pro'] ?? 3000000)));
        $priceNonIagiPro = floatval($settings['visitor_ticket_price_non_iagi_member_professional'] ?? ($settings['visitor_price_non_iagi_member_pro'] == '3000000' && !isset($settings['visitor_ticket_price_non_iagi_member_professional']) ? 4000000 : ($settings['visitor_price_non_iagi_member_pro'] ?? 4000000)));
        $priceIagiExpat = floatval($settings['visitor_ticket_price_iagi_member_expatriate'] ?? ($settings['visitor_price_iagi_member_expat'] == '5000000' ? 6000000 : ($settings['visitor_price_iagi_member_expat'] ?? 6000000)));
        $priceNonIagiExpat = floatval($settings['visitor_ticket_price_non_iagi_member_expatriate'] ?? ($settings['visitor_price_non_iagi_member_expat'] == '6000000' ? 7000000 : ($settings['visitor_price_non_iagi_member_expat'] ?? 7000000)));
        $priceStudent = floatval($settings['visitor_ticket_price_student_undergraduate'] ?? ($settings['visitor_price_student'] == '750000' ? 1000000 : ($settings['visitor_price_student'] ?? 1000000)));

        // Full category configuration list matching official conference pricing (regular prices)
        $categories = [
            [
                'id' => 'iagi_member_professional',
                'name' => 'Professional (Member)',
                'badge' => 'PROFESSIONAL (MEMBER)',
                'normalPrice' => $priceIagiPro,
                'price' => $priceIagiPro,
                'tag' => 'PROFESSIONAL (MEMBER)',
                'tagColor' => '#047857',
                'tagBg' => '#dcfce7',
                'description' => 'For Professional IAGI Member',
                'perks' => [
                    'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                    'Seminar Kit',
                    'Lunch and Snack',
                ],
            ],
            [
                'id' => 'non_iagi_member_professional',
                'name' => 'Professional (Non-Member)',
                'badge' => 'PROFESSIONAL (NON-MEMBER)',
                'normalPrice' => $priceNonIagiPro,
                'price' => $priceNonIagiPro,
                'tag' => 'PROFESSIONAL (NON-MEMBER)',
                'tagColor' => '#0284c7',
                'tagBg' => '#e0f2fe',
                'description' => 'For Professional Non - IAGI Member',
                'perks' => [
                    'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                    'Seminar Kit',
                    'Lunch and Snack',
                ],
            ],
            [
                'id' => 'iagi_member_expatriate',
                'name' => 'Expatriate (Member)',
                'badge' => 'EXPATRIATE (MEMBER)',
                'normalPrice' => $priceIagiExpat,
                'price' => $priceIagiExpat,
                'tag' => 'EXPATRIATE (MEMBER)',
                'tagColor' => '#b45309',
                'tagBg' => '#fef3c7',
                'description' => 'For Expatriate IAGI Member',
                'perks' => [
                    'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                    'Seminar Kit',
                    'Lunch and Snack',
                ],
            ],
            [
                'id' => 'non_iagi_member_expatriate',
                'name' => 'Expatriate (Non-Member)',
                'badge' => 'EXPATRIATE (NON-MEMBER)',
                'normalPrice' => $priceNonIagiExpat,
                'price' => $priceNonIagiExpat,
                'tag' => 'EXPATRIATE (NON-MEMBER)',
                'tagColor' => '#7c3aed',
                'tagBg' => '#ede9fe',
                'description' => 'For Expatriate Non - IAGI Member',
                'perks' => [
                    'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                    'Seminar Kit',
                    'Lunch and Snack',
                ],
            ],
            [
                'id' => 'student_undergraduate',
                'name' => 'Student Undergraduate',
                'badge' => 'STUDENT UNDERGRADUATE',
                'normalPrice' => $priceStudent,
                'price' => $priceStudent,
                'tag' => 'STUDENT UNDERGRADUATE',
                'tagColor' => '#4338ca',
                'tagBg' => '#e0e7ff',
                'description' => 'For Undergraduate Student',
                'perks' => [
                    'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                    'Seminar Kit',
                    'Lunch and Snack',
                ],
            ],
            [
                'id' => 'non_exclusive',
                'name' => 'Visitor Pass (Free)',
                'badge' => 'VISITOR PASS (FREE)',
                'normalPrice' => 0,
                'price' => 0,
                'tag' => 'VISITOR PASS (FREE)',
                'tagColor' => '#059669',
                'tagBg' => '#d1fae5',
                'description' => 'For anyone who visiting on site',
                'perks' => ['Free Registration', 'Access Exhibition Hall only'],
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
            'iagi_member_professional' => floatval($settings['visitor_ticket_price_iagi_member_professional'] ?? ($settings['visitor_price_iagi_member_pro'] == '2500000' ? 3000000 : ($settings['visitor_price_iagi_member_pro'] ?? 3000000))),
            'non_iagi_member_professional' => floatval($settings['visitor_ticket_price_non_iagi_member_professional'] ?? ($settings['visitor_price_non_iagi_member_pro'] == '3000000' && !isset($settings['visitor_ticket_price_non_iagi_member_professional']) ? 4000000 : ($settings['visitor_price_non_iagi_member_pro'] ?? 4000000))),
            'iagi_member_expatriate' => floatval($settings['visitor_ticket_price_iagi_member_expatriate'] ?? ($settings['visitor_price_iagi_member_expat'] == '5000000' ? 6000000 : ($settings['visitor_price_iagi_member_expat'] ?? 6000000))),
            'non_iagi_member_expatriate' => floatval($settings['visitor_ticket_price_non_iagi_member_expatriate'] ?? ($settings['visitor_price_non_iagi_member_expat'] == '6000000' ? 7000000 : ($settings['visitor_price_non_iagi_member_expat'] ?? 7000000))),
            'student_undergraduate' => floatval($settings['visitor_ticket_price_student_undergraduate'] ?? ($settings['visitor_price_student'] == '750000' ? 1000000 : ($settings['visitor_price_student'] ?? 1000000))),
        ];

        $pricePerTicket = $pricingMap[$visitorType] ?? 0;
        $isPaid = $pricePerTicket > 0;

        if ($isPaid && !$request->hasFile('proof_of_payment')) {
            return back()->withErrors(['proof_of_payment' => 'Payment proof is required for paid registration categories.']);
        }

        return DB::transaction(function () use ($request, $visitorType, $members, $totalMembers, $pricePerTicket, $isPaid) {
            $groupCode = $totalMembers > 1 ? 'GRP-' . strtoupper(Str::random(8)) : null;

            if ($isPaid) {
                $uniqueCode = ($request->filled('unique_code') && intval($request->unique_code) >= 100 && intval($request->unique_code) <= 999)
                    ? intval($request->unique_code)
                    : rand(100, 999);
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

    /**
     * Display official payment receipt / invoice (Kwitansi & Invoice Resmi)
     */
    public function showReceipt($payment_code)
    {
        $payment = VisitorPayment::with(['tickets', 'verifiedBy'])->where('payment_code', $payment_code)->firstOrFail();

        $settings = LandingPageSetting::whereIn('key', [
            'visitor_event_date',
            'visitor_event_venue',
            'bank_info',
            'visitor_bank_transfer_info',
        ])->pluck('value', 'key');

        $eventDate = $settings['visitor_event_date'] ?? '3 - 5 November 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta';
        $rawBankInfo = $settings['visitor_bank_transfer_info'] ?? $settings['bank_info'] ?? "Mandiri Bank\nAccount Number: 137-00-1234567-8\nAccount Holder: Ikatan Ahli Geologi Indonesia (IAGI)";
        $bankInfo = preg_replace('/Bank\s+Mandiri/i', 'Mandiri Bank', $rawBankInfo);
        $bankInfo = preg_replace('/No\.\s*Rek\s*:/i', 'Account Number:', $bankInfo);
        $bankInfo = preg_replace('/a\.\s*n\.\s*:?/i', 'Account Holder: ', $bankInfo);
        $bankInfo = preg_replace('/atas\s*nama\s*:?/i', 'Account Holder: ', $bankInfo);

        return Inertia::render('VisitorTickets/Receipt', [
            'payment' => $payment,
            'tickets' => $payment->tickets,
            'eventDate' => $eventDate,
            'eventVenue' => $eventVenue,
            'bankInfo' => $bankInfo,
        ]);
    }

    /**
     * Search and lookup visitor ticket / payment status by email, phone, ticket_code, or payment_code
     */
    public function lookup(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:3|max:150',
        ]);

        $search = trim($request->input('query'));

        // Search in VisitorTicket (by email, phone, ticket_code, or visitor_name)
        // Or search in VisitorPayment (by payment_code)
        $tickets = VisitorTicket::with('payment')
            ->where(function ($q) use ($search) {
                $q->where('visitor_email', 'LIKE', "%{$search}%")
                  ->orWhere('visitor_phone', 'LIKE', "%{$search}%")
                  ->orWhere('ticket_code', 'LIKE', "%{$search}%")
                  ->orWhere('visitor_name', 'LIKE', "%{$search}%")
                  ->orWhereHas('payment', function ($pq) use ($search) {
                      $pq->where('payment_code', 'LIKE', "%{$search}%");
                  });
            })
            ->latest()
            ->take(15)
            ->get();

        if ($tickets->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No registration or ticket records found matching "' . $search . '". Please ensure you entered the registered email, phone number, or payment code correctly.',
                'data' => [],
            ]);
        }

        // Format results
        $results = $tickets->map(function ($ticket) {
            $payment = $ticket->payment;
            $hasPayment = !is_null($payment);
            
            // Determine primary destination URL
            $statusUrl = $hasPayment 
                ? route('visitor.payment.status', ['payment_code' => $payment->payment_code])
                : route('visitor.ticket.show', ['ticket_code' => $ticket->ticket_code]);

            $ticketUrl = route('visitor.ticket.show', ['ticket_code' => $ticket->ticket_code]);
            $receiptUrl = $hasPayment ? route('visitor.receipt.show', ['payment_code' => $payment->payment_code]) : null;

            return [
                'id' => $ticket->id,
                'name' => $ticket->visitor_name,
                'email' => $ticket->visitor_email,
                'phone' => $ticket->visitor_phone,
                'institution' => $ticket->visitor_institution,
                'ticket_code' => $ticket->ticket_code,
                'visitor_type' => $ticket->visitor_type,
                'category_label' => $ticket->category_label ?? ucwords(str_replace('_', ' ', $ticket->visitor_type)),
                'status' => $ticket->status,
                'has_payment' => $hasPayment,
                'payment_code' => $payment ? $payment->payment_code : null,
                'payment_status' => $payment ? $payment->status : null,
                'total_amount' => $payment ? $payment->total_amount : 0,
                'created_at_formatted' => $ticket->created_at ? $ticket->created_at->format('d M Y, H:i') : null,
                'status_url' => $statusUrl,
                'ticket_url' => $ticketUrl,
                'receipt_url' => $receiptUrl,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Found ' . count($results) . ' registration record(s).',
            'data' => $results,
        ]);
    }
}
