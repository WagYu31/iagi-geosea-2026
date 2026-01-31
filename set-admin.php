<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Try to find admin user
$user = App\Models\User::where('email', 'admin@iagi-geosea2026.com')->first();

if (!$user) {
    // If not found, try first user
    $user = App\Models\User::first();
}

if ($user) {
    $user->role = 'admin'; // lowercase 'admin' NOT 'Admin'
    $user->save();

    echo "✅ SUCCESS!\n";
    echo "IMPORTANT: Role set to lowercase 'admin' (not 'Admin')\n";
    echo "User set as admin:\n";
    echo "Name: {$user->name}\n";
    echo "Email: {$user->email}\n";
    echo "Role: {$user->role}\n";
    echo "\nSekarang:\n";
    echo "1. Logout dari aplikasi: http://localhost/logout\n";
    echo "2. Login kembali dengan:\n";
    echo "   Email: {$user->email}\n";
    echo "   Password: (password Anda)\n";
    echo "3. Akses: http://localhost/admin/dashboard\n";
    echo "4. Sidebar akan menampilkan menu admin\n";
} else {
    echo "❌ No users found in database!\n";
}
