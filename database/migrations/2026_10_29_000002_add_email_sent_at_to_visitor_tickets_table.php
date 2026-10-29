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
        Schema::table('visitor_tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('visitor_tickets', 'email_sent_at')) {
                $table->timestamp('email_sent_at')->nullable()->after('card_printed_by_admin_id');
            }
            if (!Schema::hasColumn('visitor_tickets', 'email_sent_count')) {
                $table->unsignedInteger('email_sent_count')->default(0)->after('email_sent_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_tickets', function (Blueprint $table) {
            if (Schema::hasColumn('visitor_tickets', 'email_sent_count')) {
                $table->dropColumn('email_sent_count');
            }
            if (Schema::hasColumn('visitor_tickets', 'email_sent_at')) {
                $table->dropColumn('email_sent_at');
            }
        });
    }
};
