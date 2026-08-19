<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VisitorTicket;
use App\Models\VisitorPayment;
use App\Models\LandingPageSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VisitorTicketController extends Controller
{
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
        $qrisImage = $settings['visitor_qris_image'] ?? null;
        $bankTransferInfo = $settings['visitor_bank_transfer_info'] ?? "Bank Mandiri\nNo. Rek: 137-00-1234567-8\na.n. Ikatan Ahli Geologi Indonesia (IAGI)";
        $eventDate = $settings['visitor_event_date'] ?? 'October 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Grand Ballroom Hotel Indonesia, Jakarta';

        return Inertia::render('VisitorTickets/Register', [
            'priceExclusive' => $priceExclusive,
            'priceNonExclusive' => $priceNonExclusive,
            'enabled' => $enabled,
            'qrisImage' => $qrisImage ? (str_starts_with($qrisImage, 'http') ? $qrisImage : '/storage/' . $qrisImage) : null,
            'bankTransferInfo' => $bankTransferInfo,
            'eventDate' => $eventDate,
            'eventVenue' => $eventVenue,
        ]);
    }

    /**
     * Store new visitor ticket registration (Exclusive or Non-Exclusive)
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
            
            // Required if exclusive
            'payment_method' => 'required_if:visitor_type,exclusive|in:qris_indo,foreign_bank_transfer',
            'proof_of_payment' => 'required_if:visitor_type,exclusive|file|image|max:10240', // max 10MB before compression
            'original_file_size_kb' => 'nullable|numeric',
            'compressed_file_size_kb' => 'nullable|numeric',
        ]);

        $visitorType = $request->visitor_type;
        $members = $request->members;
        $totalMembers = count($members);
        $groupCode = 'GRP-' . strtoupper(Str::random(8));

        return DB::transaction(function () use ($request, $visitorType, $members, $totalMembers, $groupCode) {
            if ($visitorType === 'exclusive') {
                // Fetch dynamic price
                $priceSetting = LandingPageSetting::where('key', 'visitor_ticket_price_exclusive')->value('value');
                $pricePerTicket = floatval($priceSetting ?: 150000);
                
                // 3 digit random unique code
                $uniqueCode = rand(100, 999);
                $totalAmount = ($pricePerTicket * $totalMembers) + $uniqueCode;
                
                // Upload payment proof
                $proofPath = null;
                if ($request->hasFile('proof_of_payment')) {
                    $proofPath = $request->file('proof_of_payment')->store('visitor_payments', 'public');
                }

                $payment = VisitorPayment::create([
                    'payment_code' => 'VPAY-' . date('ymd') . '-' . strtoupper(Str::random(6)),
                    'payment_method' => $request->payment_method,
                    'total_members' => $totalMembers,
                    'price_per_ticket' => $pricePerTicket,
                    'unique_code' => $uniqueCode,
                    'total_amount' => $totalAmount,
                    'proof_of_payment' => $proofPath,
                    'original_file_size_kb' => $request->original_file_size_kb,
                    'compressed_file_size_kb' => $request->compressed_file_size_kb,
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
                        'status' => 'pending', // Pending until payment approved
                        'checked_in' => false,
                        'card_printed' => false,
                    ]);

                    if ($index === 0) {
                        $firstTicket = $ticket;
                    }
                }

                return redirect()->route('visitor.payment.status', ['payment_code' => $payment->payment_code])
                    ->with('success', 'Pendaftaran Visitor Exclusive berhasil disubmit! Silakan tunggu verifikasi admin.');
            } else {
                // Non-Exclusive (Free)
                $firstTicket = null;
                $generatedCodes = [];

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

                    $generatedCodes[] = $ticket->ticket_code;
                    if ($index === 0) {
                        $firstTicket = $ticket;
                    }
                }

                return redirect()->route('visitor.ticket.show', ['ticket_code' => $firstTicket->ticket_code])
                    ->with('success', 'Pendaftaran Visitor Non-Exclusive berhasil! E-Tiket Anda telah terbit.');
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

        $eventDate = $settings['visitor_event_date'] ?? 'October 2026';
        $eventVenue = $settings['visitor_event_venue'] ?? 'Grand Ballroom Hotel Indonesia, Jakarta';

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
