<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::where('email', 'reviewer@iagi-geosea2026.com')->first();

if ($user) {
    echo "Email: " . $user->email . "\n";
    echo "Role: '" . $user->role . "'\n";
    echo "Role lowercase: '" . strtolower($user->role) . "'\n";
    echo "Role === 'reviewer': " . ($user->role === 'reviewer' ? 'TRUE' : 'FALSE') . "\n";
    echo "Role === 'Reviewer': " . ($user->role === 'Reviewer' ? 'TRUE' : 'FALSE') . "\n";
} else {
    echo "User not found!\n";
}
