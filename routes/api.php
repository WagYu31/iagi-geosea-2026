<?php

use App\Http\Controllers\Api\BadgeApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - PIT IAGI & GEOSEA XIX 2026
|--------------------------------------------------------------------------
|
| Dedicated REST API endpoints for On-Site Badge & ID Card Printing Vendors.
|
*/

// Version 1 routes: /api/v1/badges/...
Route::prefix('v1/badges')->group(function () {
    // 1. Bulk participants
    Route::get('/participants', [BadgeApiController::class, 'index'])->name('api.v1.badges.participants');

    // 2. Search single participant by ticket code (barcode/QR) or numeric ID
    Route::get('/search', [BadgeApiController::class, 'search'])->name('api.v1.badges.search');
    Route::get('/participant/{code_or_id}', [BadgeApiController::class, 'show'])->name('api.v1.badges.show');

    // 3. Callback mark card printed
    Route::post('/mark-printed', [BadgeApiController::class, 'markPrinted'])->name('api.v1.badges.markPrinted');

    // 4. Gate check-in
    Route::post('/checkin', [BadgeApiController::class, 'checkIn'])->name('api.v1.badges.checkin');

    // 5. Metadata categories & templates
    Route::get('/categories', [BadgeApiController::class, 'categories'])->name('api.v1.badges.categories');
});

// Shortcut alias routes without v1 prefix: /api/badges/...
Route::prefix('badges')->group(function () {
    Route::get('/participants', [BadgeApiController::class, 'index'])->name('api.badges.participants');
    Route::get('/search', [BadgeApiController::class, 'search'])->name('api.badges.search');
    Route::get('/participant/{code_or_id}', [BadgeApiController::class, 'show'])->name('api.badges.show');
    Route::post('/mark-printed', [BadgeApiController::class, 'markPrinted'])->name('api.badges.markPrinted');
    Route::post('/checkin', [BadgeApiController::class, 'checkIn'])->name('api.badges.checkin');
    Route::get('/categories', [BadgeApiController::class, 'categories'])->name('api.badges.categories');
});
