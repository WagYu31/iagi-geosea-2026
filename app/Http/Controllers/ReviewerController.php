<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Review;
use App\Models\PdfAnnotation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    public function dashboard()
    {
        $reviewerId = Auth::id();

        // Get all reviews assigned to this reviewer
        $assignedReviews = Review::where('reviewer_id', $reviewerId)
            ->with(['submission.user', 'submission.payment'])
            ->get();

        $analytics = [
            'totalAssigned' => $assignedReviews->count(),
            'completed' => $assignedReviews->whereNotNull('originality_score')->count(),
            'pending' => $assignedReviews->whereNull('originality_score')->count(),
        ];

        return Inertia::render('Reviewer/Dashboard', [
            'analytics' => $analytics,
            'recentAssignments' => $assignedReviews->take(5),
        ]);
    }

    public function submissions()
    {
        $reviewerId = Auth::id();

        // Get all submissions assigned to this reviewer
        $reviews = Review::where('reviewer_id', $reviewerId)
            ->with(['submission.user', 'submission.payment'])
            ->latest()
            ->get();

        return Inertia::render('Reviewer/Submissions', [
            'reviews' => $reviews,
        ]);
    }

    public function viewSubmission($id)
    {
        $reviewerId = Auth::id();

        $review = Review::where('reviewer_id', $reviewerId)
            ->where('submission_id', $id)
            ->first();

        if (!$review) {
            abort(403, 'You are not assigned to review this submission.');
        }

        $submission = Submission::with(['user', 'reviews.reviewer'])->findOrFail($id);
        $isPhase2 = in_array($submission->status, ['revision_required_phase2']);

        // Get all annotations for this submission (from all reviewers)
        $annotations = PdfAnnotation::where('submission_id', $id)
            ->with('user:id,name')
            ->orderBy('page_number')
            ->orderBy('created_at')
            ->get();

        // Convert DOCX to PDF for review (if applicable)
        $previewPdfUrl = null;
        $fullPaperFile = $submission->full_paper_file;
        if ($fullPaperFile && preg_match('/\.(docx?)$/i', $fullPaperFile)) {
            $previewPdfUrl = $this->getOrConvertToPdf($fullPaperFile);
        }

        return Inertia::render('Submissions/View', [
            'submission' => $submission,
            'reviews' => $submission->reviews,
            'isReviewer' => true,
            'isPhase2' => $isPhase2,
            'annotations' => $annotations,
            'currentReviewId' => $review->id,
            'previewPdfUrl' => $previewPdfUrl,
        ]);
    }

    // Submit scores only
    public function submitScoring(Request $request, $reviewId)
    {
        $request->validate([
            'originality_score' => 'required|integer|min:1|max:5',
            'relevance_score' => 'required|integer|min:1|max:5',
            'clarity_score' => 'required|integer|min:1|max:5',
            'methodology_score' => 'required|integer|min:1|max:5',
            'overall_score' => 'required|integer|min:1|max:5',
        ]);

        $review = Review::where('id', $reviewId)
            ->where('reviewer_id', Auth::id())
            ->firstOrFail();

        $review->update([
            'originality_score' => $request->originality_score,
            'relevance_score' => $request->relevance_score,
            'clarity_score' => $request->clarity_score,
            'methodology_score' => $request->methodology_score,
            'overall_score' => $request->overall_score,
        ]);

        return back()->with('success', 'Scores submitted successfully!');
    }

    // Submit comments + recommendation
    public function submitComment(Request $request, $reviewId)
    {
        $request->validate([
            'comments' => 'required|string',
            'recommendation' => 'nullable|string|max:255',
        ]);

        $review = Review::where('id', $reviewId)
            ->where('reviewer_id', Auth::id())
            ->with('submission')
            ->firstOrFail();

        $isPhase2 = in_array($review->submission->status, ['revision_required_phase2']);

        if ($isPhase2) {
            $review->update([
                'comments_phase2' => $request->comments,
                'recommendation_phase2' => $request->recommendation,
            ]);
        } else {
            $review->update([
                'comments' => $request->comments,
                'recommendation' => $request->recommendation,
            ]);
        }

        return back()->with('success', 'Review comment submitted successfully!');
    }

    // ── PDF Annotation CRUD ──

    public function storeAnnotation(Request $request, $submissionId)
    {
        $request->validate([
            'page_number' => 'required|integer|min:1',
            'highlight_color' => 'required|string|in:yellow,red,green,blue',
            'selected_text' => 'required|string',
            'comment' => 'nullable|string|max:2000',
            'position_data' => 'required|array',
        ]);

        $reviewerId = Auth::id();
        $review = Review::where('reviewer_id', $reviewerId)
            ->where('submission_id', $submissionId)
            ->firstOrFail();

        $annotation = PdfAnnotation::create([
            'review_id' => $review->id,
            'submission_id' => $submissionId,
            'user_id' => $reviewerId,
            'page_number' => $request->page_number,
            'highlight_color' => $request->highlight_color,
            'selected_text' => $request->selected_text,
            'comment' => $request->comment,
            'position_data' => $request->position_data,
        ]);

        return response()->json($annotation->load('user:id,name'), 201);
    }

    public function updateAnnotation(Request $request, $annotationId)
    {
        $annotation = PdfAnnotation::where('id', $annotationId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $request->validate([
            'comment' => 'nullable|string|max:2000',
            'resolved' => 'nullable|boolean',
            'highlight_color' => 'nullable|string|in:yellow,red,green,blue',
        ]);

        $annotation->update($request->only(['comment', 'resolved', 'highlight_color']));

        return response()->json($annotation->load('user:id,name'));
    }

    public function deleteAnnotation($annotationId)
    {
        $annotation = PdfAnnotation::where('id', $annotationId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $annotation->delete();

        return response()->json(['message' => 'Annotation deleted']);
    }

    /**
     * Convert a DOCX file to PDF using LibreOffice and cache the result.
     * Returns the public URL of the converted PDF, or null on failure.
     */
    private function getOrConvertToPdf(string $storagePath): ?string
    {
        $fullPath = storage_path('app/public/' . $storagePath);

        if (!file_exists($fullPath)) {
            Log::warning('DOCX file not found for conversion: ' . $fullPath);
            return null;
        }

        // Build the expected PDF path (same dir, .pdf extension)
        $pdfPath = preg_replace('/\.(docx?)$/i', '.pdf', $storagePath);
        $pdfFullPath = storage_path('app/public/' . $pdfPath);

        // Return cached PDF if it exists and is newer than the source
        if (file_exists($pdfFullPath) && filemtime($pdfFullPath) >= filemtime($fullPath)) {
            return '/storage/' . $pdfPath;
        }

        // Convert using LibreOffice
        $outputDir = dirname($pdfFullPath);
        $command = sprintf(
            'libreoffice --headless --convert-to pdf --outdir %s %s 2>&1',
            escapeshellarg($outputDir),
            escapeshellarg($fullPath)
        );

        $output = [];
        $exitCode = 0;
        exec($command, $output, $exitCode);

        if ($exitCode !== 0 || !file_exists($pdfFullPath)) {
            Log::error('LibreOffice DOCX→PDF conversion failed', [
                'command' => $command,
                'exit_code' => $exitCode,
                'output' => implode("\n", $output),
            ]);
            return null;
        }

        Log::info('DOCX converted to PDF: ' . $pdfPath);
        return '/storage/' . $pdfPath;
    }
}
