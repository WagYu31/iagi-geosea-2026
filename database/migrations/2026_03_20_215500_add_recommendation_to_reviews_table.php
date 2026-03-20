<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop phase column if it exists (separate call to avoid MySQL issues)
        if (Schema::hasColumn('reviews', 'phase')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropColumn('phase');
            });
        }

        // Add new columns
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'recommendation')) {
                $table->string('recommendation')->nullable()->after('comments');
            }
            if (!Schema::hasColumn('reviews', 'comments_phase2')) {
                $table->text('comments_phase2')->nullable()->after('recommendation');
            }
            if (!Schema::hasColumn('reviews', 'recommendation_phase2')) {
                $table->string('recommendation_phase2')->nullable()->after('comments_phase2');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['recommendation', 'comments_phase2', 'recommendation_phase2']);
        });
    }
};
