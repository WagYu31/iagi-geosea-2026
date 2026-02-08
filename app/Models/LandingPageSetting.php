<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class LandingPageSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'section',
        'description'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto-clear cache when settings change
        static::saved(function () {
            Cache::forget('landing-page-settings');
        });

        static::deleted(function () {
            Cache::forget('landing-page-settings');
        });
    }
}
