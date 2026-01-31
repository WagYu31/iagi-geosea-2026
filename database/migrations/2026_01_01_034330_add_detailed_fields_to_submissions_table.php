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
        Schema::table('submissions', function (Blueprint $table) {
            // Add new fields
            $table->string('author_full_name')->after('user_id')->nullable();
            $table->string('co_author_1')->nullable();
            $table->string('co_author_2')->nullable();
            $table->string('co_author_3')->nullable();
            $table->string('co_author_4')->nullable();
            $table->string('co_author_5')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('corresponding_author_email')->nullable();
            $table->string('paper_sub_theme')->nullable();
            $table->text('abstract')->nullable();
            $table->string('layouting_file')->nullable();
            $table->string('editor_feedback_file')->nullable();
            $table->string('institute_organization')->nullable();
            $table->boolean('consent_agreed')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn([
                'author_full_name',
                'co_author_1',
                'co_author_2',
                'co_author_3',
                'co_author_4',
                'co_author_5',
                'mobile_number',
                'corresponding_author_email',
                'paper_sub_theme',
                'abstract',
                'layouting_file',
                'editor_feedback_file',
                'institute_organization',
                'consent_agreed',
            ]);
        });
    }
};
