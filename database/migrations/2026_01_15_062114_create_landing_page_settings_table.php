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
        Schema::create('landing_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, json, image, date
            $table->string('section')->nullable(); // countdown, speakers, timeline, etc
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default values
        DB::table('landing_page_settings')->insert([
            [
                'key' => 'countdown_target_date',
                'value' => '2026-01-18T00:00:00',
                'type' => 'date',
                'section' => 'countdown',
                'description' => 'Target date for registration countdown',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'keynote_speakers',
                'value' => json_encode([
                    ['name' => 'Dr. John Smith', 'title' => 'Lead Geologist', 'institution' => 'University of Indonesia'],
                    ['name' => 'Dr. Maria Garcia', 'title' => 'Research Director', 'institution' => 'Asian Geological Institute'],
                    ['name' => 'Prof. Ahmad Hassan', 'title' => 'Professor', 'institution' => 'Institute of Technology'],
                ]),
                'type' => 'json',
                'section' => 'speakers',
                'description' => 'List of keynote speakers',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'timeline_events',
                'value' => json_encode([
                    ['title' => 'Registration Opens', 'date' => 'January 18, 2026', 'status' => 'completed'],
                    ['title' => 'Abstract Submission', 'date' => 'February 28, 2026', 'status' => 'active'],
                    ['title' => 'Early Bird Deadline', 'date' => 'April 30, 2026', 'status' => 'upcoming'],
                    ['title' => 'Final Registration', 'date' => 'June 30, 2026', 'status' => 'upcoming'],
                    ['title' => 'Conference Date', 'date' => 'August 15-17, 2026', 'status' => 'upcoming'],
                ]),
                'type' => 'json',
                'section' => 'timeline',
                'description' => 'Timeline events',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'contact_phone',
                'value' => '+62 21 1234 5678',
                'type' => 'text',
                'section' => 'contact',
                'description' => 'Contact phone number',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@iagi-geosea2026.org',
                'type' => 'text',
                'section' => 'contact',
                'description' => 'Contact email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'contact_address',
                'value' => "UPN Veteran Yogyakarta\nJl. SWK 104 (Lingkar Utara)\nYogyakarta 55283",
                'type' => 'text',
                'section' => 'contact',
                'description' => 'Contact address',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'sponsors',
                'value' => json_encode([
                    ['name' => 'Sponsor 1', 'level' => 'Platinum', 'logo' => null],
                    ['name' => 'Sponsor 2', 'level' => 'Gold', 'logo' => null],
                    ['name' => 'Sponsor 3', 'level' => 'Gold', 'logo' => null],
                    ['name' => 'Sponsor 4', 'level' => 'Silver', 'logo' => null],
                    ['name' => 'Sponsor 5', 'level' => 'Silver', 'logo' => null],
                ]),
                'type' => 'json',
                'section' => 'sponsors',
                'description' => 'List of sponsors',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_page_settings');
    }
};
