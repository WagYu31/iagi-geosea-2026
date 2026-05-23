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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('snap_token')->nullable()->after('amount');
            $table->string('order_id')->nullable()->unique()->after('snap_token');
            $table->string('payment_type')->nullable()->after('order_id');
            $table->string('transaction_id')->nullable()->after('payment_type');
            $table->string('status')->default('pending')->after('transaction_id');
            $table->timestamp('paid_at')->nullable()->after('status');
            $table->json('midtrans_response')->nullable()->after('paid_at');
            // Make payment_proof_url nullable for Midtrans payments (no proof needed)
            $table->string('payment_proof_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'snap_token',
                'order_id',
                'payment_type',
                'transaction_id',
                'status',
                'paid_at',
                'midtrans_response',
            ]);
        });
    }
};
