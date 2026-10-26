<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisitorTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BadgeApiController extends Controller
{
    /**
     * Default API Key for Badge & Printing Vendor
     */
    protected const DEFAULT_API_KEY = 'geosea2026-badge-api-key';

    /**
     * Authenticate request using API Key from Header or Query Param
     */
    protected function authenticateApiKey(Request $request): ?JsonResponse
    {
        $expectedKey = config('app.badge_api_key', env('BADGE_API_KEY', self::DEFAULT_API_KEY));

        $headerKey = $request->header('X-API-KEY');
        if (!$headerKey && $request->hasHeader('Authorization')) {
            $auth = $request->header('Authorization');
            if (str_starts_with($auth, 'Bearer ')) {
                $headerKey = substr($auth, 7);
            }
        }

        $providedKey = $headerKey ?: $request->query('api_key') ?: $request->input('api_key');

        if (!$providedKey || !hash_equals($expectedKey, (string) $providedKey)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Invalid or missing API Key. Please provide X-API-KEY header or api_key parameter.',
            ], 401);
        }

        return null;
    }

    /**
     * 1. API Bulk Peserta:
     * Mengambil seluruh data peserta sekaligus untuk keperluan cetak badge massal atau sinkronisasi offline.
     *
     * GET /api/v1/badges/participants
     */
    public function index(Request $request): JsonResponse
    {
        if ($authError = $this->authenticateApiKey($request)) {
            return $authError;
        }

        $query = VisitorTicket::query();

        // Filter status (default: active, or 'all')
        $status = $request->query('status', 'active');
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Filter category / visitor_type
        if ($request->filled('category')) {
            $query->where('visitor_type', $request->query('category'));
        } elseif ($request->filled('type')) {
            $query->where('visitor_type', $request->query('type'));
        }

        // Filter check-in status
        if ($request->has('checked_in') && $request->query('checked_in') !== 'all') {
            $isCheckedIn = filter_var($request->query('checked_in'), FILTER_VALIDATE_BOOLEAN);
            $query->where('checked_in', $isCheckedIn);
        }

        // Filter card_printed status
        if ($request->has('card_printed') && $request->query('card_printed') !== 'all') {
            $isPrinted = filter_var($request->query('card_printed'), FILTER_VALIDATE_BOOLEAN);
            $query->where('card_printed', $isPrinted);
        }

        // Search by keyword (name, code, institution, email)
        if ($request->filled('search')) {
            $search = trim($request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('visitor_name', 'like', "%{$search}%")
                  ->orWhere('ticket_code', 'like', "%{$search}%")
                  ->orWhere('visitor_institution', 'like', "%{$search}%")
                  ->orWhere('visitor_email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';
        if (in_array($sortBy, ['id', 'visitor_name', 'visitor_type', 'created_at', 'ticket_code'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->orderBy('id', 'asc');
        }

        // Check if vendor requests all data without pagination
        $all = filter_var($request->query('all', false), FILTER_VALIDATE_BOOLEAN);
        $limit = (int) $request->query('limit', 500);
        $limit = max(1, min($limit, 2000)); // clamp between 1 and 2000

        if ($all) {
            $tickets = $query->get();
            $formatted = $tickets->map(fn($t) => self::formatBadgeData($t));

            return response()->json([
                'success' => true,
                'total' => $formatted->count(),
                'data' => $formatted,
            ]);
        }

        $paginated = $query->paginate($limit);
        $formatted = collect($paginated->items())->map(fn($t) => self::formatBadgeData($t));

        return response()->json([
            'success' => true,
            'total' => $paginated->total(),
            'per_page' => $paginated->perPage(),
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'data' => $formatted,
        ]);
    }

    /**
     * 2. API Search Berdasarkan ID atau Kode Registrasi (Barcode):
     * Mengambil 1 data peserta berdasarkan ticket_code atau numeric id untuk cetak on-site saat di-scan.
     *
     * GET /api/v1/badges/search?code=TKT-IPRO-26-XXXX
     * GET /api/v1/badges/participant/{code_or_id}
     */
    public function search(Request $request, ?string $code = null): JsonResponse
    {
        if ($authError = $this->authenticateApiKey($request)) {
            return $authError;
        }

        $searchKey = $code ?: $request->query('code') ?: $request->query('q') ?: $request->query('id');

        if (!$searchKey) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter code atau ID wajib diisi. Contoh: ?code=TKT-IPRO-26-XXXX atau /participant/TKT-IPRO-26-XXXX',
            ], 400);
        }

        $searchKey = trim($searchKey);

        // Search by ticket_code (exact) or numeric ID
        $ticket = VisitorTicket::where('ticket_code', $searchKey)
            ->orWhere(function ($q) use ($searchKey) {
                if (is_numeric($searchKey)) {
                    $q->where('id', (int) $searchKey);
                }
            })
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'status' => 'not_found',
                'message' => "Peserta dengan kode atau ID '{$searchKey}' tidak ditemukan.",
            ], 404);
        }

        // Optional auto-mark as printed
        $markPrinted = filter_var($request->query('mark_printed', false), FILTER_VALIDATE_BOOLEAN);
        if ($markPrinted && !$ticket->card_printed) {
            $ticket->update([
                'card_printed' => true,
                'card_printed_at' => now(),
            ]);
        }

        // Optional auto-checkin
        $markCheckin = filter_var($request->query('mark_checkin', false), FILTER_VALIDATE_BOOLEAN);
        if ($markCheckin && !$ticket->checked_in) {
            $ticket->update([
                'checked_in' => true,
                'checked_in_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'status' => $ticket->status,
            'data' => self::formatBadgeData($ticket),
        ]);
    }

    /**
     * Alias for search using path parameter:
     * GET /api/v1/badges/participant/{code_or_id}
     */
    public function show(Request $request, string $code_or_id): JsonResponse
    {
        return $this->search($request, $code_or_id);
    }

    /**
     * 3. API Callback Mark Card Printed:
     * Digunakan oleh mesin printer vendor setelah kartu sukses dicetak fisik.
     *
     * POST /api/v1/badges/mark-printed
     * Body JSON: { "ticket_code": "TKT-..." } or { "id": 123 } or { "ticket_codes": [...] }
     */
    public function markPrinted(Request $request): JsonResponse
    {
        if ($authError = $this->authenticateApiKey($request)) {
            return $authError;
        }

        $codes = $request->input('ticket_codes');
        if (is_array($codes) && count($codes) > 0) {
            $updatedCount = VisitorTicket::whereIn('ticket_code', $codes)
                ->update([
                    'card_printed' => true,
                    'card_printed_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => "Sebanyak {$updatedCount} kartu peserta berhasil ditandai telah dicetak.",
                'updated_count' => $updatedCount,
            ]);
        }

        $ticketCode = $request->input('ticket_code') ?: $request->input('code');
        $id = $request->input('id');

        if (!$ticketCode && !$id) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter ticket_code atau id wajib diisi dalam body request.',
            ], 422);
        }

        $ticket = VisitorTicket::when($ticketCode, fn($q) => $q->where('ticket_code', $ticketCode))
            ->when(!$ticketCode && $id, fn($q) => $q->where('id', $id))
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak ditemukan.',
            ], 404);
        }

        $ticket->update([
            'card_printed' => true,
            'card_printed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Kartu badge peserta {$ticket->visitor_name} ({$ticket->ticket_code}) berhasil ditandai telah dicetak.",
            'data' => self::formatBadgeData($ticket),
        ]);
    }

    /**
     * 4. API Direct Gate Check-In:
     * Digunakan jika scanner vendor juga berfungsi sebagai gate kehadiran resmi.
     *
     * POST /api/v1/badges/checkin
     * Body JSON: { "ticket_code": "TKT-..." }
     */
    public function checkIn(Request $request): JsonResponse
    {
        if ($authError = $this->authenticateApiKey($request)) {
            return $authError;
        }

        $ticketCode = trim((string) ($request->input('ticket_code') ?: $request->input('code')));
        if (!$ticketCode) {
            return response()->json([
                'success' => false,
                'message' => 'Field ticket_code wajib diisi.',
            ], 422);
        }

        return DB::transaction(function () use ($ticketCode) {
            $ticket = VisitorTicket::where('ticket_code', $ticketCode)
                ->lockForUpdate()
                ->first();

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'status' => 'not_found',
                    'message' => 'Tiket tidak ditemukan dalam sistem.',
                ], 404);
            }

            if ($ticket->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'status' => 'inactive',
                    'message' => "Tiket tidak aktif (Status: {$ticket->status}).",
                    'data' => self::formatBadgeData($ticket),
                ], 422);
            }

            if ($ticket->checked_in) {
                return response()->json([
                    'success' => false,
                    'status' => 'already_checked_in',
                    'message' => 'Tiket ini sudah pernah check-in sebelumnya.',
                    'data' => self::formatBadgeData($ticket),
                ], 409);
            }

            $ticket->update([
                'checked_in' => true,
                'checked_in_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'status' => 'checked_in',
                'message' => 'Check-in berhasil.',
                'data' => self::formatBadgeData($ticket),
            ]);
        });
    }

    /**
     * 5. Helper API: List Metadata Kategori & Template Lanyard
     * Berguna agar vendor bisa mengunduh / meng-cache seluruh file gambar template background badge.
     *
     * GET /api/v1/badges/categories
     */
    public function categories(Request $request): JsonResponse
    {
        if ($authError = $this->authenticateApiKey($request)) {
            return $authError;
        }

        $categories = [
            // 1. Participant
            'iagi_member_professional' => [
                'type' => 'iagi_member_professional',
                'label' => 'Professional (Member)',
                'badge_role' => 'PARTICIPANT',
                'template_filename' => 'Participant.png',
                'template_url' => url('/images/badges/Participant.png'),
            ],
            'non_iagi_member_professional' => [
                'type' => 'non_iagi_member_professional',
                'label' => 'Professional (Non-Member)',
                'badge_role' => 'PARTICIPANT',
                'template_filename' => 'Participant.png',
                'template_url' => url('/images/badges/Participant.png'),
            ],
            'iagi_member_expatriate' => [
                'type' => 'iagi_member_expatriate',
                'label' => 'Expatriate (Member)',
                'badge_role' => 'PARTICIPANT',
                'template_filename' => 'Participant.png',
                'template_url' => url('/images/badges/Participant.png'),
            ],
            'non_iagi_member_expatriate' => [
                'type' => 'non_iagi_member_expatriate',
                'label' => 'Expatriate (Non-Member)',
                'badge_role' => 'PARTICIPANT',
                'template_filename' => 'Participant.png',
                'template_url' => url('/images/badges/Participant.png'),
            ],
            'student_undergraduate' => [
                'type' => 'student_undergraduate',
                'label' => 'Student Undergraduate',
                'badge_role' => 'STUDENT',
                'template_filename' => 'Student.png',
                'template_url' => url('/images/badges/Student.png'),
            ],
            'student_crowd' => [
                'type' => 'student_crowd',
                'label' => 'Student Crowd',
                'badge_role' => 'STUDENT',
                'template_filename' => 'Student.png',
                'template_url' => url('/images/badges/Student.png'),
            ],

            // 2. VIP & Invitations
            'vip' => [
                'type' => 'vip',
                'label' => 'VIP',
                'badge_role' => 'VIP',
                'template_filename' => 'VIP.png',
                'template_url' => url('/images/badges/VIP.png'),
            ],
            'speaker' => [
                'type' => 'speaker',
                'label' => 'Keynote Speaker',
                'badge_role' => 'KEYNOTE SPEAKER',
                'template_filename' => 'Speaker.png',
                'template_url' => url('/images/badges/Speaker.png'),
            ],
            'invited_speaker' => [
                'type' => 'invited_speaker',
                'label' => 'Invited Speaker',
                'badge_role' => 'INVITED SPEAKER',
                'template_filename' => 'Invited_Speaker.png',
                'template_url' => url('/images/badges/Invited_Speaker.png'),
            ],
            'panelist' => [
                'type' => 'panelist',
                'label' => 'Panelist',
                'badge_role' => 'PANELIST',
                'template_filename' => 'Panelist.png',
                'template_url' => url('/images/badges/Panelist.png'),
            ],
            'moderator' => [
                'type' => 'moderator',
                'label' => 'Moderator',
                'badge_role' => 'MODERATOR',
                'template_filename' => 'Moderator.png',
                'template_url' => url('/images/badges/Moderator.png'),
            ],
            'exhibition' => [
                'type' => 'exhibition',
                'label' => 'Exhibition',
                'badge_role' => 'EXHIBITOR',
                'template_filename' => 'Exhibitor.png',
                'template_url' => url('/images/badges/Exhibitor.png'),
            ],
            'committee' => [
                'type' => 'committee',
                'label' => 'Committee',
                'badge_role' => 'COMMITTEE',
                'template_filename' => 'Committee.png',
                'template_url' => url('/images/badges/Committee.png'),
            ],
            'student_volunteer' => [
                'type' => 'student_volunteer',
                'label' => 'Student Volunteer',
                'badge_role' => 'STUDENT VOLUNTEER',
                'template_filename' => 'Student_Volunteer.png',
                'template_url' => url('/images/badges/Student_Volunteer.png'),
            ],
            'board' => [
                'type' => 'board',
                'label' => 'Board',
                'badge_role' => 'BOARD',
                'template_filename' => 'Board.png',
                'template_url' => url('/images/badges/Board.png'),
            ],
            'sponsorship' => [
                'type' => 'sponsorship',
                'label' => 'Delegate (Sponsor)',
                'badge_role' => 'DELEGATE',
                'template_filename' => 'Delegate.png',
                'template_url' => url('/images/badges/Delegate.png'),
            ],

            // 3. Technical Sessions
            'presenter' => [
                'type' => 'presenter',
                'label' => 'Presenter',
                'badge_role' => 'PRESENTER',
                'template_filename' => 'Presenter.png',
                'template_url' => url('/images/badges/Presenter.png'),
            ],
            'oral_presenter' => [
                'type' => 'oral_presenter',
                'label' => 'Oral Presenter',
                'badge_role' => 'PRESENTER',
                'template_filename' => 'Presenter.png',
                'template_url' => url('/images/badges/Presenter.png'),
            ],
            'poster_presenter' => [
                'type' => 'poster_presenter',
                'label' => 'Poster Presenter',
                'badge_role' => 'PRESENTER',
                'template_filename' => 'Presenter.png',
                'template_url' => url('/images/badges/Presenter.png'),
            ],
            'session_chair' => [
                'type' => 'session_chair',
                'label' => 'Session Chair',
                'badge_role' => 'SESSION CHAIR',
                'template_filename' => 'Session_Chair.png',
                'template_url' => url('/images/badges/Session_Chair.png'),
            ],
            'judge' => [
                'type' => 'judge',
                'label' => 'Judge',
                'badge_role' => 'JUDGE',
                'template_filename' => 'Judge.png',
                'template_url' => url('/images/badges/Judge.png'),
            ],
            'session_chair_judge' => [
                'type' => 'session_chair_judge',
                'label' => 'Session Chair / Judge',
                'badge_role' => 'CHAIR / JUDGE',
                'template_filename' => 'Session_Chair_Judge.png',
                'template_url' => url('/images/badges/Session_Chair_Judge.png'),
            ],

            // 4. Visitor
            'non_exclusive' => [
                'type' => 'non_exclusive',
                'label' => 'Visitor Pass',
                'badge_role' => 'VISITOR',
                'template_filename' => 'Visitor.png',
                'template_url' => url('/images/badges/Visitor.png'),
            ],
        ];

        return response()->json([
            'success' => true,
            'total' => count($categories),
            'data' => array_values($categories),
        ]);
    }

    /**
     * Standardized Badge Data Transformer
     */
    public static function formatBadgeData(VisitorTicket $ticket): array
    {
        $type = $ticket->visitor_type ?: 'non_exclusive';
        $templatePath = self::getBadgeTemplatePath($type);
        $templateFilename = self::getBadgeTemplateFilename($type);
        $badgeRole = self::getBadgeRole($type);

        $verifyUrl = route('visitor.ticket.show', $ticket->ticket_code);

        return [
            'id' => (int) $ticket->id,
            'ticket_code' => $ticket->ticket_code,
            'registration_code' => $ticket->ticket_code, // alias
            'barcode_data' => $ticket->ticket_code,     // 1D/2D barcode string
            'qr_content' => $ticket->ticket_code,       // QR code value
            'qr_verify_url' => $verifyUrl,
            'visitor_name' => (string) $ticket->visitor_name,
            'name' => (string) $ticket->visitor_name,    // alias
            'visitor_institution' => $ticket->visitor_institution ?: '-',
            'institution' => $ticket->visitor_institution ?: '-', // alias
            'visitor_type' => $type,
            'category' => $type,                        // alias
            'category_label' => $ticket->category_label ?: 'Participant',
            'badge_role' => $badgeRole,
            'badge_template_filename' => $templateFilename,
            'badge_template_url' => url($templatePath),
            'status' => (string) $ticket->status,
            'is_group_leader' => (bool) $ticket->is_group_leader,
            'group_code' => $ticket->group_code,
            'checked_in' => (bool) $ticket->checked_in,
            'checked_in_at' => $ticket->checked_in_at ? $ticket->checked_in_at->toIso8601String() : null,
            'card_printed' => (bool) $ticket->card_printed,
            'card_printed_at' => $ticket->card_printed_at ? $ticket->card_printed_at->toIso8601String() : null,
            'visitor_email' => (string) $ticket->visitor_email,
            'visitor_phone' => (string) ($ticket->visitor_phone ?: '-'),
            'registered_at' => $ticket->created_at ? $ticket->created_at->toIso8601String() : null,
        ];
    }

    /**
     * Get Badge Role Title (Large text on Lanyard header)
     */
    public static function getBadgeRole(string $type): string
    {
        $map = [
            'vip' => 'VIP',
            'exclusive' => 'VIP',
            'speaker' => 'KEYNOTE SPEAKER',
            'keynote_speech' => 'KEYNOTE SPEAKER',
            'keynote_speaker' => 'KEYNOTE SPEAKER',
            'invited_speaker' => 'INVITED SPEAKER',
            'panelist' => 'PANELIST',
            'moderator' => 'MODERATOR',
            'exhibition' => 'EXHIBITOR',
            'committee' => 'COMMITTEE',
            'student_volunteer' => 'STUDENT VOLUNTEER',
            'board' => 'BOARD',
            'sponsorship' => 'DELEGATE',
            'sponsor' => 'DELEGATE',
            'delegate' => 'DELEGATE',
            'student_undergraduate' => 'STUDENT',
            'student_crowd' => 'STUDENT',
            'student' => 'PRESENTER',
            'presenter' => 'PRESENTER',
            'oral' => 'PRESENTER',
            'oral_presenter' => 'PRESENTER',
            'poster' => 'PRESENTER',
            'poster_presenter' => 'PRESENTER',
            'session_chair' => 'SESSION CHAIR',
            'judge' => 'JUDGE',
            'session_chair_judge' => 'CHAIR / JUDGE',
            'non_exclusive' => 'VISITOR',
        ];

        return $map[$type] ?? 'PARTICIPANT';
    }

    /**
     * Get Badge Template Filename (High-Res 790x1253 PNG)
     */
    public static function getBadgeTemplateFilename(string $type): string
    {
        $map = [
            'vip' => 'VIP.png',
            'exclusive' => 'VIP.png',
            'speaker' => 'Speaker.png',
            'keynote_speech' => 'Speaker.png',
            'keynote_speaker' => 'Speaker.png',
            'invited_speaker' => 'Invited_Speaker.png',
            'panelist' => 'Panelist.png',
            'moderator' => 'Moderator.png',
            'exhibition' => 'Exhibitor.png',
            'committee' => 'Committee.png',
            'student_volunteer' => 'Student_Volunteer.png',
            'board' => 'Board.png',
            'sponsorship' => 'Delegate.png',
            'sponsor' => 'Delegate.png',
            'delegate' => 'Delegate.png',
            'student_undergraduate' => 'Student.png',
            'student_crowd' => 'Student.png',
            'student' => 'Presenter.png',
            'presenter' => 'Presenter.png',
            'oral' => 'Presenter.png',
            'oral_presenter' => 'Presenter.png',
            'poster' => 'Presenter.png',
            'poster_presenter' => 'Presenter.png',
            'session_chair' => 'Session_Chair.png',
            'judge' => 'Judge.png',
            'session_chair_judge' => 'Session_Chair_Judge.png',
            'non_exclusive' => 'Visitor.png',
            'iagi_member_professional' => 'Participant.png',
            'non_iagi_member_professional' => 'Participant.png',
            'iagi_member_expatriate' => 'Participant.png',
            'non_iagi_member_expatriate' => 'Participant.png',
            'student_postgraduate' => 'Participant.png',
            'general_ticket' => 'Participant.png',
        ];

        return $map[$type] ?? 'Participant.png';
    }

    /**
     * Get Relative Path to Badge Template
     */
    public static function getBadgeTemplatePath(string $type): string
    {
        return '/images/badges/' . self::getBadgeTemplateFilename($type);
    }
}
