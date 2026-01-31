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
        // Change ENUM to VARCHAR to accept longer values like "Oral Presentation" and "Poster Presentation"
        DB::statement("ALTER TABLE submissions MODIFY COLUMN presentation_preference VARCHAR(255) NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to ENUM
        DB::statement("ALTER TABLE submissions MODIFY COLUMN presentation_preference ENUM('Oral', 'Poster') NOT NULL");
    }
};
