<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('landing');

// Public API for landing page settings (must be outside auth middleware)
Route::get('/api/landing-settings', [App\Http\Controllers\LandingPageSettingController::class, 'getPublicSettings']);
Route::get('/download/resource/{index}', [App\Http\Controllers\LandingPageSettingController::class, 'downloadResource'])->name('download.resource');

Route::get('/dashboard', function () {
    $user = Auth::user();

    // Redirect reviewers to their specific dashboard
    if (strtolower($user->role) === 'reviewer') {
        return redirect()->route('reviewer.dashboard');
    }

    // Redirect admins to their specific dashboard
    if (strtolower($user->role) === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    $submissions = $user->submissions()
        ->with(['payment', 'reviews'])
        ->get()
        ->map(function ($submission) {
            $submission->payment_status = $submission->payment?->verified ? 'paid' : 'unpaid';
            
            // Calculate average of all 5 categories per reviewer
            $validReviews = $submission->reviews->filter(fn($r) => $r->overall_score !== null);
            if ($validReviews->count() > 0) {
                $submission->score = $validReviews->avg(function($r) {
                    return (
                        ($r->originality_score ?? 0) +
                        ($r->relevance_score ?? 0) +
                        ($r->clarity_score ?? 0) +
                        ($r->methodology_score ?? 0) +
                        ($r->overall_score ?? 0)
                    ) / 5;
                });
            } else {
                $submission->score = null;
            }
            
            return $submission;
        });

    return Inertia::render('Dashboard', [
        'user' => $user,
        'submissions' => $submissions,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Test route
    Route::get('/test-admin', function () {
        return Inertia::render('TestAdmin');
    })->name('test.admin');

    // Profile routes
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');

    // Submissions routes
    Route::get('/submissions', [App\Http\Controllers\SubmissionController::class, 'index'])->name('submissions.index');
    Route::get('/submissions/{id}', [App\Http\Controllers\SubmissionController::class, 'show'])->name('submissions.show');
    Route::post('/submissions', [App\Http\Controllers\SubmissionController::class, 'store'])->name('submissions.store');
    Route::post('/submissions/{id}', [App\Http\Controllers\SubmissionController::class, 'update'])->name('submissions.update');

    // Payments routes
    Route::get('/payments', function () {
        $user = Auth::user();
        $submissions = $user->submissions()->get();

        // Get payments with submission relationship
        $payments = App\Models\Payment::where('user_id', $user->id)
            ->with('submission')
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'submissions' => $submissions,
        ]);
    })->name('payments.index');
    Route::post('/payments', [App\Http\Controllers\PaymentController::class, 'store'])->name('payments.store');
    Route::delete('/payments/{id}', [App\Http\Controllers\PaymentController::class, 'destroy'])->name('payments.destroy');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');

        // Submissions Management
        Route::get('/submissions', [App\Http\Controllers\AdminController::class, 'submissions'])->name('submissions');
        Route::patch('/submissions/{id}/status', [App\Http\Controllers\AdminController::class, 'updateSubmissionStatus'])->name('submissions.updateStatus');
        Route::post('/submissions/bulk-update', [App\Http\Controllers\AdminController::class, 'bulkUpdateStatus'])->name('submissions.bulkUpdate');
        Route::post('/submissions/{id}/assign-reviewer', [App\Http\Controllers\AdminController::class, 'assignReviewer'])->name('submissions.assignReviewer');
        Route::delete('/submissions/{submissionId}/reviewer/{reviewerId}', [App\Http\Controllers\AdminController::class, 'removeReviewer'])->name('submissions.removeReviewer');
        Route::delete('/submissions/{id}', [App\Http\Controllers\AdminController::class, 'deleteSubmission'])->name('submissions.delete');
        Route::get('/submissions/export', [App\Http\Controllers\AdminController::class, 'exportSubmissions'])->name('submissions.export');
        Route::get('/export', [App\Http\Controllers\AdminController::class, 'exportSubmissions'])->name('export');

        // Payments Management
        Route::get('/payments', [App\Http\Controllers\AdminController::class, 'payments'])->name('payments');
        Route::patch('/payments/{id}/verify', [App\Http\Controllers\AdminController::class, 'verifyPayment'])->name('payments.verify');
        Route::patch('/payments/{id}/reject', [App\Http\Controllers\AdminController::class, 'rejectPayment'])->name('payments.reject');

        // Users Management
        Route::get('/users', [App\Http\Controllers\AdminController::class, 'users'])->name('users');
        Route::post('/users', [App\Http\Controllers\AdminController::class, 'createUser'])->name('users.create');
        Route::patch('/users/{id}/role', [App\Http\Controllers\AdminController::class, 'updateUserRole'])->name('users.updateRole');
        Route::patch('/users/{id}/password', [App\Http\Controllers\AdminController::class, 'updatePassword'])->name('users.updatePassword');
        Route::patch('/users/{id}/toggle-verification', [App\Http\Controllers\AdminController::class, 'toggleVerification'])->name('users.toggleVerification');
        Route::delete('/users/{id}', [App\Http\Controllers\AdminController::class, 'deleteUser'])->name('users.delete');

        // Scores Management
        Route::get('/scores', [App\Http\Controllers\AdminController::class, 'scores'])->name('scores');

        // Landing Page Settings
        Route::get('/settings', [App\Http\Controllers\LandingPageSettingController::class, 'index'])->name('settings');
        Route::post('/settings', [App\Http\Controllers\LandingPageSettingController::class, 'store'])->name('settings.store');
        Route::patch('/settings/{setting}', [App\Http\Controllers\LandingPageSettingController::class, 'update'])->name('settings.update');
        Route::post('/settings/upload-speaker-photo', [App\Http\Controllers\LandingPageSettingController::class, 'uploadSpeakerPhoto'])->name('settings.uploadSpeakerPhoto');
        Route::post('/settings/upload-sponsor-logo', [App\Http\Controllers\LandingPageSettingController::class, 'uploadSponsorLogo'])->name('settings.uploadSponsorLogo');
        Route::post('/settings/upload-resource-file', [App\Http\Controllers\LandingPageSettingController::class, 'uploadResourceFile'])->name('settings.uploadResourceFile');
        Route::post('/settings/save-resources', [App\Http\Controllers\LandingPageSettingController::class, 'saveResources'])->name('settings.saveResources');
        Route::post('/settings/save-timeline', [App\Http\Controllers\LandingPageSettingController::class, 'saveTimeline'])->name('settings.saveTimeline');
        Route::post('/settings/upload-hero-background', [App\Http\Controllers\LandingPageSettingController::class, 'uploadHeroBackground'])->name('settings.uploadHeroBackground');
        Route::post('/settings/save-hero-text', [App\Http\Controllers\LandingPageSettingController::class, 'saveHeroText'])->name('settings.saveHeroText');
        Route::post('/settings/upload-hero-logo', [App\Http\Controllers\LandingPageSettingController::class, 'uploadHeroLogo'])->name('settings.uploadHeroLogo');
        Route::post('/settings/upload-hero-logo-secondary', [App\Http\Controllers\LandingPageSettingController::class, 'uploadHeroLogoSecondary'])->name('settings.uploadHeroLogoSecondary');
        Route::post('/settings/delete-hero-logo-secondary', [App\Http\Controllers\LandingPageSettingController::class, 'deleteHeroLogoSecondary'])->name('settings.deleteHeroLogoSecondary');


        // Submission Settings (Deadline Control) - Update only, displayed in Settings tabs
        Route::post('/submission-settings', [App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('submission.settings.update');

        // Email/SMTP Settings
        Route::get('/email-settings', function () {
            return Inertia::render('Admin/EmailSettings');
        })->name('email.settings.page');
        Route::get('/email-settings/data', [App\Http\Controllers\AdminController::class, 'getEmailSettings'])->name('email.settings');
        Route::post('/email-settings', [App\Http\Controllers\AdminController::class, 'saveEmailSettings'])->name('email.save');
        Route::post('/email-test', [App\Http\Controllers\AdminController::class, 'testEmail'])->name('email.test');
    });

    // Reviewer routes
    Route::middleware(['role:reviewer'])->prefix('reviewer')->name('reviewer.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\ReviewerController::class, 'dashboard'])->name('dashboard');

        // Assigned Submissions
        Route::get('/submissions', [App\Http\Controllers\ReviewerController::class, 'submissions'])->name('submissions');
        Route::get('/submissions/{id}', [App\Http\Controllers\ReviewerController::class, 'viewSubmission'])->name('submissions.view');
        Route::post('/reviews/{id}/submit', [App\Http\Controllers\ReviewerController::class, 'submitReview'])->name('reviews.submit');
    });
});
