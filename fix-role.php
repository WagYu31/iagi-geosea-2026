<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Update using Eloquent to force save
$user = App\Models\User::where('email', 'admin@iagi-geosea2026.com')->first();
if ($user) {
    $oldRole = $user->role;
    $user->role = 'admin';
    $user->save();
    echo "✅ Updated {$user->name}: '{$oldRole}' → 'admin'\n";
} else {
    echo "❌ User not found\n";
}

// Verify
$admins = App\Models\User::where('role', 'admin')->get();
echo "\n📋 Admin users:\n";
foreach ($admins as $admin) {
    echo "  - {$admin->name} ({$admin->email}) → role: {$admin->role}\n";
}

echo "\n🔄 Now:\n";
echo "1. Logout: http://127.0.0.1:8000/logout\n";
echo "2. Close browser completely\n";
echo "3. Open browser again\n";
echo "4. Login with: admin@iagi-geosea2026.com / admin123\n";
echo "5. Sidebar will show admin menu!\n";
