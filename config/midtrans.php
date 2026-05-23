<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Midtrans Server Key
    |--------------------------------------------------------------------------
    */
    'server_key' => env('MIDTRANS_SERVER_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Client Key
    |--------------------------------------------------------------------------
    */
    'client_key' => env('MIDTRANS_CLIENT_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Production Mode
    |--------------------------------------------------------------------------
    */
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),

    /*
    |--------------------------------------------------------------------------
    | Sanitize Input
    |--------------------------------------------------------------------------
    */
    'is_sanitized' => true,

    /*
    |--------------------------------------------------------------------------
    | 3D Secure
    |--------------------------------------------------------------------------
    */
    'is_3ds' => true,

    /*
    |--------------------------------------------------------------------------
    | Snap URL
    |--------------------------------------------------------------------------
    */
    'snap_url' => env('MIDTRANS_IS_PRODUCTION', false)
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js',

    /*
    |--------------------------------------------------------------------------
    | Registration Fee Pricing
    |--------------------------------------------------------------------------
    |
    | Harga registrasi berdasarkan kategori peserta (submission.participant_category).
    | Key = nilai dari kolom `participant_category` di tabel submissions (lowercase).
    |
    */
    'pricing' => [
        'professional'  => 2500000,  // Professional and IAGI member
        'international' => 3000000,  // International Delegate (Non-IAGI)
        'student'       => 750000,   // Student
    ],

];
