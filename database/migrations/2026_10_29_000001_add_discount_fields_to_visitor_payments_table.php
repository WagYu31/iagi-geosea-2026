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
            if (!Schema::hasColumn('visitor_payments', 'discount_type')) {
                $table->string('discount_type', 20)->default('none')->after('total_amount');
            }
            if (!Schema::hasColumn('visitor_payments', 'discount_value')) {
                $table->decimal('discount_value', 12, 2)->default(0)->after('discount_type');
            }
            if (!Schema::hasColumn('visitor_payments', 'discount_amount')) {
                $table->decimal('discount_amount', 12, 2)->default(0)->after('discount_value');
            }
            if (!Schema::hasColumn('visitor_payments', 'discount_notes')) {
                $table->string('discount_notes', 255)->nullable()->after('discount_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_payments', function (Blueprint $table) {
            if (Schema::hasColumn('visitor_payments', 'discount_notes')) {
                $table->dropColumn('discount_notes');
            }
            if (Schema::hasColumn('visitor_payments', 'discount_amount')) {
                $table->dropColumn('discount_amount');
            }
            if (Schema::hasColumn('visitor_payments', 'discount_value')) {
                $table->dropColumn('discount_value');
            }
            if (Schema::hasColumn('visitor_payments', 'discount_type')) {
                $table->dropColumn('discount_type');
            }
        });
    }
};
