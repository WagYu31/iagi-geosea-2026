<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    protected $fillable = [
        'ip_address',
        'user_agent',
        'page',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];
}
