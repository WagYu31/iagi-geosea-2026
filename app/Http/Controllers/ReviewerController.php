<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // Check if reviewer is assigned to this submission
        $review = Review::where('reviewer_id', $reviewerId)
            ->where('submission_id', $id)
            ->first();

        if (!$review) {
            abort(403, 'You are not assigned to review this submission.');
        }

        $submission = Submission::with(['user', 'reviews.reviewer'])->findOrFail($id);

        return Inertia::render('Submissions/View', [
            'submission' => $submission,
            'reviews' => $submission->reviews,
            'isReviewer' => true,
        ]);
    }

    public function submitReview(Request $request, $reviewId)
    {
        $request->validate([
            'originality_score' => 'required|integer|min:1|max:5',
            'relevance_score' => 'required|integer|min:1|max:5',
            'clarity_score' => 'required|integer|min:1|max:5',
            'methodology_score' => 'required|integer|min:1|max:5',
            'overall_score' => 'required|integer|min:1|max:5',
            'comments' => 'required|string',
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
            'comments' => $request->comments,
        ]);

        return back()->with('success', 'Review submitted successfully!');
    }
}
