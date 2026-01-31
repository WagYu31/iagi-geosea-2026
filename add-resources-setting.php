<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\LandingPageSetting;

// Default resources
$resources = [
    [
        'title' => 'Oral Presentation Template',
        'description' => 'PowerPoint template for oral presentations',
        'file' => '/templates/oral-template.pptx',
        'type' => 'pptx'
    ],
    [
        'title' => 'Poster Presentation Template',
        'description' => 'Template for poster presentations',
        'file' => '/templates/poster-template.pptx',
        'type' => 'pptx'
    ],
    [
        'title' => 'Seminar Guidelines',
        'description' => 'Guidelines and instructions for submissions',
        'file' => '/templates/seminar-template.txt',
        'type' => 'txt'
    ],
];

// Check if resources setting already exists
$existing = LandingPageSetting::where('key', 'resources')->first();

if ($existing) {
    echo "Resources setting already exists. Updating...\n";
    $existing->update([
        'value' => json_encode($resources),
        'type' => 'json'
    ]);
} else {
    echo "Creating resources setting...\n";
    LandingPageSetting::create([
        'section' => 'resources',
        'key' => 'resources',
        'value' => json_encode($resources),
        'type' => 'json'
    ]);
}

echo "Resources setting has been added successfully!\n";
echo "Default resources:\n";
foreach ($resources as $resource) {
    echo "- {$resource['title']} ({$resource['file']})\n";
}
