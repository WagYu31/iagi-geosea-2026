<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\LandingPageSetting;

// Default timeline
$timeline = [
    [
        'title' => 'Registration Opens',
        'date' => 'January 18, 2026',
        'status' => 'completed'
    ],
    [
        'title' => 'Abstract Submission',
        'date' => 'February 28, 2026',
        'status' => 'active'
    ],
    [
        'title' => 'Early Bird Deadline',
        'date' => 'April 30, 2026',
        'status' => 'upcoming'
    ],
    [
        'title' => 'Final Registration',
        'date' => 'June 30, 2026',
        'status' => 'upcoming'
    ],
    [
        'title' => 'Conference Date',
        'date' => 'August 15-17, 2026',
        'status' => 'upcoming'
    ],
];

// Check if timeline setting already exists
$existing = LandingPageSetting::where('key', 'timeline')->first();

if ($existing) {
    echo "Timeline setting already exists. Updating...\n";
    $existing->update([
        'value' => json_encode($timeline),
        'type' => 'json'
    ]);
} else {
    echo "Creating timeline setting...\n";
    LandingPageSetting::create([
        'section' => 'timeline',
        'key' => 'timeline',
        'value' => json_encode($timeline),
        'type' => 'json'
    ]);
}

echo "Timeline setting has been added successfully!\n";
echo "Default timeline:\n";
foreach ($timeline as $item) {
    echo "- {$item['title']} ({$item['date']}) - Status: {$item['status']}\n";
}
