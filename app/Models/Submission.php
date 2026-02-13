<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'co_authors',
        'topic',
        'affiliation',
        'whatsapp_number',
        'abstract_file',
        'full_paper_file',
        'status',
        'presentation_preference',
        // New fields
        'author_full_name',
        'co_author_1',
        'co_author_1_institute',
        'co_author_2',
        'co_author_2_institute',
        'co_author_3',
        'co_author_3_institute',
        'co_author_4',
        'co_author_4_institute',
        'co_author_5',
        'co_author_5_institute',
        'mobile_number',
        'corresponding_author_email',
        'paper_theme',
        'paper_sub_theme',
        'abstract',
        'layouting_file',
        'editor_feedback_file',
        'institute_organization',
        'consent_agreed',
        'keywords',
        'category_submission',
        'category',
        'participant_category',
        'submission_code',
        'publication_option',
        'preferred_publication',
        'deletion_requested_at',
        'deletion_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
