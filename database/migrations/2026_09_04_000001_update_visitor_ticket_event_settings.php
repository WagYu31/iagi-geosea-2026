<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('landing_page_settings')->updateOrInsert(
            ['key' => 'visitor_event_date'],
            [
                'value' => '3-5 November 2026',
                'section' => 'visitor_tickets',
                'type' => 'text',
                'updated_at' => now(),
            ]
        );

        DB::table('landing_page_settings')->updateOrInsert(
            ['key' => 'visitor_event_venue'],
            [
                'value' => 'Royal Ambarrukmo Yogyakarta',
                'section' => 'visitor_tickets',
                'type' => 'text',
                'updated_at' => now(),
            ]
        );

        try {
            Cache::forget('landing-page-settings');
        } catch (\Throwable $e) {
            // ignore
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
