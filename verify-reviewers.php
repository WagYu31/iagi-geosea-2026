<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== Verify All Reviewers ===\n\n";

// Get all unverified reviewers
$reviewers = User::whereRaw('LOWER(role) = ?', ['reviewer'])
    ->whereNull('email_verified_at')
    ->get();

if ($reviewers->isEmpty()) {
    echo "✓ All reviewers are already verified!\n";
    exit(0);
}

echo "Found " . $reviewers->count() . " unverified reviewers:\n\n";

foreach ($reviewers as $reviewer) {
    echo "Verifying: {$reviewer->name} ({$reviewer->email})\n";

    $reviewer->email_verified_at = now();
    $reviewer->save();

    echo "  ✓ Verified!\n\n";
}

echo "\n=== Summary ===\n";
echo "Total reviewers verified: " . $reviewers->count() . "\n";
echo "\nAll reviewers are now verified!\n";
