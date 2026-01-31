<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key
     */
    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value by key
     */
    public static function set($key, $value)
    {
        return static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /**
     * Check if submission is currently open
     */
    public static function isSubmissionOpen()
    {
        $enabled = static::get('submission_enabled', '1');
        if ($enabled !== '1') {
            return false;
        }

        $start = static::get('submission_deadline_start');
        $end = static::get('submission_deadline_end');
        $now = now();

        if ($start && $now->lt(Carbon::parse($start))) {
            return false; // Not started yet
        }

        if ($end && $now->gt(Carbon::parse($end))) {
            return false; // Already ended
        }

        return true;
    }

    /**
     * Get submission status with message
     */
    public static function getSubmissionStatus()
    {
        $enabled = static::get('submission_enabled', '1');
        if ($enabled !== '1') {
            return [
                'open' => false,
                'message' => 'Submission is currently disabled by administrator.'
            ];
        }

        $start = static::get('submission_deadline_start');
        $end = static::get('submission_deadline_end');
        $now = now();

        if ($start && $now->lt(Carbon::parse($start))) {
            return [
                'open' => false,
                'message' => 'Submission will open on ' . Carbon::parse($start)->format('d M Y, H:i') . ' WIB',
                'startDate' => $start,
                'endDate' => $end,
            ];
        }

        if ($end && $now->gt(Carbon::parse($end))) {
            return [
                'open' => false,
                'message' => 'Submission deadline has passed on ' . Carbon::parse($end)->format('d M Y, H:i') . ' WIB',
                'startDate' => $start,
                'endDate' => $end,
            ];
        }

        return [
            'open' => true,
            'message' => $end ? 'Deadline: ' . Carbon::parse($end)->format('d M Y, H:i') . ' WIB' : 'Submission is open',
            'startDate' => $start,
            'endDate' => $end,
        ];
    }
}
