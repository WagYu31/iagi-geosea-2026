<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('visitor_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('visitor_payments', 'receipt_no')) {
                $table->string('receipt_no', 150)->nullable()->after('payment_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_payments', function (Blueprint $table) {
            if (Schema::hasColumn('visitor_payments', 'receipt_no')) {
                $table->dropColumn('receipt_no');
            }
        });
    }
};
