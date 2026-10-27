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
    protected $description = 'Sinkronisasi logo dan data sponsor resmi ke LandingPageSetting sesuai Sponsorship Item resmi';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=====================================================================");
        $this->info("55TH PIT IAGI - GEOSEA XIX 2026: SINKRONISASI SPONSOR & PARTNER RESMI");
        $this->info("=====================================================================");

        $sponsors = [

    // =========================================================================
    // 1. MAIN EVENT DIAMOND
    // =========================================================================
            [
        'id' => 1,
        'name' => 'Pertamina Hulu Energi',
        'category' => 'Main Event Diamond',
        'level' => 'Diamond',
        'logo' => '/images/sponsors/pertamina_phe.png',
        'website' => 'https://phe.pertamina.com',
        'order' => 1,
            ],
            [
        'id' => 2,
        'name' => 'MIND ID (Mining Industry Indonesia)',
        'category' => 'Main Event Diamond',
        'level' => 'Diamond',
        'logo' => '/images/sponsors/mind_id.png',
        'website' => 'https://mind.id',
        'order' => 2,
            ],

    // =========================================================================
    // 2. MAIN EVENT SILVER
    // =========================================================================
            [
        'id' => 3,
        'name' => 'PT Geo Dipa Energi (Persero)',
        'category' => 'Main Event Silver',
        'level' => 'Silver',
        'logo' => '/images/sponsors/geodipa.png',
        'website' => 'https://geodipa.co.id',
        'order' => 3,
            ],

    // =========================================================================
    // 3. MAIN EVENT BRONZE
    // =========================================================================
            [
        'id' => 4,
        'name' => 'Halliburton Indonesia',
        'category' => 'Main Event Bronze',
        'level' => 'Bronze',
        'logo' => '/images/sponsors/halliburton.png',
        'website' => 'https://www.halliburton.com',
        'order' => 4,
            ],
            [
        'id' => 5,
        'name' => 'SLB Indonesia',
        'category' => 'Main Event Bronze',
        'level' => 'Bronze',
        'logo' => '/images/sponsors/slb.png',
        'website' => 'https://www.slb.com',
        'order' => 5,
            ],
            [
        'id' => 6,
        'name' => 'PT Energi Mega Persada Tbk',
        'category' => 'Main Event Bronze',
        'level' => 'Bronze',
        'logo' => '/images/sponsors/emp.png',
        'website' => 'https://www.emp.id',
        'order' => 6,
            ],
            [
        'id' => 7,
        'name' => 'PT Geo Fix Indonesia',
        'category' => 'Main Event Bronze',
        'level' => 'Bronze',
        'logo' => '/images/sponsors/geofix.png',
        'website' => 'https://www.geofix-id.com',
        'order' => 7,
            ],
            [
        'id' => 8,
        'name' => 'BAUER Pratama Indonesia',
        'category' => 'Main Event Bronze',
        'level' => 'Bronze',
        'logo' => '/images/sponsors/bauer_pratama.png',
        'website' => 'https://www.bauer.de',
        'order' => 8,
            ],
            [
                'id' => 9,
                'name' => 'Husky CNOOC Madura Limited',
                'category' => 'Main Event Bronze',
                'level' => 'Bronze',
                'logo' => '/images/sponsors/hcml.png',
                'website' => 'https://www.hcml.co.id',
                'order' => 9,
            ],
            [
                'id' => 10,
                'name' => 'UPN "Veteran" Yogyakarta',
                'category' => 'Main Event Bronze',
                'level' => 'Bronze',
                'logo' => '/images/sponsors/upn_veteran_yogyakarta.png',
                'website' => 'https://upnyk.ac.id',
                'order' => 10,
            ],

    // =========================================================================
    // 4. IAGI PRESIDENT ELECTION
    // =========================================================================
            [
                'id' => 11,
                'name' => 'PT Pelsart Tambang Kencana',
                'category' => 'IAGI President Election',
                'level' => 'President Election',
                'logo' => '/images/sponsors/pelsart.png',
                'website' => 'https://ptkgold.co.id',
                'order' => 11,
            ],

    // =========================================================================
    // 5. ICE BREAKING NIGHT
    // =========================================================================
            [
                'id' => 12,
                'name' => 'PT Raharsa',
                'category' => 'Ice Breaking Night',
                'level' => 'Ice Breaking Night',
                'logo' => '/images/sponsors/raharsa.png',
                'website' => 'https://raharsa.com',
                'order' => 12,
            ],

    // =========================================================================
    // 6. KEYNOTE / PLENARY SESSION
    // =========================================================================
            [
                'id' => 13,
                'name' => 'Geo Sumberdaya alam',
                'category' => 'Keynote/Plenary',
                'level' => 'Keynote/Plenary',
                'logo' => '/images/sponsors/geo_sumber_daya.jpg',
                'website' => 'https://geosumberdaya.com',
                'order' => 13,
            ],

    // =========================================================================
    // 7. TECHNICAL SESSIONS
    // =========================================================================
            [
                'id' => 14,
                'name' => 'PT Supreme Energy',
                'category' => 'Technical Sessions',
                'level' => 'Technical Sessions',
                'logo' => '/images/sponsors/supreme_energy.png',
                'website' => 'https://www.supreme-energy.com',
                'order' => 14,
            ],

    // =========================================================================
    // 8. LANYARD & NAME TAG
    // =========================================================================
            [
                'id' => 15,
                'name' => 'Prime Natuna Energy',
                'category' => 'Lanyard & Name Tag',
                'level' => 'Lanyard & Name Tag',
                'logo' => '/images/sponsors/skk_prime_natuna.png',
                'website' => 'https://www.skkmigas.go.id',
                'order' => 15,
            ],

    // =========================================================================
    // 9. EXHIBITION
    // =========================================================================
            [
                'id' => 16,
                'name' => 'Promising Geophysic Malaysia',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/promising_geophysics_full.png',
                'website' => 'https://promisinggeophysics.com',
                'order' => 16,
            ],
            [
                'id' => 17,
                'name' => 'PT Wahana Kerja Indonesia (Waskpro)',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/wahana_kerja.png',
                'website' => 'https://waskpro.com',
                'order' => 17,
            ],
            [
                'id' => 18,
                'name' => 'PT Jakindo Perkasa',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/jakindo_full.png',
                'website' => 'https://www.jakindoperkasa.com',
                'order' => 18,
            ],
            [
                'id' => 19,
                'name' => 'PT Geoservices',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/geoservices_full.png',
                'website' => 'https://geoservices.co.id',
                'order' => 19,
            ],
            [
                'id' => 20,
                'name' => 'Badan Geologi (ESDM)',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/kementerian_esdm.png',
                'website' => 'https://geologi.esdm.go.id',
                'order' => 20,
            ],
            [
                'id' => 21,
                'name' => 'Geonest',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/geonest_full.png',
                'website' => 'https://geonest-software.com',
                'order' => 21,
            ],
            [
                'id' => 22,
                'name' => 'BATM Trisakti',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/batm_trisakti.png',
                'website' => 'https://trisakti.ac.id',
                'order' => 22,
            ],
            [
                'id' => 23,
                'name' => 'WAVIV Knowledge Navigator',
                'category' => 'Exhibition',
                'level' => 'Exhibition',
                'logo' => '/images/sponsors/waviv.png',
                'website' => 'https://waviv.com',
                'order' => 23,
            ],

    // =========================================================================
    // 10. OTHER & SUPPORTING PARTNERS
    // =========================================================================
            [
                'id' => 24,
                'name' => 'EnQuest EP Ltd',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/enquest.png',
                'website' => 'https://www.enquest.com',
                'order' => 24,
            ],
            [
                'id' => 25,
                'name' => 'PT DMT Exploration Engineering Consulting Indonesia',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/dmt.png',
                'website' => 'https://www.dmt-group.com',
                'order' => 25,
            ],
            [
                'id' => 26,
                'name' => 'Kageo Trisakti',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/geosakti.png',
                'website' => 'https://geologi.ftke.trisakti.ac.id',
                'order' => 26,
            ],
            [
                'id' => 27,
                'name' => 'PT Cita Mineral Investindo Tbk (CITA)',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/cita_mineral.png',
                'website' => 'https://citamineral.com',
                'order' => 27,
            ],
            [
                'id' => 28,
                'name' => 'Kageo Gadjah Mada',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/kageogama.png',
                'website' => 'https://kageogama.org',
                'order' => 28,
            ],
            [
                'id' => 29,
                'name' => 'PT Indo Bara Pratama',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/indo_bara_pratama.jpg',
                'website' => 'https://indobarapratama.com',
                'order' => 29,
            ],
            [
                'id' => 30,
                'name' => 'PT Bukit Raya Sekawan',
                'category' => 'Other',
                'level' => 'Other',
                'logo' => '/images/sponsors/bukit_raya_sekawan.png',
                'website' => 'https://bukitrayasekawan.com',
                'order' => 30,
            ],
            [
                'id' => 31,
                'name' => 'SKK Migas',
                'category' => 'Institutional Partner',
                'level' => 'Institutional Partner',
                'logo' => '/images/sponsors/skk_migas.webp',
                'website' => 'https://www.skkmigas.go.id',
                'order' => 31,
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
                $sponsor['category'],
                $sponsor['logo'],
                $exists ? "OK ({$size})" : 'MISSING',
            ];
        }

        $this->table(['Sponsor / Partner', 'Sponsorship Item', 'Logo Path', 'Status Fisik'], $tableData);

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
