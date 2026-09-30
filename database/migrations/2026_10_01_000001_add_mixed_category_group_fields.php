<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add fields for Mixed-Category Group Registration feature.
     *
     * visitor_payments: PIC info + mixed flag
     * visitor_tickets:  individual_price per ticket
     */
    public function up(): void
    {
        Schema::table('visitor_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('visitor_payments', 'is_mixed_category')) {
                $table->boolean('is_mixed_category')->default(false)->after('payment_method');
            }
            if (!Schema::hasColumn('visitor_payments', 'pic_name')) {
                $table->string('pic_name', 150)->nullable()->after('is_mixed_category');
            }
            if (!Schema::hasColumn('visitor_payments', 'pic_email')) {
                $table->string('pic_email', 150)->nullable()->after('pic_name');
            }
            if (!Schema::hasColumn('visitor_payments', 'pic_phone')) {
                $table->string('pic_phone', 50)->nullable()->after('pic_email');
            }
            if (!Schema::hasColumn('visitor_payments', 'pic_institution')) {
                $table->string('pic_institution', 150)->nullable()->after('pic_phone');
            }
        });

        Schema::table('visitor_tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('visitor_tickets', 'individual_price')) {
                $table->decimal('individual_price', 12, 2)->default(0)->after('visitor_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_payments', function (Blueprint $table) {
            $cols = ['is_mixed_category', 'pic_name', 'pic_email', 'pic_phone', 'pic_institution'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('visitor_payments', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::table('visitor_tickets', function (Blueprint $table) {
            if (Schema::hasColumn('visitor_tickets', 'individual_price')) {
                $table->dropColumn('individual_price');
            }
        });
    }
};
