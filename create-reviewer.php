<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create reviewer account
$reviewer = User::updateOrCreate(
    ['email' => 'reviewer@iagi-geosea2026.com'],
    [
        'name' => 'Dr. Reviewer IAGI',
        'email' => 'reviewer@iagi-geosea2026.com',
        'password' => Hash::make('reviewer123'),
        'role' => 'reviewer',
        'email_verified_at' => now(),
        'full_name' => 'Dr. Reviewer IAGI',
        'affiliation' => 'IAGI',
        'whatsapp' => '+628123456789',
        'category' => 'Professional',
    ]
);

echo "✅ Reviewer created successfully!\n\n";
echo "📋 Reviewer Account:\n";
echo "  - Name: {$reviewer->name}\n";
echo "  - Email: {$reviewer->email}\n";
echo "  - Password: reviewer123\n";
echo "  - Role: {$reviewer->role}\n\n";

// Also make admin assignable as reviewer
$admin = User::where('email', 'admin@iagi-geosea2026.com')->first();
if ($admin) {
    echo "📋 Admin can also be assigned as reviewer:\n";
    echo "  - Name: {$admin->name}\n";
    echo "  - Email: {$admin->email}\n";
}

echo "\n🔄 Now:\n";
echo "1. Refresh admin submissions page\n";
echo "2. Click 'Assign' button\n";
echo "3. You will see 'Dr. Reviewer IAGI' in the dropdown\n";
echo "4. Select and assign!\n";
