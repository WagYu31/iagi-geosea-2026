<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify payment_method from ENUM to VARCHAR(100) to support 'bank_transfer', 'cash_onsite', etc.
        try {
            DB::statement("ALTER TABLE visitor_payments MODIFY COLUMN payment_method VARCHAR(100) NOT NULL DEFAULT 'bank_transfer'");
        } catch (\Throwable $e) {
            // Fallback for sqlite / non-mysql
            Schema::table('visitor_payments', function (Blueprint $table) {
                $table->string('payment_method', 100)->default('bank_transfer')->change();
            });
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
