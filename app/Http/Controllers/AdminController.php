<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use App\Models\EmailSetting;
use App\Mail\SubmissionStatusChanged;
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
        $analytics = [
            'totalSubmissions' => Submission::count(),
            'pendingReviews' => Submission::where('status', 'pending')->count(),
            'verifiedPayments' => Payment::where('verified', true)->count(),
            'acceptedSubmissions' => Submission::where('status', 'accepted')->count(),
            'rejectedSubmissions' => Submission::where('status', 'rejected')->count(),
            'totalUsers' => User::where('role', 'user')->count(),
        ];

        // Recent submissions
        $recentSubmissions = Submission::with('user')
            ->latest()
            ->take(5)
            ->get();

        // Pending payments
        $pendingPayments = Payment::with(['user', 'submission'])
            ->where('verified', false)
            ->count();

        // Submissions per topic statistics with category breakdown
        $submissionsPerTopic = Submission::selectRaw('
                COALESCE(NULLIF(paper_sub_theme, ""), NULLIF(topic, ""), "Tidak Ditentukan") as topic_name,
                COUNT(*) as count,
                SUM(CASE WHEN category_submission = "Oral Presentation" THEN 1 ELSE 0 END) as oral_presentation_count,
                SUM(CASE WHEN category_submission = "Poster Presentation" THEN 1 ELSE 0 END) as poster_presentation_count
            ')
            ->groupBy('topic_name')
            ->orderBy('count', 'DESC')
            ->get()
            ->map(function ($item) {
                return [
                    'topic' => $item->topic_name,
                    'count' => (int) $item->count,
                    'oral_presentation_count' => (int) $item->oral_presentation_count,
                    'poster_presentation_count' => (int) $item->poster_presentation_count,
                ];
            });

        // Participant category statistics
        $participantStats = [
            'student' => Submission::join('users', 'submissions.user_id', '=', 'users.id')
                ->where('users.category', 'Student')
                ->count(),
            'professional' => Submission::join('users', 'submissions.user_id', '=', 'users.id')
                ->where('users.category', 'Professional')
                ->count(),
            'international' => Submission::join('users', 'submissions.user_id', '=', 'users.id')
                ->where('users.category', 'International Delegate')
                ->count(),
        ];

        // Submissions per topic by participant category (with presentation type breakdown)
        $submissionsPerTopicByParticipant = Submission::join('users', 'submissions.user_id', '=', 'users.id')
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
            ->map(function ($item) {
                return [
                    'topic' => $item->topic_name,
                    'count' => (int) $item->count,
                    'student_count' => (int) $item->student_count,
                    'professional_count' => (int) $item->professional_count,
                    'international_count' => (int) $item->international_count,
                    'oral_presentation_count' => (int) $item->oral_presentation_count,
                    'poster_presentation_count' => (int) $item->poster_presentation_count,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'analytics' => $analytics,
            'recentSubmissions' => $recentSubmissions,
            'pendingPayments' => $pendingPayments,
            'submissionsPerTopic' => $submissionsPerTopic,
            'participantStats' => $participantStats,
            'submissionsPerTopicByParticipant' => $submissionsPerTopicByParticipant,
        ]);
    }

    public function submissions()
    {
        $submissions = Submission::with(['user', 'reviews.reviewer', 'payment'])
            ->latest()
            ->get();

        $reviewers = User::whereRaw('LOWER(role) = ?', ['reviewer'])->get();

        return Inertia::render('Admin/Submissions', [
            'submissions' => $submissions,
            'reviewers' => $reviewers,
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
                return [
                    'ID' => $submission->id,
                    'Title' => $submission->title,
                    'Author' => $submission->author_full_name ?? $submission->user->name,
                    'Email' => $submission->corresponding_author_email ?? $submission->user->email,
                    'Phone' => $submission->user->whatsapp ?? 'N/A',
                    'Institute' => $submission->institute_organization ?? $submission->affiliation,
                    'Sub Theme' => $submission->paper_sub_theme ?? $submission->topic,
                    'Status' => $submission->status,
                    'Payment Status' => $submission->payment?->verified ? 'Paid' : 'Unpaid',
                    'Submitted At' => $submission->created_at->format('Y-m-d H:i:s'),
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

    public function payments()
    {
        $payments = Payment::with(['user', 'submission'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
        ]);
    }

    public function verifyPayment(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'verified' => true,
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Payment verified successfully!');
    }

    public function rejectPayment(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'verified' => false,
            'verified_at' => null,
        ]);

        return back()->with('success', 'Payment status reset successfully!');
    }

    public function users()
    {
        $users = User::latest()->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
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

    public function scores()
    {
        $submissions = Submission::with(['user', 'reviews.reviewer'])
            ->latest()
            ->get();

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
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
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
}
