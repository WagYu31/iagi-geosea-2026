<?php

namespace App\Console\Commands;

use App\Models\LandingPageSetting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SyncSponsorsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sponsors:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinkronisasi logo dan data sponsor resmi ke LandingPageSetting (Sponsor Spotlight)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=====================================================================");
        $this->info("55TH PIT IAGI - GEOSEA XIX 2026: SINKRONISASI SPONSOR & PARTNER RESMI");
        $this->info("=====================================================================");

        $sponsors = [
            // --- PLATINUM SPONSORS ---
            [
                'id' => 1,
                'name' => 'MIND ID (Mining Industry Indonesia)',
                'category' => 'platinum',
                'level' => 'Platinum',
                'logo' => '/images/sponsors/mind_id.png',
                'website' => 'https://mind.id',
                'order' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Halliburton',
                'category' => 'platinum',
                'level' => 'Platinum',
                'logo' => '/images/sponsors/halliburton.jpg',
                'website' => 'https://www.halliburton.com',
                'order' => 2,
            ],
            [
                'id' => 3,
                'name' => 'SKK Migas - Prime Natuna EP',
                'category' => 'platinum',
                'level' => 'Platinum',
                'logo' => '/images/sponsors/skk_prime_natuna.png',
                'website' => 'https://www.skkmigas.go.id',
                'order' => 3,
            ],
            [
                'id' => 4,
                'name' => 'SKK Migas',
                'category' => 'platinum',
                'level' => 'Platinum',
                'logo' => '/images/sponsors/skk_migas.webp',
                'website' => 'https://www.skkmigas.go.id',
                'order' => 4,
            ],

            // --- GOLD SPONSORS ---
            [
                'id' => 5,
                'name' => 'EnQuest',
                'category' => 'gold',
                'level' => 'Gold',
                'logo' => '/images/sponsors/enquest.png',
                'website' => 'https://www.enquest.com',
                'order' => 5,
            ],
            [
                'id' => 6,
                'name' => 'PT Bauer Pratama Indonesia',
                'category' => 'gold',
                'level' => 'Gold',
                'logo' => '/images/sponsors/bauer_pratama.png',
                'website' => 'https://www.bauer.de',
                'order' => 6,
            ],
            [
                'id' => 7,
                'name' => 'PT Indo Bara Pratama',
                'category' => 'gold',
                'level' => 'Gold',
                'logo' => '/images/sponsors/indo_bara_pratama.jpg',
                'website' => 'https://indobarapratama.com',
                'order' => 7,
            ],
            [
                'id' => 8,
                'name' => 'Supreme Energy',
                'category' => 'gold',
                'level' => 'Gold',
                'logo' => '/images/sponsors/supreme_energy.png',
                'website' => 'https://www.supreme-energy.com',
                'order' => 8,
            ],

            // --- SILVER SPONSORS ---
            [
                'id' => 9,
                'name' => 'DMT Group',
                'category' => 'silver',
                'level' => 'Silver',
                'logo' => '/images/sponsors/dmt.png',
                'website' => 'https://www.dmt-group.com',
                'order' => 9,
            ],
            [
                'id' => 10,
                'name' => 'Raharsa',
                'category' => 'silver',
                'level' => 'Silver',
                'logo' => '/images/sponsors/raharsa.png',
                'website' => 'https://raharsa.com',
                'order' => 10,
            ],
            [
                'id' => 11,
                'name' => 'PT Geo Sumber Daya Kreasi',
                'category' => 'silver',
                'level' => 'Silver',
                'logo' => '/images/sponsors/geo_sumber_daya.jpg',
                'website' => 'https://geosumberdaya.com',
                'order' => 11,
            ],
            [
                'id' => 12,
                'name' => 'Promising Geophysics',
                'category' => 'silver',
                'level' => 'Silver',
                'logo' => '/images/sponsors/promising_geophysics.jpg',
                'website' => 'https://promisinggeophysics.com',
                'order' => 12,
            ],

            // --- SUPPORTING PARTNERS ---
            [
                'id' => 13,
                'name' => 'Kageogama (Keluarga Alumni Geologi Gadjah Mada)',
                'category' => 'supporting',
                'level' => 'Supporting',
                'logo' => '/images/sponsors/kageogama.png',
                'website' => 'https://kageogama.org',
                'order' => 13,
            ],
        ];

        // Verifikasi keberadaan file logo fisik di public
        $tableData = [];
        foreach ($sponsors as $sponsor) {
            $relPath = ltrim($sponsor['logo'], '/');
            $fullPath = public_path($relPath);
            $exists = file_exists($fullPath);
            $size = $exists ? round(filesize($fullPath) / 1024, 1) . ' KB' : 'TIDAK DITEMUKAN';

            $tableData[] = [
                $sponsor['name'],
                strtoupper($sponsor['category']),
                $sponsor['logo'],
                $exists ? "OK ({$size})" : 'MISSING',
            ];
        }

        $this->table(['Sponsor / Partner', 'Tier', 'Logo Path', 'Status Fisik'], $tableData);

        // Update atau Buat LandingPageSetting untuk 'sponsors'
        $setting = LandingPageSetting::updateOrCreate(
            ['key' => 'sponsors'],
            [
                'value' => json_encode($sponsors, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT),
                'type' => 'json',
                'section' => 'landing_page',
                'description' => 'Daftar sponsor dan partner resmi yang ditampilkan pada 3D Spotlight Carousel & E-Ticket',
            ]
        );

        // Clear cache
        Cache::forget('landing-page-settings');
        if (function_exists('opcache_reset')) {
            @opcache_reset();
        }

        $this->newLine();
        $this->info("✅ Sukses! Sebanyak " . count($sponsors) . " sponsor berhasil disinkronisasi ke database.");
        $this->info("LandingPageSetting ID: {$setting->id}, Key: '{$setting->key}', Section: '{$setting->section}'.");
        $this->info("Cache 'landing-page-settings' telah dibersihkan.");

        return Command::SUCCESS;
    }
}
