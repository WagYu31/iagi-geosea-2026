<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class JuriPosterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $juris = [
            [
                'name' => 'Ali Achmad',
                'email' => 'ali.achmad@arutmin.com',
                'affiliation' => 'PT Arutmin Indonesia',
            ],
            [
                'name' => 'Feddy',
                'email' => 'feddy.yurniadi@merdekacoppergold.com',
                'affiliation' => 'PT Merdeka Copper Gold',
            ],
            [
                'name' => 'Feddy',
                'email' => 'feddy.yurniadi@gmail.com',
                'affiliation' => 'PT Merdeka Copper Gold',
            ],
            [
                'name' => 'Sukiato',
                'email' => 'sukiato.kho@gmail.com',
                'affiliation' => 'Dewan Juri Poster',
            ],
            [
                'name' => 'Didit Hadi Barianto',
                'email' => 'didit_geologi@ugm.ac.id',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'Dr. Ir. Barlian Dwinagara, M.T.',
                'email' => 'barliandn@upnyk.ac.id',
                'affiliation' => 'UPN "Veteran" Yogyakarta',
            ],
            [
                'name' => 'Hitler Sijabat',
                'email' => 'hit.sijabat@gmail.com',
                'affiliation' => 'Dewan Juri Poster',
            ],
            [
                'name' => 'Reza Syahputra',
                'email' => 'syahputra.reza@sci.ui.ac.id',
                'affiliation' => 'Universitas Indonesia (UI)',
            ],
            [
                'name' => 'Bambang Mujihardi',
                'email' => 'bambangmujihardi@pertamina.com',
                'affiliation' => 'PT Pertamina',
            ],
            [
                'name' => 'Awang H Satyana',
                'email' => 'aharunsatyana@gmail.com',
                'affiliation' => 'Dewan Juri Poster',
            ],
            [
                'name' => 'Dr Dwandari Ralanarko',
                'email' => 'dwandari.ralanarko@pertamina.com',
                'affiliation' => 'PT Pertamina',
            ],
            [
                'name' => 'Aurora Juniarti',
                'email' => 'aurora.juniar@gmail.com',
                'affiliation' => 'Dewan Juri Poster',
            ],
        ];

        foreach ($juris as $juri) {
            User::updateOrCreate(
                ['email' => $juri['email']],
                [
                    'name'              => $juri['name'],
                    'full_name'         => $juri['name'],
                    'password'          => Hash::make('Juri123.'),
                    'role'              => 'Juri',
                    'affiliation'       => $juri['affiliation'],
                    'category'          => 'Professional',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
