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
        try {
            DB::statement("ALTER TABLE visitor_tickets MODIFY COLUMN registration_source VARCHAR(50) NOT NULL DEFAULT 'online_self'");
        } catch (\Throwable $e) {
            // Fallback for sqlite / non-mysql
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            DB::statement("ALTER TABLE visitor_tickets MODIFY COLUMN registration_source ENUM('online_self', 'admin_onsite') NOT NULL DEFAULT 'online_self'");
        } catch (\Throwable $e) {
            //
        }
    }
};

