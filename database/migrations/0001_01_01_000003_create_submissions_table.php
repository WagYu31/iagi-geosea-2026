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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('co_authors')->nullable();
            $table->string('topic'); // e.g., Petroleum, Geothermal, etc.
            $table->string('affiliation');
            $table->string('whatsapp_number');
            $table->string('abstract_file')->nullable();
            $table->string('full_paper_file')->nullable();
            $table->enum('status', ['pending', 'under_review', 'revision_required_phase1', 'revision_required_phase2', 'accepted', 'rejected'])->default('pending');
            $table->enum('presentation_preference', ['Oral', 'Poster']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
