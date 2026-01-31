<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Create sponsors setting with default data
$defaultSponsors = [
    ['name' => 'Sponsor 1', 'level' => 'Platinum', 'logo' => null],
    ['name' => 'Sponsor 2', 'level' => 'Gold', 'logo' => null],
    ['name' => 'Sponsor 3', 'level' => 'Gold', 'logo' => null],
    ['name' => 'Sponsor 4', 'level' => 'Silver', 'logo' => null],
    ['name' => 'Sponsor 5', 'level' => 'Silver', 'logo' => null],
];

$setting = \App\Models\LandingPageSetting::create([
    'key' => 'sponsors',
    'value' => json_encode($defaultSponsors),
    'type' => 'json',
    'section' => 'sponsors',
    'description' => 'Conference sponsors list'
]);

echo "✅ Sponsors setting added successfully!\n";
echo "ID: " . $setting->id . "\n";
echo "Key: " . $setting->key . "\n";
echo "Default sponsors: " . count($defaultSponsors) . " sponsors\n";
echo "You can now manage sponsors from Admin Settings.\n";
