-- =====================================================================
-- SQL Query: Tambah Akun Juri Poster - PIT IAGI & GEOSEA XIX 2026
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
('Ali Achmad', 'Ali Achmad', 'ali.achmad@arutmin.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Arutmin Indonesia', 'Professional', NOW(), NOW()),
('Feddy', 'Feddy', 'feddy.yurniadi@merdekacoppergold.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Merdeka Copper Gold', 'Professional', NOW(), NOW()),
('Feddy', 'Feddy', 'feddy.yurniadi@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Merdeka Copper Gold', 'Professional', NOW(), NOW()),
('Sukiato', 'Sukiato', 'sukiato.kho@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Poster', 'Professional', NOW(), NOW()),
('Didit Hadi Barianto', 'Didit Hadi Barianto', 'didit_geologi@ugm.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Gadjah Mada (UGM)', 'Professional', NOW(), NOW()),
('Dr. Ir. Barlian Dwinagara, M.T.', 'Dr. Ir. Barlian Dwinagara, M.T.', 'barliandn@upnyk.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'UPN "Veteran" Yogyakarta', 'Professional', NOW(), NOW()),
('Hitler Sijabat', 'Hitler Sijabat', 'hit.sijabat@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Poster', 'Professional', NOW(), NOW()),
('Reza Syahputra', 'Reza Syahputra', 'syahputra.reza@sci.ui.ac.id', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Universitas Indonesia (UI)', 'Professional', NOW(), NOW()),
('Bambang Mujihardi', 'Bambang Mujihardi', 'bambangmujihardi@pertamina.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Pertamina', 'Professional', NOW(), NOW()),
('Awang H Satyana', 'Awang H Satyana', 'aharunsatyana@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Poster', 'Professional', NOW(), NOW()),
('Dr Dwandari Ralanarko', 'Dr Dwandari Ralanarko', 'dwandari.ralanarko@pertamina.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'PT Pertamina', 'Professional', NOW(), NOW()),
('Aurora Juniarti', 'Aurora Juniarti', 'aurora.juniar@gmail.com', NOW(), '$2y$12$F67kg943otI1mffOnSsLDenudxOG0S7dhZ1sHBC64DDwDY4soltwO', 'Juri', 'Dewan Juri Poster', 'Professional', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `full_name` = VALUES(`full_name`),
    `password` = VALUES(`password`),
    `role` = 'Juri',
    `affiliation` = VALUES(`affiliation`),
    `category` = 'Professional',
    `email_verified_at` = COALESCE(`email_verified_at`, NOW()),
    `updated_at` = NOW();
