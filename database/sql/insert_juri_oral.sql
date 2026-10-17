-- =====================================================================
-- SQL Query: Tambah Akun Juri Oral Presentation - PIT IAGI & GEOSEA XIX 2026
-- Password Semua Akun : Juri123.
-- Bcrypt Hash (Cost 12): $2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO
-- Role                 : Juri
-- Status Akun          : Verified (email_verified_at = NOW())
-- =====================================================================

INSERT INTO `users` (
    `name`,
    `full_name`,
    `email`,
    `email_verified_at`,
    `password`,
    `role`,
    `affiliation`,
    `category`,
    `created_at`,
    `updated_at`
) VALUES
('Fahmi Hakim', 'Fahmi Hakim', 'fahmihakim@ugm.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('Dwi Fitri Yudiantoro', 'Dwi Fitri Yudiantoro', 'd_fitriyudiantoro@upnyk.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'UPN "Veteran" Yogyakarta', 'Professional', NOW(), NOW()),
('Mhd. Andriansyah Gurusinga', 'Mhd. Andriansyah Gurusinga', 'andriansyah.gurusinga@upnyk.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'UPN "Veteran" Yogyakarta', 'Professional', NOW(), NOW()),
('Niniek Rina Herdinita', 'Niniek Rina Herdinita', 'r.herdianita@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Oral', 'Professional', NOW(), NOW()),
('Nugroho Imam Setiawan', 'Nugroho Imam Setiawan', 'nugroho.setiawan@ugm.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('Bagaskara Wahyu Purnomo Putra, S.T., M.Eng', 'Bagaskara Wahyu Purnomo Putra, S.T., M.Eng', 'bagaskarawpp@live.undip.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Diponegoro (UNDIP)', 'Professional', NOW(), NOW()),
('Ir. Moch Hasmannoor Rachman', 'Ir. Moch Hasmannoor Rachman', 'moch.hasmannoor.r@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Oral', 'Professional', NOW(), NOW()),
('Muhammad Zelandi', 'Muhammad Zelandi', 'muhammadzelandi@unja.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Jambi (UNJA)', 'Professional', NOW(), NOW()),
('Ruth Amelia', 'Ruth Amelia', 'truthamelia@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Oral', 'Professional', NOW(), NOW()),
('I Gde', 'I Gde Budi Indrawan', 'igbindrawan@ugm.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('Eril Suhada Lanin', 'Eril Suhada Lanin', 'eril.lanin@ferg.co.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT FERG', 'Professional', NOW(), NOW()),
('Faizal Al Marawi', 'Faizal Al Marawi', 'faizal.marawi@pertamina.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Pertamina', 'Professional', NOW(), NOW()),
('Imaduddin Kartoatmodjo', 'Imaduddin Kartoatmodjo', 'imaduddinkartoatmodjo@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Oral', 'Professional', NOW(), NOW()),
('Hitler Sijabat', 'Hitler Sijabat', 'hit.sijabat@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri', 'Professional', NOW(), NOW()),
('Donatus Hendra Amijaya', 'Donatus Hendra Amijaya', 'hamijaya@ugm.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('I wayan Warmada', 'I wayan Warmada', 'warmada@ugm.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('I wayan Warmada', 'I wayan Warmada', 'warmada@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('Dian Rahma Yoni', 'Dian Rahma Yoni', 'dian.rahma@upnyk.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'UPN "Veteran" Yogyakarta', 'Professional', NOW(), NOW()),
('Junaedi', 'Junaedi', 'Junaedi.Junaedi@medcoenergi.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Medco Energi', 'Professional', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `full_name` = VALUES(`full_name`),
    `password` = VALUES(`password`),
    `role` = 'Juri',
    `affiliation` = VALUES(`affiliation`),
    `category` = 'Professional',
    `email_verified_at` = COALESCE(`email_verified_at`, NOW()),
    `updated_at` = NOW();
