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
        Schema::table('reviews', function (Blueprint $table) {
            $table->integer('originality_score')->unsigned()->nullable()->change();
            $table->integer('relevance_score')->unsigned()->nullable()->change();
            $table->integer('clarity_score')->unsigned()->nullable()->change();
            $table->integer('methodology_score')->unsigned()->nullable()->change();
            $table->integer('overall_score')->unsigned()->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->integer('originality_score')->unsigned()->nullable(false)->change();
            $table->integer('relevance_score')->unsigned()->nullable(false)->change();
            $table->integer('clarity_score')->unsigned()->nullable(false)->change();
            $table->integer('methodology_score')->unsigned()->nullable(false)->change();
            $table->integer('overall_score')->unsigned()->nullable(false)->change();
        });
    }
};
