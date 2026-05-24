<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pdf_annotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained()->onDelete('cascade');
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('page_number')->unsigned();
            $table->string('highlight_color', 20)->default('yellow');
            $table->text('selected_text');
            $table->text('comment')->nullable();
            $table->json('position_data'); // Bounding rects for highlight positioning
            $table->boolean('resolved')->default(false);
            $table->timestamps();

            $table->index(['submission_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pdf_annotations');
    }
};
