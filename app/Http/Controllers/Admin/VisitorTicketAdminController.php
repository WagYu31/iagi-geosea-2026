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

        // Visitor Type filter (supports single or multi-select comma separated or array)
        if ($type = $request->input('type')) {
            $types = is_array($type) ? $type : explode(',', (string) $type);
            $types = array_filter(array_map('trim', $types), fn($t) => $t !== '' && $t !== 'all');
            if (!empty($types)) {
                $query->whereIn('visitor_type', $types);
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

        // Debt / Payment filter
        if ($debt = $request->input('debt')) {
            if ($debt === 'debt') {
                $query->whereHas('payment', function ($pq) {
                    $pq->where('is_debt', true);
                });
            } elseif ($debt === 'fully_paid' || $debt === 'paid') {
                $query->whereHas('payment', function ($pq) {
                    $pq->where('is_debt', false);
                });
            } elseif ($debt === 'free') {
                $query->whereDoesntHave('payment');
            } elseif ($debt === 'no_debt') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('payment')
                      ->orWhereHas('payment', function ($pq) {
                          $pq->where('is_debt', false);
                      });
                });
            }
        }

        // Email sent filter
        if ($emailSent = $request->input('email_sent')) {
            if ($emailSent === 'sent') {
                $query->whereNotNull('email_sent_at');
            } elseif ($emailSent === 'unsent') {
                $query->whereNull('email_sent_at');
            }
        }

        // Unpaid Excel filter
        if ($unpaidExcel = $request->input('unpaid_excel')) {
            $unpaidEmails = self::getUnpaidPresenterEmails();
            if ($unpaidExcel === 'unpaid') {
                $query->whereIn(DB::raw('LOWER(visitor_email)'), $unpaidEmails);
            } elseif ($unpaidExcel === 'paid') {
                $query->whereNotIn(DB::raw('LOWER(visitor_email)'), $unpaidEmails);
            }
        }

        // Duplicate Check filter (email / name / any / both)
        if ($duplicate = $request->input('duplicate')) {
            if ($duplicate === 'email') {
                $dupEmailList = VisitorTicket::select(DB::raw('LOWER(TRIM(visitor_email)) as email'))
                    ->whereNotNull('visitor_email')
                    ->where('visitor_email', '!=', '')
                    ->groupBy(DB::raw('LOWER(TRIM(visitor_email))'))
                    ->havingRaw('COUNT(*) > 1')
                    ->pluck('email')
                    ->toArray();
                if (!empty($dupEmailList)) {
                    $query->whereIn(DB::raw('LOWER(TRIM(visitor_email))'), $dupEmailList);
                } else {
                    $query->whereRaw('1 = 0');
                }
            } elseif ($duplicate === 'name') {
                $dupNameList = VisitorTicket::select(DB::raw('LOWER(TRIM(visitor_name)) as name'))
                    ->whereNotNull('visitor_name')
                    ->where('visitor_name', '!=', '')
                    ->groupBy(DB::raw('LOWER(TRIM(visitor_name))'))
                    ->havingRaw('COUNT(*) > 1')
                    ->pluck('name')
                    ->toArray();
                if (!empty($dupNameList)) {
                    $query->whereIn(DB::raw('LOWER(TRIM(visitor_name))'), $dupNameList);
                } else {
                    $query->whereRaw('1 = 0');
                }
            } elseif ($duplicate === 'any') {
                $dupEmailList = VisitorTicket::select(DB::raw('LOWER(TRIM(visitor_email)) as email'))
                    ->whereNotNull('visitor_email')
                    ->where('visitor_email', '!=', '')
                    ->groupBy(DB::raw('LOWER(TRIM(visitor_email))'))
                    ->havingRaw('COUNT(*) > 1')
                    ->pluck('email')
                    ->toArray();
                $dupNameList = VisitorTicket::select(DB::raw('LOWER(TRIM(visitor_name)) as name'))
                    ->whereNotNull('visitor_name')
                    ->where('visitor_name', '!=', '')
                    ->groupBy(DB::raw('LOWER(TRIM(visitor_name))'))
                    ->havingRaw('COUNT(*) > 1')
                    ->pluck('name')
                    ->toArray();
                if (!empty($dupEmailList) || !empty($dupNameList)) {
                    $query->where(function ($q) use ($dupEmailList, $dupNameList) {
                        if (!empty($dupEmailList)) {
                            $q->whereIn(DB::raw('LOWER(TRIM(visitor_email))'), $dupEmailList);
                        }
                        if (!empty($dupNameList)) {
                            if (!empty($dupEmailList)) {
                                $q->orWhereIn(DB::raw('LOWER(TRIM(visitor_name))'), $dupNameList);
                            } else {
                                $q->whereIn(DB::raw('LOWER(TRIM(visitor_name))'), $dupNameList);
                            }
                        }
                    });
                } else {
                    $query->whereRaw('1 = 0');
                }
            } elseif ($duplicate === 'both') {
                $dupBothPairs = VisitorTicket::select(DB::raw('CONCAT(LOWER(TRIM(visitor_email)), ":::", LOWER(TRIM(visitor_name))) as pair'))
                    ->whereNotNull('visitor_email')
                    ->where('visitor_email', '!=', '')
                    ->whereNotNull('visitor_name')
                    ->where('visitor_name', '!=', '')
                    ->groupBy(DB::raw('LOWER(TRIM(visitor_email)), LOWER(TRIM(visitor_name))'))
                    ->havingRaw('COUNT(*) > 1')
                    ->pluck('pair')
                    ->toArray();
                if (!empty($dupBothPairs)) {
                    $query->whereIn(DB::raw('CONCAT(LOWER(TRIM(visitor_email)), ":::", LOWER(TRIM(visitor_name)))'), $dupBothPairs);
                } else {
                    $query->whereRaw('1 = 0');
                }
            }
        }

        // Invoice presence filter (all / has_invoice / no_invoice)
        if ($invFilter = $request->input('invoice_filter')) {
            if ($invFilter === 'has_invoice' || $invFilter === 'with_invoice') {
                $query->whereNotNull('payment_id');
            } elseif ($invFilter === 'no_invoice' || $invFilter === 'without_invoice') {
                $query->whereNull('payment_id');
            }
        }

        // Specific Invoice Number filter
        if ($invNo = trim((string) $request->input('invoice_no', ''))) {
            if (preg_match('/(\d+)/', $invNo, $matches)) {
                $numericId = (int) $matches[1];
                $matchingPaymentId = null;
                if ($numericId >= 13) {
                    $targetRank = $numericId - 12;
                    $matchingPaymentId = VisitorPayment::orderBy('id', 'asc')
                        ->skip($targetRank - 1)
                        ->take(1)
                        ->value('id');
                } elseif ($numericId > 0) {
                    $matchingPaymentId = $numericId;
                }
                $query->whereHas('payment', function ($pq) use ($invNo, $matchingPaymentId) {
                    $pq->where('payment_code', 'like', "%{$invNo}%");
                    if ($matchingPaymentId) {
                        $pq->orWhere('id', $matchingPaymentId);
                    }
                });
            } else {
                $query->whereHas('payment', function ($pq) use ($invNo) {
                    $pq->where('payment_code', 'like', "%{$invNo}%");
                });
            }
        }

        // Card Printed filter (all / printed / not_printed)
        if ($cardPrinted = $request->input('card_printed')) {
            if ($cardPrinted === 'printed' || $cardPrinted === 'yes' || $cardPrinted === '1') {
                $query->where('card_printed', true);
            } elseif ($cardPrinted === 'not_printed' || $cardPrinted === 'no' || $cardPrinted === '0') {
                $query->where('card_printed', false);
            }
        }

        return $query;
    }

    /**
     * Display visitor tickets management dashboard
     */
    public function index(Request $request)
    {
        $statsQuery = $this->filterTicketsQuery($request);
        $query = $this->filterTicketsQuery($request);

        $perPageInput = $request->input('per_page', 25);
        if ($perPageInput === 'all' || (int)$perPageInput >= 9999 || (int)$perPageInput <= 0) {
            $perPage = 10000;
        } else {
            $perPage = max(10, min(1000, (int)$perPageInput));
        }

        $duplicateParam = $request->input('duplicate');
        $sort = $request->input('sort', 'latest');

        if ($duplicateParam === 'email') {
            $tickets = $query->orderBy(DB::raw('LOWER(TRIM(visitor_email))'), 'asc')->orderBy('id', 'asc')->paginate($perPage)->withQueryString();
        } elseif ($duplicateParam === 'name') {
            $tickets = $query->orderBy(DB::raw('LOWER(TRIM(visitor_name))'), 'asc')->orderBy('id', 'asc')->paginate($perPage)->withQueryString();
        } elseif ($duplicateParam === 'any' || $duplicateParam === 'both') {
            $tickets = $query->orderBy(DB::raw('LOWER(TRIM(visitor_email))'), 'asc')->orderBy(DB::raw('LOWER(TRIM(visitor_name))'), 'asc')->paginate($perPage)->withQueryString();
        } elseif ($sort === 'inv_desc') {
            // Sort by Invoice Number Descending (Terbesar / Terakhir ke Terkecil)
            $tickets = $query->orderByRaw('CASE WHEN visitor_tickets.payment_id IS NOT NULL THEN 0 ELSE 1 END')
                ->orderBy('visitor_tickets.payment_id', 'desc')
                ->orderBy('visitor_tickets.is_group_leader', 'desc')
                ->orderBy('visitor_tickets.id', 'asc')
                ->paginate($perPage)
                ->withQueryString();
        } elseif ($sort === 'inv_asc') {
            // Sort by Invoice Number Ascending (Terkecil / Pertama ke Terbesar)
            $tickets = $query->orderByRaw('CASE WHEN visitor_tickets.payment_id IS NOT NULL THEN 0 ELSE 1 END')
                ->orderBy('visitor_tickets.payment_id', 'asc')
                ->orderBy('visitor_tickets.is_group_leader', 'desc')
                ->orderBy('visitor_tickets.id', 'asc')
                ->paginate($perPage)
                ->withQueryString();
        } elseif ($sort === 'oldest') {
            $tickets = $query->oldest()->paginate($perPage)->withQueryString();
        } else {
            $tickets = $query->latest()->paginate($perPage)->withQueryString();
        }

        // Cleanup any orphan payments that have no associated visitor tickets
        try {
            VisitorPayment::whereDoesntHave('tickets')->delete();
        } catch (\Exception $e) {
            Log::warning('Orphan visitor payments cleanup: ' . $e->getMessage());
        }

        // Unpaid presenters list from Excel
        $unpaidEmails = self::getUnpaidPresenterEmails();
        $unpaidTicketIds = [];
        try {
            $unpaidTicketIds = VisitorTicket::whereIn(DB::raw('LOWER(visitor_email)'), $unpaidEmails)->pluck('id')->toArray();
        } catch (\Exception $e) {
            Log::warning('Error fetching unpaidTicketIds: ' . $e->getMessage());
        }

        // Duplicate calculation
        $dupEmailList = [];
        $dupNameList = [];
        $dupEmailTicketCount = 0;
        $dupNameTicketCount = 0;
        $dupAnyTicketCount = 0;
        try {
            $dupEmailList = VisitorTicket::select(DB::raw('LOWER(TRIM(visitor_email)) as email'))
                ->whereNotNull('visitor_email')
                ->where('visitor_email', '!=', '')
                ->groupBy(DB::raw('LOWER(TRIM(visitor_email))'))
                ->havingRaw('COUNT(*) > 1')
                ->pluck('email')
                ->toArray();

            $dupNameList = VisitorTicket::select(DB::raw('LOWER(TRIM(visitor_name)) as name'))
                ->whereNotNull('visitor_name')
                ->where('visitor_name', '!=', '')
                ->groupBy(DB::raw('LOWER(TRIM(visitor_name))'))
                ->havingRaw('COUNT(*) > 1')
                ->pluck('name')
                ->toArray();

            $dupEmailTicketCount = !empty($dupEmailList)
                ? VisitorTicket::whereIn(DB::raw('LOWER(TRIM(visitor_email))'), $dupEmailList)->count()
                : 0;

            $dupNameTicketCount = !empty($dupNameList)
                ? VisitorTicket::whereIn(DB::raw('LOWER(TRIM(visitor_name))'), $dupNameList)->count()
                : 0;

            $dupAnyTicketCount = (!empty($dupEmailList) || !empty($dupNameList))
                ? VisitorTicket::where(function ($q) use ($dupEmailList, $dupNameList) {
                    if (!empty($dupEmailList)) {
                        $q->whereIn(DB::raw('LOWER(TRIM(visitor_email))'), $dupEmailList);
                    }
                    if (!empty($dupNameList)) {
                        if (!empty($dupEmailList)) {
                            $q->orWhereIn(DB::raw('LOWER(TRIM(visitor_name))'), $dupNameList);
                        } else {
                            $q->whereIn(DB::raw('LOWER(TRIM(visitor_name))'), $dupNameList);
                        }
                    }
                })->count()
                : 0;
        } catch (\Exception $e) {
            Log::warning('Error computing duplicate stats: ' . $e->getMessage());
        }

        $typeInput = $request->input('type');
        $hasTypeFilter = !empty($typeInput) && $typeInput !== 'all' && (!is_array($typeInput) || !empty(array_filter($typeInput, fn($t) => $t !== 'all' && $t !== '')));

        $hasFilters = $request->filled('search') ||
            $hasTypeFilter ||
            ($request->filled('registration_type') && $request->input('registration_type') !== 'all') ||
            ($request->filled('checked_in') && $request->input('checked_in') !== 'all') ||
            ($request->filled('status') && $request->input('status') !== 'all') ||
            ($request->filled('debt') && $request->input('debt') !== 'all') ||
            ($request->filled('email_sent') && $request->input('email_sent') !== 'all') ||
            ($request->filled('duplicate') && $request->input('duplicate') !== 'all') ||
            ($request->filled('invoice_filter') && $request->input('invoice_filter') !== 'all') ||
            $request->filled('invoice_no') ||
            ($request->filled('card_printed') && $request->input('card_printed') !== 'all') ||
            ($request->filled('sort') && !in_array($request->input('sort'), ['latest', 'all', ''])) ||
            ($request->filled('unpaid_excel') && $request->input('unpaid_excel') !== 'all');

        // Fetch tickets matching the active query (or all tickets if no filter) with payment relations
        $ticketsForStats = $statsQuery->with('payment')->get();

        $statsTotalVisitors = $ticketsForStats->count();
        $statsExclusivePaidCount = 0;
        $statsNonExclusiveCount = 0;
        $statsCheckedInCount = 0;
        $statsCardPrintedCount = 0;
        $statsPendingVerificationCount = 0;
        $statsEmailSentCount = 0;
        $statsEmailUnsentCount = 0;
        $statsDebtCount = 0;
        $statsFullyPaidCount = 0;
        $statsFreeCount = 0;
        $statsGroupRegistrationCount = 0;

        $statsRealPaidRevenue = 0;
        $statsDebtTotalRevenue = 0;

        foreach ($ticketsForStats as $t) {
            if ($t->checked_in) $statsCheckedInCount++;
            if ($t->card_printed) $statsCardPrintedCount++;
            if ($t->status === 'pending') $statsPendingVerificationCount++;
            if (!empty($t->email_sent_at)) $statsEmailSentCount++;
            if (empty($t->email_sent_at) && $t->status === 'active' && !empty($t->visitor_email)) $statsEmailUnsentCount++;
            if (in_array($t->visitor_type, ['non_exclusive', 'visitor'])) $statsNonExclusiveCount++;
            if ($t->visitor_type === 'exclusive' && $t->status === 'active') $statsExclusivePaidCount++;

            if (!$t->payment) {
                $statsFreeCount++;
                continue;
            }

            if ($t->payment->is_mixed_category) {
                $statsGroupRegistrationCount++;
            }

            $isDebt = (bool) $t->payment->is_debt;
            $isApproved = ($t->payment->status === 'approved');

            if ($isDebt) {
                $statsDebtCount++;
            } else {
                $statsFullyPaidCount++;
            }

            $groupCount = max(
                $t->payment->tickets_count ?? ($t->payment->tickets ? $t->payment->tickets->count() : 0),
                (int) ($t->payment->total_members ?? 0),
                1
            );
            $isGroup = $groupCount > 1 || (bool) $t->payment->is_mixed_category;
            $indPrice = ($t->individual_price && (float) $t->individual_price > 0)
                ? (float) $t->individual_price
                : (((float) ($t->payment->price_per_ticket ?? 0) > 0)
                    ? (float) $t->payment->price_per_ticket
                    : round((float) ($t->payment->total_amount ?? 0) / $groupCount));

            $ticketPrice = $isGroup ? $indPrice : (float) ($t->payment->total_amount ?? $indPrice ?? 0);

            if ($isDebt) {
                $statsDebtTotalRevenue += $ticketPrice;
            } elseif ($isApproved) {
                $statsRealPaidRevenue += $ticketPrice;
            }
        }

        $statsGrandTotalRevenue = $statsRealPaidRevenue + $statsDebtTotalRevenue;

        // Calculate summary stats dynamically linked to active filters
        $stats = [
            'isFiltered' => $hasFilters,
            'totalVisitors' => $statsTotalVisitors,
            'exclusivePaidCount' => $statsExclusivePaidCount,
            'nonExclusiveCount' => $statsNonExclusiveCount,
            'checkedInCount' => $statsCheckedInCount,
            'cardPrintedCount' => $statsCardPrintedCount,
            'cardUnprintedCount' => max(0, $statsTotalVisitors - $statsCardPrintedCount),
            'pendingVerificationCount' => $statsPendingVerificationCount,
            'emailSentCount' => $statsEmailSentCount,
            'emailUnsentCount' => $statsEmailUnsentCount,
            'debtCount' => $statsDebtCount,
            'fullyPaidCount' => $statsFullyPaidCount,
            'freeCount' => $statsFreeCount,
            'realPaidRevenue' => $statsRealPaidRevenue,
            'debtTotalRevenue' => $statsDebtTotalRevenue,
            'debtInvoiceRevenue' => (float) VisitorPayment::where('is_debt', true)->whereHas('tickets')->sum('total_amount'),
            'totalRevenue' => $statsRealPaidRevenue,
            'grandTotalRevenue' => $statsGrandTotalRevenue,
            'groupRegistrationCount' => $statsGroupRegistrationCount,
            'unpaidExcelCount' => count($unpaidTicketIds),
            'duplicateEmailTicketsCount' => $dupEmailTicketCount,
            'duplicateNameTicketsCount' => $dupNameTicketCount,
            'duplicateAnyTicketsCount' => $dupAnyTicketCount,
        ];

        $globalStats = [
            'totalVisitors' => VisitorTicket::count(),
            'checkedInCount' => VisitorTicket::where('checked_in', true)->count(),
            'cardPrintedCount' => VisitorTicket::where('card_printed', true)->count(),
        ];

        // Fetch tickets timestamp & status in memory for bulletproof, SQL-version-agnostic grouping
        $allTicketTimestamps = ($hasFilters ? (clone $statsQuery) : VisitorTicket::query())
            ->select('created_at', 'status')
            ->whereNotNull('created_at')
            ->get();

        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        $twentyOneDaysAgo = now()->subDays(21)->startOfDay();

        $dailyVelocity = $allTicketTimestamps
            ->filter(fn($t) => $t->created_at >= $thirtyDaysAgo)
            ->groupBy(fn($t) => $t->created_at->format('Y-m-d'))
            ->sortKeys()
            ->map(function ($group, $dateStr) {
                return [
                    'date' => date('d M', strtotime($dateStr)),
                    'day' => date('d', strtotime($dateStr)),
                    'total' => $group->count(),
                    'lunas' => $group->where('status', 'active')->count(),
                    'pending' => $group->where('status', '!=', 'active')->count(),
                ];
            })
            ->values()
            ->toArray();

        $dailyTrend = $allTicketTimestamps
            ->filter(fn($t) => $t->created_at >= $twentyOneDaysAgo)
            ->groupBy(fn($t) => $t->created_at->format('Y-m-d'))
            ->sortKeys()
            ->map(function ($group, $dateStr) {
                return [
                    'date' => date('d M', strtotime($dateStr)),
                    'count' => $group->count(),
                ];
            })
            ->values()
            ->toArray();

        $monthlyVelocity = $allTicketTimestamps
            ->groupBy(fn($t) => $t->created_at->format('Y-m'))
            ->sortKeys()
            ->map(function ($group, $ym) {
                $first = $group->first();
                return [
                    'month' => $first ? $first->created_at->format('M') : $ym,
                    'total' => $group->count(),
                    'lunas' => $group->where('status', 'active')->count(),
                    'pending' => $group->where('status', '!=', 'active')->count(),
                ];
            })
            ->values()
            ->toArray();

        // Prepare Comprehensive Realtime Analytics Data (Charts & Diagrams)
        $analyticsTicketQuery = $hasFilters ? (clone $statsQuery) : VisitorTicket::query();
        $baseAnalyticsTotal = (clone $analyticsTicketQuery)->count();
        $activeAnalyticsCount = (clone $analyticsTicketQuery)->where('status', 'active')->count();
        $checkedInAnalyticsCount = (clone $analyticsTicketQuery)->where('checked_in', true)->count();
        $sentAnalyticsCount = (clone $analyticsTicketQuery)->whereNotNull('email_sent_at')->count();
        $printedAnalyticsCount = (clone $analyticsTicketQuery)->where('card_printed', true)->count();

        // 1. Hourly Gate Turnstile Flow (07:00 - 17:00 WIB)
        $hourlyBuckets = [
            '07:00' => 0, '08:00' => 0, '09:00' => 0, '10:00' => 0,
            '11:00' => 0, '12:00' => 0, '13:00' => 0, '14:00' => 0,
            '15:00' => 0, '16:00' => 0, '17:00' => 0
        ];
        
        $checkedInTickets = (clone $analyticsTicketQuery)
            ->where('checked_in', true)
            ->whereNotNull('checked_in_at')
            ->select('checked_in_at')
            ->get();
            
        foreach ($checkedInTickets as $ct) {
            $hour = $ct->checked_in_at ? (int) $ct->checked_in_at->format('H') : 8;
            $slot = sprintf('%02d:00', min(17, max(7, $hour)));
            if (isset($hourlyBuckets[$slot])) {
                $hourlyBuckets[$slot]++;
            }
        }
        
        $slottedSum = array_sum($hourlyBuckets);
        $unslottedCount = max(0, $checkedInAnalyticsCount - $slottedSum);
        if ($unslottedCount > 0) {
            $hourlyBuckets['07:00'] += (int) round($unslottedCount * 0.10);
            $hourlyBuckets['08:00'] += (int) round($unslottedCount * 0.40);
            $hourlyBuckets['09:00'] += (int) round($unslottedCount * 0.25);
            $hourlyBuckets['10:00'] += (int) round($unslottedCount * 0.15);
            $rem = $unslottedCount - ((int) round($unslottedCount * 0.10) + (int) round($unslottedCount * 0.40) + (int) round($unslottedCount * 0.25) + (int) round($unslottedCount * 0.15));
            $hourlyBuckets['11:00'] += max(0, $rem);
        }

        $hourlyAttendance = [];
        $cumVol = 0;
        foreach ($hourlyBuckets as $hourKey => $vol) {
            $cumVol += $vol;
            $hourlyAttendance[] = [
                'hour' => $hourKey,
                'volume' => $vol,
                'cumulative' => $cumVol,
            ];
        }

        // 2. The 4 Conference Pillars Breakdown
        $commercialTypes = ['iagi_member_professional', 'non_iagi_member_professional', 'iagi_member_expatriate', 'non_iagi_member_expatriate', 'student_undergraduate', 'dosen', 'professional', 'professional_1500', 'exclusive'];
        $scientificTypes = ['presenter', 'invited_speaker', 'session_chair_judge', 'oral', 'oral_presenter', 'poster', 'poster_presenter', 'judge', 'session_chair', 'student'];
        $leadershipTypes = ['vip', 'speaker', 'keynote_speech', 'keynote_speaker', 'panelist', 'moderator', 'board', 'vip_companion'];
        $expoTypes = ['exhibition', 'sponsorship', 'sponsor', 'delegate', 'committee', 'student_volunteer', 'student_crowd', 'non_exclusive', 'it_developer', 'tesko'];

        $allTicketsCollection = (clone $analyticsTicketQuery)->with('payment:id,is_debt,status,total_amount')->get();

        $buildPillarData = function($types, $label, $icon, $color) use ($allTicketsCollection) {
            $matched = $allTicketsCollection->whereIn('visitor_type', $types);
            $totalCount = $matched->count();
            $lunasCount = $matched->filter(fn($t) => $t->status === 'active' && (!$t->payment || !$t->payment->is_debt))->count();
            $debtCount = $matched->filter(fn($t) => ($t->payment && $t->payment->is_debt))->count();
            $pendingCount = $matched->filter(fn($t) => $t->status === 'pending' && (!$t->payment || !$t->payment->is_debt))->count();
            $checkedInCount = $matched->where('checked_in', true)->count();
            $revenue = (float) $matched->sum('individual_price');

            return [
                'label' => $label,
                'icon' => $icon,
                'color' => $color,
                'total' => $totalCount,
                'lunas' => $lunasCount,
                'debt' => $debtCount,
                'pending' => $pendingCount,
                'checked_in' => $checkedInCount,
                'revenue' => $revenue,
                'types' => $types,
            ];
        };

        $pillarsBreakdown = [
            'commercial' => $buildPillarData($commercialTypes, 'Commercial / Paid', '💼', '#2563eb'),
            'scientific' => $buildPillarData($scientificTypes, 'Scientific & Presenters', '🔬', '#8b5cf6'),
            'leadership' => $buildPillarData($leadershipTypes, 'VIP & Leadership', '🌟', '#f59e0b'),
            'expo' => $buildPillarData($expoTypes, 'Expo, Industry & Crew', '🏢', '#10b981'),
        ];

        // 3. Top Institutions with Real Bi-Color Stacked Data (Lunas vs Debt)
        $topInstitutionsRaw = (clone $analyticsTicketQuery)
            ->whereNotNull('visitor_institution')
            ->whereRaw("TRIM(visitor_institution) NOT IN ('', '-', '--', '---', 'None', 'null')")
            ->select('visitor_institution as name', DB::raw('count(*) as count'), DB::raw('sum(individual_price) as total_revenue'))
            ->groupBy('visitor_institution')
            ->orderByDesc('count')
            ->limit(30)
            ->get();

        $topInstitutions = $topInstitutionsRaw->map(function($inst) use ($allTicketsCollection) {
            $instTickets = $allTicketsCollection->filter(function($t) use ($inst) {
                return trim(strtolower($t->visitor_institution ?? '')) === trim(strtolower($inst->name));
            });
            $lunas = $instTickets->filter(fn($t) => $t->status === 'active' && (!$t->payment || !$t->payment->is_debt))->count();
            $debt = $instTickets->filter(fn($t) => $t->payment && (bool)$t->payment->is_debt)->count();
            $pending = $instTickets->filter(fn($t) => $t->status === 'pending' && (!$t->payment || !$t->payment->is_debt))->count();
            $checkedIn = $instTickets->where('checked_in', true)->count();

            return [
                'name' => $inst->name,
                'count' => (int) $inst->count,
                'lunas' => $lunas,
                'lunas_count' => $lunas,
                'debt' => $debt,
                'debt_count' => $debt,
                'pending' => $pending,
                'pending_count' => $pending,
                'checked_in' => $checkedIn,
                'total_revenue' => (float) ($inst->total_revenue ?? 0),
                'solvency_pct' => $inst->count > 0 ? round(($lunas / $inst->count) * 100) : 0,
            ];
        });

        // 4. Institutional Sectors Classification
        $sectorCounts = [
            'oil_gas' => ['label' => 'Minyak & Gas / KKKS', 'icon' => '🛢️', 'count' => 0, 'revenue' => 0, 'color' => '#2563eb'],
            'government' => ['label' => 'Pemerintah & Regulator', 'icon' => '🏛️', 'count' => 0, 'revenue' => 0, 'color' => '#0d9488'],
            'academic' => ['label' => 'Universitas & Riset', 'icon' => '🎓', 'count' => 0, 'revenue' => 0, 'color' => '#8b5cf6'],
            'mining' => ['label' => 'Pertambangan & Mineral', 'icon' => '⛏️', 'count' => 0, 'revenue' => 0, 'color' => '#d97706'],
            'services' => ['label' => 'Geoscience Service / Vendor', 'icon' => '🤝', 'count' => 0, 'revenue' => 0, 'color' => '#06b6d4'],
            'others' => ['label' => 'Independent / Konsultan', 'icon' => '👤', 'count' => 0, 'revenue' => 0, 'color' => '#64748b'],
        ];

        foreach ($allTicketsCollection as $t) {
            $inst = strtolower($t->visitor_institution ?? '');
            $price = (float) $t->individual_price;
            if (str_contains($inst, 'pertamina') || str_contains($inst, 'medco') || str_contains($inst, 'petronas') || str_contains($inst, 'bp ') || str_contains($inst, 'eni ') || str_contains($inst, 'mubadala') || str_contains($inst, 'exxon') || str_contains($inst, 'inpex') || str_contains($inst, 'chevron') || str_contains($inst, 'oil') || str_contains($inst, 'gas')) {
                $sectorCounts['oil_gas']['count']++;
                $sectorCounts['oil_gas']['revenue'] += $price;
            } elseif (str_contains($inst, 'skk migas') || str_contains($inst, 'badan geologi') || str_contains($inst, 'esdm') || str_contains($inst, 'lemigas') || str_contains($inst, 'brin') || str_contains($inst, 'pvmbg') || str_contains($inst, 'psdmbp') || str_contains($inst, 'kementerian')) {
                $sectorCounts['government']['count']++;
                $sectorCounts['government']['revenue'] += $price;
            } elseif (str_contains($inst, 'ugm') || str_contains($inst, 'gadjah mada') || str_contains($inst, 'itb') || str_contains($inst, 'ui') || str_contains($inst, 'upn') || str_contains($inst, 'undip') || str_contains($inst, 'unpad') || str_contains($inst, 'trisakti') || str_contains($inst, 'univ') || str_contains($inst, 'institut') || str_contains($inst, 'akadem')) {
                $sectorCounts['academic']['count']++;
                $sectorCounts['academic']['revenue'] += $price;
            } elseif (str_contains($inst, 'freeport') || str_contains($inst, 'vale') || str_contains($inst, 'antam') || str_contains($inst, 'bukit asam') || str_contains($inst, 'harita') || str_contains($inst, 'mining') || str_contains($inst, 'tambang')) {
                $sectorCounts['mining']['count']++;
                $sectorCounts['mining']['revenue'] += $price;
            } elseif (str_contains($inst, 'slb') || str_contains($inst, 'schlumberger') || str_contains($inst, 'halliburton') || str_contains($inst, 'geofix') || str_contains($inst, 'fugro') || str_contains($inst, 'pgs') || str_contains($inst, 'petrolink')) {
                $sectorCounts['services']['count']++;
                $sectorCounts['services']['revenue'] += $price;
            } else {
                $sectorCounts['others']['count']++;
                $sectorCounts['others']['revenue'] += $price;
            }
        }

        // 5. Demographics (International ASEAN vs Domestic)
        $internationalCount = $allTicketsCollection->filter(function($t) {
            $vt = $t->visitor_type;
            $inst = strtolower($t->visitor_institution ?? '');
            return str_contains($vt, 'expatriate') || str_contains($inst, 'philippines') || str_contains($inst, 'malaysia') || str_contains($inst, 'thailand') || str_contains($inst, 'singapore') || str_contains($inst, 'vietnam');
        })->count();
        $domesticCount = max(0, $baseAnalyticsTotal - $internationalCount);

        // 6. Target Benchmarks (Executive KPI)
        $targetBenchmarks = [
            'financial' => [
                'target' => 400000000,
                'achieved' => (float) $statsRealPaidRevenue,
                'pipeline' => (float) $statsGrandTotalRevenue,
                'debt' => (float) $statsDebtTotalRevenue,
                'percentage' => round(((float) $statsRealPaidRevenue / 400000000) * 100, 1),
            ],
            'attendance' => [
                'target' => 1000,
                'registered' => $baseAnalyticsTotal,
                'checked_in' => $checkedInAnalyticsCount,
                'reg_percentage' => round(($baseAnalyticsTotal / 1000) * 100, 1),
                'turnstile_percentage' => $baseAnalyticsTotal > 0 ? round(($checkedInAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0,
            ],
        ];

        // 7. Venue Registration Funnel
        $funnelMetrics = [
            ['stage' => '1. Total Terdaftar', 'count' => $baseAnalyticsTotal, 'pct' => 100, 'color' => '#3b82f6'],
            ['stage' => '2. Verifikasi Lunas', 'count' => $activeAnalyticsCount, 'pct' => $baseAnalyticsTotal > 0 ? round(($activeAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0, 'color' => '#10b981'],
            ['stage' => '3. E-Tiket Terkirim', 'count' => $sentAnalyticsCount, 'pct' => $baseAnalyticsTotal > 0 ? round(($sentAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0, 'color' => '#8b5cf6'],
            ['stage' => '4. Hadir di Venue', 'count' => $checkedInAnalyticsCount, 'pct' => $baseAnalyticsTotal > 0 ? round(($checkedInAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0, 'color' => '#06b6d4'],
            ['stage' => '5. Lanyard / Badge Dicetak', 'count' => $printedAnalyticsCount, 'pct' => $baseAnalyticsTotal > 0 ? round(($printedAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0, 'color' => '#f59e0b'],
        ];

        $matchingPaymentIds = $hasFilters 
            ? (clone $statsQuery)->whereNotNull('payment_id')->pluck('payment_id')->unique()->toArray() 
            : null;

        $highValueQuery = VisitorPayment::withCount('tickets')->where('total_amount', '>', 0);
        if ($hasFilters && $matchingPaymentIds !== null) {
            $highValueQuery->whereIn('id', $matchingPaymentIds);
        }

        $analytics = [
            'categoryDistribution' => (clone $analyticsTicketQuery)
                ->select('visitor_type', DB::raw('count(*) as count'), DB::raw('sum(individual_price) as est_revenue'))
                ->groupBy('visitor_type')
                ->orderByDesc('count')
                ->get()
                ->map(function ($c) {
                    return [
                        'visitor_type' => $c->visitor_type,
                        'label' => VisitorTicket::getVisitorTypeLabelStatic($c->visitor_type),
                        'count' => (int) $c->count,
                        'est_revenue' => (float) ($c->est_revenue ?? 0),
                    ];
                }),
            'topInstitutions' => $topInstitutions,
            'pillarsBreakdown' => $pillarsBreakdown,
            'hourlyAttendance' => $hourlyAttendance,
            'institutionalSectors' => array_values($sectorCounts),
            'demographics' => [
                'international' => $internationalCount,
                'domestic' => $domesticCount,
                'international_pct' => $baseAnalyticsTotal > 0 ? round(($internationalCount / $baseAnalyticsTotal) * 100, 1) : 0,
                'domestic_pct' => $baseAnalyticsTotal > 0 ? round(($domesticCount / $baseAnalyticsTotal) * 100, 1) : 0,
            ],
            'targetBenchmarks' => $targetBenchmarks,
            'funnelMetrics' => $funnelMetrics,
            'dailyTrend' => $dailyTrend,
            'dailyVelocity' => $dailyVelocity,
            'monthlyVelocity' => $monthlyVelocity,
            'ticketStatusBreakdown' => [
                'active' => (clone $analyticsTicketQuery)->where('status', 'active')->count(),
                'pending' => (clone $analyticsTicketQuery)->where('status', 'pending')->count(),
                'debt' => (clone $analyticsTicketQuery)->whereHas('payment', fn($pq) => $pq->where('is_debt', true))->count(),
                'total' => $baseAnalyticsTotal,
            ],
            'paymentBreakdown' => [
                ['id' => 0, 'label' => 'Approved (Lunas)', 'value' => VisitorPayment::where('status', 'approved')->where('is_debt', false)->whereHas('tickets')->count(), 'color' => '#10b981'],
                ['id' => 1, 'label' => 'Pending Verification', 'value' => VisitorPayment::where('status', 'pending')->where('is_debt', false)->whereHas('tickets')->count(), 'color' => '#f59e0b'],
                ['id' => 2, 'label' => 'Outstanding Debt', 'value' => VisitorPayment::where('is_debt', true)->whereHas('tickets')->count(), 'color' => '#ea580c'],
                ['id' => 3, 'label' => 'Rejected', 'value' => VisitorPayment::where('status', 'rejected')->whereHas('tickets')->count(), 'color' => '#ef4444'],
            ],
            'revenueBreakdown' => [
                'paidRevenue' => $statsRealPaidRevenue,
                'debtRevenue' => $statsDebtTotalRevenue,
                'debtInvoiceRevenue' => (float) VisitorPayment::where('is_debt', true)->whereHas('tickets')->sum('total_amount'),
                'grandTotalRevenue' => $statsGrandTotalRevenue,
                'pendingRevenue' => (float) VisitorPayment::where('status', 'pending')->where('is_debt', false)->whereHas('tickets')->sum('total_amount'),
            ],
            'sourceDistribution' => [
                ['id' => 0, 'label' => 'Online Self-Reg', 'value' => (clone $analyticsTicketQuery)->where(function($q) { $q->where('registration_source', 'online_self')->orWhereNull('registration_source'); })->count(), 'color' => '#3b82f6'],
                ['id' => 1, 'label' => 'Onsite Assisted', 'value' => (clone $analyticsTicketQuery)->whereIn('registration_source', ['admin_onsite', 'onsite_admin', 'admin_onsite_bulk'])->count(), 'color' => '#10b981'],
                ['id' => 2, 'label' => 'Group Delegation', 'value' => (clone $analyticsTicketQuery)->whereHas('payment', fn($pq) => $pq->where('is_mixed_category', true))->count(), 'color' => '#8b5cf6'],
                ['id' => 3, 'label' => 'Free / Invited', 'value' => (clone $analyticsTicketQuery)->whereIn('visitor_type', ['vip', 'keynote_speaker', 'speaker', 'session_chair', 'board', 'delegate', 'committee', 'student_volunteer', 'exhibition', 'student_crowd', 'vip_companion', 'it_developer', 'tesko', 'non_exclusive'])->count(), 'color' => '#0d9488'],
            ],
            'gateAttendance' => [
                'checkedIn' => $checkedInAnalyticsCount,
                'notCheckedIn' => max(0, $baseAnalyticsTotal - $checkedInAnalyticsCount),
                'total' => $baseAnalyticsTotal,
                'percentage' => $baseAnalyticsTotal > 0 ? round(($checkedInAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0,
            ],
            'emailDelivery' => [
                'sent' => $sentAnalyticsCount,
                'unsent' => max(0, $baseAnalyticsTotal - $sentAnalyticsCount),
                'percentage' => $baseAnalyticsTotal > 0 ? round(($sentAnalyticsCount / $baseAnalyticsTotal) * 100, 1) : 0,
            ],
            'corporateInvoices' => $highValueQuery
                ->orderByDesc('total_amount')
                ->limit(8)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'code' => $p->payment_code,
                    'institution' => $p->pic_institution ?: ($p->pic_name ?: 'Delegasi Terdaftar'),
                    'delegation_type' => $p->is_mixed_category ? 'Corporate Delegation' : ($p->tickets_count > 1 ? "Delegasi {$p->tickets_count} Peserta" : 'Conference Delegate'),
                    'total_amount' => (float) $p->total_amount,
                    'paid_amount' => $p->is_debt ? 0 : ($p->status === 'approved' ? (float) $p->total_amount : 0),
                    'debt_amount' => $p->is_debt ? (float) $p->total_amount : ($p->status === 'pending' ? (float) $p->total_amount : 0),
                    'pic_name' => $p->pic_name ?: 'PIC Delegasi',
                    'pic_phone' => $p->pic_phone ?: '-',
                    'pic_email' => $p->pic_email ?: '-',
                    'status' => $p->status,
                    'is_debt' => (bool) $p->is_debt,
                    'delegates_count' => $p->tickets_count ?: ($p->total_members ?: 1),
                    'pending_days' => $p->created_at ? max(1, (int) round($p->created_at->diffInDays(now()))) : 1,
                ]),
            'highValueInvoices' => $highValueQuery
                ->orderByDesc('total_amount')
                ->limit(6)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'code' => $p->payment_code,
                    'institution' => $p->pic_institution ?: ($p->pic_name ?: 'Delegasi Terdaftar'),
                    'opportunity' => $p->is_mixed_category ? 'Corporate Delegation' : ($p->tickets_count > 1 ? "Delegasi {$p->tickets_count} Peserta" : 'Conference Delegate'),
                    'deal_size' => (float) $p->total_amount,
                    'pic' => $p->pic_name ?: 'PIC Delegasi',
                    'status' => $p->status,
                    'is_debt' => (bool) $p->is_debt,
                    'delegates' => $p->tickets_count ?: ($p->total_members ?: 1),
                    'pending_days' => $p->created_at ? max(1, (int) round($p->created_at->diffInDays(now()))) : 1,
                ]),
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
            'globalStats' => $globalStats,
            'analytics' => $analytics,
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
                'email_sent' => $request->input('email_sent', 'all'),
                'duplicate' => $request->input('duplicate', 'all'),
                'invoice_filter' => $request->input('invoice_filter', 'all'),
                'invoice_no' => $request->input('invoice_no', ''),
                'card_printed' => $request->input('card_printed', 'all'),
                'sort' => $request->input('sort', 'latest'),
                'unpaid_excel' => $request->input('unpaid_excel', 'all'),
                'per_page' => $perPageInput,
            ],
            'duplicateEmails' => $dupEmailList,
            'duplicateNames' => $dupNameList,
            'occupiedUniqueCodes' => VisitorPayment::getOccupiedUniqueCodes(),
            'unpaidExcelEmails' => $unpaidEmails,
            'unpaidTicketIds' => $unpaidTicketIds,
        ]);
    }

    /**
     * Onsite assistive registration by Admin
     */
    public function storeOnsite(Request $request)
    {
        $isVisitorPass = ($request->visitor_type === 'non_exclusive');

        $request->validate([
            'visitor_name' => $isVisitorPass ? 'nullable|string|max:150' : 'required|string|max:150',
            'visitor_email' => $isVisitorPass ? 'nullable|email|max:150' : 'required|email|max:150',
            'visitor_phone' => 'nullable|string|max:50',
            'visitor_institution' => 'nullable|string|max:150',
            'visitor_type' => 'required|string|max:100',
            'quantity' => 'nullable|integer|min:1|max:500',
            'payment_status' => 'nullable|in:paid_cash,free_bypass,pending',
            'proof_of_payment' => 'nullable|file|mimes:jpeg,png,jpg,webp,pdf|max:10240',
            'unique_code' => 'nullable|integer|min:0|max:9999',
            'discount_type' => 'nullable|string|in:none,nominal,percent',
            'discount_value' => 'nullable|numeric|min:0',
            'discount_notes' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($request, $isVisitorPass) {
            $paymentId = null;
            $type = $request->visitor_type;
            $quantity = max(1, min(500, intval($request->input('quantity', 1))));

            // Handling bulk creation for blank Visitor Pass
            if ($isVisitorPass && $quantity > 1) {
                $createdTickets = [];
                for ($i = 0; $i < $quantity; $i++) {
                    $ticketCode = VisitorTicket::generateTicketCode('non_exclusive');
                    $ticket = VisitorTicket::create([
                        'payment_id' => null,
                        'registered_by_admin_id' => Auth::id(),
                        'registration_source' => 'admin_onsite',
                        'visitor_name' => !empty($request->visitor_name) ? $request->visitor_name : 'VISITOR',
                        'visitor_email' => !empty($request->visitor_email) ? $request->visitor_email : ('visitor_' . strtolower(substr($ticketCode, -6)) . '_' . ($i + 1) . '@pitiagi.cloud'),
                        'visitor_phone' => $request->visitor_phone,
                        'visitor_institution' => $request->visitor_institution,
                        'ticket_code' => $ticketCode,
                        'visitor_type' => 'non_exclusive',
                        'individual_price' => 0,
                        'is_group_leader' => ($i === 0),
                        'status' => 'active',
                        'checked_in' => false,
                        'card_printed' => false,
                    ]);
                    $createdTickets[] = $ticket->id;
                }

                ActivityLog::record(
                    action: 'create_bulk_visitor_tickets',
                    module: 'visitor_tickets',
                    description: "Menerbitkan massal {$quantity} tiket Visitor Pass polos/generic",
                    targetId: $createdTickets[0] ?? null,
                    targetCode: "BULK-VISITOR-{$quantity}",
                    snapshot: ['count' => $quantity, 'first_id' => $createdTickets[0] ?? null]
                );

                return redirect()->route('admin.visitorTickets.printBadgesBulk', [
                    'mode' => 'selected',
                    'ids' => implode(',', $createdTickets),
                ])->with('success', "Berhasil menerbitkan {$quantity} Tiket Visitor Pass polos! Siap cetak.");
            }

            $paidCategories = [
                'iagi_member_professional' => 3000000,
                'non_iagi_member_professional' => 4000000,
                'iagi_member_expatriate' => 6000000,
                'non_iagi_member_expatriate' => 7000000,
                'student_undergraduate' => 1000000,
                'dosen' => 1500000,
                'professional' => 1500000,
                'professional_1500' => 1500000,
            ];

            $isPaidCategory = isset($paidCategories[$type]);

            if ($isPaidCategory && $request->payment_status !== 'free_bypass') {
                $settingKey = "visitor_ticket_price_{$type}";
                $priceSetting = LandingPageSetting::where('key', $settingKey)->value('value');
                $price = floatval($priceSetting ?: $paidCategories[$type]);

                // Discount Calculation (Rupiah or Percentage)
                $discountType = $request->input('discount_type', 'none');
                $discountValue = floatval($request->input('discount_value', 0));
                $discountNotes = $request->input('discount_notes');
                $discountAmount = 0;

                if ($discountType === 'percent') {
                    $clampedPercent = min(100, max(0, $discountValue));
                    $discountAmount = round(($price * $clampedPercent) / 100, 2);
                } elseif ($discountType === 'nominal') {
                    $discountAmount = min($price, max(0, $discountValue));
                } else {
                    $discountType = 'none';
                    $discountValue = 0;
                    $discountAmount = 0;
                }

                $discountedPrice = max(0, $price - $discountAmount);

                if ($discountedPrice <= 0) {
                    $uniqueCode = 0;
                    $totalAmount = 0;
                } else {
                    // Ensure system-enforced unique code without duplicates
                    $uniqueCode = intval($request->input('unique_code', 0));
                    $isOccupied = ($uniqueCode > 0) && VisitorPayment::where('unique_code', $uniqueCode)
                        ->where('status', '!=', 'rejected')
                        ->exists();

                    if ($uniqueCode <= 0 || $isOccupied) {
                        $uniqueCode = self::generateUniquePaymentCode();
                    }

                    $totalAmount = $discountedPrice + $uniqueCode;
                }

                $proofPath = null;
                $originalSize = null;
                if ($request->hasFile('proof_of_payment')) {
                    $file = $request->file('proof_of_payment');
                    $originalSize = (int) round($file->getSize() / 1024);
                    $proofPath = $file->store('visitor_proofs', 'public');
                }

                $notes = 'Onsite registration by Admin: ' . (Auth::user()->name ?? 'Admin');
                if ($discountAmount > 0) {
                    $discountDesc = $discountType === 'percent' ? "{$discountValue}%" : ('Rp ' . number_format($discountValue, 0, ',', '.'));
                    $notes .= " | Diskon: {$discountDesc} (-Rp " . number_format($discountAmount, 0, ',', '.') . ")";
                    if (!empty($discountNotes)) {
                        $notes .= " [Alasan: {$discountNotes}]";
                    }
                }

                $isPending = ($request->payment_status === 'pending');
                $paymentData = [
                    'payment_code' => 'ONSITE-' . date('ymd') . '-' . strtoupper(Str::random(6)),
                    'payment_method' => 'cash_onsite',
                    'total_members' => 1,
                    'price_per_ticket' => $price,
                    'unique_code' => $uniqueCode,
                    'total_amount' => $totalAmount,
                    'status' => $isPending ? 'pending' : 'approved',
                    'is_debt' => $isPending,
                    'debt_notes' => $isPending ? 'Registrasi Onsite Belum Bayar (Tanggungan)' : null,
                    'debt_settled_at' => null,
                    'verified_at' => $isPending ? null : now(),
                    'verified_by_admin_id' => Auth::id(),
                    'proof_of_payment' => $proofPath,
                    'original_file_size_kb' => $originalSize,
                    'compressed_file_size_kb' => $originalSize,
                    'notes' => $notes,
                ];

                if (\Illuminate\Support\Facades\Schema::hasColumn('visitor_payments', 'discount_type')) {
                    $paymentData['discount_type'] = $discountType;
                    $paymentData['discount_value'] = $discountValue;
                    $paymentData['discount_amount'] = $discountAmount;
                    $paymentData['discount_notes'] = $discountNotes;
                }

                $payment = VisitorPayment::create($paymentData);

                $paymentId = $payment->id;
            }

            $finalName = !empty($request->visitor_name) ? $request->visitor_name : ($isVisitorPass ? 'VISITOR' : 'Visitor');
            $finalEmail = !empty($request->visitor_email) ? $request->visitor_email : ($isVisitorPass ? ('visitor_' . strtolower(Str::random(6)) . '@pitiagi.cloud') : 'visitor@pitiagi.cloud');

            $ticket = VisitorTicket::create([
                'payment_id' => $paymentId,
                'registered_by_admin_id' => Auth::id(),
                'registration_source' => 'admin_onsite',
                'visitor_name' => $finalName,
                'visitor_email' => $finalEmail,
                'visitor_phone' => $request->visitor_phone,
                'visitor_institution' => $request->visitor_institution,
                'ticket_code' => VisitorTicket::generateTicketCode($type),
                'visitor_type' => $type,
                'individual_price' => $isPaidCategory ? $price : 0,
                'is_group_leader' => true,
                'status' => ($isPaidCategory && $request->payment_status === 'pending') ? 'pending' : 'active',
                'checked_in' => false,
                'card_printed' => false,
            ]);

            // Send E-Ticket email if active & real email
            if ($ticket->status === 'active' && !empty($ticket->visitor_email) && !str_contains($ticket->visitor_email, '@pitiagi.cloud')) {
                try {
                    $this->applySmtpSettings();
                    Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                    try {
                        $ticket->update(['email_sent_at' => now(), 'email_sent_count' => 1]);
                    } catch (\Exception $e) {}
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

            if ($isVisitorPass) {
                return redirect()->route('admin.visitorTickets.printBadge', $ticket->id)
                    ->with('success', "Tiket Visitor Pass berhasil diterbitkan! Siap cetak.");
            }

            return back()->with('success', "Onsite registration successful! Ticket Code: {$ticket->ticket_code}");
        });
    }

    /**
     * Generate collision-free unique payment code between 101 and 999
     */
    public static function generateUniquePaymentCode(): int
    {
        return VisitorPayment::generateUniqueCode();
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
        $debtSettled = false;
        if ($request->boolean('settle_debt')) {
            $dataToUpdate['is_debt'] = false;
            $dataToUpdate['debt_notes'] = null;
            $dataToUpdate['debt_settled_at'] = now();
            $debtSettled = true;
        } elseif ($request->has('is_debt')) {
            $isDebt = $request->boolean('is_debt');
            $dataToUpdate['is_debt'] = $isDebt;
            if ($isDebt) {
                $dataToUpdate['debt_notes'] = $request->input('debt_notes');
                $dataToUpdate['debt_settled_at'] = null;
            } else {
                $dataToUpdate['debt_notes'] = null;
                $dataToUpdate['debt_settled_at'] = now();
                $debtSettled = true;
            }
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            $dataToUpdate['status'] = $status;
        } elseif ($debtSettled && ($payment->status === 'pending' || !isset($dataToUpdate['status']))) {
            // Automatically promote to approved when debt is cleared if not rejected
            $dataToUpdate['status'] = 'approved';
        }

        if (isset($dataToUpdate['status']) && $dataToUpdate['status'] === 'approved' && !$payment->verified_at) {
            $dataToUpdate['verified_at'] = now();
            $dataToUpdate['verified_by_admin_id'] = Auth::id();
        }

        $payment->update($dataToUpdate);

        // If status is approved or debt was cleared, ensure tickets are active
        if ($payment->status === 'approved' || $debtSettled) {
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

        $updateData = [
            'is_debt' => $isDebt,
            'debt_notes' => $isDebt ? $debtNotes : null,
            'debt_settled_at' => $isDebt ? null : now(),
        ];

        // When debt is cleared (Lunas / Lepas Debt Tag):
        // Automatically approve payment and activate all tickets
        if (!$isDebt) {
            $updateData['status'] = 'approved';
            if (!$payment->verified_at) {
                $updateData['verified_at'] = now();
                $updateData['verified_by_admin_id'] = Auth::id();
            }
        }

        $payment->update($updateData);

        if (!$isDebt) {
            VisitorTicket::where('payment_id', $payment->id)->update([
                'status' => 'active',
            ]);
        }

        $msg = $isDebt 
            ? 'Pembayaran berhasil ditandai sebagai HUTANG / TANGGUNGAN.' 
            : 'Tag Hutang berhasil dicabut. Pembayaran LUNAS & seluruh tiket peserta otomatis AKTIF.';
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

        if ($newStatus === 'active' && $ticket->payment_id && $ticket->payment) {
            $payment = $ticket->payment;
            $hasOtherPending = VisitorTicket::where('payment_id', $payment->id)->where('id', '!=', $ticket->id)->where('status', '!=', 'active')->exists();
            if (!$hasOtherPending && $payment->status === 'pending') {
                $payment->update([
                    'status' => 'approved',
                    'verified_at' => $payment->verified_at ?: now(),
                    'verified_by_admin_id' => Auth::id(),
                ]);
            }
        }

        // If newly activated and has email, send E-Ticket email
        if ($newStatus === 'active' && $oldStatus !== 'active' && !empty($ticket->visitor_email)) {
            try {
                $this->applySmtpSettings();
                Mail::to($ticket->visitor_email)->send(new VisitorTicketIssued($ticket));
                try {
                    $ticket->update(['email_sent_at' => now(), 'email_sent_count' => ($ticket->email_sent_count ?? 0) + 1]);
                } catch (\Exception $e) {}
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
            'dosen' => 1500000,
            'professional' => 1500000,
            'professional_1500' => 1500000,
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
            'student_crowd' => 'TKT-CRWD',
            'vip_companion' => 'TKT-VCMP',
            'it_developer' => 'TKT-DEV',
            'tesko' => 'TKT-TSK',
            'non_exclusive' => 'TKT-VIS',
            'exclusive' => 'TKT-EXC',
            'iagi_member_professional' => 'TKT-IPRO',
            'non_iagi_member_professional' => 'TKT-NPRO',
            'iagi_member_expatriate' => 'TKT-IEXP',
            'non_iagi_member_expatriate' => 'TKT-NEXP',
            'student_undergraduate' => 'TKT-STUD',
            'dosen' => 'TKT-DOSN',
            'professional' => 'TKT-PRO',
            'professional_1500' => 'TKT-PRO',
            // Technical
            'student' => 'TKT-PRS',
            'presenter' => 'TKT-PRS',
            'invited_speaker' => 'TKT-ISPK',
            'session_chair_judge' => 'TKT-JDG',
            'session_chair' => 'TKT-JDG',
            'judge' => 'TKT-JDG',
            'oral' => 'TKT-PRS',
            'oral_presenter' => 'TKT-PRS',
            'poster' => 'TKT-PRS',
            'poster_presenter' => 'TKT-PRS',
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
                        try {
                            $t->update(['email_sent_at' => now(), 'email_sent_count' => ($t->email_sent_count ?? 0) + 1]);
                        } catch (\Exception $e) {}
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

            try {
                $ticket->update([
                    'email_sent_at' => now(),
                    'email_sent_count' => ($ticket->email_sent_count ?? 0) + 1,
                ]);
            } catch (\Exception $e) {
                Log::warning("Could not update email_sent_at for ticket {$ticket->id}: " . $e->getMessage());
            }

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

        $rawInput = trim($request->ticket_code);
        $checkinGroup = $request->boolean('checkin_group', true);

        // 1. Clean & extract ticket code or payment code from raw input or URL
        $cleanCode = $rawInput;
        if (preg_match('/(TKT-[A-Za-z0-9\-]+)/i', $rawInput, $matches)) {
            $cleanCode = strtoupper($matches[1]);
        } elseif (preg_match('/((?:ONSITE|INV|PY|PAY)-[A-Za-z0-9\-]+)/i', $rawInput, $matches)) {
            $cleanCode = strtoupper($matches[1]);
        }

        return DB::transaction(function () use ($cleanCode, $rawInput, $checkinGroup) {
            // Step 1: Direct match by ticket_code (case-insensitive)
            $ticket = VisitorTicket::with('payment')
                ->where(DB::raw('UPPER(ticket_code)'), strtoupper($cleanCode))
                ->lockForUpdate()
                ->first();

            // Step 2: Fallback lookup by payment_code (e.g. ONSITE-..., INV-..., or URL from Receipt)
            if (!$ticket) {
                $payment = VisitorPayment::where(DB::raw('UPPER(payment_code)'), strtoupper($cleanCode))
                    ->orWhere(DB::raw('UPPER(payment_code)'), strtoupper($rawInput))
                    ->first();

                if ($payment) {
                    $ticket = VisitorTicket::with('payment')
                        ->where('payment_id', $payment->id)
                        ->orderBy('is_group_leader', 'desc')
                        ->orderBy('id', 'asc')
                        ->lockForUpdate()
                        ->first();
                }
            }

            // Step 3: Fallback lookup by suffix (e.g. if category changed from TKT-VIS-26-45AEA1 to TKT-IEXP-26-45AEA1)
            if (!$ticket) {
                $parts = explode('-', $cleanCode);
                if (count($parts) >= 3) {
                    $suffix = end($parts);
                    if (strlen($suffix) >= 4) {
                        $ticket = VisitorTicket::with('payment')
                            ->where('ticket_code', 'LIKE', "%-{$suffix}")
                            ->lockForUpdate()
                            ->first();
                    }
                }
            }

            // Step 4: Fallback lookup by ActivityLog (if ticket was renamed/re-categorized)
            if (!$ticket) {
                $renamedLog = ActivityLog::where('module', 'visitor_tickets')
                    ->where('description', 'like', "%{$cleanCode}%")
                    ->latest()
                    ->first();
                if ($renamedLog && !empty($renamedLog->target_id)) {
                    $ticket = VisitorTicket::with('payment')
                        ->where('id', $renamedLog->target_id)
                        ->lockForUpdate()
                        ->first();
                }
            }

            // Step 5: Fallback lookup by ID if numeric
            if (!$ticket && is_numeric($cleanCode)) {
                $ticket = VisitorTicket::with('payment')
                    ->where('id', (int) $cleanCode)
                    ->lockForUpdate()
                    ->first();
            }

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'status' => 'not_found',
                    'message' => 'Tiket tidak ditemukan dalam sistem.',
                ], 404);
            }

            // Auto-heal: If payment is approved and debt is settled, but ticket was left as pending, activate it!
            if ($ticket->status !== 'active') {
                if ($ticket->payment && $ticket->payment->status === 'approved' && !$ticket->payment->is_debt) {
                    $ticket->update(['status' => 'active']);
                }
            }

            // Find all tickets belonging to the same group / payment
            $groupTickets = collect();
            if ($ticket->payment_id) {
                $groupTickets = VisitorTicket::with('payment')
                    ->where('payment_id', $ticket->payment_id)
                    ->orderBy('is_group_leader', 'desc')
                    ->orderBy('id', 'asc')
                    ->get();
            } elseif (!empty($ticket->group_code)) {
                $groupTickets = VisitorTicket::with('payment')
                    ->where('group_code', $ticket->group_code)
                    ->orderBy('is_group_leader', 'desc')
                    ->orderBy('id', 'asc')
                    ->get();
            }

            $isGroup = $groupTickets->count() > 1;

            // Check if ticket is still pending/cancelled
            if ($ticket->status !== 'active') {
                $isDebt = (bool) ($ticket->payment && $ticket->payment->is_debt);
                $msg = $ticket->status === 'pending' 
                    ? ($isDebt ? 'Tiket masih memiliki TAG HUTANG (Belum Lunas). Harap selesaikan pembayaran di meja registrasi.' : 'Tiket masih dalam status PENDING (Pembayaran belum diverifikasi).') 
                    : 'Tiket telah DIBATALKAN.';

                return response()->json([
                    'success' => false,
                    'status' => 'inactive',
                    'message' => $msg,
                    'ticket' => $ticket,
                    'is_group' => $isGroup,
                    'group_tickets' => $groupTickets,
                ], 422);
            }

            $alreadyCheckedIn = (bool) $ticket->checked_in;
            $checkedTime = $ticket->checked_in_at ? $ticket->checked_in_at->format('d/m/Y H:i:s') : '-';

            $newlyCheckedInCount = 0;
            if ($isGroup && $checkinGroup) {
                // Check in all active group members that have not checked in yet
                foreach ($groupTickets as $gTicket) {
                    if ($gTicket->status === 'active' && !$gTicket->checked_in) {
                        $gTicket->update([
                            'checked_in' => true,
                            'checked_in_at' => now(),
                            'checked_in_by_admin_id' => Auth::id(),
                        ]);
                        $newlyCheckedInCount++;
                    }
                }
                // Refresh group tickets list
                $groupTickets = VisitorTicket::with('payment')
                    ->whereIn('id', $groupTickets->pluck('id'))
                    ->orderBy('is_group_leader', 'desc')
                    ->orderBy('id', 'asc')
                    ->get();
                $ticket->refresh();
            } else {
                if (!$alreadyCheckedIn) {
                    $ticket->update([
                        'checked_in' => true,
                        'checked_in_at' => now(),
                        'checked_in_by_admin_id' => Auth::id(),
                    ]);
                    $newlyCheckedInCount = 1;
                }
            }

            $templatePath = self::getBadgeTemplateForType($ticket->visitor_type);

            // If scanned ticket was already checked in and no other group members were newly checked in
            if ($alreadyCheckedIn && $newlyCheckedInCount === 0) {
                return response()->json([
                    'success' => false,
                    'status' => 'already_checked_in',
                    'message' => 'PERINGATAN: Tiket ini SUDAH PERNAH CHECK-IN pada ' . $checkedTime . ($isGroup ? " (Rombongan {$groupTickets->count()} orang)." : '.'),
                    'ticket' => $ticket,
                    'is_group' => $isGroup,
                    'group_tickets' => $groupTickets,
                    'templatePath' => $templatePath,
                ], 409);
            }

            $message = 'Check-in BERHASIL! Selamat datang.';
            if ($isGroup) {
                $checkedTotal = $groupTickets->filter(fn($t) => $t->checked_in)->count();
                $message = "Check-in Rombongan BERHASIL! {$checkedTotal} dari {$groupTickets->count()} peserta dalam grup ini telah terverifikasi.";
            }

            return response()->json([
                'success' => true,
                'status' => 'checked_in',
                'message' => $message,
                'ticket' => $ticket,
                'is_group' => $isGroup,
                'group_tickets' => $groupTickets,
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
            'student_crowd' => '/images/badges/Student.png',
            'vip_companion' => '/images/badges/VIP.png',
            'it_developer' => '/images/badges/IT_Developer.png',
            'tesko' => '/images/badges/Tesko.png',
            'iagi_member_professional' => '/images/badges/Participant.png',
            'non_iagi_member_professional' => '/images/badges/Participant.png',
            'iagi_member_expatriate' => '/images/badges/Participant.png',
            'non_iagi_member_expatriate' => '/images/badges/Participant.png',
            'student_undergraduate' => '/images/badges/Student.png',
            'dosen' => '/images/badges/Participant.png',
            'professional' => '/images/badges/Participant.png',
            'professional_1500' => '/images/badges/Participant.png',
            'student' => '/images/badges/Student.png',
            'student_postgraduate' => '/images/badges/Participant.png',
            'general_ticket' => '/images/badges/Participant.png',
            'exclusive' => '/images/badges/VIP.png',
            'non_exclusive' => '/images/badges/Visitor.png',
            // Technical
            'presenter' => '/images/badges/Presenter.png',
            'invited_speaker' => '/images/badges/Invited_Speaker.png',
            'session_chair_judge' => '/images/badges/Session_Chair_Judge.png',
            'session_chair' => '/images/badges/Session_Chair.png',
            'judge' => '/images/badges/Judge.png',
            'oral' => '/images/badges/Presenter.png',
            'oral_presenter' => '/images/badges/Presenter.png',
            'poster' => '/images/badges/Presenter.png',
            'poster_presenter' => '/images/badges/Presenter.png',
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

        $updates = [
            'card_printed' => true,
            'card_printed_at' => now(),
            'card_printed_by_admin_id' => Auth::id(),
        ];

        // Otomatis tandai check-in jika tiket aktif dan belum check-in
        // Membantu admin saat melayani peserta onsite/manual yang langsung cetak kartu di meja
        if (!$ticket->checked_in && $ticket->status === 'active') {
            $updates['checked_in'] = true;
            $updates['checked_in_at'] = now();
            $updates['checked_in_by_admin_id'] = Auth::id();
        }

        $ticket->update($updates);

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
                ->orderBy('is_group_leader', 'desc')
                ->orderBy('id', 'asc')
                ->get();
        } else {
            $query = $this->filterTicketsQuery($request);
            $tickets = $query->latest()->get();
        }

        if ($tickets->isEmpty()) {
            return redirect()->route('admin.visitorTickets')->with('error', 'Tidak ada tiket yang dipilih atau sesuai filter untuk dicetak.');
        }

        // Mark all as card printed and auto check-in for active tickets
        $now = now();
        $adminId = Auth::id();
        VisitorTicket::whereIn('id', $tickets->pluck('id'))->update([
            'card_printed' => true,
            'card_printed_at' => $now,
            'card_printed_by_admin_id' => $adminId,
        ]);

        VisitorTicket::whereIn('id', $tickets->where('checked_in', false)->where('status', 'active')->pluck('id'))->update([
            'checked_in' => true,
            'checked_in_at' => $now,
            'checked_in_by_admin_id' => $adminId,
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
        $mode = $request->input('mode', 'selected'); // 'selected', 'filtered', or 'exclude_selected'
        $ticketIds = $request->input('ticket_ids', []);
        $excludedIds = $request->input('excluded_ids', []);

        if ($mode === 'exclude_selected') {
            $query = $this->filterTicketsQuery($request);
            if (!empty($excludedIds)) {
                $exIdArray = is_array($excludedIds) ? $excludedIds : array_filter(explode(',', (string)$excludedIds));
                $query->whereNotIn('id', $exIdArray);
            }
            $tickets = $query->where('status', 'active')
                ->whereNotNull('visitor_email')
                ->where('visitor_email', '!=', '')
                ->get();
        } elseif ($mode === 'selected' || (!empty($ticketIds) && $mode !== 'filtered')) {
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
                try {
                    $ticket->update([
                        'email_sent_at' => now(),
                        'email_sent_count' => ($ticket->email_sent_count ?? 0) + 1,
                    ]);
                } catch (\Exception $e) {
                    // Fail silently if column not ready
                }
                $successCount++;
            } catch (\Exception $e) {
                $failCount++;
                Log::error("Bulk resend email failed for {$ticket->visitor_email}: " . $e->getMessage());
            }
        }

        $excludedCount = is_array($excludedIds) ? count($excludedIds) : count(array_filter(explode(',', (string)$excludedIds)));
        $msgSuffix = ($mode === 'exclude_selected' && $excludedCount > 0) ? " ({$excludedCount} tiket ditandai berhasil dilewati/tidak dikirimi email)" : "";

        if ($failCount === 0) {
            return back()->with('success', "E-Tiket berhasil dikirimkan ke {$successCount} email pengunjung{$msgSuffix}.");
        } else {
            return back()->with('warning', "E-Tiket terkirim ke {$successCount} email ({$failCount} email gagal dikirim){$msgSuffix}. Pastikan pengaturan SMTP sudah aktif.");
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
            'Base Amount (IDR)',
            'Discount (IDR)',
            'Discount Notes',
            'Unique Code',
            'Total Amount (IDR)',
            'Checked In',
            'Checked In Time',
            'Card Printed',
            'Registered At',
        ]);

        foreach ($tickets as $t) {
            $p = $t->payment;
            fputcsv($handle, [
                $t->ticket_code,
                $p ? ($p->receipt_no ?? '-') : '-',
                $p ? $p->payment_code : '-',
                $t->visitor_name,
                $t->visitor_email,
                $t->visitor_phone ?? '-',
                $t->visitor_institution ?? '-',
                $t->category_label ?? strtoupper($t->visitor_type),
                $t->registration_source === 'admin_onsite' ? 'Onsite (Admin)' : 'Online Self',
                strtoupper($t->status),
                $p ? strtoupper($p->payment_method) : 'FREE',
                $p ? strtoupper($p->status) : 'FREE',
                $t->individual_price ?? ($t->price ?? 0),
                $p ? ($p->discount_amount ?? 0) : 0,
                $p ? ($p->discount_notes ?? '-') : '-',
                $p ? ($p->unique_code ?? 0) : 0,
                $p ? $p->total_amount : 0,
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
                    'registration_source' => 'admin_onsite',
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

        // 1. Presenter (Presenter / Oral / Poster)
        if (str_contains($clean, 'presenter') || str_contains($clean, 'oral') || str_contains($clean, 'poster')) {
            return 'presenter';
        }

        // 2. Session Chair / Judge
        if (str_contains($clean, 'chair') || str_contains($clean, 'judge')) {
            return 'session_chair_judge';
        }

        // 3. Invited Speaker
        if (str_contains($clean, 'invited') || (str_contains($clean, 'speaker') && !str_contains($clean, 'keynote'))) {
            return 'invited_speaker';
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

        // Student Crowd
        if (str_contains($clean, 'crowd')) {
            return 'student_crowd';
        }

        // VIP Companion
        if (str_contains($clean, 'companion') || (str_contains($clean, 'vip') && str_contains($clean, 'pendamping'))) {
            return 'vip_companion';
        }

        // IT Developer
        if (str_contains($clean, 'developer') || str_contains($clean, 'programmer') || str_contains($clean, 'it dev') || str_contains($clean, 'it_developer')) {
            return 'it_developer';
        }

        // TESKO
        if (str_contains($clean, 'tesko')) {
            return 'tesko';
        }

        // Participant types
        if (str_contains($clean, 'dosen') || str_contains($clean, 'lecturer')) {
            return 'dosen';
        }
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
     * Toggle Card Printed status manually by Admin
     */
    public function toggleCardPrinted(Request $request, $id)
    {
        $ticket = VisitorTicket::findOrFail($id);

        $newStatus = !$ticket->card_printed;

        $updates = [
            'card_printed' => $newStatus,
            'card_printed_at' => $newStatus ? now() : null,
            'card_printed_by_admin_id' => $newStatus ? Auth::id() : null,
        ];

        // Jika ditandai sudah cetak kartu, otomatis check-in jika belum check-in
        if ($newStatus && $request->boolean('auto_check_in', true) && !$ticket->checked_in && $ticket->status === 'active') {
            $updates['checked_in'] = true;
            $updates['checked_in_at'] = now();
            $updates['checked_in_by_admin_id'] = Auth::id();
        }

        $ticket->update($updates);

        $msg = $newStatus 
            ? "Status kartu {$ticket->ticket_code} ({$ticket->visitor_name}): SUDAH DICETAK!" . ($ticket->checked_in ? " (Sekaligus Di-Check In)" : "") 
            : "Status cetak kartu {$ticket->ticket_code} dibatalkan (Belum Cetak).";

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
                'unique_code' => 'nullable|integer|min:0|max:9999',
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
                    'dosen' => 1500000,
                    'professional' => 1500000,
                    'professional_1500' => 1500000,
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
                    'student_crowd' => 'TKT-CRWD',
                    'vip_companion' => 'TKT-VCMP',
                    'non_exclusive' => 'TKT-VIS',
                    'exclusive' => 'TKT-EXC',
                    'iagi_member_professional' => 'TKT-IPRO',
                    'non_iagi_member_professional' => 'TKT-NPRO',
                    'iagi_member_expatriate' => 'TKT-IEXP',
                    'non_iagi_member_expatriate' => 'TKT-NEXP',
                    'student_undergraduate' => 'TKT-STUD',
                    'dosen' => 'TKT-DOSN',
            'professional' => 'TKT-PRO',
            'professional_1500' => 'TKT-PRO',
                    // Technical
                    'student' => 'TKT-PRS',
                    'presenter' => 'TKT-PRS',
                    'invited_speaker' => 'TKT-ISPK',
                    'session_chair_judge' => 'TKT-JDG',
                    'session_chair' => 'TKT-JDG',
                    'judge' => 'TKT-JDG',
                    'oral' => 'TKT-PRS',
                    'oral_presenter' => 'TKT-PRS',
                    'poster' => 'TKT-PRS',
                    'poster_presenter' => 'TKT-PRS',
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

                    // Only sync if explicitly requested (default: false to preserve corporate HRD data)
                    if ($request->boolean('sync_pic_with_primary', false) && $primaryTicket) {
                        $picName = $primaryTicket->visitor_name;
                        $picEmail = $primaryTicket->visitor_email;
                        $picPhone = $primaryTicket->visitor_phone;
                        $picInstitution = $primaryTicket->visitor_institution;
                    }

                    $updatePayment = [
                        'total_members' => $totalMembers,
                        'pic_name' => !empty($picName) ? $picName : $payment->pic_name,
                        'pic_email' => !empty($picEmail) ? $picEmail : $payment->pic_email,
                        'pic_phone' => !empty($picPhone) ? $picPhone : $payment->pic_phone,
                        'pic_institution' => !empty($picInstitution) ? $picInstitution : $payment->pic_institution,
                    ];

                    $uniqueCode = $request->has('unique_code')
                        ? (int) $request->input('unique_code')
                        : (int) ($payment->unique_code ?? 0);

                    $updatePayment['unique_code'] = $uniqueCode;

                    if ($request->boolean('recalculate_total', true)) {
                        $freshTickets = $payment->tickets()->get();
                        $subtotal = 0;
                        foreach ($freshTickets as $ft) {
                            $itemPrice = (float) $ft->individual_price;
                            if ($itemPrice <= 0 && isset($paidCategories[$ft->visitor_type])) {
                                $itemPrice = (float) $paidCategories[$ft->visitor_type];
                                $ft->update(['individual_price' => $itemPrice]);
                            }
                            $subtotal += $itemPrice;
                        }
                        if ($subtotal > 0) {
                            $discountAmount = (float) ($payment->discount_amount ?? 0);
                            $updatePayment['total_amount'] = max(0, $subtotal - $discountAmount) + $uniqueCode;
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
            'dosen' => 1500000,
            'professional' => 1500000,
            'professional_1500' => 1500000,
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
            'student_crowd' => 'TKT-CRWD',
            'vip_companion' => 'TKT-VCMP',
            'it_developer' => 'TKT-DEV',
            'tesko' => 'TKT-TSK',
            'non_exclusive' => 'TKT-VIS',
            'exclusive' => 'TKT-EXC',
            'iagi_member_professional' => 'TKT-IPRO',
            'non_iagi_member_professional' => 'TKT-NPRO',
            'iagi_member_expatriate' => 'TKT-IEXP',
            'non_iagi_member_expatriate' => 'TKT-NEXP',
            'student_undergraduate' => 'TKT-STUD',
            'dosen' => 'TKT-DOSN',
            'professional' => 'TKT-PRO',
            'professional_1500' => 'TKT-PRO',
            // Technical
            'student' => 'TKT-PRS',
            'presenter' => 'TKT-PRS',
            'invited_speaker' => 'TKT-ISPK',
            'session_chair_judge' => 'TKT-JDG',
            'session_chair' => 'TKT-JDG',
            'judge' => 'TKT-JDG',
            'oral' => 'TKT-PRS',
            'oral_presenter' => 'TKT-PRS',
            'poster' => 'TKT-PRS',
            'poster_presenter' => 'TKT-PRS',
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
            $uniqueCode = $request->has('unique_code')
                ? (int) $request->input('unique_code')
                : (int) ($ticket->payment->unique_code ?? 0);

            $paymentUpdates = [];
            if ($request->has('unique_code')) {
                $paymentUpdates['unique_code'] = $uniqueCode;
            }
            if ($subtotal > 0) {
                $paymentUpdates['total_amount'] = $subtotal + $uniqueCode;
            }
            if (!empty($paymentUpdates)) {
                $ticket->payment->update($paymentUpdates);
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
            'action' => 'required|in:verify_payment,activate_tickets,mark_pending,mark_printed,check_in,undo_check_in,cancel_ticket,delete,resend_email',
            'ticket_ids' => 'nullable|array',
            'ticket_ids.*' => 'integer|exists:visitor_tickets,id',
            'mode' => 'nullable|string|in:selected,filtered_pending',
        ]);

        $action = $request->action;

        if ($request->input('mode') === 'filtered_pending') {
            $query = $this->filterTicketsQuery($request);
            $tickets = $query->where('visitor_tickets.status', 'pending')->get();
            $ticketIds = $tickets->pluck('id')->toArray();
        } else {
            $ticketIds = $request->ticket_ids ?? [];
            $tickets = VisitorTicket::whereIn('id', $ticketIds)->get();
        }

        if (empty($ticketIds) && in_array($action, ['activate_tickets', 'verify_payment', 'mark_pending', 'mark_printed', 'check_in', 'undo_check_in', 'cancel_ticket', 'delete'])) {
            return back()->with('error', 'Tidak ada tiket yang dipilih untuk diproses.');
        }

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

            case 'activate_tickets':
            case 'verify_payment':
                // 1. Ubah status semua tiket terpilih menjadi 'active'
                VisitorTicket::whereIn('id', $ticketIds)->update([
                    'status' => 'active',
                ]);

                // 2. Setujui invoice pembayaran terkait jika ada
                $paymentIds = $tickets->pluck('payment_id')->filter()->unique();
                if ($paymentIds->isNotEmpty()) {
                    VisitorPayment::whereIn('id', $paymentIds)->where('status', '!=', 'approved')->update([
                        'status' => 'approved',
                        'verified_at' => now(),
                        'verified_by_admin_id' => Auth::id(),
                    ]);
                    // Pastikan seluruh tiket anggota dalam invoice yang sama juga berstatus active
                    VisitorTicket::whereIn('payment_id', $paymentIds)->update(['status' => 'active']);
                }

                $activatedCount = count($ticketIds);
                return back()->with('success', "Sukses! {$activatedCount} tiket berhasil diubah statusnya menjadi ACTIVE (Pending Terverifikasi) secara massal.");

            case 'mark_pending':
                VisitorTicket::whereIn('id', $ticketIds)->update(['status' => 'pending']);
                return back()->with('success', count($ticketIds) . ' tiket berhasil diubah menjadi PENDING.');

            case 'mark_printed':
                $now = now();
                $adminId = Auth::id();
                VisitorTicket::whereIn('id', $ticketIds)->update([
                    'card_printed' => true,
                    'card_printed_at' => $now,
                    'card_printed_by_admin_id' => $adminId,
                ]);
                VisitorTicket::whereIn('id', $ticketIds)->where('status', 'active')->where('checked_in', false)->update([
                    'checked_in' => true,
                    'checked_in_at' => $now,
                    'checked_in_by_admin_id' => $adminId,
                ]);
                return back()->with('success', count($ticketIds) . ' tiket berhasil ditandai SUDAH CETAK KARTU secara massal.');

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

    /**
     * Upload an updated Excel/CSV file containing unpaid presenters
     */
    public function uploadUnpaidExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());
        if (!in_array($ext, ['xlsx', 'xls', 'csv'])) {
            return back()->with('error', 'Format file harus berupa Excel (.xlsx, .xls) atau CSV (.csv).');
        }

        $destDir = storage_path('app');
        if (!file_exists($destDir)) {
            @mkdir($destDir, 0755, true);
        }

        $destPath = storage_path('app/List_Belum_Bayar.xlsx');
        $file->move($destDir, 'List_Belum_Bayar.xlsx');

        $emails = self::extractEmailsFromExcel($destPath);
        $count = count($emails);

        $matchedTicketsCount = VisitorTicket::whereIn(DB::raw('LOWER(visitor_email)'), $emails)->count();

        return back()->with('success', "File Excel berhasil diunggah! Terdeteksi {$count} email unik dari file, dengan {$matchedTicketsCount} tiket pengunjung yang cocok di sistem.");
    }

    /**
     * Download current unpaid presenters Excel file
     */
    public function downloadUnpaidExcel()
    {
        $possiblePaths = [
            storage_path('app/List_Belum_Bayar.xlsx'),
            base_path('List_Belum_Bayar.xlsx'),
        ];
        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                return response()->download($path, 'List_Belum_Bayar.xlsx');
            }
        }
        return back()->with('error', 'File List Belum Bayar belum tersedia di server.');
    }

    /**
     * Get list of lowercase emails of unpaid presenters from Excel or fallback preset
     */
    public static function getUnpaidPresenterEmails(): array
    {
        $possiblePaths = [
            base_path('List_Belum_Bayar.xlsx'),
            storage_path('app/List_Belum_Bayar.xlsx'),
            storage_path('app/unpaid_presenters.xlsx'),
        ];

        foreach ($possiblePaths as $filePath) {
            if (file_exists($filePath)) {
                $extracted = self::extractEmailsFromExcel($filePath);
                if (!empty($extracted)) {
                    return $extracted;
                }
            }
        }

        // Default verified list from List_Belum_Bayar.xlsx
        return [
            'ak.al.jailani@gmail.com',
            'aazizurrofi@skkmigas.go.id',
            'ainunrahmaniah1717@gmail.com',
            'ajirahmat.g@gmail.com',
            'alfian.gumelar@pertamina.com',
            'anggit.kurnia@pertamina.com',
            'annisar.ea@techconnect.co.id',
            'falkhanb@gmail.com',
            'rahmadiantyanastya@gmail.com',
            'aveliansyah@gmail.com',
            'gheaayuanggraeni@gmail.com',
            'bermanmora01@gmail.com',
            'yurisaputra@gmail.com',
            'budi.r.permana@medcoenergi.com',
            'devon.agasya@borneo-indobara.com',
            'earifullah27@gmail.com',
            'farihaelsya@gmail.com',
            'husein.almunawwar@pertamina.com',
            'ihsanakmala@gmail.com',
            'imasviestawati22@gmail.com',
            'mk.iram.dairaby@pertamina.com',
            'lano.adhitya@esdm.go.id',
            'mk.m.suryantara@pertamina.com',
            'malamshah@bukitasam.co.id',
            'hapiid1st@gmail.com',
            'mk.muh.ghifari@pertamina.com',
            'luthfimuhammmad@gmail.com',
            'isetiawan2@slb.com',
            'ncitajaya@gmail.com',
            'nurqosimg@gmail.com',
            'abelardyan@gmail.com',
            'rendyjohneffendi@gmail.com',
            'riezarachmatgsi@gmail.com',
            'riksathabrani@gmail.com',
            'rinaldi.ikhram@unpad.ac.id',
            'ryan.rahdiana@gmail.com',
            'hoseawidodo@ui.ac.id',
            'dumex.pasaribu@gmail.com',
            'winofadriand@gmail.com',
            'zikri.sulistyo@gmail.com',
            'gendang88@gmail.com',
        ];
    }

    /**
     * Extract unique email addresses from an Excel (.xlsx) or CSV file
     */
    public static function extractEmailsFromExcel(string $filePath): array
    {
        $emails = [];
        try {
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            if ($ext === 'csv') {
                $content = @file_get_contents($filePath);
                if ($content && preg_match_all('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', $content, $matches)) {
                    foreach ($matches[0] as $em) {
                        $em = trim(strtolower($em));
                        if (filter_var($em, FILTER_VALIDATE_EMAIL)) {
                            $emails[] = $em;
                        }
                    }
                }
            } else {
                $zip = new \ZipArchive();
                if ($zip->open($filePath) === true) {
                    $strings = [];
                    $sharedXml = $zip->getFromName('xl/sharedStrings.xml');
                    if ($sharedXml) {
                        $sXml = @simplexml_load_string($sharedXml);
                        if ($sXml && isset($sXml->si)) {
                            foreach ($sXml->si as $si) {
                                $strings[] = (string)($si->t ?? '');
                            }
                        }
                    }

                    for ($i = 1; $i <= 10; $i++) {
                        $sheetXml = $zip->getFromName("xl/worksheets/sheet{$i}.xml");
                        if (!$sheetXml) continue;
                        $shXml = @simplexml_load_string($sheetXml);
                        if ($shXml && isset($shXml->sheetData->row)) {
                            foreach ($shXml->sheetData->row as $row) {
                                foreach ($row->c as $cell) {
                                    $val = (string)$cell->v;
                                    if ((string)$cell['t'] === 's' && isset($strings[(int)$val])) {
                                        $val = $strings[(int)$val];
                                    }
                                    $val = trim(strtolower($val));
                                    if (filter_var($val, FILTER_VALIDATE_EMAIL)) {
                                        $emails[] = $val;
                                    }
                                }
                            }
                        }
                    }
                    $zip->close();
                }
            }
        } catch (\Exception $e) {
            Log::warning("extractEmailsFromExcel error: " . $e->getMessage());
        }

        return array_values(array_unique($emails));
    }
}

