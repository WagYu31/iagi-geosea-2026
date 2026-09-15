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
            if (!Schema::hasColumn('visitor_payments', 'is_debt')) {
                $table->boolean('is_debt')->default(false)->after('status');
            }
            if (!Schema::hasColumn('visitor_payments', 'debt_notes')) {
                $table->text('debt_notes')->nullable()->after('is_debt');
            }
            if (!Schema::hasColumn('visitor_payments', 'debt_settled_at')) {
                $table->timestamp('debt_settled_at')->nullable()->after('debt_notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_payments', function (Blueprint $table) {
            if (Schema::hasColumn('visitor_payments', 'is_debt')) {
                $table->dropColumn('is_debt');
            }
            if (Schema::hasColumn('visitor_payments', 'debt_notes')) {
                $table->dropColumn('debt_notes');
            }
            if (Schema::hasColumn('visitor_payments', 'debt_settled_at')) {
                $table->dropColumn('debt_settled_at');
            }
        });
    }
};
