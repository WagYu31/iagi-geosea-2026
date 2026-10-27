<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'Scanner' and 'Scaner' to the users role enum
        DB::statement("ALTER TABLE `users` MODIFY `role` ENUM('Admin','Reviewer','Author','Juri','Scanner','Scaner') NOT NULL DEFAULT 'Author'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `users` MODIFY `role` ENUM('Admin','Reviewer','Author','Juri') NOT NULL DEFAULT 'Author'");
    }
};
