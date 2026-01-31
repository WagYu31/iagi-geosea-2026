<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create test user if not exists
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        // Create admin user if not exists
        if (!User::where('email', 'admin@iagi-geosea2026.com')->exists()) {
            User::create([
                'name' => 'Admin IAGI',
                'email' => 'admin@iagi-geosea2026.com',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'role' => 'Admin',
            ]);
        }
    }
}
