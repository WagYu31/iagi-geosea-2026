<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class JuriOralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $juris = [
            [
                'name' => 'Fahmi Hakim',
                'email' => 'fahmihakim@ugm.ac.id',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'Dwi Fitri Yudiantoro',
                'email' => 'd_fitriyudiantoro@upnyk.ac.id',
                'affiliation' => 'UPN "Veteran" Yogyakarta',
            ],
            [
                'name' => 'Mhd. Andriansyah Gurusinga',
                'email' => 'andriansyah.gurusinga@upnyk.ac.id',
                'affiliation' => 'UPN "Veteran" Yogyakarta',
            ],
            [
                'name' => 'Niniek Rina Herdinita',
                'email' => 'r.herdianita@gmail.com',
                'affiliation' => 'Dewan Juri Oral',
            ],
            [
                'name' => 'Nugroho Imam Setiawan',
                'email' => 'nugroho.setiawan@ugm.ac.id',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng',
                'email' => 'bagaskarawpp@live.undip.ac.id',
                'affiliation' => 'Universitas Diponegoro (UNDIP)',
            ],
            [
                'name' => 'Ir. Moch Hasmannoor Rachman',
                'email' => 'moch.hasmannoor.r@gmail.com',
                'affiliation' => 'Dewan Juri Oral',
            ],
            [
                'name' => 'Muhammad Zelandi',
                'email' => 'muhammadzelandi@unja.ac.id',
                'affiliation' => 'Universitas Jambi (UNJA)',
            ],
            [
                'name' => 'Ruth Amelia',
                'email' => 'truthamelia@gmail.com',
                'affiliation' => 'Dewan Juri Oral',
            ],
            [
                'name' => 'I Gde',
                'full_name' => 'I Gde Budi Indrawan',
                'email' => 'igbindrawan@ugm.ac.id',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'Eril Suhada Lanin',
                'email' => 'eril.lanin@ferg.co.id',
                'affiliation' => 'PT FERG',
            ],
            [
                'name' => 'Faizal Al Marawi',
                'email' => 'faizal.marawi@pertamina.com',
                'affiliation' => 'PT Pertamina',
            ],
            [
                'name' => 'Imaduddin Kartoatmodjo',
                'email' => 'imaduddinkartoatmodjo@gmail.com',
                'affiliation' => 'Dewan Juri Oral',
            ],
            [
                'name' => 'Hitler Sijabat',
                'email' => 'hit.sijabat@gmail.com',
                'affiliation' => 'Dewan Juri',
            ],
            [
                'name' => 'Donatus Hendra Amijaya',
                'email' => 'hamijaya@ugm.ac.id',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'I wayan Warmada',
                'email' => 'warmada@ugm.ac.id',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'I wayan Warmada',
                'email' => 'warmada@gmail.com',
                'affiliation' => 'Universitas Gadjah Mada (UGM)',
            ],
            [
                'name' => 'Dian Rahma Yoni',
                'email' => 'dian.rahma@upnyk.ac.id',
                'affiliation' => 'UPN "Veteran" Yogyakarta',
            ],
            [
                'name' => 'Junaedi',
                'email' => 'Junaedi.Junaedi@medcoenergi.com',
                'affiliation' => 'PT Medco Energi',
            ],
        ];

        foreach ($juris as $juri) {
            User::updateOrCreate(
                ['email' => $juri['email']],
                [
                    'name'              => $juri['name'],
                    'full_name'         => $juri['full_name'] ?? $juri['name'],
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
