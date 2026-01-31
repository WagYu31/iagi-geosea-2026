<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes to submissions table for faster queries (safe check)
        DB::statement('CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_submissions_code ON submissions(submission_code)');

        // Add indexes to users table
        DB::statement('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');

        // Add indexes to payments table  
        DB::statement('CREATE INDEX IF NOT EXISTS idx_payments_submission ON payments(submission_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex('idx_submissions_user_id');
            $table->dropIndex('idx_submissions_status');
            $table->dropIndex('idx_submissions_created_at');
            $table->dropIndex('idx_submissions_code');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_email');
            $table->dropIndex('idx_users_role');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('idx_payments_submission');
            $table->dropIndex('idx_payments_status');
        });
    }
};
