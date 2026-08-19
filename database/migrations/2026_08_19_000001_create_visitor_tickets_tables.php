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
        // 1. Visitor Payments Table
        Schema::create('visitor_payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_code', 50)->unique();
            $table->enum('payment_method', ['qris_indo', 'foreign_bank_transfer', 'cash_onsite'])->default('qris_indo');
            $table->integer('total_members')->default(1);
            $table->decimal('price_per_ticket', 12, 2)->default(0);
            $table->integer('unique_code')->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('proof_of_payment')->nullable(); // Compressed image path
            $table->integer('original_file_size_kb')->nullable();
            $table->integer('compressed_file_size_kb')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 2. Visitor Tickets Table
        Schema::create('visitor_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->nullable()->constrained('visitor_payments')->nullOnDelete();
            $table->foreignId('registered_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('registration_source', ['online_self', 'admin_onsite'])->default('online_self');
            
            $table->string('visitor_name', 150);
            $table->string('visitor_email', 150);
            $table->string('visitor_phone', 50)->nullable();
            $table->string('visitor_institution', 150)->nullable();
            
            $table->string('ticket_code', 100)->unique();
            $table->enum('visitor_type', ['exclusive', 'non_exclusive'])->default('non_exclusive');
            $table->boolean('is_group_leader')->default(false);
            $table->string('group_code', 50)->nullable()->index();
            
            $table->enum('status', ['pending', 'active', 'cancelled'])->default('active');
            
            // Check-in Gate
            $table->boolean('checked_in')->default(false);
            $table->timestamp('checked_in_at')->nullable();
            $table->foreignId('checked_in_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            
            // Physical Lanyard / ID Card printing
            $table->boolean('card_printed')->default(false);
            $table->timestamp('card_printed_at')->nullable();
            $table->foreignId('card_printed_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_tickets');
        Schema::dropIfExists('visitor_payments');
    }
};
