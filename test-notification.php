<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Submission;
use App\Services\WhatsAppNotificationService;

echo "=== Testing WhatsApp Notification ===\n\n";

// Get a submission with user data
$submission = Submission::with('user')->first();

if (!$submission) {
    echo "❌ No submissions found in database!\n";
    exit(1);
}

if (!$submission->user) {
    echo "❌ Submission has no user!\n";
    exit(1);
}

if (!$submission->user->whatsapp) {
    echo "❌ User has no WhatsApp number!\n";
    echo "User: {$submission->user->name} ({$submission->user->email})\n";
    exit(1);
}

echo "📱 Testing notification for:\n";
echo "   User: {$submission->user->name}\n";
echo "   Email: {$submission->user->email}\n";
echo "   Phone: {$submission->user->whatsapp}\n";
echo "   Submission ID: {$submission->id}\n";
echo "   Title: {$submission->title}\n";
echo "   Status: {$submission->status}\n\n";

// Create notification service
$whatsappService = new WhatsAppNotificationService();

// Test with "accepted" status for a happy message
echo "🚀 Sending test notification with 'accepted' status...\n\n";

$result = $whatsappService->sendSubmissionStatusNotification(
    $submission->user,
    $submission,
    'accepted'
);

if ($result) {
    echo "✅ Notification sent successfully!\n\n";
    echo "Check:\n";
    echo "1. User's WhatsApp: {$submission->user->whatsapp}\n";
    echo "2. Logs: storage/logs/laravel.log\n";
} else {
    echo "❌ Failed to send notification!\n\n";
    echo "Check logs: storage/logs/laravel.log\n";
}

echo "\n=== Test Complete ===\n";
