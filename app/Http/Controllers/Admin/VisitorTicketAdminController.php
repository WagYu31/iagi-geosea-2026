<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VisitorTicket;
use App\Models\VisitorPayment;
use App\Models\LandingPageSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VisitorTicketAdminController extends Controller
{
    /**
     * Display visitor tickets management dashboard
     */
    public function index(Request $request)
    {
        $query = VisitorTicket::with(['payment', 'registeredBy', 'checkedInBy', 'cardPrintedBy']);

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('visitor_name', 'like', "%{$search}%")
                  ->orWhere('visitor_email', 'like', "%{$search}%")
                  ->orWhere('visitor_phone', 'like', "%{$search}%")
                  ->orWhere('visitor_institution', 'like', "%{$search}%")
                  ->orWhere('ticket_code', 'like', "%{$search}%");
            });
        }

        // Visitor Type filter
        if ($type = $request->input('type')) {
            if ($type !== 'all') {
                $query->where('visitor_type', $type);
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

        $tickets = $query->latest()->paginate(25)->withQueryString();

        // Calculate global summary stats
        $stats = [
            'totalVisitors' => VisitorTicket::count(),
            'exclusivePaidCount' => VisitorTicket::where('visitor_type', 'exclusive')->where('status', 'active')->count(),
            'nonExclusiveCount' => VisitorTicket::where('visitor_type', 'non_exclusive')->count(),
            'checkedInCount' => VisitorTicket::where('checked_in', true)->count(),
            'pendingVerificationCount' => VisitorPayment::where('status', 'pending')->count(),
            'totalRevenue' => VisitorPayment::where('status', 'approved')->sum('total_amount'),
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
                'checked_in' => $request->input('checked_in', 'all'),
                'status' => $request->input('status', 'all'),
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
            'visitor_type' => 'required|in:exclusive,non_exclusive',
            'payment_status' => 'required_if:visitor_type,exclusive|in:paid_cash,free_bypass,pending',
        ]);

        return DB::transaction(function () use ($request) {
            $paymentId = null;

            if ($request->visitor_type === 'exclusive') {
                $priceSetting = LandingPageSetting::where('key', 'visitor_ticket_price_exclusive')->value('value');
                $price = floatval($priceSetting ?: 150000);

                $payment = VisitorPayment::create([
                    'payment_code' => 'ONSITE-' . date('ymd') . '-' . strtoupper(Str::random(6)),
                    'payment_method' => 'cash_onsite',
                    'total_members' => 1,
                    'price_per_ticket' => $price,
                    'unique_code' => 0,
                    'total_amount' => $request->payment_status === 'free_bypass' ? 0 : $price,
                    'status' => $request->payment_status === 'pending' ? 'pending' : 'approved',
                    'verified_at' => $request->payment_status === 'pending' ? null : now(),
                    'verified_by_admin_id' => Auth::id(),
                    'notes' => 'Onsite registration by Admin: ' . Auth::user()->name,
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
                'ticket_code' => VisitorTicket::generateTicketCode($request->visitor_type),
                'visitor_type' => $request->visitor_type,
                'is_group_leader' => true,
                'status' => ($request->visitor_type === 'exclusive' && $request->payment_status === 'pending') ? 'pending' : 'active',
                'checked_in' => false,
                'card_printed' => false,
            ]);

            return back()->with('success', "Registrasi onsite berhasil! Kode Tiket: {$ticket->ticket_code}");
        });
    }

    /**
     * Verify Exclusive Visitor Payment
     */
    public function verifyPayment($id)
    {
        $payment = VisitorPayment::findOrFail($id);
        
        $payment->update([
            'status' => 'approved',
            'verified_at' => now(),
            'verified_by_admin_id' => Auth::id(),
        ]);

        // Activate all associated tickets
        VisitorTicket::where('payment_id', $payment->id)->update([
            'status' => 'active',
        ]);

        return back()->with('success', 'Pembayaran visitor berhasil diverifikasi dan tiket telah diaktifkan.');
    }

    /**
     * Reject Exclusive Visitor Payment
     */
    public function rejectPayment(Request $request, $id)
    {
        $payment = VisitorPayment::findOrFail($id);
        
        $payment->update([
            'status' => 'rejected',
            'notes' => $request->input('notes', 'Pembayaran ditolak oleh admin.'),
        ]);

        VisitorTicket::where('payment_id', $payment->id)->update([
            'status' => 'cancelled',
        ]);

        return back()->with('success', 'Pembayaran visitor telah ditolak.');
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
            'eventVenue' => $settings['visitor_event_venue'] ?? 'Grand Ballroom Hotel Indonesia, Jakarta',
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
        $ticket = VisitorTicket::with('payment')->where('ticket_code', $ticketCode)->first();

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
            return response()->json([
                'success' => false,
                'status' => 'already_checked_in',
                'message' => 'PERINGATAN: Tiket ini SUDAH PERNAH CHECK-IN pada ' . $ticket->checked_in_at->format('d/m/Y H:i:s') . '.',
                'ticket' => $ticket,
            ], 409);
        }

        // Valid Check-In
        $ticket->update([
            'checked_in' => true,
            'checked_in_at' => now(),
            'checked_in_by_admin_id' => Auth::id(),
        ]);

        // Get template path for printing
        $templateKey = $ticket->visitor_type === 'exclusive' 
            ? 'visitor_exclusive_lanyard_template' 
            : 'visitor_non_exclusive_lanyard_template';
            
        $templatePath = LandingPageSetting::where('key', $templateKey)->value('value');

        return response()->json([
            'success' => true,
            'status' => 'checked_in',
            'message' => 'Check-in BERHASIL! Selamat datang.',
            'ticket' => $ticket,
            'templatePath' => $templatePath ? '/storage/' . $templatePath : null,
        ]);
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

        $templateKey = $ticket->visitor_type === 'exclusive' 
            ? 'visitor_exclusive_lanyard_template' 
            : 'visitor_non_exclusive_lanyard_template';
            
        $templatePath = LandingPageSetting::where('key', $templateKey)->value('value');

        return Inertia::render('Admin/VisitorTickets/PrintBadge', [
            'ticket' => $ticket,
            'templatePath' => $templatePath ? '/storage/' . $templatePath : null,
        ]);
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
            'Visitor Name',
            'Email',
            'Phone / WhatsApp',
            'Institution',
            'Category',
            'Registration Source',
            'Status',
            'Payment Method',
            'Amount (IDR)',
            'Checked In',
            'Checked In Time',
            'Card Printed',
            'Registered At',
        ]);

        foreach ($tickets as $t) {
            fputcsv($handle, [
                $t->ticket_code,
                $t->visitor_name,
                $t->visitor_email,
                $t->visitor_phone ?? '-',
                $t->visitor_institution ?? '-',
                strtoupper($t->visitor_type),
                $t->registration_source === 'admin_onsite' ? 'Onsite (Admin)' : 'Online Self',
                strtoupper($t->status),
                $t->payment ? strtoupper($t->payment->payment_method) : 'FREE',
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
}
