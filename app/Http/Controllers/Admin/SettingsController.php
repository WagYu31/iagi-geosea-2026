<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page
     */
    public function index()
    {
        $settings = [
            'submission_deadline_start' => Setting::get('submission_deadline_start'),
            'submission_deadline_end' => Setting::get('submission_deadline_end'),
            'submission_enabled' => Setting::get('submission_enabled', '1'),
        ];

        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'submission_deadline_start' => 'nullable|date',
            'submission_deadline_end' => 'nullable|date|after_or_equal:submission_deadline_start',
            'submission_enabled' => 'required|boolean',
        ]);

        Setting::set('submission_deadline_start', $request->submission_deadline_start);
        Setting::set('submission_deadline_end', $request->submission_deadline_end);
        Setting::set('submission_enabled', $request->submission_enabled ? '1' : '0');

        return back()->with('success', 'Settings updated successfully!');
    }
}
