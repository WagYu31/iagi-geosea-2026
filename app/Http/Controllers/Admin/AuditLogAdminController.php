<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\VisitorPayment;
use App\Models\VisitorTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class AuditLogAdminController extends Controller
{
    /**
     * Display the audit, activity, and system logs dashboard
     */
    public function index(Request $request)
    {
        ActivityLog::ensureTableExists();

        $search = trim($request->input('search', ''));
        $actionFilter = $request->input('action', 'all');
        $moduleFilter = $request->input('module', 'all');
        $dateFilter = $request->input('date', 'all');

        $query = ActivityLog::query();

        // 1. Search keyword
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('target_code', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        // 2. Action filter
        if ($actionFilter !== 'all') {
            if ($actionFilter === 'deletions') {
                $query->where(function ($q) {
                    $q->where('action', 'like', '%delete%')
                      ->orWhere('description', 'like', '%hapus%');
                });
            } elseif ($actionFilter === 'payments') {
                $query->where(function ($q) {
                    $q->where('action', 'like', '%payment%')
                      ->orWhere('action', 'like', '%verify%')
                      ->orWhere('action', 'like', '%debt%');
                });
            } elseif ($actionFilter === 'category') {
                $query->where('action', 'like', '%category%');
            } elseif ($actionFilter === 'status') {
                $query->where(function ($q) {
                    $q->where('action', 'like', '%status%')
                      ->orWhere('action', 'like', '%checkin%');
                });
            } elseif ($actionFilter === 'create') {
                $query->where('action', 'like', '%create%');
            } else {
                $query->where('action', $actionFilter);
            }
        }

        // 3. Module filter
        if ($moduleFilter !== 'all') {
            $query->where('module', $moduleFilter);
        }

        // 4. Date filter
        if ($dateFilter === 'today') {
            $query->whereDate('created_at', today());
        } elseif ($dateFilter === 'yesterday') {
            $query->whereDate('created_at', today()->subDay());
        } elseif ($dateFilter === 'this_week') {
            $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($dateFilter === 'this_month') {
            $query->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year);
        }

        $logs = $query->latest('id')->paginate(25)->withQueryString();

        // Summary counters
        $stats = [
            'totalLogs' => ActivityLog::count(),
            'deletedCount' => ActivityLog::where('action', 'like', '%delete%')->count(),
            'paymentCount' => ActivityLog::where(function ($q) {
                $q->where('action', 'like', '%verify%')
                  ->orWhere('action', 'like', '%payment%');
            })->count(),
            'statusCount' => ActivityLog::where('action', 'like', '%status%')->count(),
            'categoryCount' => ActivityLog::where('action', 'like', '%category%')->count(),
        ];

        // ─── GAP CHECKER: Detect missing/skipped database sequence IDs ───
        $gapAnalysis = $this->analyzeDatabaseGaps();

        // ─── SYSTEM LOGS: Parse recent storage/logs/laravel.log safely ───
        $systemLogs = $this->readRecentLaravelLogs();

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'gapAnalysis' => $gapAnalysis,
            'systemLogs' => $systemLogs,
            'filters' => [
                'search' => $search,
                'action' => $actionFilter,
                'module' => $moduleFilter,
                'date' => $dateFilter,
            ],
        ]);
    }

    /**
     * Analyze gaps in visitor_tickets and visitor_payments tables
     */
    private function analyzeDatabaseGaps(): array
    {
        try {
            // Check visitor_tickets table
            $ticketIds = VisitorTicket::orderBy('id', 'asc')->pluck('id')->toArray();
            $ticketGaps = [];
            $totalTickets = count($ticketIds);
            $maxTicketId = !empty($ticketIds) ? end($ticketIds) : 0;
            $minTicketId = !empty($ticketIds) ? reset($ticketIds) : 1;

            if ($maxTicketId > 1 && $totalTickets > 0) {
                $ticketIdFlip = array_flip($ticketIds);
                for ($i = 1; $i < $maxTicketId; $i++) {
                    if (!isset($ticketIdFlip[$i])) {
                        // Check if we have an audit log recorded for this deleted ticket ID
                        $matchedLog = ActivityLog::where('module', 'visitor_tickets')
                            ->where('action', 'like', '%delete%')
                            ->where(function ($q) use ($i) {
                                $q->where('target_id', $i)
                                  ->orWhere('description', 'like', "%ID #{$i}%");
                            })
                            ->latest()
                            ->first();

                        $ticketGaps[] = [
                            'missing_id' => $i,
                            'type' => 'ticket',
                            'matched_log' => $matchedLog ? [
                                'action' => $matchedLog->action,
                                'description' => $matchedLog->description,
                                'target_code' => $matchedLog->target_code,
                                'deleted_by' => $matchedLog->user_name,
                                'deleted_at' => $matchedLog->created_at->format('Y-m-d H:i:s'),
                                'snapshot' => $matchedLog->snapshot,
                            ] : null,
                        ];

                        if (count($ticketGaps) >= 100) break; // Limit to 100 gaps
                    }
                }
            }

            // Check visitor_payments table
            $paymentIds = VisitorPayment::orderBy('id', 'asc')->pluck('id')->toArray();
            $paymentGaps = [];
            $totalPayments = count($paymentIds);
            $maxPaymentId = !empty($paymentIds) ? end($paymentIds) : 0;

            if ($maxPaymentId > 1 && $totalPayments > 0) {
                $paymentIdFlip = array_flip($paymentIds);
                for ($j = 1; $j < $maxPaymentId; $j++) {
                    if (!isset($paymentIdFlip[$j])) {
                        $matchedLog = ActivityLog::where('module', 'payments')
                            ->where('action', 'like', '%delete%')
                            ->where('target_id', $j)
                            ->latest()
                            ->first();

                        $paymentGaps[] = [
                            'missing_id' => $j,
                            'type' => 'payment',
                            'matched_log' => $matchedLog ? [
                                'action' => $matchedLog->action,
                                'description' => $matchedLog->description,
                                'target_code' => $matchedLog->target_code,
                                'deleted_by' => $matchedLog->user_name,
                                'deleted_at' => $matchedLog->created_at->format('Y-m-d H:i:s'),
                            ] : null,
                        ];

                        if (count($paymentGaps) >= 100) break;
                    }
                }
            }

            return [
                'ticket_stats' => [
                    'count' => $totalTickets,
                    'min_id' => $minTicketId,
                    'max_id' => $maxTicketId,
                    'gap_count' => count($ticketGaps),
                    'gaps' => $ticketGaps,
                ],
                'payment_stats' => [
                    'count' => $totalPayments,
                    'max_id' => $maxPaymentId,
                    'gap_count' => count($paymentGaps),
                    'gaps' => $paymentGaps,
                ],
            ];
        } catch (\Throwable $e) {
            return [
                'error' => $e->getMessage(),
                'ticket_stats' => ['count' => 0, 'gap_count' => 0, 'gaps' => []],
                'payment_stats' => ['count' => 0, 'gap_count' => 0, 'gaps' => []],
            ];
        }
    }

    /**
     * Read the last portion of storage/logs/laravel.log safely
     */
    private function readRecentLaravelLogs(): array
    {
        $logPath = storage_path('logs/laravel.log');

        if (!File::exists($logPath)) {
            return [
                'exists' => false,
                'size_formatted' => '0 KB',
                'size_bytes' => 0,
                'last_modified' => null,
                'entries' => [],
            ];
        }

        $size = File::size($logPath);
        $lastModified = date('Y-m-d H:i:s', File::lastModified($logPath));

        // Format size
        if ($size >= 1048576) {
            $formattedSize = number_format($size / 1048576, 2) . ' MB';
        } elseif ($size >= 1024) {
            $formattedSize = number_format($size / 1024, 2) . ' KB';
        } else {
            $formattedSize = $size . ' B';
        }

        // Read last 150 KB safely
        $readBytes = min($size, 153600);
        $content = '';
        $fp = @fopen($logPath, 'r');
        if ($fp) {
            if ($size > $readBytes) {
                fseek($fp, -$readBytes, SEEK_END);
            }
            $content = fread($fp, $readBytes);
            fclose($fp);
        }

        // Parse log entries using standard Laravel log pattern
        $pattern = '/^\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}[\.\d]*)\]\s+(\w+)\.(\w+):\s+(.*?)(?=\n\[\d{4}-\d{2}-\d{2}|\z)/ms';
        preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

        $entries = [];
        $errorCount = 0;
        $warningCount = 0;
        $infoCount = 0;

        foreach ($matches as $match) {
            $timestamp = $match[1];
            $environment = $match[2];
            $level = strtoupper($match[3]);
            $body = trim($match[4]);

            if ($level === 'ERROR' || $level === 'CRITICAL' || $level === 'ALERT' || $level === 'EMERGENCY') {
                $errorCount++;
            } elseif ($level === 'WARNING') {
                $warningCount++;
            } else {
                $infoCount++;
            }

            // Split first line and stack trace
            $lines = explode("\n", $body, 2);
            $message = $lines[0] ?? '';
            $trace = $lines[1] ?? '';

            $entries[] = [
                'timestamp' => $timestamp,
                'level' => $level,
                'environment' => $environment,
                'message' => substr($message, 0, 300),
                'trace' => substr($trace, 0, 1500),
            ];
        }

        // Reverse so newest entries appear first, limit to 60 items
        $entries = array_slice(array_reverse($entries), 0, 60);

        return [
            'exists' => true,
            'size_formatted' => $formattedSize,
            'size_bytes' => $size,
            'last_modified' => $lastModified,
            'error_count' => $errorCount,
            'warning_count' => $warningCount,
            'info_count' => $infoCount,
            'entries' => $entries,
        ];
    }

    /**
     * Clear system log file
     */
    public function clearSystemLog()
    {
        $logPath = storage_path('logs/laravel.log');
        if (File::exists($logPath)) {
            File::put($logPath, '');
        }

        ActivityLog::record(
            action: 'clear_system_log',
            module: 'system',
            description: 'Admin membersihkan riwayat file server log laravel.log'
        );

        return back()->with('success', 'File server log laravel.log berhasil dibersihkan.');
    }

    /**
     * Download the full laravel.log file
     */
    public function downloadSystemLog()
    {
        $logPath = storage_path('logs/laravel.log');
        if (!File::exists($logPath)) {
            return back()->with('error', 'File log tidak ditemukan.');
        }

        $filename = 'laravel-' . date('Y-m-d-His') . '.log';
        return Response::download($logPath, $filename, [
            'Content-Type' => 'text/plain',
        ]);
    }
}
