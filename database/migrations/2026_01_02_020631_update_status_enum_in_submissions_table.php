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
        // For MySQL, we need to alter the enum column
        DB::statement("ALTER TABLE submissions MODIFY COLUMN status ENUM('pending', 'under_review', 'revision_required_phase1', 'revision_required_phase2', 'accepted', 'rejected') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE submissions MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'revision') DEFAULT 'pending'");
    }
};
