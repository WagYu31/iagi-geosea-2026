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
        if (!Schema::hasTable('activity_logs')) {
            Schema::create('activity_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('user_name', 150)->nullable();
                $table->string('user_email', 150)->nullable();
                $table->string('action', 80); // delete_ticket, bulk_delete_tickets, update_ticket, verify_payment, reject_payment, etc.
                $table->string('module', 60)->default('general'); // visitor_tickets, payments, submissions, users, settings
                $table->text('description');
                $table->unsignedBigInteger('target_id')->nullable();
                $table->string('target_code', 100)->nullable();
                $table->json('snapshot')->nullable(); // detailed snapshot of record before delete/update
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();

                $table->index(['action', 'created_at']);
                $table->index(['module', 'created_at']);
                $table->index('target_code');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
