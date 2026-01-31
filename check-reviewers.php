<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "🔍 Checking Reviewers in Database...\n\n";

// Get all reviewers
$reviewers = User::where('role', 'reviewer')->get();

if ($reviewers->count() === 0) {
    echo "❌ NO REVIEWERS FOUND!\n";
    echo "Run: php create-reviewer.php\n";
} else {
    echo "✅ Found {$reviewers->count()} reviewer(s):\n\n";
    foreach ($reviewers as $reviewer) {
        echo "  📋 Reviewer #{$reviewer->id}\n";
        echo "     Name: {$reviewer->name}\n";
        echo "     Email: {$reviewer->email}\n";
        echo "     Role: {$reviewer->role}\n";
        echo "     Created: {$reviewer->created_at}\n\n";
    }
}

// Check admin
$admin = User::where('email', 'admin@iagi-geosea2026.com')->first();
if ($admin) {
    echo "👤 Admin Account:\n";
    echo "   Name: {$admin->name}\n";
    echo "   Email: {$admin->email}\n";
    echo "   Role: {$admin->role}\n\n";
}

// Check all users by role
echo "📊 All Users by Role:\n";
$roles = User::select('role', \DB::raw('count(*) as total'))
    ->groupBy('role')
    ->get();

foreach ($roles as $role) {
    echo "   {$role->role}: {$role->total}\n";
}

echo "\n✅ If reviewer exists above, refresh admin page with Ctrl+Shift+R\n";
