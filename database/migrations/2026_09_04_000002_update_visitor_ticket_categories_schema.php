<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify visitor_type from ENUM to VARCHAR(100) to support all conference participant categories
        try {
            DB::statement("ALTER TABLE visitor_tickets MODIFY COLUMN visitor_type VARCHAR(100) NOT NULL DEFAULT 'non_exclusive'");
        } catch (\Throwable $e) {
            // Fallback for sqlite / non-mysql
        }

        // Add default setting prices for new categories if not exist
        $defaults = [
            'visitor_price_iagi_member_pro' => '2500000',
            'visitor_price_non_iagi_member_pro' => '3000000',
            'visitor_price_iagi_member_expat' => '5000000',
            'visitor_price_non_iagi_member_expat' => '6000000',
            'visitor_price_student' => '750000',
        ];

        foreach ($defaults as $key => $val) {
            DB::table('landing_page_settings')->updateOrInsert(
                ['key' => $key],
                [
                    'value' => $val,
                    'section' => 'visitor_tickets',
                    'type' => 'text',
                    'updated_at' => now(),
                ]
            );
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
