<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'comments_phase2')) {
                $table->text('comments_phase2')->nullable();
            }
            if (!Schema::hasColumn('reviews', 'recommendation_phase2')) {
                $table->string('recommendation_phase2')->nullable();
            }
            if (!Schema::hasColumn('reviews', 'recommendation')) {
                $table->string('recommendation')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'comments_phase2')) {
                $table->dropColumn('comments_phase2');
            }
            if (Schema::hasColumn('reviews', 'recommendation_phase2')) {
                $table->dropColumn('recommendation_phase2');
            }
        });
    }
};
