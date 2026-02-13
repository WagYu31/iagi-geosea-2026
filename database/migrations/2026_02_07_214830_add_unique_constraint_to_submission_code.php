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
        // Fix any NULL or empty submission_code values with unique placeholders
        $nullRows = DB::table('submissions')
            ->whereNull('submission_code')
            ->orWhere('submission_code', '')
            ->get();

        foreach ($nullRows as $row) {
            DB::table('submissions')
                ->where('id', $row->id)
                ->update(['submission_code' => 'LEGACY-' . str_pad($row->id, 5, '0', STR_PAD_LEFT)]);
        }

        try {
            Schema::table('submissions', function (Blueprint $table) {
                $table->unique('submission_code');
            });
        } catch (\Exception $e) {
            // Unique constraint already exists, skip
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropUnique(['submission_code']);
        });
    }
};
