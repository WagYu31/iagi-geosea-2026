<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresentationScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'juri_id',
        'rubric_type',
        // Oral: Delivery (A)
        'time_management',
        'posture_professionalism',
        'communication_skills',
        // Oral: Content (B)
        'scientific_substantiation',
        'technical_contribution',
        'logical_organization',
        'visual_quality',
        'originality_innovation',
        // Poster: Poster Quality (A)
        'poster_scientific_substantiation',
        'practical_usefulness',
        'poster_technical_contribution',
        'poster_organization_design',
        'poster_originality',
        // Poster: Presenter Quality (B)
        'presentation_explanation',
        'subject_knowledge',
        // Shared: Manuscript (C)
        'manuscript_substantiation',
        'manuscript_writing',
        // Meta
        'weighted_final_score',
        'juri_notes',
    ];

    protected $casts = [
        'weighted_final_score' => 'decimal:2',
    ];

    // ── Relationships ──

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function juri()
    {
        return $this->belongsTo(User::class, 'juri_id');
    }

    // ── Weight Maps ──

    /**
     * Oral rubric weights (total = 1.0)
     */
    public static function oralWeights(): array
    {
        return [
            // A. Presentation Delivery (30%)
            'time_management'            => 0.05,
            'posture_professionalism'     => 0.10,
            'communication_skills'        => 0.15,
            // B. Presentation Content (50%)
            'scientific_substantiation'   => 0.15,
            'technical_contribution'      => 0.10,
            'logical_organization'        => 0.10,
            'visual_quality'              => 0.05,
            'originality_innovation'      => 0.10,
            // C. Manuscript Quality (20%)
            'manuscript_substantiation'   => 0.10,
            'manuscript_writing'          => 0.10,
        ];
    }

    /**
     * Poster rubric weights (total = 1.0)
     */
    public static function posterWeights(): array
    {
        return [
            // A. Poster Quality (55%)
            'poster_scientific_substantiation' => 0.15,
            'practical_usefulness'             => 0.10,
            'poster_technical_contribution'    => 0.10,
            'poster_organization_design'       => 0.10,
            'poster_originality'               => 0.10,
            // B. Presenter Quality (25%)
            'presentation_explanation'         => 0.10,
            'subject_knowledge'                => 0.15,
            // C. Manuscript Quality (20%)
            'manuscript_substantiation'        => 0.10,
            'manuscript_writing'               => 0.10,
        ];
    }

    /**
     * Calculate and save the weighted final score.
     * Returns the computed score (1.0 – 10.0).
     */
    public function calculateWeightedScore(): float
    {
        $weights = $this->rubric_type === 'oral'
            ? self::oralWeights()
            : self::posterWeights();

        $score = 0.0;
        $allFilled = true;

        foreach ($weights as $field => $weight) {
            $value = $this->{$field};
            if ($value === null) {
                $allFilled = false;
                continue;
            }
            $score += $value * $weight;
        }

        // Only save if all required fields are filled
        if ($allFilled) {
            $this->weighted_final_score = round($score, 2);
            $this->save();
        }

        return round($score, 2);
    }

    /**
     * Get the score interpretation label.
     */
    public static function getInterpretation(float $score): string
    {
        if ($score >= 9.0) return 'Outstanding';
        if ($score >= 8.0) return 'Excellent';
        if ($score >= 7.0) return 'Very Good';
        if ($score >= 6.0) return 'Good';
        if ($score >= 5.0) return 'Fair';
        return 'Needs Improvement';
    }
}
