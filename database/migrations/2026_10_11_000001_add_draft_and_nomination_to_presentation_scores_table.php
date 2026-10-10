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
        Schema::table('presentation_scores', function (Blueprint $table) {
            if (!Schema::hasColumn('presentation_scores', 'is_draft')) {
                $table->boolean('is_draft')->default(false)->after('weighted_final_score');
            }
            if (!Schema::hasColumn('presentation_scores', 'is_nominated_best')) {
                $table->boolean('is_nominated_best')->default(false)->after('is_draft');
            }
            if (!Schema::hasColumn('presentation_scores', 'nomination_category')) {
                $table->string('nomination_category', 100)->nullable()->after('is_nominated_best');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_scores', function (Blueprint $table) {
            if (Schema::hasColumn('presentation_scores', 'nomination_category')) {
                $table->dropColumn('nomination_category');
            }
            if (Schema::hasColumn('presentation_scores', 'is_nominated_best')) {
                $table->dropColumn('is_nominated_best');
            }
            if (Schema::hasColumn('presentation_scores', 'is_draft')) {
                $table->dropColumn('is_draft');
            }
        });
    }
};
