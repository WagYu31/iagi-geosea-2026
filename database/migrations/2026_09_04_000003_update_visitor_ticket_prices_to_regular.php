<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $regularPrices = [
            'visitor_price_iagi_member_pro' => '3000000',
            'visitor_price_non_iagi_member_pro' => '4000000',
            'visitor_price_iagi_member_expat' => '6000000',
            'visitor_price_non_iagi_member_expat' => '7000000',
            'visitor_price_student' => '1000000',
            'visitor_ticket_price_iagi_member_professional' => '3000000',
            'visitor_ticket_price_non_iagi_member_professional' => '4000000',
            'visitor_ticket_price_iagi_member_expatriate' => '6000000',
            'visitor_ticket_price_non_iagi_member_expatriate' => '7000000',
            'visitor_ticket_price_student_undergraduate' => '1000000',
            'visitor_ticket_price_exclusive' => '500000',
            'visitor_ticket_price_non_exclusive' => '0',
        ];

        foreach ($regularPrices as $key => $val) {
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
