<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use App\Models\PageVisit;
use App\Models\EmailSetting;
use App\Models\Certificate;
use App\Mail\SubmissionStatusChanged;
use App\Mail\PaymentConfirmation;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Cache heavy aggregations for 60 seconds
        $analytics = cache()->remember('admin_dashboard_analytics', 60, function() {
            return [
                'totalSubmissions' => Submission::count(),
                'pendingReviews' => Submission::where('status', 'pending')->count(),
                'verifiedPayments' => Payment::where('verified', true)->count(),
                'acceptedSubmissions' => Submission::where('status', 'accepted')->count(),
                'rejectedSubmissions' => Submission::where('status', 'rejected')->count(),
                'totalUsers' => User::where('role', 'Author')->count(),
            ];
        });

        // Recent submissions (light query, no cache needed)
        $recentSubmissions = Submission::with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'status', 'user_id', 'created_at']);

        // Pending payments count
        $pendingPayments = Payment::where('verified', false)->count();

        // Cache topic statistics for 60 seconds
        $submissionsPerTopic = cache()->remember('admin_topic_stats', 60, function() {
            return Submission::selectRaw('
                COALESCE(NULLIF(paper_sub_theme, ""), NULLIF(topic, ""), "Tidak Ditentukan") as topic_name,
                COUNT(*) as count,
                SUM(CASE WHEN category_submission = "Oral Presentation" THEN 1 ELSE 0 END) as oral_presentation_count,
                SUM(CASE WHEN category_submission = "Poster Presentation" THEN 1 ELSE 0 END) as poster_presentation_count
            ')
            ->groupBy('topic_name')
            ->orderBy('count', 'DESC')
            ->get()
            ->map(fn($item) => [
                'topic' => $item->topic_name,
                'count' => (int) $item->count,
                'oral_presentation_count' => (int) $item->oral_presentation_count,
                'poster_presentation_count' => (int) $item->poster_presentation_count,
            ]);
        });

        // Cache participant stats
        $participantStats = cache()->remember('admin_participant_stats', 60, function() {
            return [
                'student' => Submission::join('users', 'submissions.user_id', '=', 'users.id')
                    ->where('users.category', 'Student')->count(),
                'professional' => Submission::join('users', 'submissions.user_id', '=', 'users.id')
                    ->where('users.category', 'Professional')->count(),
                'international' => Submission::join('users', 'submissions.user_id', '=', 'users.id')
                    ->where('users.category', 'International Delegate')->count(),
            ];
        });

        // Cache topic by participant stats
        $submissionsPerTopicByParticipant = cache()->remember('admin_topic_participant_stats', 60, function() {
            return Submission::join('users', 'submissions.user_id', '=', 'users.id')
                ->selectRaw('
                    COALESCE(NULLIF(submissions.paper_sub_theme, ""), NULLIF(submissions.topic, ""), "Tidak Ditentukan") as topic_name,
                    COUNT(*) as count,
                    SUM(CASE WHEN users.category = "Student" THEN 1 ELSE 0 END) as student_count,
                    SUM(CASE WHEN users.category = "Professional" THEN 1 ELSE 0 END) as professional_count,
                    SUM(CASE WHEN users.category = "International Delegate" THEN 1 ELSE 0 END) as international_count,
                    SUM(CASE WHEN submissions.category_submission = "Oral Presentation" THEN 1 ELSE 0 END) as oral_presentation_count,
                    SUM(CASE WHEN submissions.category_submission = "Poster Presentation" THEN 1 ELSE 0 END) as poster_presentation_count
                ')
                ->groupBy('topic_name')
                ->orderBy('count', 'DESC')
                ->get()
                ->map(fn($item) => [
                    'topic' => $item->topic_name,
                    'count' => (int) $item->count,
                    'student_count' => (int) $item->student_count,
                    'professional_count' => (int) $item->professional_count,
                    'international_count' => (int) $item->international_count,
                    'oral_presentation_count' => (int) $item->oral_presentation_count,
                    'poster_presentation_count' => (int) $item->poster_presentation_count,
                ]);
        });

        // Visitor analytics (light queries)
        $visitorAnalytics = [
            'today' => PageVisit::where('page', '/')->whereDate('visited_at', today())->count(),
            'last7days' => PageVisit::where('page', '/')->where('visited_at', '>=', now()->subDays(7))->count(),
            'last30days' => PageVisit::where('page', '/')->where('visited_at', '>=', now()->subDays(30))->count(),
            'total' => PageVisit::where('page', '/')->count(),
        ];

        // Daily visitor trend (last 30 days)
        $dailyVisitors = PageVisit::where('page', '/')
            ->where('visited_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(visited_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'count' => (int) $item->count,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'analytics' => $analytics,
            'recentSubmissions' => $recentSubmissions,
            'pendingPayments' => $pendingPayments,
            'submissionsPerTopic' => $submissionsPerTopic,
            'participantStats' => $participantStats,
            'submissionsPerTopicByParticipant' => $submissionsPerTopicByParticipant,
            'visitorAnalytics' => $visitorAnalytics,
            'dailyVisitors' => $dailyVisitors,
        ]);
    }

    public function visitorAnalytics(Request $request)
    {
        $period = $request->get('period', '30d');

        $stats = [
            'today' => PageVisit::where('page', '/')->whereDate('visited_at', today())->count(),
            'last7days' => PageVisit::where('page', '/')->where('visited_at', '>=', now()->subDays(7))->count(),
            'last30days' => PageVisit::where('page', '/')->where('visited_at', '>=', now()->subDays(30))->count(),
            'total' => PageVisit::where('page', '/')->count(),
        ];

        if ($period === 'today') {
            // Hourly breakdown for today
            $chartData = PageVisit::where('page', '/')
                ->whereDate('visited_at', today())
                ->selectRaw('HOUR(visited_at) as hour, COUNT(*) as count')
                ->groupBy('hour')
                ->orderBy('hour')
                ->get()
                ->map(fn($item) => [
                    'label' => str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'count' => (int) $item->count,
                ]);
        } elseif ($period === '7d') {
            $chartData = PageVisit::where('page', '/')
                ->where('visited_at', '>=', now()->subDays(7))
                ->selectRaw('DATE(visited_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'label' => \Carbon\Carbon::parse($item->date)->format('M d'),
                    'count' => (int) $item->count,
                ]);
        } else {
            $chartData = PageVisit::where('page', '/')
                ->where('visited_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(visited_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'label' => \Carbon\Carbon::parse($item->date)->format('M d'),
                    'count' => (int) $item->count,
                ]);
        }

        return response()->json([
            'stats' => $stats,
            'chartData' => $chartData,
            'period' => $period,
        ]);
    }

    public function submissionAnalytics(Request $request)
    {
        $period = $request->get('period', '30d');

        $stats = [
            'today' => Submission::whereDate('created_at', today())->count(),
            'last7days' => Submission::where('created_at', '>=', now()->subDays(7))->count(),
            'last30days' => Submission::where('created_at', '>=', now()->subDays(30))->count(),
            'total' => Submission::count(),
        ];

        if ($period === 'today') {
            $chartData = Submission::whereDate('created_at', today())
                ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
                ->groupBy('hour')
                ->orderBy('hour')
                ->get()
                ->map(fn($item) => [
                    'label' => str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'count' => (int) $item->count,
                ]);
        } elseif ($period === '7d') {
            $chartData = Submission::where('created_at', '>=', now()->subDays(7))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'label' => \Carbon\Carbon::parse($item->date)->format('M d'),
                    'count' => (int) $item->count,
                ]);
        } else {
            $chartData = Submission::where('created_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'label' => \Carbon\Carbon::parse($item->date)->format('M d'),
                    'count' => (int) $item->count,
                ]);
        }

        return response()->json([
            'stats' => $stats,
            'chartData' => $chartData,
            'period' => $period,
        ]);
    }

    public function submissions(Request $request)
    {
        $query = Submission::with([
            'user:id,name,email,whatsapp,category',
            'reviews:id,submission_id,reviewer_id',
            'reviews.reviewer:id,name,email',
            'payment:id,submission_id,verified,amount',
        ]);

        // Server-side search
        if ($search = $request->get('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  })
                  ->orWhere('author_full_name', 'like', "%{$search}%");
            });
        }

        // Server-side status filter
        if ($status = $request->get('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Server-side presentation filter
        if ($presentation = $request->get('presentation')) {
            if ($presentation !== 'all') {
                $query->where('presentation_preference', $presentation);
            }
        }

        $submissions = $query->latest()->paginate(25)->withQueryString();

        // Status counts for filter badges (fast COUNT queries)
        $statusCounts = [
            'all' => Submission::count(),
            'pending' => Submission::where('status', 'pending')->count(),
            'under_review' => Submission::where('status', 'under_review')->count(),
            'revision_required_phase1' => Submission::where('status', 'revision_required_phase1')->count(),
            'revision_required_phase2' => Submission::where('status', 'revision_required_phase2')->count(),
            'accepted' => Submission::where('status', 'accepted')->count(),
            'rejected' => Submission::where('status', 'rejected')->count(),
            'deletion_requested' => Submission::where('status', 'deletion_requested')->count(),
        ];

        $reviewers = User::whereRaw('LOWER(role) = ?', ['reviewer'])->get(['id', 'name', 'email', 'affiliation']);

        return Inertia::render('Admin/Submissions', [
            'submissions' => $submissions,
            'reviewers' => $reviewers,
            'statusCounts' => $statusCounts,
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', 'all'),
                'presentation' => $request->get('presentation', 'all'),
            ],
        ]);
    }

    public function updateSubmissionStatus(Request $request, $id, WhatsAppNotificationService $whatsappService)
    {
        $request->validate([
            'status' => 'required|in:pending,under_review,revision_required_phase1,revision_required_phase2,accepted,rejected',
        ]);

        $submission = Submission::with('user')->findOrFail($id);
        $oldStatus = $submission->status;
        $submission->update(['status' => $request->status]);

        // Send notifications if status changed
        if ($oldStatus !== $request->status) {
            // Send WhatsApp notification
            $whatsappService->sendSubmissionStatusNotification(
                $submission->user,
                $submission,
                $request->status
            );
            
            // Send email notification (queued for async processing)
            try {
                $authorName = $submission->author_full_name;
                $authorEmail = $submission->corresponding_author_email;
                
                Mail::to($authorEmail)->queue(new SubmissionStatusChanged(
                    $submission,
                    $oldStatus,
                    $request->status,
                    $authorName
                ));
            } catch (\Exception $e) {
                Log::error('Failed to queue status change email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Submission status updated successfully!');
    }

    public function bulkUpdateStatus(Request $request, WhatsAppNotificationService $whatsappService)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:submissions,id',
            'status' => 'required|in:pending,under_review,revision_required_phase1,revision_required_phase2,accepted,rejected',
        ]);

        // Get submissions with user data before updating and store old statuses
        $submissions = Submission::with('user')
            ->whereIn('id', $request->submission_ids)
            ->get();
        
        $submissionsData = $submissions->map(function($sub) {
            return [
                'submission' => $sub,
                'oldStatus' => $sub->status
            ];
        });

        // Update status for all submissions
        Submission::whereIn('id', $request->submission_ids)
            ->update(['status' => $request->status]);

        // Send notifications to each user
        foreach ($submissionsData as $data) {
            $submission = $data['submission'];
            $oldStatus = $data['oldStatus'];
            
            // Refresh submission to get new status
            $submission->refresh();
            
            // Send WhatsApp notification
            $whatsappService->sendSubmissionStatusNotification(
                $submission->user,
                $submission,
                $request->status
            );
            
            // Send email notification (queued for async processing)
            try {
                $authorName = $submission->author_full_name;
                $authorEmail = $submission->corresponding_author_email;
                
                Mail::to($authorEmail)->queue(new SubmissionStatusChanged(
                    $submission,
                    $oldStatus,
                    $request->status,
                    $authorName
                ));
            } catch (\Exception $e) {
                Log::error("Failed to queue status change email to {$authorEmail}: " . $e->getMessage());
            }
        }

        return back()->with('success', count($request->submission_ids) . ' submissions updated successfully!');
    }

    public function assignReviewer(Request $request, $id)
    {
        $request->validate([
            'reviewer_ids' => 'required|array|max:5',
            'reviewer_ids.*' => 'required|exists:users,id',
        ]);

        $submission = Submission::findOrFail($id);

        // Check current reviewer count
        $currentReviewersCount = Review::where('submission_id', $submission->id)->count();
        $newReviewersCount = count($request->reviewer_ids);

        if ($currentReviewersCount + $newReviewersCount > 5) {
            return back()->withErrors(['error' => 'Maximum 5 reviewers per submission. Currently assigned: ' . $currentReviewersCount]);
        }

        // Get already assigned reviewer IDs
        $alreadyAssigned = Review::where('submission_id', $submission->id)
            ->pluck('reviewer_id')
            ->toArray();

        $newAssignments = 0;
        foreach ($request->reviewer_ids as $reviewerId) {
            // Skip if already assigned
            if (in_array($reviewerId, $alreadyAssigned)) {
                continue;
            }

            // Create new review assignment
            Review::create([
                'submission_id' => $submission->id,
                'reviewer_id' => $reviewerId,
                'originality_score' => null,
                'relevance_score' => null,
                'clarity_score' => null,
                'methodology_score' => null,
                'overall_score' => null,
                'comments' => null,
            ]);

            $newAssignments++;
        }

        if ($newAssignments > 0) {
            return back()->with('success', $newAssignments . ' reviewer(s) assigned successfully!');
        } else {
            return back()->with('info', 'No new reviewers assigned (already assigned or limit reached).');
        }
    }

    public function removeReviewer(Request $request, $submissionId, $reviewerId)
    {
        $review = Review::where('submission_id', $submissionId)
            ->where('reviewer_id', $reviewerId)
            ->first();

        if (!$review) {
            return back()->withErrors(['error' => 'Reviewer assignment not found.']);
        }

        // Check if reviewer has already submitted scores
        if ($review->originality_score !== null || $review->overall_score !== null) {
            return back()->withErrors(['error' => 'Cannot remove reviewer who has already submitted a review.']);
        }

        $review->delete();

        return back()->with('success', 'Reviewer removed successfully!');
    }

    public function exportSubmissions()
    {
        $submissions = Submission::with(['user', 'payment'])
            ->get()
            ->map(function ($submission) {
                $publicationOption = $submission->publication_option;
                $preferredPub = $submission->preferred_publication;

                $publicationLabel = match($publicationOption) {
                    'yes' => 'Journal Publication',
                    'no'  => 'Proceedings Only',
                    default => 'N/A',
                };

                $preferredPubLabel = match($preferredPub) {
                    'scopus_proceedings' => 'Scopus Proceedings',
                    'iagi_journal'       => 'IAGI Journal',
                    default => $preferredPub ?? 'N/A',
                };

                return [
                    'ID'                      => $submission->id,
                    'Submission Code'         => $submission->submission_code ?? 'N/A',
                    'Title'                   => $submission->title,
                    'Author Full Name'        => $submission->author_full_name ?? $submission->user->name,
                    'Corresponding Email'     => $submission->corresponding_author_email ?? $submission->user->email,
                    'Phone / WhatsApp'        => $submission->user->whatsapp ?? 'N/A',
                    'Institute / Organization'=> $submission->institute_organization ?? $submission->affiliation ?? 'N/A',
                    'Participant Category'    => $submission->user->category ?? 'N/A',
                    'Paper Theme'             => $submission->paper_theme ?? 'N/A',
                    'Paper Sub Theme'         => $submission->paper_sub_theme ?? $submission->topic ?? 'N/A',
                    'Presentation Type'       => $submission->presentation_preference ?? $submission->category_submission ?? 'N/A',
                    'Publication Preference'  => $publicationLabel,
                    'Preferred Publication'   => $preferredPubLabel,
                    'Co-Author 1'             => $submission->co_author_1 ?? '',
                    'Co-Author 1 Institute'   => $submission->co_author_1_institute ?? '',
                    'Co-Author 2'             => $submission->co_author_2 ?? '',
                    'Co-Author 2 Institute'   => $submission->co_author_2_institute ?? '',
                    'Co-Author 3'             => $submission->co_author_3 ?? '',
                    'Co-Author 3 Institute'   => $submission->co_author_3_institute ?? '',
                    'Co-Author 4'             => $submission->co_author_4 ?? '',
                    'Co-Author 4 Institute'   => $submission->co_author_4_institute ?? '',
                    'Co-Author 5'             => $submission->co_author_5 ?? '',
                    'Co-Author 5 Institute'   => $submission->co_author_5_institute ?? '',
                    'Keywords'                => $submission->keywords ?? 'N/A',
                    'Abstract'                => $submission->abstract ?? 'N/A',
                    'Status'                  => $submission->status,
                    'Payment Status'          => $submission->payment?->verified ? 'Paid' : 'Unpaid',
                    'Payment Amount'          => $submission->payment?->amount ?? 'N/A',
                    'Submitted At'            => $submission->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $filename = 'submissions_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');

        // Add BOM for UTF-8
        fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

        // Add header
        fputcsv($handle, array_keys($submissions->first()));

        // Add data
        foreach ($submissions as $submission) {
            fputcsv($handle, $submission);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function deleteSubmission($id)
    {
        $submission = Submission::findOrFail($id);
        
        // Delete related reviews first
        Review::where('submission_id', $id)->delete();
        
        // Delete related payments
        Payment::where('submission_id', $id)->delete();
        
        // Delete the submission file if exists
        if ($submission->file_path && Storage::disk('public')->exists($submission->file_path)) {
            Storage::disk('public')->delete($submission->file_path);
        }
        
        // Delete the submission
        $submission->delete();

        return back()->with('success', 'Submission deleted successfully!');
    }

    public function approveDeletion($id)
    {
        $submission = Submission::findOrFail($id);

        if ($submission->status !== 'deletion_requested') {
            return back()->withErrors(['error' => 'This submission has not requested deletion.']);
        }

        // Delete related reviews
        Review::where('submission_id', $id)->delete();

        // Delete related payments
        Payment::where('submission_id', $id)->delete();

        // Delete submission files
        foreach (['file_path', 'full_paper_file', 'layouting_file', 'editor_feedback_file'] as $fileField) {
            if ($submission->$fileField && Storage::disk('public')->exists($submission->$fileField)) {
                Storage::disk('public')->delete($submission->$fileField);
            }
        }

        $submission->delete();

        return back()->with('success', 'Deletion request approved. Submission has been permanently deleted.');
    }

    public function rejectDeletion($id)
    {
        $submission = Submission::findOrFail($id);

        if ($submission->status !== 'deletion_requested') {
            return back()->withErrors(['error' => 'This submission has not requested deletion.']);
        }

        $submission->update([
            'status' => 'pending',
            'deletion_reason' => null,
            'deletion_requested_at' => null,
        ]);

        return back()->with('success', 'Deletion request rejected. Submission status reset to pending.');
    }

    public function payments(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $query = Payment::with(['user:id,name,email,category', 'submission:id,title,submission_code']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $cleanSearch = ltrim($search, '#');
                
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('submission', function ($sq) use ($search) {
                    $sq->where('title', 'like', "%{$search}%")
                       ->orWhere('submission_code', 'like', "%{$search}%");
                })
                ->orWhere('amount', 'like', "%{$search}%")
                ->orWhere('order_id', 'like', "%{$search}%")
                ->orWhere('transaction_id', 'like', "%{$search}%")
                ->orWhere('gateway', 'like', "%{$search}%")
                ->orWhere('id', $cleanSearch);
            });
        }

        if ($category && $category !== 'all') {
            $query->whereHas('user', function ($uq) use ($category) {
                $uq->where('category', $category);
            });
        }

        $payments = $query->latest()->paginate(25);

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
            ]
        ]);
    }

    public function verifyPayment(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'verified' => true,
            'verified_at' => now(),
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Queue confirmation email
        try {
            $payment->load(['user', 'submission']);
            if ($payment->user && $payment->user->email) {
                Mail::to($payment->user->email)->queue(new PaymentConfirmation($payment));
                Log::info("Payment confirmation email queued for payment #{$payment->id} via admin manual verification");
            }
        } catch (\Exception $e) {
            Log::error("Failed to queue email for manual payment verify #{$payment->id}: " . $e->getMessage());
        }

        return back()->with('success', 'Payment verified successfully!');
    }

    public function rejectPayment(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'verified' => false,
            'verified_at' => null,
            'status' => 'failed',
        ]);

        return back()->with('success', 'Payment rejected and status reset to failed!');
    }

    public function deletePayment($id)
    {
        $payment = Payment::findOrFail($id);

        // Delete payment proof file if exists
        if ($payment->payment_proof_url && Storage::disk('public')->exists($payment->payment_proof_url)) {
            Storage::disk('public')->delete($payment->payment_proof_url);
        }

        // Delete support document file if exists
        if ($payment->support_document_url && Storage::disk('public')->exists($payment->support_document_url)) {
            Storage::disk('public')->delete($payment->support_document_url);
        }

        $payment->delete();

        return back()->with('success', 'Payment deleted. The author can now re-submit payment.');
    }

    public function users(Request $request)
    {
        $query = User::latest();

        // Server-side search by name or email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Server-side role filter
        if ($role = $request->input('role')) {
            if ($role !== 'all') {
                $query->where('role', $role);
            }
        }

        $users = $query->paginate(25)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', 'all'),
            ],
        ]);
    }

    public function exportUsers()
    {
        $users = User::withCount('submissions')->latest()->get()
            ->map(function ($user) {
                return [
                    'ID'                => $user->id,
                    'Name'              => $user->name,
                    'Full Name'         => $user->full_name ?? $user->name,
                    'Email'             => $user->email,
                    'WhatsApp'          => $user->whatsapp ?? 'N/A',
                    'Affiliation'       => $user->affiliation ?? 'N/A',
                    'Category'          => $user->category ?? 'N/A',
                    'Role'              => $user->role ?? 'Author',
                    'Email Verified'    => $user->email_verified_at ? 'Yes' : 'No',
                    'Total Submissions' => $user->submissions_count,
                    'Registered At'     => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $filename = 'users_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');

        // Add BOM for UTF-8 Excel compatibility
        fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

        if ($users->count() > 0) {
            fputcsv($handle, array_keys($users->first()));
            foreach ($users as $user) {
                fputcsv($handle, $user);
            }
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:Author,Admin,Reviewer',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return back()->with('success', 'User role updated successfully!');
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }

    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'password' => bcrypt($request->password),
        ]);

        return back()->with('success', 'Password updated successfully');
    }

    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'whatsapp' => 'nullable|string|max:20',
            'affiliation' => 'nullable|string|max:255',
            'category' => 'nullable|string|in:Student,Professional,International Delegate',
            'password' => 'nullable|string|min:8',
        ];

        $request->validate($rules);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'affiliation' => $request->affiliation,
            'category' => $request->category,
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return back()->with('success', 'Profile updated successfully');
    }

    public function scores()
    {
        $submissions = Submission::with(['user:id,name,email', 'reviews:id,submission_id,reviewer_id,originality_score,relevance_score,clarity_score,methodology_score,overall_score,comments', 'reviews.reviewer:id,name'])
            ->latest()
            ->paginate(25);

        return Inertia::render('Admin/Scores', [
            'submissions' => $submissions,
        ]);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:Author,Admin,Reviewer',
            'affiliation' => $request->role === 'Reviewer' ? 'required|string|max:255' : 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'affiliation' => $request->affiliation,
            'email_verified_at' => now(), // Auto-verify admin-created users
        ]);

        return back()->with('success', 'User created successfully');
    }

    public function toggleVerification(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->verify) {
            $user->email_verified_at = now();
        } else {
            $user->email_verified_at = null;
        }

        $user->save();

        // Send email notification when account is verified
        if ($request->verify) {
            try {
                Mail::to($user->email)->queue(new \App\Mail\AccountVerified($user));
            } catch (\Exception $e) {
                // Log error but don't fail the verification
                \Log::warning('Failed to send verification email to ' . $user->email . ': ' . $e->getMessage());
            }
        } else {
            try {
                Mail::to($user->email)->queue(new \App\Mail\AccountUnverified($user));
            } catch (\Exception $e) {
                \Log::warning('Failed to send unverification email to ' . $user->email . ': ' . $e->getMessage());
            }
        }

        return back()->with('success', 'User verification status updated successfully');
    }

    public function getEmailSettings()
    {
        $emailSettings = EmailSetting::getActive() ?? new EmailSetting();
        return response()->json($emailSettings);
    }

    public function saveEmailSettings(Request $request)
    {
        $request->validate([
            'mail_host' => 'required|string',
            'mail_port' => 'required|integer',
            'mail_username' => 'required|string',
            'mail_password' => 'required|string',
            'mail_encryption' => 'required|in:tls,ssl',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required|string',
        ]);

        // Deactivate all existing settings
        EmailSetting::query()->update(['is_active' => false]);

        // Create or update the setting
        $settings = EmailSetting::updateOrCreate(
            ['id' => 1],
            [
                'mail_mailer' => 'smtp',
                'mail_host' => $request->mail_host,
                'mail_port' => $request->mail_port,
                'mail_username' => $request->mail_username,
                'mail_password' => $request->mail_password,
                'mail_encryption' => $request->mail_encryption,
                'mail_from_address' => $request->mail_from_address,
                'mail_from_name' => $request->mail_from_name,
                'is_active' => true,
            ]
        );

        // Apply settings immediately
        $settings->applyToConfig();

        return back()->with('success', 'SMTP settings saved successfully!');
    }

    public function testEmail(Request $request)
    {
        $request->validate([
            'test_email' => 'required|email'
        ]);

        try {
            \Mail::raw('This is a test email from IAGI-GEOSEA 2026 Conference Management System.', function($message) use ($request) {
                $message->to($request->test_email)
                        ->subject('Test Email - IAGI-GEOSEA 2026');
            });

            return response()->json(['success' => true, 'message' => 'Test email sent successfully!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }

    // ========== CERTIFICATES ==========

    public function certificates(Request $request)
    {
        $query = Submission::with(['user:id,name,email', 'certificates.uploader:id,name'])
            ->where('status', 'accepted');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('submission_code', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        // Filter by certificate status
        if ($request->filled('cert_status')) {
            if ($request->cert_status === 'has_certificate') {
                $query->whereHas('certificates');
            } elseif ($request->cert_status === 'no_certificate') {
                $query->whereDoesntHave('certificates');
            }
        }

        $submissions = $query->latest()->paginate(25)->withQueryString();

        return Inertia::render('Admin/Certificates', [
            'submissions' => $submissions,
            'filters' => $request->only(['search', 'cert_status']),
        ]);
    }

    public function uploadCertificate(Request $request, $submissionId)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'certificate_type' => 'required|in:participation,presenter,best_paper',
            'label' => 'nullable|string|max:255',
        ]);

        $submission = Submission::findOrFail($submissionId);

        $file = $request->file('file');
        $filename = 'cert_' . $submission->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('certificates', $filename, 'public');

        Certificate::create([
            'submission_id' => $submission->id,
            'user_id' => $submission->user_id,
            'file_path' => $path,
            'certificate_type' => $request->certificate_type,
            'label' => $request->label ?: $this->getDefaultLabel($request->certificate_type),
            'uploaded_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Certificate uploaded successfully.');
    }

    public function deleteCertificate($id)
    {
        $certificate = Certificate::findOrFail($id);

        // Delete file from storage
        if (Storage::disk('public')->exists($certificate->file_path)) {
            Storage::disk('public')->delete($certificate->file_path);
        }

        $certificate->delete();

        return redirect()->back()->with('success', 'Certificate deleted.');
    }

    private function getDefaultLabel($type)
    {
        return match ($type) {
            'participation' => 'Certificate of Participation',
            'presenter' => 'Certificate of Presenter',
            'best_paper' => 'Best Paper Award',
            default => 'Certificate',
        };
    }
}
