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
        // 1. Add 'Juri' to the users role enum
        DB::statement("ALTER TABLE `users` MODIFY `role` ENUM('Admin','Reviewer','Author','Juri') NOT NULL DEFAULT 'Author'");

        // 2. Create the presentation_scores table
        Schema::create('presentation_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('juri_id')->constrained('users')->onDelete('cascade');
            $table->enum('rubric_type', ['oral', 'poster']);

            // ── Oral: A. Presentation Delivery (30%) ──
            $table->unsignedTinyInteger('time_management')->nullable();           // 5%
            $table->unsignedTinyInteger('posture_professionalism')->nullable();    // 10%
            $table->unsignedTinyInteger('communication_skills')->nullable();       // 15%

            // ── Oral: B. Presentation Content (50%) ──
            $table->unsignedTinyInteger('scientific_substantiation')->nullable();  // 15%
            $table->unsignedTinyInteger('technical_contribution')->nullable();     // 10%
            $table->unsignedTinyInteger('logical_organization')->nullable();       // 10%
            $table->unsignedTinyInteger('visual_quality')->nullable();             // 5%
            $table->unsignedTinyInteger('originality_innovation')->nullable();     // 10%

            // ── Poster: A. Poster Quality (55%) ──
            $table->unsignedTinyInteger('poster_scientific_substantiation')->nullable(); // 15%
            $table->unsignedTinyInteger('practical_usefulness')->nullable();             // 10%
            $table->unsignedTinyInteger('poster_technical_contribution')->nullable();    // 10%
            $table->unsignedTinyInteger('poster_organization_design')->nullable();       // 10%
            $table->unsignedTinyInteger('poster_originality')->nullable();               // 10%

            // ── Poster: B. Presenter Quality (25%) ──
            $table->unsignedTinyInteger('presentation_explanation')->nullable();  // 10%
            $table->unsignedTinyInteger('subject_knowledge')->nullable();         // 15%

            // ── Shared: C. Manuscript Quality (20%) ──
            $table->unsignedTinyInteger('manuscript_substantiation')->nullable(); // 10%
            $table->unsignedTinyInteger('manuscript_writing')->nullable();         // 10%

            // ── Computed / Meta ──
            $table->decimal('weighted_final_score', 4, 2)->nullable();
            $table->text('juri_notes')->nullable();
            $table->timestamps();

            // Prevent duplicate: one juri can only score one submission once
            $table->unique(['submission_id', 'juri_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_scores');

        // Revert role enum
        DB::statement("ALTER TABLE `users` MODIFY `role` ENUM('Admin','Reviewer','Author') NOT NULL DEFAULT 'Author'");
    }
};
