<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Insert map_embed_url setting
$setting = \App\Models\LandingPageSetting::create([
    'key' => 'map_embed_url',
    'value' => 'https://www.google.com/maps?q=Universitas+Pembangunan+Nasional+Veteran+Yogyakarta&output=embed&z=17',
    'type' => 'string',
    'section' => 'contact',
    'description' => 'Google Maps Embed URL for location'
]);

echo "✅ Map setting added successfully!\n";
echo "ID: " . $setting->id . "\n";
echo "Key: " . $setting->key . "\n";
echo "You can now update the map URL from Admin Settings.\n";
