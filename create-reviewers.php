<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create 4 reviewer accounts
$reviewers = [
    [
        'name' => 'Dr. John Smith',
        'email' => 'reviewer1@iagi-geosea.com',
        'password' => Hash::make('password123'),
        'role' => 'reviewer',
        'email_verified_at' => now(),
    ],
    [
        'name' => 'Prof. Maria Garcia',
        'email' => 'reviewer2@iagi-geosea.com',
        'password' => Hash::make('password123'),
        'role' => 'reviewer',
        'email_verified_at' => now(),
    ],
    [
        'name' => 'Dr. Ahmad Rahman',
        'email' => 'reviewer3@iagi-geosea.com',
        'password' => Hash::make('password123'),
        'role' => 'reviewer',
        'email_verified_at' => now(),
    ],
    [
        'name' => 'Dr. Sarah Chen',
        'email' => 'reviewer4@iagi-geosea.com',
        'password' => Hash::make('password123'),
        'role' => 'reviewer',
        'email_verified_at' => now(),
    ],
];

echo "Creating 4 reviewer accounts...\n\n";

foreach ($reviewers as $reviewerData) {
    // Check if user already exists
    $existing = User::where('email', $reviewerData['email'])->first();

    if ($existing) {
        echo "✓ User {$reviewerData['email']} already exists\n";
        echo "  Updating role to 'reviewer'...\n";
        $existing->update(['role' => 'reviewer']);
    } else {
        $user = User::create($reviewerData);
        echo "✓ Created reviewer: {$reviewerData['name']} ({$reviewerData['email']})\n";
    }
}

echo "\n===========================================\n";
echo "SUCCESS! 4 Reviewer accounts are ready\n";
echo "===========================================\n\n";

echo "Login Credentials:\n";
echo "-------------------\n";
foreach ($reviewers as $reviewer) {
    echo "Email: {$reviewer['email']}\n";
    echo "Password: password123\n";
    echo "-------------------\n";
}

echo "\nYou can now assign these reviewers to submissions!\n";
