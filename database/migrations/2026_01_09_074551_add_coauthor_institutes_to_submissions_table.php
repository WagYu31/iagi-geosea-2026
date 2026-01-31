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
            $table->string('co_author_1_institute')->nullable()->after('co_author_1');
            $table->string('co_author_2_institute')->nullable()->after('co_author_2');
            $table->string('co_author_3_institute')->nullable()->after('co_author_3');
            $table->string('co_author_4_institute')->nullable()->after('co_author_4');
            $table->string('co_author_5_institute')->nullable()->after('co_author_5');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn([
                'co_author_1_institute',
                'co_author_2_institute',
                'co_author_3_institute',
                'co_author_4_institute',
                'co_author_5_institute',
            ]);
        });
    }
};
