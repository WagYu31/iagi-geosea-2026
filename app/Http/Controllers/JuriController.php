<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\PresentationScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
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

        $completedScores = $assignedScores->whereNotNull('weighted_final_score')->where('is_draft', false);
        $averageScore = $completedScores->count() > 0 ? round($completedScores->avg('weighted_final_score'), 2) : null;
        $oralCount = $assignedScores->where('rubric_type', 'oral')->count();
        $posterCount = $assignedScores->where('rubric_type', 'poster')->count();

        $analytics = [
            'totalAssigned' => $assignedScores->count(),
            'completed'     => $completedScores->count(),
            'pending'       => $assignedScores->whereNull('weighted_final_score')->count(),
            'averageScore'  => $averageScore,
            'oralCount'     => $oralCount,
            'posterCount'   => $posterCount,
        ];

        return Inertia::render('Juri/Dashboard', [
            'analytics'          => $analytics,
            'recentAssignments'  => $assignedScores->sortByDesc('created_at')->values(),
        ]);
    }

    public function submissions()
    {
        $juriId = Auth::id();

        // Get all submissions assigned to this juri via presentation_scores,
        // and include fellow assigned judges on the same submission!
        $scores = PresentationScore::where('juri_id', $juriId)
            ->with([
                'submission.user',
                'submission.payment',
                'submission.presentationScores' => function ($query) {
                    $query->with('juri:id,name,email');
                },
            ])
            ->latest()
            ->get();

        return Inertia::render('Juri/Submissions', [
            'scores'        => $scores,
            'currentJuriId' => $juriId,
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

        $submission = Submission::with([
            'user',
            'presentationScores' => function ($query) {
                $query->with('juri:id,name,email');
            },
        ])->findOrFail($id);

        return Inertia::render('Juri/ScoreForm', [
            'submission'        => $submission,
            'presentationScore' => $presentationScore,
            'allScores'         => $submission->presentationScores,
            'currentJuriId'     => $juriId,
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
        $isDraft = $request->input('action') === 'draft' || $request->boolean('is_draft');

        // Validation rules: if saving as draft, numeric scores are optional (nullable)
        $scoreRule = $isDraft ? 'nullable|integer|min:1|max:10' : 'required|integer|min:1|max:10';
        $baseRules = [
            'manuscript_substantiation' => $scoreRule,
            'manuscript_writing'        => $scoreRule,
            'juri_notes'                => 'nullable|string|max:5000',
            'is_nominated_best'         => 'nullable|boolean',
            'nomination_category'       => 'nullable|string|max:100',
        ];

        if ($rubricType === 'oral') {
            $rules = array_merge($baseRules, [
                'time_management'            => $scoreRule,
                'posture_professionalism'     => $scoreRule,
                'communication_skills'        => $scoreRule,
                'scientific_substantiation'   => $scoreRule,
                'technical_contribution'      => $scoreRule,
                'logical_organization'        => $scoreRule,
                'visual_quality'              => $scoreRule,
                'originality_innovation'      => $scoreRule,
            ]);
        } else {
            $rules = array_merge($baseRules, [
                'poster_scientific_substantiation' => $scoreRule,
                'practical_usefulness'             => $scoreRule,
                'poster_technical_contribution'    => $scoreRule,
                'poster_organization_design'       => $scoreRule,
                'poster_originality'               => $scoreRule,
                'presentation_explanation'         => $scoreRule,
                'subject_knowledge'                => $scoreRule,
            ]);
        }

        $validated = $request->validate($rules);

        // Update scores
        $presentationScore->fill($validated);

        if (Schema::hasColumn('presentation_scores', 'is_draft')) {
            $presentationScore->is_draft = $isDraft;
        }

        if (Schema::hasColumn('presentation_scores', 'is_nominated_best')) {
            $presentationScore->is_nominated_best = $request->boolean('is_nominated_best');
            $presentationScore->nomination_category = $request->input('nomination_category') ?: ($rubricType === 'oral' ? 'Best Oral Presentation' : 'Best Poster Presentation');
        }

        if ($isDraft) {
            $presentationScore->save();
            return back()->with('success', 'Draft penilaian berhasil disimpan! Anda dapat melanjutkan kapan saja.');
        }

        // Final official submission
        $presentationScore->save();
        $presentationScore->calculateWeightedScore();

        return back()->with('success', 'Penilaian resmi berhasil dikirim! Nilai Akhir: ' . $presentationScore->weighted_final_score);
    }
}
