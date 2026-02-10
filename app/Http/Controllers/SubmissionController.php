<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Setting;
use App\Mail\SubmissionConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Block unverified Authors from accessing My Submissions
        if ((!$user->role || $user->role === 'Author') && !$user->email_verified_at) {
            return redirect()->route('dashboard')->with('error', 'Your account has not been verified yet. Please wait for admin verification before accessing submissions.');
        }

        $submissions = $user->submissions()->with('reviews.reviewer')->get();

        // Backfill participant_category from user's category for older submissions
        $categoryMap = [
            'Student' => 'student',
            'Professional' => 'professional',
            'International Delegate' => 'international',
        ];
        foreach ($submissions as $submission) {
            if (!$submission->participant_category && $user->category) {
                $submission->participant_category = $categoryMap[$user->category] ?? null;
            }
        }

        $submissionStatus = Setting::getSubmissionStatus();

        return Inertia::render('Submissions/Index', [
            'submissions' => $submissions,
            'submissionStatus' => $submissionStatus,
        ]);
    }

    public function show($id)
    {
        $submission = Auth::user()->submissions()->with('reviews.reviewer')->findOrFail($id);

        return Inertia::render('Submissions/View', [
            'submission' => $submission,
            'reviews' => $submission->reviews,
        ]);
    }

    public function update(Request $request, $id)
    {
        $submission = Auth::user()->submissions()->findOrFail($id);

        // Check if user is allowed to edit (only for revision required statuses)
        $allowedStatuses = ['revision_required_phase1', 'revision_required_phase2', 'pending'];
        if (!in_array($submission->status, $allowedStatuses)) {
            return back()->withErrors(['error' => 'You cannot edit this submission at its current status.']);
        }

        $validated = $request->validate([
            'author_full_name' => 'required|string|max:255',
            'co_author_1' => 'nullable|string|max:255',
            'co_author_1_institute' => 'nullable|string|max:255',
            'co_author_2' => 'nullable|string|max:255',
            'co_author_2_institute' => 'nullable|string|max:255',
            'co_author_3' => 'nullable|string|max:255',
            'co_author_3_institute' => 'nullable|string|max:255',
            'co_author_4' => 'nullable|string|max:255',
            'co_author_4_institute' => 'nullable|string|max:255',
            'co_author_5' => 'nullable|string|max:255',
            'co_author_5_institute' => 'nullable|string|max:255',
            'mobile_number' => 'required|string|max:20',
            'corresponding_author_email' => 'required|email|max:255',
            'paper_sub_theme' => 'required|string|max:255',
            'paper_theme' => 'nullable|string|max:255',
            'category_submission' => 'required|string|max:255',
            'participant_category' => 'required|in:student,professional,international',
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'required|string|max:500',
            'institute_organization' => 'required|string|max:255',
            'full_paper_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'layouting_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'editor_feedback_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Handle file uploads
        if ($request->hasFile('full_paper_file')) {
            // Delete old file if exists
            if ($submission->full_paper_file && Storage::disk('public')->exists($submission->full_paper_file)) {
                Storage::disk('public')->delete($submission->full_paper_file);
            }
            $validated['full_paper_file'] = $request->file('full_paper_file')->store('submissions/papers', 'public');
        }

        if ($request->hasFile('layouting_file')) {
            if ($submission->layouting_file && Storage::disk('public')->exists($submission->layouting_file)) {
                Storage::disk('public')->delete($submission->layouting_file);
            }
            $validated['layouting_file'] = $request->file('layouting_file')->store('submissions/layouting', 'public');
        }

        if ($request->hasFile('editor_feedback_file')) {
            if ($submission->editor_feedback_file && Storage::disk('public')->exists($submission->editor_feedback_file)) {
                Storage::disk('public')->delete($submission->editor_feedback_file);
            }
            $validated['editor_feedback_file'] = $request->file('editor_feedback_file')->store('submissions/feedback', 'public');
        }

        // Update status back to under_review if it was revision required
        if (in_array($submission->status, ['revision_required_phase1', 'revision_required_phase2'])) {
            $validated['status'] = 'under_review';
        }

        $submission->update($validated);

        return redirect()->route('submissions.show', $id)->with('success', 'Submission updated successfully!');
    }

    public function store(Request $request)
    {
        // Check if submission is open
        if (!Setting::isSubmissionOpen()) {
            return back()->withErrors(['error' => 'Submission is currently closed or deadline has passed.']);
        }

        $request->validate([
            'author_full_name' => 'required|string|max:255',
            'co_author_1' => 'nullable|string|max:255',
            'co_author_1_institute' => 'nullable|string|max:255',
            'co_author_2' => 'nullable|string|max:255',
            'co_author_2_institute' => 'nullable|string|max:255',
            'co_author_3' => 'nullable|string|max:255',
            'co_author_3_institute' => 'nullable|string|max:255',
            'co_author_4' => 'nullable|string|max:255',
            'co_author_4_institute' => 'nullable|string|max:255',
            'co_author_5' => 'nullable|string|max:255',
            'co_author_5_institute' => 'nullable|string|max:255',
            'mobile_number' => 'required|string|max:20',
            'corresponding_author_email' => 'required|email|max:255',
            'paper_sub_theme' => 'required|string|max:255',
            'paper_theme' => 'nullable|string|max:255',
            'category_submission' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'required|string|max:500',
            'layouting_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'editor_feedback_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'full_paper_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'institute_organization' => 'required|string|max:255',
            'consent_agreed' => 'required|accepted',
            'participant_category' => 'required|in:student,professional,international',
        ]);

        // Generate submission code with database lock to prevent race conditions
        $participantCode = match($request->participant_category) {
            'student' => 'S',
            'professional' => 'P',
            'international' => 'I',
        };

        $presentationCode = str_starts_with($request->category_submission, 'Oral') ? 'O' : 'P';
        $prefix = $participantCode . $presentationCode . 'IG';

        // Store files before transaction (no need to lock for this)
        $layoutingPath = null;
        $editorFeedbackPath = null;
        $fullPaperPath = null;

        if ($request->hasFile('layouting_file')) {
            $layoutingPath = $request->file('layouting_file')->store('submissions/layouting', 'public');
        }

        if ($request->hasFile('editor_feedback_file')) {
            $editorFeedbackPath = $request->file('editor_feedback_file')->store('submissions/feedback', 'public');
        }

        if ($request->hasFile('full_paper_file')) {
            $fullPaperPath = $request->file('full_paper_file')->store('submissions/papers', 'public');
        }

        // Use database transaction with lock to prevent duplicate submission codes
        $submission = DB::transaction(function () use ($request, $prefix, $layoutingPath, $editorFeedbackPath, $fullPaperPath) {
            // Lock the rows with this prefix to prevent concurrent reads
            $lastSubmission = Submission::where('submission_code', 'LIKE', $prefix . '-%')
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            if ($lastSubmission && $lastSubmission->submission_code) {
                $lastNumber = (int) substr($lastSubmission->submission_code, -3);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $submissionCode = $prefix . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

            return Submission::create([
                'user_id' => Auth::id(),
                'author_full_name' => $request->author_full_name,
                'co_author_1' => $request->co_author_1,
                'co_author_1_institute' => $request->co_author_1_institute,
                'co_author_2' => $request->co_author_2,
                'co_author_2_institute' => $request->co_author_2_institute,
                'co_author_3' => $request->co_author_3,
                'co_author_3_institute' => $request->co_author_3_institute,
                'co_author_4' => $request->co_author_4,
                'co_author_4_institute' => $request->co_author_4_institute,
                'co_author_5' => $request->co_author_5,
                'co_author_5_institute' => $request->co_author_5_institute,
                'mobile_number' => $request->mobile_number,
                'corresponding_author_email' => $request->corresponding_author_email,
                'paper_sub_theme' => $request->paper_sub_theme,
                'paper_theme' => $request->paper_theme,
                'category_submission' => $request->category_submission,
                'title' => $request->title,
                'abstract' => $request->abstract,
                'keywords' => $request->keywords,
                'layouting_file' => $layoutingPath,
                'editor_feedback_file' => $editorFeedbackPath,
                'full_paper_file' => $fullPaperPath,
                'institute_organization' => $request->institute_organization,
                'consent_agreed' => $request->consent_agreed,
                'status' => 'pending',
                'topic' => $request->paper_sub_theme,
                'affiliation' => $request->institute_organization,
                'whatsapp_number' => $request->mobile_number,
                'presentation_preference' => $request->category_submission ?? 'Oral Presentation',
                'participant_category' => $request->participant_category,
                'submission_code' => $submissionCode,
            ]);
        });

        // Send confirmation email to author (queued for async processing)
        try {
            $authorName = $request->author_full_name;
            $authorEmail = $request->corresponding_author_email;
            
            Mail::to($authorEmail)->queue(new SubmissionConfirmation($submission, $authorName));
        } catch (\Exception $e) {
            // Log error but don't fail submission
            Log::error('Failed to queue submission confirmation email: ' . $e->getMessage());
        }

        return back()->with('success', 'Paper submitted successfully!');
    }

    public function downloadTemplate()
    {
        $path = 'templates/submission_template.docx';

        if (Storage::disk('public')->exists($path)) {
            return response()->download(storage_path('app/public/' . $path));
        }

        abort(404);
    }

    public function revise(Request $request, Submission $submission)
    {
        // Ensure user owns the submission
        if ($submission->user_id !== Auth::id()) {
            abort(403);
        }

        // Ensure submission requires revision
        if ($submission->status !== 'Revision Required') {
            return back()->withErrors(['error' => 'This submission does not require revision.']);
        }

        $request->validate([
            'revised_abstract' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'revised_paper' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'comments' => 'required|string|max:1000',
        ]);

        // Store revised files
        $revisedAbstractPath = null;
        $revisedPaperPath = null;

        if ($request->hasFile('revised_abstract')) {
            $revisedAbstractPath = $request->file('revised_abstract')->store('submissions/revisions', 'public');
        }

        if ($request->hasFile('revised_paper')) {
            $revisedPaperPath = $request->file('revised_paper')->store('submissions/revisions', 'public');
        }

        // Update submission with revision
        $submission->update([
            'status' => 'Under Review',
            'revision_comments' => $request->comments,
            'revised_abstract_path' => $revisedAbstractPath,
            'revised_paper_path' => $revisedPaperPath,
            'revised_at' => now(),
        ]);

        return back()->with('success', 'Revision submitted successfully!');
    }
}
