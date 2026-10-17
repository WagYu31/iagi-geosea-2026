<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations to update the admin WhatsApp number.
     */
    public function up(): void
    {
        DB::table('users')
            ->where('role', 'admin')
            ->where(function ($query) {
                $query->whereNull('whatsapp')
                    ->orWhere('whatsapp', '')
                    ->orWhere('whatsapp', 'like', '%8212226504%');
            })
            ->update(['whatsapp' => '085771593522']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down migration needed
    }
};
