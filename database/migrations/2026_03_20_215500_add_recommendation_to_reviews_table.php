<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'recommendation')) {
                $table->string('recommendation')->nullable()->after('comments');
            }
            if (!Schema::hasColumn('reviews', 'phase')) {
                $table->unsignedTinyInteger('phase')->default(1)->after('recommendation');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['recommendation', 'phase']);
        });
    }
};
