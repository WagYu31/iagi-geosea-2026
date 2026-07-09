<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\PresentationScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JuriController extends Controller
{
    public function dashboard()
    {
        $juriId = Auth::id();

        // Get all presentation scores assigned to this juri
        $assignedScores = PresentationScore::where('juri_id', $juriId)
            ->with(['submission.user'])
            ->get();

        $analytics = [
            'totalAssigned' => $assignedScores->count(),
            'completed'     => $assignedScores->whereNotNull('weighted_final_score')->count(),
            'pending'       => $assignedScores->whereNull('weighted_final_score')->count(),
        ];

        return Inertia::render('Juri/Dashboard', [
            'analytics'          => $analytics,
            'recentAssignments'  => $assignedScores->sortByDesc('created_at')->take(5)->values(),
        ]);
    }

    public function submissions()
    {
        $juriId = Auth::id();

        // Get all submissions assigned to this juri via presentation_scores
        $scores = PresentationScore::where('juri_id', $juriId)
            ->with(['submission.user', 'submission.payment'])
            ->latest()
            ->get();

        return Inertia::render('Juri/Submissions', [
            'scores' => $scores,
        ]);
    }

    public function viewSubmission($id)
    {
        $juriId = Auth::id();

        // Ensure juri is assigned to this submission
        $presentationScore = PresentationScore::where('juri_id', $juriId)
            ->where('submission_id', $id)
            ->first();

        if (!$presentationScore) {
            abort(403, 'You are not assigned to score this submission.');
        }

        $submission = Submission::with(['user', 'presentationScores.juri'])->findOrFail($id);

        return Inertia::render('Juri/ScoreForm', [
            'submission'        => $submission,
            'presentationScore' => $presentationScore,
            'allScores'         => $submission->presentationScores,
            'oralWeights'       => PresentationScore::oralWeights(),
            'posterWeights'     => PresentationScore::posterWeights(),
        ]);
    }

    public function submitScoring(Request $request, $id)
    {
        $juriId = Auth::id();

        $presentationScore = PresentationScore::where('juri_id', $juriId)
            ->where('submission_id', $id)
            ->firstOrFail();

        $rubricType = $presentationScore->rubric_type;

        // Build validation rules based on rubric type
        $baseRules = [
            'manuscript_substantiation' => 'required|integer|min:1|max:10',
            'manuscript_writing'        => 'required|integer|min:1|max:10',
            'juri_notes'                => 'nullable|string|max:5000',
        ];

        if ($rubricType === 'oral') {
            $rules = array_merge($baseRules, [
                'time_management'            => 'required|integer|min:1|max:10',
                'posture_professionalism'     => 'required|integer|min:1|max:10',
                'communication_skills'        => 'required|integer|min:1|max:10',
                'scientific_substantiation'   => 'required|integer|min:1|max:10',
                'technical_contribution'      => 'required|integer|min:1|max:10',
                'logical_organization'        => 'required|integer|min:1|max:10',
                'visual_quality'              => 'required|integer|min:1|max:10',
                'originality_innovation'      => 'required|integer|min:1|max:10',
            ]);
        } else {
            $rules = array_merge($baseRules, [
                'poster_scientific_substantiation' => 'required|integer|min:1|max:10',
                'practical_usefulness'             => 'required|integer|min:1|max:10',
                'poster_technical_contribution'    => 'required|integer|min:1|max:10',
                'poster_organization_design'       => 'required|integer|min:1|max:10',
                'poster_originality'               => 'required|integer|min:1|max:10',
                'presentation_explanation'         => 'required|integer|min:1|max:10',
                'subject_knowledge'                => 'required|integer|min:1|max:10',
            ]);
        }

        $validated = $request->validate($rules);

        // Update scores
        $presentationScore->update($validated);

        // Calculate and save weighted final score
        $presentationScore->calculateWeightedScore();

        return back()->with('success', 'Scores submitted successfully! Final Score: ' . $presentationScore->weighted_final_score);
    }
}
