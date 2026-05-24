<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PdfAnnotation extends Model
{
    protected $fillable = [
        'review_id',
        'submission_id',
        'user_id',
        'page_number',
        'highlight_color',
        'selected_text',
        'comment',
        'position_data',
        'resolved',
    ];

    protected $casts = [
        'position_data' => 'array',
        'resolved' => 'boolean',
        'page_number' => 'integer',
    ];

    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
