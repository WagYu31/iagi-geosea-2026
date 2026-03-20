-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: arzano-db.id.rapidplex.com:3306
-- Generation Time: Feb 19, 2026 at 09:02 PM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pitiagic_geosea`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('pit-iagi-geosea-2026-cache-landing-page-settings', 'a:25:{s:21:\"countdown_target_date\";s:16:\"2026-02-09T00:00\";s:16:\"keynote_speakers\";a:1:{i:0;a:4:{s:4:\"name\";s:0:\"\";s:5:\"title\";s:0:\"\";s:5:\"photo\";s:0:\"\";s:11:\"institution\";s:0:\"\";}}s:15:\"timeline_events\";a:5:{i:0;a:3:{s:5:\"title\";s:18:\"Registration Opens\";s:4:\"date\";s:16:\"January 18, 2026\";s:6:\"status\";s:9:\"completed\";}i:1;a:3:{s:5:\"title\";s:19:\"Abstract Submission\";s:4:\"date\";s:17:\"February 28, 2026\";s:6:\"status\";s:6:\"active\";}i:2;a:3:{s:5:\"title\";s:19:\"Early Bird Deadline\";s:4:\"date\";s:14:\"April 30, 2026\";s:6:\"status\";s:8:\"upcoming\";}i:3;a:3:{s:5:\"title\";s:18:\"Final Registration\";s:4:\"date\";s:13:\"June 30, 2026\";s:6:\"status\";s:8:\"upcoming\";}i:4;a:3:{s:5:\"title\";s:15:\"Conference Date\";s:4:\"date\";s:18:\"August 15-17, 2026\";s:6:\"status\";s:8:\"upcoming\";}}s:13:\"contact_phone\";s:12:\"085771593522\";s:13:\"contact_email\";s:23:\"wahyuwutomo31@gmail.com\";s:15:\"contact_address\";s:67:\"UPN Veteran Yogyakarta\nJl. SWK 104 (Lingkar Utara)\nYogyakarta 55283\";s:8:\"sponsors\";a:6:{i:0;a:3:{s:4:\"name\";s:0:\"\";s:4:\"logo\";s:34:\"/storage/sponsors/1770512959_0.png\";s:4:\"tier\";s:4:\"gold\";}i:1;a:3:{s:4:\"name\";s:0:\"\";s:4:\"logo\";s:34:\"/storage/sponsors/1770385582_1.png\";s:4:\"tier\";s:4:\"gold\";}i:2;a:3:{s:4:\"name\";s:0:\"\";s:4:\"logo\";s:34:\"/storage/sponsors/1770385610_2.png\";s:4:\"tier\";s:4:\"gold\";}i:3;a:3:{s:4:\"name\";s:0:\"\";s:4:\"logo\";s:34:\"/storage/sponsors/1770385657_3.png\";s:4:\"tier\";s:4:\"gold\";}i:4;a:3:{s:4:\"name\";s:0:\"\";s:4:\"logo\";s:34:\"/storage/sponsors/1770385781_4.png\";s:4:\"tier\";s:4:\"gold\";}i:5;a:3:{s:4:\"name\";s:0:\"\";s:4:\"logo\";s:34:\"/storage/sponsors/1770385804_5.png\";s:4:\"tier\";s:4:\"gold\";}}s:13:\"map_embed_url\";s:449:\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.6031187563613!2d106.79175527499117!3d-6.315751193673618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ee3e065d4f6b%3A0xe176f81a31564166!2sUniversitas%20Pembangunan%20Nasional%20%22Veteran%22%20Jakarta!5e0!3m2!1sid!2sid!4v1768497356521!5m2!1sid!2sid\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>\";s:9:\"resources\";a:6:{i:0;a:5:{s:5:\"title\";s:18:\"Abstract Guideline\";s:11:\"description\";N;s:8:\"file_url\";s:47:\"/storage/resources/1770494452_698799f476034.pdf\";s:9:\"file_type\";s:3:\"pdf\";s:9:\"file_size\";s:9:\"117.53 KB\";}i:1;a:0:{}i:2;a:0:{}i:3;a:5:{s:5:\"title\";s:27:\"How to do the registration?\";s:11:\"description\";s:25:\"About Your Account Step 1\";s:8:\"file_url\";s:47:\"/storage/resources/1770517238_6987f2f694a02.pdf\";s:9:\"file_type\";s:3:\"pdf\";s:9:\"file_size\";s:9:\"442.15 KB\";}i:4;a:5:{s:5:\"title\";s:29:\"How if I forgot the password?\";s:11:\"description\";s:25:\"About Your Account Step 2\";s:8:\"file_url\";s:47:\"/storage/resources/1770517260_6987f30c40057.pdf\";s:9:\"file_type\";s:3:\"pdf\";s:9:\"file_size\";s:9:\"397.39 KB\";}i:5;a:5:{s:5:\"title\";s:39:\"How to start a new abstarct submission?\";s:11:\"description\";s:25:\"About Your Account Step 3\";s:8:\"file_url\";s:47:\"/storage/resources/1770517295_6987f32ff0bd3.pdf\";s:9:\"file_type\";s:3:\"pdf\";s:9:\"file_size\";s:9:\"179.31 KB\";}}s:8:\"timeline\";a:5:{i:0;a:3:{s:5:\"title\";s:19:\"Abstract Submission\";s:4:\"date\";s:16:\"February 9, 2026\";s:6:\"status\";s:6:\"active\";}i:1;a:3:{s:5:\"title\";s:17:\"Abstract Deadline\";s:4:\"date\";s:14:\"March 21, 2026\";s:6:\"status\";s:8:\"upcoming\";}i:2;a:3:{s:5:\"title\";s:32:\"Abstract Acceptance Announcement\";s:4:\"date\";s:12:\"May 07, 2026\";s:6:\"status\";s:8:\"upcoming\";}i:3;a:3:{s:5:\"title\";s:35:\"Full Manuscript Submission Deadline\";s:4:\"date\";s:16:\"Agustus 07, 2026\";s:6:\"status\";s:8:\"upcoming\";}i:4;a:3:{s:5:\"title\";s:10:\"Main Event\";s:4:\"date\";s:16:\"November 3, 2026\";s:6:\"status\";s:8:\"upcoming\";}}s:12:\"contact_info\";a:5:{s:5:\"phone\";s:13:\"+628111581461\";s:5:\"email\";s:25:\"iagisekretariat@gmail.com\";s:8:\"location\";s:116:\"Jl. Laksda Adisucipto No.81, Ambarukmo, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281\";s:8:\"maps_url\";s:409:\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.071712251235!2d110.40312379999999!3d-7.7822215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59e82583c5f9%3A0x8decbfc296a4eef2!2sRoyal%20Ambarrukmo%20Yogyakarta!5e0!3m2!1sid!2sid!4v1770202344114!5m2!1sid!2sid\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>\";s:8:\"telegram\";s:19:\"bit.ly/TelegramIAGI\";}s:12:\"social_media\";a:5:{s:9:\"instagram\";s:31:\"https://www.instagram.com/iagi/\";s:8:\"facebook\";s:38:\"https://www.facebook.com/iagi.official\";s:7:\"twitter\";s:21:\"https://x.com/iaginet\";s:8:\"linkedin\";s:0:\"\";s:7:\"youtube\";s:71:\"https://youtube.com/@iagiikatanahligeologiindon6703?si=WxkKsrIiS8u28ElR\";}s:9:\"hero_text\";a:4:{s:11:\"title_line1\";s:44:\"55ᵀᴴ IAGI Annual Scientific Meeting 2026\";s:11:\"title_line2\";s:34:\"GEOSEA XIX Convention & Exhibition\";s:11:\"theme_label\";s:16:\"CONFERENCE THEME\";s:10:\"theme_text\";s:97:\"Harmonizing Georesources, Geohazard, and Heritage Conservation to Promote Sustainable Development\";}s:20:\"hero_logos_secondary\";a:10:{i:0;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233024_0.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233024_0.png\";}i:1;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233042_1.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233042_1.png\";}i:2;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233049_2.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233049_2.png\";}i:3;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233059_3.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233059_3.png\";}i:4;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233066_4.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233066_4.png\";}i:5;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233084_5.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233084_5.png\";}i:6;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233090_6.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233090_6.png\";}i:7;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233098_7.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233098_7.png\";}i:8;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233103_8.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233103_8.png\";}i:9;a:2:{s:3:\"url\";s:50:\"/storage/hero/hero_logo_secondary_1770233109_9.png\";s:8:\"filename\";s:36:\"hero_logo_secondary_1770233109_9.png\";}}s:15:\"hero_background\";a:3:{s:3:\"url\";s:37:\"/storage/hero/hero_bg_1770235015.jpeg\";s:4:\"type\";s:5:\"image\";s:8:\"filename\";s:23:\"hero_bg_1770235015.jpeg\";}s:9:\"hero_logo\";a:2:{s:3:\"url\";s:38:\"/storage/hero/hero_logo_1770260454.png\";s:8:\"filename\";s:24:\"hero_logo_1770260454.png\";}s:28:\"keynote_speakers_description\";s:15:\"To Be Announced\";s:20:\"sponsors_description\";s:0:\"\";s:20:\"submission_procedure\";a:1:{i:0;a:2:{s:5:\"title\";s:18:\"About Your Account\";s:5:\"items\";a:3:{i:0;a:3:{s:4:\"text\";s:27:\"How to do the registration?\";s:4:\"link\";s:47:\"/storage/resources/1770517238_6987f2f694a02.pdf\";s:8:\"filename\";s:31:\"How to do the registration?.pdf\";}i:1;a:3:{s:4:\"text\";s:29:\"How if I forgot the password?\";s:4:\"link\";s:47:\"/storage/resources/1770517260_6987f30c40057.pdf\";s:8:\"filename\";s:33:\"How if I forgot the password?.pdf\";}i:2;a:3:{s:4:\"text\";s:39:\"How to start a new abstarct submission?\";s:4:\"link\";s:47:\"/storage/resources/1770517295_6987f32ff0bd3.pdf\";s:8:\"filename\";s:43:\"How to start a new abstarct submission?.pdf\";}}}}s:13:\"afgeo_members\";a:6:{i:0;a:3:{s:4:\"name\";s:4:\"IAGI\";s:7:\"country\";s:9:\"Indonesia\";s:4:\"logo\";s:37:\"/storage/afgeo/afgeo_1770420198_0.png\";}i:1;a:3:{s:4:\"name\";s:3:\"GSM\";s:7:\"country\";s:8:\"Malaysia\";s:4:\"logo\";s:37:\"/storage/afgeo/afgeo_1770420369_1.png\";}i:2;a:3:{s:4:\"name\";s:3:\"GST\";s:7:\"country\";s:8:\"Thailand\";s:4:\"logo\";s:37:\"/storage/afgeo/afgeo_1770420391_2.png\";}i:3;a:3:{s:4:\"name\";s:3:\"GSP\";s:7:\"country\";s:11:\"Philippines\";s:4:\"logo\";s:37:\"/storage/afgeo/afgeo_1770420422_3.png\";}i:4;a:3:{s:4:\"name\";s:3:\"GSV\";s:7:\"country\";s:7:\"Vietnam\";s:4:\"logo\";s:37:\"/storage/afgeo/afgeo_1770420440_4.png\";}i:5;a:3:{s:4:\"name\";s:3:\"GSC\";s:7:\"country\";s:7:\"Myanmar\";s:4:\"logo\";s:37:\"/storage/afgeo/afgeo_1770420549_5.png\";}}s:10:\"afgeo_text\";a:4:{s:13:\"section_label\";s:11:\"OUR NETWORK\";s:5:\"title\";s:12:\"AFGEO Member\";s:8:\"subtitle\";s:69:\"Association of Federation of Geoscientists of East and Southeast Asia\";s:10:\"background\";s:0:\"\";}s:14:\"faq_background\";a:2:{s:3:\"url\";s:0:\"\";s:8:\"filename\";s:0:\"\";}s:8:\"faq_text\";a:2:{s:5:\"title\";s:25:\"Frequently Asked Question\";s:8:\"subtitle\";s:68:\"Follow these simple steps to submit your abstract for the conference\";}s:14:\"resources_text\";a:3:{s:13:\"section_label\";s:9:\"DOWNLOADS\";s:5:\"title\";s:20:\"Conference Resources\";s:8:\"subtitle\";s:95:\"Everything you need to prepare a professional presentation for the IAGI-GEOSEA 2026 conference.\";}s:15:\"custom_sections\";a:1:{i:0;a:4:{s:13:\"section_label\";s:7:\"pre-pit\";s:5:\"title\";s:13:\"Section Title\";s:8:\"subtitle\";s:19:\"Section description\";s:7:\"members\";a:0:{}}}}', 1771509908),
('pit-iagi-geosea-2026-cache-reviewer@iagi-geosea2026.com|2001:448a:50a0:17d2:5546:5c10:6047:43fa', 'i:1;', 1771333231),
('pit-iagi-geosea-2026-cache-reviewer@iagi-geosea2026.com|2001:448a:50a0:17d2:5546:5c10:6047:43fa:timer', 'i:1771333231;', 1771333231),
('pit-iagi-geosea-2026-cache-reviewer@iagigeosea2026.com|43.252.144.225', 'i:3;', 1771468063),
('pit-iagi-geosea-2026-cache-reviewer@iagigeosea2026.com|43.252.144.225:timer', 'i:1771468063;', 1771468063),
('pit-iagi-geosea-2026-cache-takdir.fitriadi@gmail.com|116.90.168.179', 'i:1;', 1771389956),
('pit-iagi-geosea-2026-cache-takdir.fitriadi@gmail.com|116.90.168.179:timer', 'i:1771389956;', 1771389956);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_settings`
--

CREATE TABLE `email_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `mail_mailer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'smtp',
  `mail_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_port` int NOT NULL DEFAULT '587',
  `mail_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_encryption` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tls',
  `mail_from_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_from_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `landing_page_settings`
--

CREATE TABLE `landing_page_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `landing_page_settings`
--

INSERT INTO `landing_page_settings` (`id`, `key`, `value`, `type`, `section`, `description`, `created_at`, `updated_at`) VALUES
(1, 'countdown_target_date', '2026-02-09T00:00', 'date', 'countdown', 'Target date for registration countdown', '2026-01-14 23:35:50', '2026-02-04 20:41:31'),
(2, 'keynote_speakers', '[{\"name\":\"\",\"title\":\"\",\"photo\":\"\",\"institution\":\"\"}]', 'json', 'speakers', 'List of keynote speakers', '2026-01-14 23:35:50', '2026-02-07 19:42:21'),
(3, 'timeline_events', '[{\"title\":\"Registration Opens\",\"date\":\"January 18, 2026\",\"status\":\"completed\"},{\"title\":\"Abstract Submission\",\"date\":\"February 28, 2026\",\"status\":\"active\"},{\"title\":\"Early Bird Deadline\",\"date\":\"April 30, 2026\",\"status\":\"upcoming\"},{\"title\":\"Final Registration\",\"date\":\"June 30, 2026\",\"status\":\"upcoming\"},{\"title\":\"Conference Date\",\"date\":\"August 15-17, 2026\",\"status\":\"upcoming\"}]', 'json', 'timeline', 'Timeline events', '2026-01-14 23:35:50', '2026-01-14 23:35:50'),
(4, 'contact_phone', '085771593522', 'text', 'contact', 'Contact phone number', '2026-01-14 23:35:50', '2026-01-15 09:55:22'),
(5, 'contact_email', 'wahyuwutomo31@gmail.com', 'text', 'contact', 'Contact email', '2026-01-14 23:35:50', '2026-01-15 09:56:04'),
(6, 'contact_address', 'UPN Veteran Yogyakarta\nJl. SWK 104 (Lingkar Utara)\nYogyakarta 55283', 'text', 'contact', 'Contact address', '2026-01-14 23:35:50', '2026-01-15 10:03:14'),
(7, 'sponsors', '[{\"name\":\"\",\"logo\":\"\\/storage\\/sponsors\\/1770512959_0.png\",\"tier\":\"gold\"},{\"name\":\"\",\"logo\":\"\\/storage\\/sponsors\\/1770385582_1.png\",\"tier\":\"gold\"},{\"name\":\"\",\"logo\":\"\\/storage\\/sponsors\\/1770385610_2.png\",\"tier\":\"gold\"},{\"name\":\"\",\"logo\":\"\\/storage\\/sponsors\\/1770385657_3.png\",\"tier\":\"gold\"},{\"name\":\"\",\"logo\":\"\\/storage\\/sponsors\\/1770385781_4.png\",\"tier\":\"gold\"},{\"name\":\"\",\"logo\":\"\\/storage\\/sponsors\\/1770385804_5.png\",\"tier\":\"gold\"}]', 'json', 'sponsors', 'List of sponsors', '2026-01-14 23:35:50', '2026-02-07 18:09:19'),
(8, 'map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.6031187563613!2d106.79175527499117!3d-6.315751193673618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ee3e065d4f6b%3A0xe176f81a31564166!2sUniversitas%20Pembangunan%20Nasional%20%22Veteran%22%20Jakarta!5e0!3m2!1sid!2sid!4v1768497356521!5m2!1sid!2sid\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', 'string', 'contact', 'Google Maps Embed URL for location', '2026-01-15 10:14:26', '2026-01-15 10:16:47'),
(11, 'resources', '[{\"title\":\"Abstract Guideline\",\"description\":null,\"file_url\":\"\\/storage\\/resources\\/1770494452_698799f476034.pdf\",\"file_type\":\"pdf\",\"file_size\":\"117.53 KB\"},[],[],{\"title\":\"How to do the registration?\",\"description\":\"About Your Account Step 1\",\"file_url\":\"\\/storage\\/resources\\/1770517238_6987f2f694a02.pdf\",\"file_type\":\"pdf\",\"file_size\":\"442.15 KB\"},{\"title\":\"How if I forgot the password?\",\"description\":\"About Your Account Step 2\",\"file_url\":\"\\/storage\\/resources\\/1770517260_6987f30c40057.pdf\",\"file_type\":\"pdf\",\"file_size\":\"397.39 KB\"},{\"title\":\"How to start a new abstarct submission?\",\"description\":\"About Your Account Step 3\",\"file_url\":\"\\/storage\\/resources\\/1770517295_6987f32ff0bd3.pdf\",\"file_type\":\"pdf\",\"file_size\":\"179.31 KB\"}]', 'json', 'resources', NULL, '2026-01-16 01:46:14', '2026-02-07 19:21:35'),
(12, 'timeline', '[{\"title\":\"Abstract Submission\",\"date\":\"February 9, 2026\",\"status\":\"active\"},{\"title\":\"Abstract Deadline\",\"date\":\"March 21, 2026\",\"status\":\"upcoming\"},{\"title\":\"Abstract Acceptance Announcement\",\"date\":\"May 07, 2026\",\"status\":\"upcoming\"},{\"title\":\"Full Manuscript Submission Deadline\",\"date\":\"Agustus 07, 2026\",\"status\":\"upcoming\"},{\"title\":\"Main Event\",\"date\":\"November 3, 2026\",\"status\":\"upcoming\"}]', 'json', 'timeline', NULL, '2026-01-16 02:18:17', '2026-02-04 03:55:00'),
(13, 'contact_info', '{\"phone\":\"+628111581461\",\"email\":\"iagisekretariat@gmail.com\",\"location\":\"Jl. Laksda Adisucipto No.81, Ambarukmo, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281\",\"maps_url\":\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.071712251235!2d110.40312379999999!3d-7.7822215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59e82583c5f9%3A0x8decbfc296a4eef2!2sRoyal%20Ambarrukmo%20Yogyakarta!5e0!3m2!1sid!2sid!4v1770202344114!5m2!1sid!2sid\\\" width=\\\"600\\\" height=\\\"450\\\" style=\\\"border:0;\\\" allowfullscreen=\\\"\\\" loading=\\\"lazy\\\" referrerpolicy=\\\"no-referrer-when-downgrade\\\"></iframe>\",\"telegram\":\"bit.ly/TelegramIAGI\"}', 'json', 'contact', 'Contact information (phone, email, location, maps)', '2026-01-28 19:09:31', '2026-02-04 12:22:16'),
(14, 'social_media', '{\"instagram\":\"https://www.instagram.com/iagi/\",\"facebook\":\"https://www.facebook.com/iagi.official\",\"twitter\":\"https://x.com/iaginet\",\"linkedin\":\"\",\"youtube\":\"https://youtube.com/@iagiikatanahligeologiindon6703?si=WxkKsrIiS8u28ElR\"}', 'json', 'landing_page', NULL, '2026-02-04 03:57:49', '2026-02-04 04:00:06'),
(15, 'hero_text', '{\"title_line1\":\"55\\u1d40\\u1d34 IAGI Annual Scientific Meeting 2026\",\"title_line2\":\"GEOSEA XIX Convention & Exhibition\",\"theme_label\":\"CONFERENCE THEME\",\"theme_text\":\"Harmonizing Georesources, Geohazard, and Heritage Conservation to Promote Sustainable Development\"}', 'json', 'landing_page', NULL, '2026-02-04 12:23:19', '2026-02-13 06:44:30'),
(16, 'hero_logos_secondary', '[{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233024_0.png\",\"filename\":\"hero_logo_secondary_1770233024_0.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233042_1.png\",\"filename\":\"hero_logo_secondary_1770233042_1.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233049_2.png\",\"filename\":\"hero_logo_secondary_1770233049_2.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233059_3.png\",\"filename\":\"hero_logo_secondary_1770233059_3.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233066_4.png\",\"filename\":\"hero_logo_secondary_1770233066_4.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233084_5.png\",\"filename\":\"hero_logo_secondary_1770233084_5.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233090_6.png\",\"filename\":\"hero_logo_secondary_1770233090_6.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233098_7.png\",\"filename\":\"hero_logo_secondary_1770233098_7.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233103_8.png\",\"filename\":\"hero_logo_secondary_1770233103_8.png\"},{\"url\":\"\\/storage\\/hero\\/hero_logo_secondary_1770233109_9.png\",\"filename\":\"hero_logo_secondary_1770233109_9.png\"}]', 'json', 'landing_page', NULL, '2026-02-04 12:23:44', '2026-02-04 12:25:09'),
(17, 'hero_background', '{\"url\":\"\\/storage\\/hero\\/hero_bg_1770235015.jpeg\",\"type\":\"image\",\"filename\":\"hero_bg_1770235015.jpeg\"}', 'json', 'landing_page', NULL, '2026-02-04 12:56:55', '2026-02-04 12:56:55'),
(18, 'hero_logo', '{\"url\":\"\\/storage\\/hero\\/hero_logo_1770260454.png\",\"filename\":\"hero_logo_1770260454.png\"}', 'json', 'landing_page', NULL, '2026-02-04 20:00:54', '2026-02-04 20:00:54'),
(19, 'keynote_speakers_description', 'To Be Announced', 'text', 'general', NULL, '2026-02-05 12:54:08', '2026-02-07 21:15:32'),
(20, 'sponsors_description', '', 'text', 'general', NULL, '2026-02-05 12:54:29', '2026-02-07 13:47:49'),
(21, 'submission_procedure', '[{\"title\":\"About Your Account\",\"items\":[{\"text\":\"How to do the registration?\",\"link\":\"/storage/resources/1770517238_6987f2f694a02.pdf\",\"filename\":\"How to do the registration?.pdf\"},{\"text\":\"How if I forgot the password?\",\"link\":\"/storage/resources/1770517260_6987f30c40057.pdf\",\"filename\":\"How if I forgot the password?.pdf\"},{\"text\":\"How to start a new abstarct submission?\",\"link\":\"/storage/resources/1770517295_6987f32ff0bd3.pdf\",\"filename\":\"How to start a new abstarct submission?.pdf\"}]}]', 'json', 'landing_page', NULL, '2026-02-06 03:57:31', '2026-02-07 19:21:38'),
(22, 'afgeo_members', '[{\"name\":\"IAGI\",\"country\":\"Indonesia\",\"logo\":\"/storage/afgeo/afgeo_1770420198_0.png\"},{\"name\":\"GSM\",\"country\":\"Malaysia\",\"logo\":\"/storage/afgeo/afgeo_1770420369_1.png\"},{\"name\":\"GST\",\"country\":\"Thailand\",\"logo\":\"/storage/afgeo/afgeo_1770420391_2.png\"},{\"name\":\"GSP\",\"country\":\"Philippines\",\"logo\":\"/storage/afgeo/afgeo_1770420422_3.png\"},{\"name\":\"GSV\",\"country\":\"Vietnam\",\"logo\":\"/storage/afgeo/afgeo_1770420440_4.png\"},{\"name\":\"GSC\",\"country\":\"Myanmar\",\"logo\":\"/storage/afgeo/afgeo_1770420549_5.png\"}]', 'json', 'general', NULL, '2026-02-06 15:53:50', '2026-02-06 16:29:09'),
(23, 'afgeo_text', '{\"section_label\":\"OUR NETWORK\",\"title\":\"AFGEO Member\",\"subtitle\":\"Association of Federation of Geoscientists of East and Southeast Asia\",\"background\":\"\"}', 'json', 'general', NULL, '2026-02-06 15:53:50', '2026-02-07 08:43:00'),
(24, 'faq_background', '{\"url\":\"\",\"filename\":\"\"}', 'json', 'landing_page', NULL, '2026-02-06 16:16:07', '2026-02-07 08:38:50'),
(25, 'faq_text', '{\"title\":\"Frequently Asked Question\",\"subtitle\":\"Follow these simple steps to submit your abstract for the conference\"}', 'json', 'general', NULL, '2026-02-06 16:19:50', '2026-02-07 20:05:08'),
(26, 'resources_text', '{\"section_label\":\"DOWNLOADS\",\"title\":\"Conference Resources\",\"subtitle\":\"Everything you need to prepare a professional presentation for the IAGI-GEOSEA 2026 conference.\"}', 'json', 'general', NULL, '2026-02-06 16:43:56', '2026-02-06 16:43:56'),
(27, 'custom_sections', '[{\"section_label\":\"pre-pit\",\"title\":\"Section Title\",\"subtitle\":\"Section description\",\"members\":[]}]', 'json', 'general', NULL, '2026-02-06 16:47:19', '2026-02-15 19:25:33');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_submissions_table', 1),
(5, '0001_01_01_000004_create_reviews_table', 1),
(6, '0001_01_01_000005_create_payments_table', 1),
(7, '2025_12_30_163635_add_role_to_users_table', 1),
(8, '2025_12_31_130304_add_registration_fields_to_users_table', 1),
(9, '2026_01_01_034330_add_detailed_fields_to_submissions_table', 2),
(10, '2026_01_01_043931_add_amount_to_payments_table', 3),
(11, '2026_01_01_153138_add_verified_at_to_payments_table', 4),
(12, '2026_01_02_020631_update_status_enum_in_submissions_table', 5),
(13, '2026_01_02_020718_make_review_scores_nullable', 6),
(14, '2026_01_09_074551_add_coauthor_institutes_to_submissions_table', 7),
(15, '2026_01_09_081454_add_category_and_keywords_to_submissions_table', 8),
(16, '2026_01_09_082336_change_presentation_preference_to_string', 9),
(17, '2026_01_15_014542_add_category_to_submissions_table', 10),
(18, '2026_01_15_062114_create_landing_page_settings_table', 11),
(19, '2026_01_15_170410_add_map_embed_url_to_landing_page_settings_table', 12),
(20, '2026_01_16_084439_add_resources_to_landing_page_settings_table', 12),
(21, '2026_01_17_141603_create_email_settings_table', 12),
(22, '2026_01_28_000633_add_paper_theme_to_submissions_table', 13),
(23, '2026_01_29_004020_create_settings_table', 14),
(25, '2026_01_29_155959_add_participant_category_to_submissions_table', 15),
(26, '2026_01_31_151833_add_production_indexes', 16),
(27, '2026_02_07_214830_add_unique_constraint_to_submission_code', 16),
(28, '2026_02_10_071139_add_publication_option_to_submissions_table', 16),
(29, '2026_02_13_004315_add_deletion_fields_to_submissions_table', 16),
(30, '2026_02_13_005428_add_deletion_requested_to_status_enum', 16),
(31, '2026_02_13_011410_create_page_visits_table', 16);

-- --------------------------------------------------------

--
-- Table structure for table `page_visits`
--

CREATE TABLE `page_visits` (
  `id` bigint UNSIGNED NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `page` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/',
  `visited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `page_visits`
--

INSERT INTO `page_visits` (`id`, `ip_address`, `user_agent`, `page`, `visited_at`, `created_at`, `updated_at`) VALUES
(1, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:35:05', '2026-02-12 19:35:05', '2026-02-12 19:35:05'),
(2, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:35:33', '2026-02-12 19:35:33', '2026-02-12 19:35:33'),
(3, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:36:35', '2026-02-12 19:36:35', '2026-02-12 19:36:35'),
(4, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:36:59', '2026-02-12 19:36:59', '2026-02-12 19:36:59'),
(5, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:39:35', '2026-02-12 19:39:35', '2026-02-12 19:39:35'),
(6, '66.249.82.136', 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse', '/', '2026-02-12 19:39:50', '2026-02-12 19:39:50', '2026-02-12 19:39:50'),
(7, '66.249.82.135', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse', '/', '2026-02-12 19:39:50', '2026-02-12 19:39:50', '2026-02-12 19:39:50'),
(8, '66.249.82.131', 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse', '/', '2026-02-12 19:39:54', '2026-02-12 19:39:54', '2026-02-12 19:39:54'),
(9, '66.249.82.129', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse', '/', '2026-02-12 19:39:54', '2026-02-12 19:39:54', '2026-02-12 19:39:54'),
(10, '66.249.82.129', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse', '/', '2026-02-12 19:40:00', '2026-02-12 19:40:00', '2026-02-12 19:40:00'),
(11, '66.249.82.131', 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse', '/', '2026-02-12 19:40:00', '2026-02-12 19:40:00', '2026-02-12 19:40:00'),
(12, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:55:16', '2026-02-12 19:55:16', '2026-02-12 19:55:16'),
(13, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:55:30', '2026-02-12 19:55:30', '2026-02-12 19:55:30'),
(14, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:56:11', '2026-02-12 19:56:11', '2026-02-12 19:56:11'),
(15, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:56:29', '2026-02-12 19:56:29', '2026-02-12 19:56:29'),
(16, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:56:45', '2026-02-12 19:56:45', '2026-02-12 19:56:45'),
(17, '117.54.157.194', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:58:01', '2026-02-12 19:58:01', '2026-02-12 19:58:01'),
(18, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:59:26', '2026-02-12 19:59:26', '2026-02-12 19:59:26'),
(19, '114.4.212.53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 19:59:34', '2026-02-12 19:59:34', '2026-02-12 19:59:34'),
(20, '210.5.32.67', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 20:01:30', '2026-02-12 20:01:30', '2026-02-12 20:01:30'),
(21, '66.96.243.194', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 20:51:11', '2026-02-12 20:51:11', '2026-02-12 20:51:11'),
(22, '103.26.102.82', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 20:51:14', '2026-02-12 20:51:14', '2026-02-12 20:51:14'),
(23, '182.2.164.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-12 20:51:15', '2026-02-12 20:51:15', '2026-02-12 20:51:15'),
(24, '103.155.193.139', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 21:03:06', '2026-02-12 21:03:06', '2026-02-12 21:03:06'),
(25, '2a12:a800:9:1:193:26:115:123', 'req/v3 (https://github.com/imroc/req)', '/', '2026-02-12 21:06:23', '2026-02-12 21:06:23', '2026-02-12 21:06:23'),
(26, '182.2.164.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-12 21:09:47', '2026-02-12 21:09:47', '2026-02-12 21:09:47'),
(27, '103.213.118.66', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 21:13:10', '2026-02-12 21:13:10', '2026-02-12 21:13:10'),
(28, '152.42.157.60', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-12 21:13:43', '2026-02-12 21:13:43', '2026-02-12 21:13:43'),
(29, '103.147.9.132', 'Mozilla/5.0 (Linux; Android 10; Infinix X680B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36', '/', '2026-02-12 21:25:39', '2026-02-12 21:25:39', '2026-02-12 21:25:39'),
(30, '2400:9800:2a8:d4:1893:afd8:ec4a:855a', 'Mozilla/5.0 (Linux; Android 10; Infinix X680B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36', '/', '2026-02-12 21:26:29', '2026-02-12 21:26:29', '2026-02-12 21:26:29'),
(31, '2400:9800:2a8:d4:1893:afd8:ec4a:855a', 'Mozilla/5.0 (Linux; Android 10; Infinix X680B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36', '/', '2026-02-12 21:26:34', '2026-02-12 21:26:34', '2026-02-12 21:26:34'),
(32, '2400:9800:2a8:d4:1893:afd8:ec4a:855a', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.36', '/', '2026-02-12 21:26:43', '2026-02-12 21:26:43', '2026-02-12 21:26:43'),
(33, '2400:9800:2a8:d4:1893:afd8:ec4a:855a', 'Mozilla/5.0 (Linux; Android 10; Infinix X680B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36', '/', '2026-02-12 21:26:53', '2026-02-12 21:26:53', '2026-02-12 21:26:53'),
(34, '2400:9800:2a8:d4:1893:afd8:ec4a:855a', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.36', '/', '2026-02-12 21:27:03', '2026-02-12 21:27:03', '2026-02-12 21:27:03'),
(35, '2400:9800:2a8:d4:1893:afd8:ec4a:855a', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Safari/537.36', '/', '2026-02-12 21:27:05', '2026-02-12 21:27:05', '2026-02-12 21:27:05'),
(36, '116.90.168.179', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 21:29:33', '2026-02-12 21:29:33', '2026-02-12 21:29:33'),
(37, '2404:c0:4aa0::28f:dda4', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 21:30:37', '2026-02-12 21:30:37', '2026-02-12 21:30:37'),
(38, '2404:c0:6710::50b:3c2c', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 22:00:31', '2026-02-12 22:00:31', '2026-02-12 22:00:31'),
(39, '2404:c0:6710::50b:3c2c', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 22:00:35', '2026-02-12 22:00:35', '2026-02-12 22:00:35'),
(40, '2404:c0:6710::50b:3c2c', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 22:00:48', '2026-02-12 22:00:48', '2026-02-12 22:00:48'),
(41, '114.10.150.145', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 22:12:11', '2026-02-12 22:12:11', '2026-02-12 22:12:11'),
(42, '114.10.135.87', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 22:23:18', '2026-02-12 22:23:18', '2026-02-12 22:23:18'),
(43, '2404:c0:2810::fd3:a22f', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 22:28:39', '2026-02-12 22:28:39', '2026-02-12 22:28:39'),
(44, '199.244.88.222', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36', '/', '2026-02-12 23:13:30', '2026-02-12 23:13:30', '2026-02-12 23:13:30'),
(45, '2404:c0:ba01:3275:5b34:6e54:c92a:6cf3', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 23:16:11', '2026-02-12 23:16:11', '2026-02-12 23:16:11'),
(46, '2404:c0:ba01:3275:5b34:6e54:c92a:6cf3', 'WhatsApp/2.23.20.0', '/', '2026-02-12 23:17:04', '2026-02-12 23:17:04', '2026-02-12 23:17:04'),
(47, '2404:c0:ba01:3275:5b34:6e54:c92a:6cf3', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 23:17:19', '2026-02-12 23:17:19', '2026-02-12 23:17:19'),
(48, '114.10.24.4', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1', '/', '2026-02-12 23:18:12', '2026-02-12 23:18:12', '2026-02-12 23:18:12'),
(49, '45.134.79.162', 'Mozilla/5.0', '/', '2026-02-12 23:25:22', '2026-02-12 23:25:22', '2026-02-12 23:25:22'),
(50, '2400:9800:1fe:b796:b9a9:678f:826b:1c0b', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1', '/', '2026-02-12 23:34:36', '2026-02-12 23:34:36', '2026-02-12 23:34:36'),
(51, '36.64.10.90', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-12 23:34:46', '2026-02-12 23:34:46', '2026-02-12 23:34:46'),
(52, '2404:c0:18a3:e4ba:7c37:76f0:3c57:a995', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-12 23:35:46', '2026-02-12 23:35:46', '2026-02-12 23:35:46'),
(53, '116.254.120.77', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-12 23:52:08', '2026-02-12 23:52:08', '2026-02-12 23:52:08'),
(54, '101.255.21.109', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 00:04:29', '2026-02-13 00:04:29', '2026-02-13 00:04:29'),
(55, '193.31.56.121', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36', '/', '2026-02-13 00:33:52', '2026-02-13 00:33:52', '2026-02-13 00:33:52'),
(56, '2405:2c40:2:0:254e:614d:2486:c70a', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 00:36:37', '2026-02-13 00:36:37', '2026-02-13 00:36:37'),
(57, '114.5.211.241', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 00:53:40', '2026-02-13 00:53:40', '2026-02-13 00:53:40'),
(58, '2404:c0:6a18:d68a:5c8d:3205:a64f:4740', 'WhatsApp/2.23.20.0', '/', '2026-02-13 00:58:44', '2026-02-13 00:58:44', '2026-02-13 00:58:44'),
(59, '2404:c0:6a18:d68a:5c8d:3205:a64f:4740', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 00:58:49', '2026-02-13 00:58:49', '2026-02-13 00:58:49'),
(60, '2404:c0:6a18:d68a:fddf:f7ea:fb66:d222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-13 01:01:07', '2026-02-13 01:01:07', '2026-02-13 01:01:07'),
(61, '182.255.3.212', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/329.0.660098639 Mobile/15E148 Safari/604.1', '/', '2026-02-13 01:03:16', '2026-02-13 01:03:16', '2026-02-13 01:03:16'),
(62, '66.249.82.12', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 01:03:17', '2026-02-13 01:03:17', '2026-02-13 01:03:17'),
(63, '66.249.82.11', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 01:03:17', '2026-02-13 01:03:17', '2026-02-13 01:03:17'),
(64, '66.102.6.102', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 01:03:18', '2026-02-13 01:03:18', '2026-02-13 01:03:18'),
(65, '66.102.6.100', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 01:03:18', '2026-02-13 01:03:18', '2026-02-13 01:03:18'),
(66, '66.102.6.100', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 01:03:18', '2026-02-13 01:03:18', '2026-02-13 01:03:18'),
(67, '66.102.6.100', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 01:03:19', '2026-02-13 01:03:19', '2026-02-13 01:03:19'),
(68, '114.122.230.14', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-13 01:04:48', '2026-02-13 01:04:48', '2026-02-13 01:04:48'),
(69, '114.122.230.14', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-13 01:07:24', '2026-02-13 01:07:24', '2026-02-13 01:07:24'),
(70, '103.178.218.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 01:08:59', '2026-02-13 01:08:59', '2026-02-13 01:08:59'),
(71, '2404:8000:1122:773:de7c:61b4:2d37:475d', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 03:02:13', '2026-02-13 03:02:13', '2026-02-13 03:02:13'),
(72, '114.8.203.125', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 03:42:20', '2026-02-13 03:42:20', '2026-02-13 03:42:20'),
(73, '36.73.33.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 04:00:48', '2026-02-13 04:00:48', '2026-02-13 04:00:48'),
(74, '36.73.33.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 04:01:47', '2026-02-13 04:01:47', '2026-02-13 04:01:47'),
(75, '51.159.99.216', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1', '/', '2026-02-13 04:02:01', '2026-02-13 04:02:01', '2026-02-13 04:02:01'),
(76, '182.8.225.163', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 04:19:14', '2026-02-13 04:19:14', '2026-02-13 04:19:14'),
(77, '119.2.52.122', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-13 04:19:27', '2026-02-13 04:19:27', '2026-02-13 04:19:27'),
(78, '182.8.225.163', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 04:22:28', '2026-02-13 04:22:28', '2026-02-13 04:22:28'),
(79, '182.8.225.163', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 04:23:40', '2026-02-13 04:23:40', '2026-02-13 04:23:40'),
(80, '2400:9800:922:ebd0:d05d:9f0e:ac41:dbfb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-13 04:41:16', '2026-02-13 04:41:16', '2026-02-13 04:41:16'),
(81, '114.10.153.165', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_11 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6.1 Mobile/15E148 Safari/604.1', '/', '2026-02-13 04:43:13', '2026-02-13 04:43:13', '2026-02-13 04:43:13'),
(82, '2400:9800:922:ebd0:d05d:9f0e:ac41:dbfb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-13 04:45:08', '2026-02-13 04:45:08', '2026-02-13 04:45:08'),
(83, '2400:9800:922:ebd0:d05d:9f0e:ac41:dbfb', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-13 04:47:00', '2026-02-13 04:47:00', '2026-02-13 04:47:00'),
(84, '114.10.138.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 04:50:36', '2026-02-13 04:50:36', '2026-02-13 04:50:36'),
(85, '182.8.182.177', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-13 05:15:29', '2026-02-13 05:15:29', '2026-02-13 05:15:29'),
(86, '114.10.42.4', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 05:23:57', '2026-02-13 05:23:57', '2026-02-13 05:23:57'),
(87, '114.10.153.165', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_11 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6.1 Mobile/15E148 Safari/604.1', '/', '2026-02-13 05:30:10', '2026-02-13 05:30:10', '2026-02-13 05:30:10'),
(88, '114.8.203.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:04:58', '2026-02-13 06:04:58', '2026-02-13 06:04:58'),
(89, '114.8.203.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:06:41', '2026-02-13 06:06:41', '2026-02-13 06:06:41'),
(90, '140.213.45.231', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 06:07:32', '2026-02-13 06:07:32', '2026-02-13 06:07:32'),
(91, '103.139.11.218', 'WhatsApp/2.23.20.0', '/', '2026-02-13 06:07:37', '2026-02-13 06:07:37', '2026-02-13 06:07:37'),
(92, '114.8.211.75', 'Mozilla/5.0 (Linux; U; Android 13; en-us; CPH2217 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.72 Mobile Safari/537.36 HeyTapBrowser/45.13.8.1', '/', '2026-02-13 06:09:44', '2026-02-13 06:09:44', '2026-02-13 06:09:44'),
(93, '2404:c0:a701:a4eb:8c6b:afa1:199a:7802', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 06:10:40', '2026-02-13 06:10:40', '2026-02-13 06:10:40'),
(94, '114.8.203.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:14:45', '2026-02-13 06:14:45', '2026-02-13 06:14:45'),
(95, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:15:05', '2026-02-13 06:15:05', '2026-02-13 06:15:05'),
(96, '2404:c0:a701:a4eb:e073:9ee3:29ca:910a', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-13 06:19:55', '2026-02-13 06:19:55', '2026-02-13 06:19:55'),
(97, '2404:c0:a701:a4eb:e073:9ee3:29ca:910a', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-13 06:20:49', '2026-02-13 06:20:49', '2026-02-13 06:20:49'),
(98, '103.147.9.132', 'Mozilla/5.0 (Linux; Android 10; Infinix X680B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36', '/', '2026-02-13 06:28:21', '2026-02-13 06:28:21', '2026-02-13 06:28:21'),
(99, '103.147.9.132', 'Mozilla/5.0 (Linux; Android 10; Infinix X680B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36', '/', '2026-02-13 06:29:23', '2026-02-13 06:29:23', '2026-02-13 06:29:23'),
(100, '2407:0:3006:28a2:d8ce:d2fb:c243:4c88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-13 06:33:43', '2026-02-13 06:33:43', '2026-02-13 06:33:43'),
(101, '103.106.216.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:33:49', '2026-02-13 06:33:49', '2026-02-13 06:33:49'),
(102, '2407:0:3006:28a2:d8ce:d2fb:c243:4c88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-13 06:37:25', '2026-02-13 06:37:25', '2026-02-13 06:37:25'),
(103, '114.8.203.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:44:12', '2026-02-13 06:44:12', '2026-02-13 06:44:12'),
(104, '114.8.203.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:44:13', '2026-02-13 06:44:13', '2026-02-13 06:44:13'),
(105, '114.8.203.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 06:44:33', '2026-02-13 06:44:33', '2026-02-13 06:44:33'),
(106, '182.253.183.201', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 07:23:38', '2026-02-13 07:23:38', '2026-02-13 07:23:38'),
(107, '114.7.198.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 07:26:58', '2026-02-13 07:26:58', '2026-02-13 07:26:58'),
(108, '194.132.201.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123', '/', '2026-02-13 07:31:19', '2026-02-13 07:31:19', '2026-02-13 07:31:19'),
(109, '115.178.238.19', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 07:35:34', '2026-02-13 07:35:34', '2026-02-13 07:35:34'),
(110, '2400:9800:ba0:879b:6094:a6f7:400c:6010', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 07:38:46', '2026-02-13 07:38:46', '2026-02-13 07:38:46'),
(111, '125.166.167.194', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-13 07:50:53', '2026-02-13 07:50:53', '2026-02-13 07:50:53'),
(112, '125.166.167.194', 'WhatsApp/2.23.20.0', '/', '2026-02-13 07:51:12', '2026-02-13 07:51:12', '2026-02-13 07:51:12'),
(113, '114.10.138.225', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 08:35:19', '2026-02-13 08:35:19', '2026-02-13 08:35:19'),
(114, '114.10.104.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 09:02:03', '2026-02-13 09:02:03', '2026-02-13 09:02:03'),
(115, '114.10.104.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 09:03:22', '2026-02-13 09:03:22', '2026-02-13 09:03:22'),
(116, '114.10.104.136', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-13 09:05:09', '2026-02-13 09:05:09', '2026-02-13 09:05:09'),
(117, '114.10.104.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 09:06:04', '2026-02-13 09:06:04', '2026-02-13 09:06:04'),
(118, '114.10.104.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 09:06:04', '2026-02-13 09:06:04', '2026-02-13 09:06:04'),
(119, '185.54.49.166', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', '/', '2026-02-13 10:17:18', '2026-02-13 10:17:18', '2026-02-13 10:17:18'),
(120, '114.8.203.125', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 10:18:52', '2026-02-13 10:18:52', '2026-02-13 10:18:52'),
(121, '185.6.10.201', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123', '/', '2026-02-13 11:31:31', '2026-02-13 11:31:31', '2026-02-13 11:31:31'),
(122, '2001:448a:2093:353a:3c6d:5335:96b2:faef', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1', '/', '2026-02-13 11:36:31', '2026-02-13 11:36:31', '2026-02-13 11:36:31'),
(123, '180.248.38.135', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 14:02:13', '2026-02-13 14:02:13', '2026-02-13 14:02:13'),
(124, '2404:c0:a701:a4eb:e073:9ee3:29ca:910a', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-13 15:22:42', '2026-02-13 15:22:42', '2026-02-13 15:22:42'),
(125, '210.5.32.67', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 15:46:31', '2026-02-13 15:46:31', '2026-02-13 15:46:31'),
(126, '112.215.237.7', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 16:42:01', '2026-02-13 16:42:01', '2026-02-13 16:42:01'),
(127, '66.249.71.69', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.7559.132 Mobile Safari/537.36 (compatible; GoogleOther)', '/', '2026-02-13 16:57:17', '2026-02-13 16:57:17', '2026-02-13 16:57:17'),
(128, '2404:c0:8010::26:ae6c', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 17:35:32', '2026-02-13 17:35:32', '2026-02-13 17:35:32'),
(129, '167.205.0.250', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 17:57:31', '2026-02-13 17:57:31', '2026-02-13 17:57:31'),
(130, '167.205.0.250', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 18:00:42', '2026-02-13 18:00:42', '2026-02-13 18:00:42'),
(131, '167.205.0.250', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 18:10:13', '2026-02-13 18:10:13', '2026-02-13 18:10:13'),
(132, '66.249.83.137', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 18:10:18', '2026-02-13 18:10:18', '2026-02-13 18:10:18'),
(133, '66.249.83.136', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 18:10:19', '2026-02-13 18:10:19', '2026-02-13 18:10:19'),
(134, '66.249.83.128', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-13 18:10:19', '2026-02-13 18:10:19', '2026-02-13 18:10:19'),
(135, '202.65.238.78', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 18:36:30', '2026-02-13 18:36:30', '2026-02-13 18:36:30'),
(136, '66.249.71.68', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.7559.132 Mobile Safari/537.36 (compatible; GoogleOther)', '/', '2026-02-13 18:52:16', '2026-02-13 18:52:16', '2026-02-13 18:52:16'),
(137, '114.10.42.4', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 19:28:41', '2026-02-13 19:28:41', '2026-02-13 19:28:41'),
(138, '2404:c0:5c10::279:cd35', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 19:34:37', '2026-02-13 19:34:37', '2026-02-13 19:34:37'),
(139, '114.122.100.61', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 19:51:47', '2026-02-13 19:51:47', '2026-02-13 19:51:47'),
(140, '182.10.129.173', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 20:05:55', '2026-02-13 20:05:55', '2026-02-13 20:05:55'),
(141, '202.65.238.78', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 20:24:23', '2026-02-13 20:24:23', '2026-02-13 20:24:23'),
(142, '202.65.238.78', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 20:24:40', '2026-02-13 20:24:40', '2026-02-13 20:24:40'),
(143, '2001:448a:d010:94f:dd9e:b46b:9085:9580', 'WhatsApp/2.23.20.0', '/', '2026-02-13 20:47:08', '2026-02-13 20:47:08', '2026-02-13 20:47:08'),
(144, '114.122.115.241', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-13 20:56:35', '2026-02-13 20:56:35', '2026-02-13 20:56:35'),
(145, '2001:448a:10b0:fec:10d6:7f04:fcdb:ee65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-13 21:17:36', '2026-02-13 21:17:36', '2026-02-13 21:17:36'),
(146, '2620:101:2002:11a5:10:8:141:58', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0', '/', '2026-02-13 22:14:57', '2026-02-13 22:14:57', '2026-02-13 22:14:57'),
(147, '180.252.167.68', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1', '/', '2026-02-13 22:48:23', '2026-02-13 22:48:23', '2026-02-13 22:48:23'),
(148, '178.128.236.2', 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0', '/', '2026-02-14 00:03:25', '2026-02-14 00:03:25', '2026-02-14 00:03:25'),
(149, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 00:19:37', '2026-02-14 00:19:37', '2026-02-14 00:19:37'),
(150, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 00:23:10', '2026-02-14 00:23:10', '2026-02-14 00:23:10'),
(151, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 00:30:59', '2026-02-14 00:30:59', '2026-02-14 00:30:59'),
(152, '206.127.197.204', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36', '/', '2026-02-14 00:31:41', '2026-02-14 00:31:41', '2026-02-14 00:31:41'),
(153, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 01:08:14', '2026-02-14 01:08:14', '2026-02-14 01:08:14'),
(154, '158.140.172.60', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 01:10:11', '2026-02-14 01:10:11', '2026-02-14 01:10:11'),
(155, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 01:17:37', '2026-02-14 01:17:37', '2026-02-14 01:17:37'),
(156, '103.3.221.167', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 01:19:03', '2026-02-14 01:19:03', '2026-02-14 01:19:03'),
(157, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 01:25:46', '2026-02-14 01:25:46', '2026-02-14 01:25:46'),
(158, '36.72.216.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 02:39:33', '2026-02-14 02:39:33', '2026-02-14 02:39:33'),
(159, '124.158.147.109', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 02:46:36', '2026-02-14 02:46:36', '2026-02-14 02:46:36'),
(160, '198.235.24.153', 'Hello from Palo Alto Networks, find out more about our scans in https://docs-cortex.paloaltonetworks.com/r/1/Cortex-Xpanse/Scanning-activity', '/', '2026-02-14 03:23:23', '2026-02-14 03:23:23', '2026-02-14 03:23:23'),
(161, '2400:9800:1f7:b0d3:1894:14f9:6239:90b4', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 03:26:31', '2026-02-14 03:26:31', '2026-02-14 03:26:31'),
(162, '2400:9800:1f7:b0d3:1894:14f9:6239:90b4', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 03:29:43', '2026-02-14 03:29:43', '2026-02-14 03:29:43'),
(163, '2001:448a:50a0:a88:22e:b471:68e9:b3aa', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 03:46:03', '2026-02-14 03:46:03', '2026-02-14 03:46:03'),
(164, '2404:c0:b301:5cf3:cd28:a734:8852:4118', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 06:15:11', '2026-02-14 06:15:11', '2026-02-14 06:15:11'),
(165, '8.221.138.111', 'Go-http-client/1.1', '/', '2026-02-14 06:30:00', '2026-02-14 06:30:00', '2026-02-14 06:30:00'),
(166, '182.2.51.7', 'Mozilla/5.0 (Linux; Android 12; V2030) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.118 Mobile Safari/537.36 VivoBrowser/15.1.0.3', '/', '2026-02-14 07:34:01', '2026-02-14 07:34:01', '2026-02-14 07:34:01'),
(167, '2404:8000:1031:1be1:f5f0:c17f:f2f7:823c', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-14 07:59:32', '2026-02-14 07:59:32', '2026-02-14 07:59:32'),
(168, '103.125.50.170', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-14 08:20:10', '2026-02-14 08:20:10', '2026-02-14 08:20:10'),
(169, '103.125.50.170', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-14 08:24:29', '2026-02-14 08:24:29', '2026-02-14 08:24:29'),
(170, '182.253.247.69', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-14 08:47:41', '2026-02-14 08:47:41', '2026-02-14 08:47:41'),
(171, '114.10.44.28', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 09:25:55', '2026-02-14 09:25:55', '2026-02-14 09:25:55'),
(172, '114.10.44.28', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 09:27:40', '2026-02-14 09:27:40', '2026-02-14 09:27:40'),
(173, '2404:c0:202a:6080:1:0:5f7:35aa', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 11:04:30', '2026-02-14 11:04:30', '2026-02-14 11:04:30'),
(174, '2404:c0:b301:5cf3:cd28:a734:8852:4118', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 15:49:29', '2026-02-14 15:49:29', '2026-02-14 15:49:29'),
(175, '2400:9800:a03:65db:ce4b:2fb9:ff5b:904f', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 18:42:10', '2026-02-14 18:42:10', '2026-02-14 18:42:10'),
(176, '5.133.192.128', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36', '/', '2026-02-14 19:10:03', '2026-02-14 19:10:03', '2026-02-14 19:10:03'),
(177, '114.125.189.244', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '/', '2026-02-14 20:05:37', '2026-02-14 20:05:37', '2026-02-14 20:05:37'),
(178, '114.10.135.225', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1', '/', '2026-02-14 20:16:29', '2026-02-14 20:16:29', '2026-02-14 20:16:29'),
(179, '185.91.69.242', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 YaBrowser/22.7.0 Yowser/2.5 Safari/537.36', '/', '2026-02-14 21:07:30', '2026-02-14 21:07:30', '2026-02-14 21:07:30'),
(180, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 22:07:38', '2026-02-14 22:07:38', '2026-02-14 22:07:38'),
(181, '160.22.223.29', 'QR Scanner Android', '/', '2026-02-14 22:11:30', '2026-02-14 22:11:30', '2026-02-14 22:11:30'),
(182, '160.22.223.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-14 22:11:48', '2026-02-14 22:11:48', '2026-02-14 22:11:48'),
(183, '93.114.14.185', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36', '/', '2026-02-15 00:34:52', '2026-02-15 00:34:52', '2026-02-15 00:34:52'),
(184, '103.211.184.47', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36', '/', '2026-02-15 00:34:54', '2026-02-15 00:34:54', '2026-02-15 00:34:54'),
(185, '114.122.237.250', 'Mozilla/5.0 (Linux; Android 14; SM-A736B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Mobile Safari/537.36 Line/26.1.1/IAB', '/', '2026-02-15 01:31:44', '2026-02-15 01:31:44', '2026-02-15 01:31:44'),
(186, '114.122.237.250', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36', '/', '2026-02-15 01:32:10', '2026-02-15 01:32:10', '2026-02-15 01:32:10'),
(187, '114.122.237.250', 'WhatsApp/2.23.20.0', '/', '2026-02-15 01:32:14', '2026-02-15 01:32:14', '2026-02-15 01:32:14'),
(188, '114.7.193.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 01:32:43', '2026-02-15 01:32:43', '2026-02-15 01:32:43'),
(189, '2404:c0:9aa0::2f4b:da07', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-15 01:39:30', '2026-02-15 01:39:30', '2026-02-15 01:39:30'),
(190, '2407:0:3006:28a2:100c:aa27:d3b7:2fa1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-15 02:33:37', '2026-02-15 02:33:37', '2026-02-15 02:33:37'),
(191, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 03:31:16', '2026-02-15 03:31:16', '2026-02-15 03:31:16'),
(192, '47.74.46.81', 'Go-http-client/1.1', '/', '2026-02-15 05:19:31', '2026-02-15 05:19:31', '2026-02-15 05:19:31'),
(193, '149.57.180.199', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', '/', '2026-02-15 06:56:11', '2026-02-15 06:56:11', '2026-02-15 06:56:11'),
(194, '182.2.52.197', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-15 06:56:27', '2026-02-15 06:56:27', '2026-02-15 06:56:27'),
(195, '23.27.145.66', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', '/', '2026-02-15 06:56:48', '2026-02-15 06:56:48', '2026-02-15 06:56:48'),
(196, '2404:c0:2420::683:3356', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.2 Mobile/15E148 Safari/604.1', '/', '2026-02-15 07:12:40', '2026-02-15 07:12:40', '2026-02-15 07:12:40'),
(197, '192.36.109.214', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.3', '/', '2026-02-15 08:43:20', '2026-02-15 08:43:20', '2026-02-15 08:43:20'),
(198, '23.27.145.136', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', '/', '2026-02-15 11:13:51', '2026-02-15 11:13:51', '2026-02-15 11:13:51'),
(199, '2a09:bac3:3995:2723::3e6:2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-15 11:51:42', '2026-02-15 11:51:42', '2026-02-15 11:51:42'),
(200, '182.2.76.157', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-15 14:52:23', '2026-02-15 14:52:23', '2026-02-15 14:52:23'),
(201, '182.2.76.157', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-15 15:11:31', '2026-02-15 15:11:31', '2026-02-15 15:11:31'),
(202, '2a01:4ff:f0:75bf::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '/', '2026-02-15 15:16:53', '2026-02-15 15:16:53', '2026-02-15 15:16:53'),
(203, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 16:12:02', '2026-02-15 16:12:02', '2026-02-15 16:12:02'),
(204, '103.165.229.202', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-15 18:25:43', '2026-02-15 18:25:43', '2026-02-15 18:25:43'),
(205, '114.10.150.88', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', '/', '2026-02-15 18:30:29', '2026-02-15 18:30:29', '2026-02-15 18:30:29'),
(206, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 19:23:39', '2026-02-15 19:23:39', '2026-02-15 19:23:39'),
(207, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 19:25:37', '2026-02-15 19:25:37', '2026-02-15 19:25:37'),
(208, '114.8.222.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-15 19:26:34', '2026-02-15 19:26:34', '2026-02-15 19:26:34'),
(209, '160.22.223.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 20:11:33', '2026-02-15 20:11:33', '2026-02-15 20:11:33'),
(210, '182.8.227.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-15 20:18:13', '2026-02-15 20:18:13', '2026-02-15 20:18:13'),
(211, '2001:4ca0:108:42::7', 'quic-go-HTTP/3', '/', '2026-02-15 20:56:58', '2026-02-15 20:56:58', '2026-02-15 20:56:58'),
(212, '146.112.163.34', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-15 22:57:09', '2026-02-15 22:57:09', '2026-02-15 22:57:09'),
(213, '64.227.103.37', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '/', '2026-02-15 23:32:19', '2026-02-15 23:32:19', '2026-02-15 23:32:19'),
(214, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 01:47:46', '2026-02-16 01:47:46', '2026-02-16 01:47:46'),
(215, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 02:04:02', '2026-02-16 02:04:02', '2026-02-16 02:04:02'),
(216, '180.243.121.61', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-16 02:32:53', '2026-02-16 02:32:53', '2026-02-16 02:32:53'),
(217, '160.22.223.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 02:52:03', '2026-02-16 02:52:03', '2026-02-16 02:52:03'),
(218, '180.242.12.72', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 03:00:12', '2026-02-16 03:00:12', '2026-02-16 03:00:12'),
(219, '114.122.23.217', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 03:06:36', '2026-02-16 03:06:36', '2026-02-16 03:06:36'),
(220, '114.122.23.217', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 03:07:26', '2026-02-16 03:07:26', '2026-02-16 03:07:26'),
(221, '114.122.23.217', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 03:15:03', '2026-02-16 03:15:03', '2026-02-16 03:15:03'),
(222, '158.140.165.22', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 03:34:50', '2026-02-16 03:34:50', '2026-02-16 03:34:50'),
(223, '158.140.165.8', 'WhatsApp/2.23.20.0', '/', '2026-02-16 03:47:04', '2026-02-16 03:47:04', '2026-02-16 03:47:04'),
(224, '158.140.165.8', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 03:56:35', '2026-02-16 03:56:35', '2026-02-16 03:56:35'),
(225, '2400:9800:5a0:2f7e:1:0:67c9:7793', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 04:03:45', '2026-02-16 04:03:45', '2026-02-16 04:03:45'),
(226, '2400:9800:5a0:2f7e:1:0:67c9:7793', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 04:04:39', '2026-02-16 04:04:39', '2026-02-16 04:04:39'),
(227, '140.213.217.140', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_14 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6.1 Mobile/15E148 Safari/604.1', '/', '2026-02-16 04:39:11', '2026-02-16 04:39:11', '2026-02-16 04:39:11'),
(228, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 10:36:00', '2026-02-16 10:36:00', '2026-02-16 10:36:00'),
(229, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:01', '2026-02-16 14:31:01', '2026-02-16 14:31:01');
INSERT INTO `page_visits` (`id`, `ip_address`, `user_agent`, `page`, `visited_at`, `created_at`, `updated_at`) VALUES
(230, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:01', '2026-02-16 14:31:01', '2026-02-16 14:31:01'),
(231, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:01', '2026-02-16 14:31:01', '2026-02-16 14:31:01'),
(232, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:01', '2026-02-16 14:31:01', '2026-02-16 14:31:01'),
(233, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:02', '2026-02-16 14:31:02', '2026-02-16 14:31:02'),
(234, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:02', '2026-02-16 14:31:02', '2026-02-16 14:31:02'),
(235, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:02', '2026-02-16 14:31:02', '2026-02-16 14:31:02'),
(236, '34.252.183.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '/', '2026-02-16 14:31:02', '2026-02-16 14:31:02', '2026-02-16 14:31:02'),
(237, '198.235.24.93', 'Hello from Palo Alto Networks, find out more about our scans in https://docs-cortex.paloaltonetworks.com/r/1/Cortex-Xpanse/Scanning-activity', '/', '2026-02-16 14:51:09', '2026-02-16 14:51:09', '2026-02-16 14:51:09'),
(238, '182.8.227.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 16:04:07', '2026-02-16 16:04:07', '2026-02-16 16:04:07'),
(239, '2600:1f18:6864:8005:9dd0:33bf:853:d294', 'Mozilla/5.0', '/', '2026-02-16 21:09:15', '2026-02-16 21:09:15', '2026-02-16 21:09:15'),
(240, '2600:1f18:6864:8005:9dd0:33bf:853:d294', 'Mozilla/5.0', '/', '2026-02-16 21:09:18', '2026-02-16 21:09:18', '2026-02-16 21:09:18'),
(241, '2001:4860:7:506::f9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-16 21:13:49', '2026-02-16 21:13:49', '2026-02-16 21:13:49'),
(242, '114.10.42.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-16 21:43:01', '2026-02-16 21:43:01', '2026-02-16 21:43:01'),
(243, '114.5.250.253', 'WhatsApp/2.23.20.0', '/', '2026-02-16 22:37:14', '2026-02-16 22:37:14', '2026-02-16 22:37:14'),
(244, '114.5.250.253', 'WhatsApp/2.23.20.0', '/', '2026-02-16 22:37:14', '2026-02-16 22:37:14', '2026-02-16 22:37:14'),
(245, '76.13.16.118', 'Mozilla/5.0', '/', '2026-02-16 22:45:39', '2026-02-16 22:45:39', '2026-02-16 22:45:39'),
(246, '76.13.16.118', 'Mozilla/5.0', '/', '2026-02-16 22:45:39', '2026-02-16 22:45:39', '2026-02-16 22:45:39'),
(247, '114.5.250.253', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 22:45:40', '2026-02-16 22:45:40', '2026-02-16 22:45:40'),
(248, '114.5.250.253', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 22:50:14', '2026-02-16 22:50:14', '2026-02-16 22:50:14'),
(249, '209.38.125.40', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1', '/', '2026-02-16 23:01:27', '2026-02-16 23:01:27', '2026-02-16 23:01:27'),
(250, '36.72.207.113', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-16 23:44:45', '2026-02-16 23:44:45', '2026-02-16 23:44:45'),
(251, '36.72.207.113', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-16 23:45:43', '2026-02-16 23:45:43', '2026-02-16 23:45:43'),
(252, '36.72.207.113', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-16 23:46:05', '2026-02-16 23:46:05', '2026-02-16 23:46:05'),
(253, '2400:9800:5a0:e154:1:0:6c14:9067', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-16 23:56:32', '2026-02-16 23:56:32', '2026-02-16 23:56:32'),
(254, '103.222.255.184', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 01:59:25', '2026-02-17 01:59:25', '2026-02-17 01:59:25'),
(255, '2404:c0:2f10::1876:9382', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 02:21:19', '2026-02-17 02:21:19', '2026-02-17 02:21:19'),
(256, '36.74.192.161', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 02:26:30', '2026-02-17 02:26:30', '2026-02-17 02:26:30'),
(257, '140.213.190.214', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 05:14:23', '2026-02-17 05:14:23', '2026-02-17 05:14:23'),
(258, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 05:22:27', '2026-02-17 05:22:27', '2026-02-17 05:22:27'),
(259, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 06:07:53', '2026-02-17 06:07:53', '2026-02-17 06:07:53'),
(260, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 06:09:44', '2026-02-17 06:09:44', '2026-02-17 06:09:44'),
(261, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 06:09:57', '2026-02-17 06:09:57', '2026-02-17 06:09:57'),
(262, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 06:11:26', '2026-02-17 06:11:26', '2026-02-17 06:11:26'),
(263, '59.153.83.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 06:14:16', '2026-02-17 06:14:16', '2026-02-17 06:14:16'),
(264, '2404:c0:b301:5cf3:cd28:a734:8852:4118', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 06:22:56', '2026-02-17 06:22:56', '2026-02-17 06:22:56'),
(265, '103.169.238.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', '/', '2026-02-17 06:24:54', '2026-02-17 06:24:54', '2026-02-17 06:24:54'),
(266, '182.4.69.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-17 06:29:20', '2026-02-17 06:29:20', '2026-02-17 06:29:20'),
(267, '52.112.49.157', 'Mozilla/5.0 (Windows NT 6.1; WOW64) SkypeUriPreview Preview/0.5 skype-url-preview@microsoft.com', '/', '2026-02-17 06:30:14', '2026-02-17 06:30:14', '2026-02-17 06:30:14'),
(268, '52.112.49.156', 'Mozilla/5.0 (Windows NT 6.1; WOW64) SkypeUriPreview Preview/0.5 skype-url-preview@microsoft.com', '/', '2026-02-17 06:30:16', '2026-02-17 06:30:16', '2026-02-17 06:30:16'),
(269, '52.112.74.62', '', '/', '2026-02-17 06:30:17', '2026-02-17 06:30:17', '2026-02-17 06:30:17'),
(270, '182.4.69.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '/', '2026-02-17 06:35:45', '2026-02-17 06:35:45', '2026-02-17 06:35:45'),
(271, '2401:3c00:0:4c96:14bf:b3ff:fe91:56a4', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 07:49:28', '2026-02-17 07:49:28', '2026-02-17 07:49:28'),
(272, '192.36.109.82', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604', '/', '2026-02-17 08:00:46', '2026-02-17 08:00:46', '2026-02-17 08:00:46'),
(273, '192.71.142.150', 'Mozilla/5.0 (Android 14; Mobile; rv:123.0) Gecko/123.0 Firefox/123', '/', '2026-02-17 11:44:15', '2026-02-17 11:44:15', '2026-02-17 11:44:15'),
(274, '180.242.108.57', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-17 12:22:44', '2026-02-17 12:22:44', '2026-02-17 12:22:44'),
(275, '2a0c:5bc0:40:2e26:d1a0:bfa8:ca6:4e6f', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 14:55:50', '2026-02-17 14:55:50', '2026-02-17 14:55:50'),
(276, '2a04:4e41:5e00:3b27::5c9c:1b27', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-17 15:10:00', '2026-02-17 15:10:00', '2026-02-17 15:10:00'),
(277, '2001:448a:2020:b456:5935:7250:2405:ed0d', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 15:31:30', '2026-02-17 15:31:30', '2026-02-17 15:31:30'),
(278, '60.48.168.24', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '/', '2026-02-17 15:53:32', '2026-02-17 15:53:32', '2026-02-17 15:53:32'),
(279, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 16:25:39', '2026-02-17 16:25:39', '2026-02-17 16:25:39'),
(280, '2404:c0:5820::445:53e6', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 16:39:55', '2026-02-17 16:39:55', '2026-02-17 16:39:55'),
(281, '2404:c0:5820::445:53e6', 'WhatsApp/2.23.20.0', '/', '2026-02-17 16:40:16', '2026-02-17 16:40:16', '2026-02-17 16:40:16'),
(282, '2404:c0:5820::445:a1c3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 16:40:33', '2026-02-17 16:40:33', '2026-02-17 16:40:33'),
(283, '2404:c0:5820::445:a1c3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 16:57:02', '2026-02-17 16:57:02', '2026-02-17 16:57:02'),
(284, '182.3.37.110', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '/', '2026-02-17 18:07:12', '2026-02-17 18:07:12', '2026-02-17 18:07:12'),
(285, '2404:c0:5c10::6d2:9888', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '/', '2026-02-17 18:11:41', '2026-02-17 18:11:41', '2026-02-17 18:11:41'),
(286, '103.121.159.234', 'WhatsApp/2.23.20.0', '/', '2026-02-17 18:12:18', '2026-02-17 18:12:18', '2026-02-17 18:12:18'),
(287, '2001:4860:7:811::eb', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 18:18:11', '2026-02-17 18:18:11', '2026-02-17 18:18:11'),
(288, '202.65.238.202', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 18:22:39', '2026-02-17 18:22:39', '2026-02-17 18:22:39'),
(289, '140.213.165.90', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 19:44:23', '2026-02-17 19:44:23', '2026-02-17 19:44:23'),
(290, '2001:4860:7:506::ee', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 20:07:29', '2026-02-17 20:07:29', '2026-02-17 20:07:29'),
(291, '116.90.168.179', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 20:07:29', '2026-02-17 20:07:29', '2026-02-17 20:07:29'),
(292, '103.141.104.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 20:21:16', '2026-02-17 20:21:16', '2026-02-17 20:21:16'),
(293, '138.199.22.152', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3', '/', '2026-02-17 20:42:35', '2026-02-17 20:42:35', '2026-02-17 20:42:35'),
(294, '147.92.179.118', 'facebookexternalhit/1.1;line-poker/1.0', '/', '2026-02-17 21:03:27', '2026-02-17 21:03:27', '2026-02-17 21:03:27'),
(295, '182.255.6.137', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-17 21:22:42', '2026-02-17 21:22:42', '2026-02-17 21:22:42'),
(296, '2404:c0:4260::23c1:3f72', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1', '/', '2026-02-17 21:24:59', '2026-02-17 21:24:59', '2026-02-17 21:24:59'),
(297, '2404:c0:4260::23c1:3f72', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1', '/', '2026-02-17 21:25:00', '2026-02-17 21:25:00', '2026-02-17 21:25:00'),
(298, '116.90.168.179', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-17 21:44:41', '2026-02-17 21:44:41', '2026-02-17 21:44:41'),
(299, '103.127.64.202', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-17 22:03:18', '2026-02-17 22:03:18', '2026-02-17 22:03:18'),
(300, '103.127.64.202', 'WhatsApp/2.2605.103 W', '/', '2026-02-17 22:05:12', '2026-02-17 22:05:12', '2026-02-17 22:05:12'),
(301, '147.92.179.108', 'facebookexternalhit/1.1;line-poker/1.0', '/', '2026-02-17 22:49:42', '2026-02-17 22:49:42', '2026-02-17 22:49:42'),
(302, '2404:c0:1450::6a5a:7dbe', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 00:19:40', '2026-02-18 00:19:40', '2026-02-18 00:19:40'),
(303, '116.90.168.179', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 00:28:23', '2026-02-18 00:28:23', '2026-02-18 00:28:23'),
(304, '2404:c0:1470::69e9:c21', 'Mozilla/5.0 (Linux; Android 16;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 00:42:59', '2026-02-18 00:42:59', '2026-02-18 00:42:59'),
(305, '2404:c0:1470::69e9:c21', 'WhatsApp/2.23.20.0', '/', '2026-02-18 00:43:00', '2026-02-18 00:43:00', '2026-02-18 00:43:00'),
(306, '114.125.7.62', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 00:43:11', '2026-02-18 00:43:11', '2026-02-18 00:43:11'),
(307, '138.197.81.160', 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0', '/', '2026-02-18 00:53:14', '2026-02-18 00:53:14', '2026-02-18 00:53:14'),
(308, '114.125.5.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 01:01:38', '2026-02-18 01:01:38', '2026-02-18 01:01:38'),
(309, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 02:01:21', '2026-02-18 02:01:21', '2026-02-18 02:01:21'),
(310, '114.7.193.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 02:10:20', '2026-02-18 02:10:20', '2026-02-18 02:10:20'),
(311, '114.7.193.2', 'WhatsApp/2.2603.102 W', '/', '2026-02-18 02:10:32', '2026-02-18 02:10:32', '2026-02-18 02:10:32'),
(312, '114.122.237.74', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 02:11:39', '2026-02-18 02:11:39', '2026-02-18 02:11:39'),
(313, '64.233.173.162', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-18 02:11:42', '2026-02-18 02:11:42', '2026-02-18 02:11:42'),
(314, '64.233.173.163', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-18 02:11:42', '2026-02-18 02:11:42', '2026-02-18 02:11:42'),
(315, '64.233.172.40', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)', '/', '2026-02-18 02:11:43', '2026-02-18 02:11:43', '2026-02-18 02:11:43'),
(316, '114.122.237.74', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 02:21:38', '2026-02-18 02:21:38', '2026-02-18 02:21:38'),
(317, '114.122.237.74', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 02:23:51', '2026-02-18 02:23:51', '2026-02-18 02:23:51'),
(318, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 02:46:00', '2026-02-18 02:46:00', '2026-02-18 02:46:00'),
(319, '2001:4860:7:1512::fd', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-18 03:23:15', '2026-02-18 03:23:15', '2026-02-18 03:23:15'),
(320, '2001:4860:7:1412::fb', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-18 03:23:24', '2026-02-18 03:23:24', '2026-02-18 03:23:24'),
(321, '2001:4860:7:612::f9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '/', '2026-02-18 03:35:11', '2026-02-18 03:35:11', '2026-02-18 03:35:11'),
(322, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 04:05:56', '2026-02-18 04:05:56', '2026-02-18 04:05:56'),
(323, '2404:c0:9aa0::3112:4c18', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 05:43:15', '2026-02-18 05:43:15', '2026-02-18 05:43:15'),
(324, '2a01:4ff:f0:75bf::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '/', '2026-02-18 05:52:23', '2026-02-18 05:52:23', '2026-02-18 05:52:23'),
(325, '52.205.183.147', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0', '/', '2026-02-18 06:15:52', '2026-02-18 06:15:52', '2026-02-18 06:15:52'),
(326, '202.65.233.235', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 06:23:44', '2026-02-18 06:23:44', '2026-02-18 06:23:44'),
(327, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 06:26:01', '2026-02-18 06:26:01', '2026-02-18 06:26:01'),
(328, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 06:26:08', '2026-02-18 06:26:08', '2026-02-18 06:26:08'),
(329, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 06:37:50', '2026-02-18 06:37:50', '2026-02-18 06:37:50'),
(330, '119.235.212.218', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 06:40:22', '2026-02-18 06:40:22', '2026-02-18 06:40:22'),
(331, '2400:9800:5a0:8c02:1970:c171:395a:b36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 06:46:09', '2026-02-18 06:46:09', '2026-02-18 06:46:09'),
(332, '2a01:4ff:f0:75bf::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '/', '2026-02-18 06:47:17', '2026-02-18 06:47:17', '2026-02-18 06:47:17'),
(333, '2a01:4ff:f0:75bf::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '/', '2026-02-18 06:47:21', '2026-02-18 06:47:21', '2026-02-18 06:47:21'),
(334, '2400:9800:5a0:8c02:1970:c171:395a:b36', 'WhatsApp/2.2605.103 W', '/', '2026-02-18 06:48:27', '2026-02-18 06:48:27', '2026-02-18 06:48:27'),
(335, '2400:9800:5a0:8c02:1970:c171:395a:b36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 06:50:21', '2026-02-18 06:50:21', '2026-02-18 06:50:21'),
(336, '182.1.234.204', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 06:52:32', '2026-02-18 06:52:32', '2026-02-18 06:52:32'),
(337, '2400:9800:5a0:8c02:1970:c171:395a:b36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 06:52:54', '2026-02-18 06:52:54', '2026-02-18 06:52:54'),
(338, '2400:9800:5a0:8c02:1970:c171:395a:b36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 06:54:43', '2026-02-18 06:54:43', '2026-02-18 06:54:43'),
(339, '114.8.234.31', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 07:01:21', '2026-02-18 07:01:21', '2026-02-18 07:01:21'),
(340, '114.10.150.179', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 08:12:10', '2026-02-18 08:12:10', '2026-02-18 08:12:10'),
(341, '35.170.40.121', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36', '/', '2026-02-18 10:14:53', '2026-02-18 10:14:53', '2026-02-18 10:14:53'),
(342, '93.158.90.42', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604', '/', '2026-02-18 10:45:06', '2026-02-18 10:45:06', '2026-02-18 10:45:06'),
(343, '114.7.198.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 13:15:15', '2026-02-18 13:15:15', '2026-02-18 13:15:15'),
(344, '114.7.193.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 15:09:21', '2026-02-18 15:09:21', '2026-02-18 15:09:21'),
(345, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 17:00:25', '2026-02-18 17:00:25', '2026-02-18 17:00:25'),
(346, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 17:11:26', '2026-02-18 17:11:26', '2026-02-18 17:11:26'),
(347, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 17:12:00', '2026-02-18 17:12:00', '2026-02-18 17:12:00'),
(348, '119.235.212.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '/', '2026-02-18 17:13:24', '2026-02-18 17:13:24', '2026-02-18 17:13:24'),
(349, '116.90.169.65', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 18:05:03', '2026-02-18 18:05:03', '2026-02-18 18:05:03'),
(350, '158.140.182.83', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 18:06:40', '2026-02-18 18:06:40', '2026-02-18 18:06:40'),
(351, '103.141.104.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 18:19:28', '2026-02-18 18:19:28', '2026-02-18 18:19:28'),
(352, '103.141.104.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 18:25:03', '2026-02-18 18:25:03', '2026-02-18 18:25:03'),
(353, '114.10.150.179', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 18:29:12', '2026-02-18 18:29:12', '2026-02-18 18:29:12'),
(354, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 18:49:03', '2026-02-18 18:49:03', '2026-02-18 18:49:03'),
(355, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 18:55:14', '2026-02-18 18:55:14', '2026-02-18 18:55:14'),
(356, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:36:09', '2026-02-18 19:36:09', '2026-02-18 19:36:09'),
(357, '152.118.150.17', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:38:14', '2026-02-18 19:38:14', '2026-02-18 19:38:14'),
(358, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:41:36', '2026-02-18 19:41:36', '2026-02-18 19:41:36'),
(359, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:41:37', '2026-02-18 19:41:37', '2026-02-18 19:41:37'),
(360, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:45:10', '2026-02-18 19:45:10', '2026-02-18 19:45:10'),
(361, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:45:45', '2026-02-18 19:45:45', '2026-02-18 19:45:45'),
(362, '43.252.144.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '/', '2026-02-18 19:48:03', '2026-02-18 19:48:03', '2026-02-18 19:48:03'),
(363, '2400:9800:553:4ef2:1:0:4a5e:df5d', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 19:56:21', '2026-02-18 19:56:21', '2026-02-18 19:56:21'),
(364, '182.253.233.152', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-18 21:08:08', '2026-02-18 21:08:08', '2026-02-18 21:08:08'),
(365, '182.2.4.83', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-18 21:30:45', '2026-02-18 21:30:45', '2026-02-18 21:30:45'),
(366, '182.253.90.75', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-18 23:44:01', '2026-02-18 23:44:01', '2026-02-18 23:44:01'),
(367, '182.3.46.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-19 00:26:21', '2026-02-19 00:26:21', '2026-02-19 00:26:21'),
(368, '2404:c0:2441:a09:7887:e5e1:abbd:bf6e', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '/', '2026-02-19 00:26:43', '2026-02-19 00:26:43', '2026-02-19 00:26:43'),
(369, '182.3.42.37', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1', '/', '2026-02-19 00:36:04', '2026-02-19 00:36:04', '2026-02-19 00:36:04'),
(370, '114.7.193.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '/', '2026-02-19 03:26:52', '2026-02-19 03:26:52', '2026-02-19 03:26:52'),
(371, '114.8.210.42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-19 06:49:45', '2026-02-19 06:49:45', '2026-02-19 06:49:45'),
(372, '114.8.210.42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-19 06:52:34', '2026-02-19 06:52:34', '2026-02-19 06:52:34'),
(373, '114.8.210.42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '/', '2026-02-19 07:00:08', '2026-02-19 07:00:08', '2026-02-19 07:00:08');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('hendarkohardhanto@gmail.com', '$2y$12$hjaQAWVuJ63kOU8d1FEV0OBKhmjartWqjAZ6QQsmK2dFNi1VNfNjW', '2026-02-08 10:09:17');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `submission_id` bigint UNSIGNED NOT NULL,
  `payment_proof_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint UNSIGNED NOT NULL,
  `submission_id` bigint UNSIGNED NOT NULL,
  `reviewer_id` bigint UNSIGNED NOT NULL,
  `originality_score` int UNSIGNED DEFAULT NULL,
  `relevance_score` int UNSIGNED DEFAULT NULL,
  `clarity_score` int UNSIGNED DEFAULT NULL,
  `methodology_score` int UNSIGNED DEFAULT NULL,
  `overall_score` int UNSIGNED DEFAULT NULL,
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `submission_id`, `reviewer_id`, `originality_score`, `relevance_score`, `clarity_score`, `methodology_score`, `overall_score`, `comments`, `created_at`, `updated_at`) VALUES
(28, 25, 3, 5, 2, 2, 2, 5, 'uffgfhg', '2026-02-04 17:44:29', '2026-02-04 17:48:50'),
(29, 25, 5, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 17:44:29', '2026-02-04 17:44:29'),
(30, 25, 4, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 17:44:29', '2026-02-04 17:44:29'),
(31, 25, 6, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 17:44:29', '2026-02-04 17:44:29'),
(32, 25, 7, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 17:44:29', '2026-02-04 17:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4ABKznFce265HmNIotSDgcKPTLWKouAa3GKANJET', NULL, '182.253.90.75', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicGpiT2Q3QzByaHhaTUJrU2ZqejJtTEhXdmRHTklxdE1zcXpzSGo5UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHBzOi8vd3d3LnBpdGlhZ2kuY2xvdWQiO3M6NToicm91dGUiO3M6NzoibGFuZGluZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1771483441),
('7fe1WiRZ5ZAHPSYDYM5WTmOT5EA9Q7CZU2f46rB0', 16, '182.3.46.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibHFyNVJPZWo5Qm05Yk0wWm10eURucUpsSFJhalF2cHptRU1WdHZneiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTY7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHBzOi8vcGl0aWFnaS5jbG91ZCI7czo1OiJyb3V0ZSI7czo3OiJsYW5kaW5nIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1771485981),
('7PYiXTdUU0psDypggNpwOa0oNpaSKZUEyHt5B1AR', NULL, '114.8.210.42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXl1d0tWeG5WTzlCTVZCbko1QjVQVzlYcUd0cmxLNTU5V3NYdDgzYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHBzOi8vcGl0aWFnaS5jbG91ZCI7czo1OiJyb3V0ZSI7czo3OiJsYW5kaW5nIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1771509608),
('cjuz0Z6YPcO41dr6XmFOeQ9MojJFn4FY4tln3fm0', NULL, '114.7.193.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRFlTd0o5ZnQzUmxDVzRvdUpUbk9VOWZLSkdoZE95N0MyU3ZNcXJEYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHBzOi8vcGl0aWFnaS5jbG91ZCI7czo1OiJyb3V0ZSI7czo3OiJsYW5kaW5nIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1771496812),
('IYgxVziWsuiDwsyDWLypI3w2pswFdKvJvmHfzFAl', 38, '152.118.150.17', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoidTdZZmtjeFR0YWFQRU5hclFWNkp6NkNCdTNYUk44elZYWW5sWWN0WiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mzg7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHBzOi8vd3d3LnBpdGlhZ2kuY2xvdWQvc3VibWlzc2lvbnMiO3M6NToicm91dGUiO3M6MTc6InN1Ym1pc3Npb25zLmluZGV4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1771488754),
('KJHB7tV2PdlNtKnGfa7PD5FxFfmoNrU1NcaDsO6Q', NULL, '2404:c0:2441:a09:7887:e5e1:abbd:bf6e', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibHVUNTVndlYyc1h2N3FOckVKNkI2ZHl5ak5SSUY5WGE1SUNySXoyYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHBzOi8vcGl0aWFnaS5jbG91ZCI7czo1OiJyb3V0ZSI7czo3OiJsYW5kaW5nIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1771486003),
('MjOj8xBiL8EjxKUohGvJg99Q4r9ChlXRoSUw1Bmr', 48, '116.90.168.179', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSk1HTUFSc2Z5dU5kbmw4cVh6Qkw1NlNtTXlEVXN5SjA0OVprYlJkUyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjMxOiJodHRwczovL3d3dy5waXRpYWdpLmNsb3VkL2xvZ2luIjtzOjU6InJvdXRlIjtzOjU6ImxvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6NDg7fQ==', 1771488053),
('YH0r9Gz5J6ql2F6HDGBQl2SErqDeFUcg9uszXj1V', NULL, '182.3.42.37', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEh0bDJxbVVGa05CWlY5YkJQc0kwUFNLRU9yZm9NcW9ubjFHUTBhdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHBzOi8vd3d3LnBpdGlhZ2kuY2xvdWQiO3M6NToicm91dGUiO3M6NzoibGFuZGluZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1771486564);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'submission_deadline_start', NULL, '2026-01-28 17:43:07', '2026-02-12 19:56:01'),
(2, 'submission_deadline_end', NULL, '2026-01-28 17:43:07', '2026-01-28 17:43:07'),
(3, 'submission_enabled', '1', '2026-01-28 17:43:07', '2026-02-12 19:56:42');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `author_full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `co_authors` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `affiliation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `whatsapp_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abstract_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_paper_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','under_review','revision_required_phase1','revision_required_phase2','accepted','rejected','deletion_requested') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `deletion_requested_at` timestamp NULL DEFAULT NULL,
  `deletion_reason` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presentation_preference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participant_category` enum('student','professional','international') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submission_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `co_author_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_1_institute` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_2_institute` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_3_institute` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_4_institute` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `co_author_5_institute` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `corresponding_author_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paper_sub_theme` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paper_theme` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_submission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abstract` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publication_option` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_publication` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layouting_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `editor_feedback_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institute_organization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consent_agreed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `user_id`, `author_full_name`, `title`, `co_authors`, `topic`, `affiliation`, `whatsapp_number`, `abstract_file`, `full_paper_file`, `status`, `deletion_requested_at`, `deletion_reason`, `category`, `presentation_preference`, `participant_category`, `submission_code`, `created_at`, `updated_at`, `co_author_1`, `co_author_1_institute`, `co_author_2`, `co_author_2_institute`, `co_author_3`, `co_author_3_institute`, `co_author_4`, `co_author_4_institute`, `co_author_5`, `co_author_5_institute`, `mobile_number`, `corresponding_author_email`, `paper_sub_theme`, `paper_theme`, `category_submission`, `abstract`, `keywords`, `publication_option`, `preferred_publication`, `layouting_file`, `editor_feedback_file`, `institute_organization`, `consent_agreed`) VALUES
(25, 12, 'Wahyu Utomo', 'xhfjf', NULL, 'Geohazards and It\'s Risk Assessment, Mitigation and Prevention', 'testss', '+6285771593522', NULL, NULL, 'under_review', NULL, NULL, NULL, 'Poster Presentation', 'professional', 'PPIG-001', '2026-02-04 17:41:25', '2026-02-04 17:41:49', 'Wahyu Utomo', 'widi', 'Wahyu Utomo', 'widi', 'Wahyu Utomo', 'widi', 'Wahyu Utomo', 'widi', 'Wahyu Utomo', 'widi', '+6285771593522', 'cingire687@gmail.com', 'Geohazards and It\'s Risk Assessment, Mitigation and Prevention', 'Engineering Geology, Environment and Geohazard', 'Poster Presentation', 'fjfjf', 'fjfjfjf', NULL, NULL, NULL, NULL, 'testss', 1),
(27, 12, 'Wahyu Utomo', 'COMMING SOON', NULL, 'Economic Minerals and Coal Resources Conservation', 'COMMING SOON', '+6285771593522', NULL, NULL, 'pending', NULL, NULL, NULL, 'Oral Presentation', 'student', 'SOIG-001', '2026-02-08 10:11:15', '2026-02-08 10:11:15', 'wagyu ganz', 'Widi', 'Wahyu Utomo', 'COMMING SOON', 'Wahyu Utomo', 'cingire687@gmail.com', 'Wahyu Utomo', 'Wahyu Utomo', 'wagyu ganz', 'Research Director', '+6285771593522', 'cingire687@gmail.com', 'Economic Minerals and Coal Resources Conservation', 'Advanced Mining & Mineral Technology', 'Oral Presentation', 'KJJGKGK', 'GCGCHGC', NULL, NULL, NULL, NULL, 'COMMING SOON', 1),
(28, 14, 'Wahyu Utomo', 'vvv', NULL, 'Enhanced Oil/Gas Recovery', 'cv', '+6285771593522', NULL, NULL, 'pending', NULL, NULL, NULL, 'Poster Presentation', 'student', 'SPIG-001', '2026-02-08 10:13:32', '2026-02-08 10:13:32', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', '+6285771593522', 'cingire687@gmail.com', 'Enhanced Oil/Gas Recovery', 'Petroleum Geoscience, Engineering and Management', 'Poster Presentation', 'v', 'v', NULL, NULL, NULL, NULL, 'cv', 1),
(30, 20, 'Ivan Ibrahim', 'Automated Mineralogy, A Breakthrough Technique to Understand Diagenetic Mineral Indicator', NULL, 'Sedimentology and Paleontology', 'PT. Geoservices', '081317704632', NULL, NULL, 'pending', NULL, NULL, NULL, 'Oral Presentation', 'professional', 'POIG-002', '2026-02-10 00:45:37', '2026-02-10 00:45:37', 'Miladia Farrah Ardhiana', 'PT. Geoservices', 'Zelica Zelda', 'PT. Geoservices', 'Erma Kumala Dewi', 'PT. Geoservices', NULL, NULL, NULL, NULL, '081317704632', 'ivan@geoservices.co.id', 'Sedimentology and Paleontology', 'Fundamental & Digital Geoscience', 'Oral Presentation', 'The difficulty to understand diagenetic mineral indicator interpretations by using thin section technique is considered one of the obstacles in oil and gas rock analysis. Predominantly, the issue on analyzing oil and gas sample rock is regarding mineral determination. It is because the mineral determination by using conventional petrography relies on optical behavior of the mineral. The similarity of certain minerals, low quality of preparation, subjectivity of analysis, implies on the time of analysis completion as well as result precision. The upscale of mineral identification and determination by using automated method is very effective as main solution on this issue. The advancement of x-ray technology, on which scans the thin section sample, furthermore provide each mineral data in semi-quantitative manner prior to their chemical spectra. The combination of advanced technology with conventional petrography improves significantly on the analysis and output of the combined method, therefore reservoir lithofacies and diagenesis are understood more comprehensively. A case study to combine both advanced and conventional methods on eleven samples, vary from limestone, shale, to sandstone (calcareous, fine, medium, and coarse). The objective of this study is to determine the composing mineral of the reservoir rock in quantitative term which is essential to understand diagenesis precisely, moreover to support conventional microscopy identification on textural analysis. Further application of this study includes the association of composing minerals. In addition, on silisiclastic samples, grain size distribution data is obtained from the sample. The other essential data based on this study is the quantified visual porosity. According to automated mineralogy method, the limestone samples, Wackestone, Packstone, Wackestone-packstone lithofacies, are predominantly consists of Calcite from 78.2% to 88.5% with variation of Dolomite is ranging from 1.5% to 5.3%, however the other limestone sample consists of 92.0% of Dolomite. It indicates the mixing zone diagenetic environment affected these samples during deposition. The sandstone samples are composed by variation of clay from 12.8% to 53.5% (wt%). Siderite typical spectra was identified in 1 sandstone sample, in amount of 5.3%, which also indicates reduction environment, proved as well by Pyrite occurrence. In the shale sample, is also consists of 46.0% in total of clay mineral in form of Illite and Kaolinite. Based on the result, this technique improves our understanding of the composing mineral and support lithofacies and diagenesis determination. In addition, visual porosity is also calculated in semi-quantitative perspective, which is ranging from 1.1% to 2.9%.', 'Automated Mineralogy, Semi-quantitative, Mineral, Diagenesis, X-Ray', NULL, NULL, NULL, NULL, 'PT. Geoservices', 1),
(31, 21, 'Nur Amalina, S.T.', 'High Chalcopyrite Distribution in Big Gossan Upper Level Western Area, Papua, Indonesia', NULL, 'Mine Geology, Grade Control and Reconciliation', 'PT Geoservices', '+6282398388676', NULL, NULL, 'pending', NULL, NULL, NULL, 'Poster Presentation', 'professional', 'PPIG-003', '2026-02-15 19:19:16', '2026-02-15 20:08:58', 'Mira Meirawaty, S.T., M.T.', 'Trisakti University', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '+6282398388676', 'Nuramln8486@gmail.com', 'Mine Geology, Grade Control and Reconciliation', 'Advanced Mining & Mineral Technology', 'Poster Presentation', 'The Big Gossan Mine is one of the largest stope and filing mining systems in the world and is operated by PT Freeport Indonesia. The Big Gossan deposit is a ~200m wide, 1200m long, and 600m high, steeply northeast dipping to subvertıcal skarn alteration body at the Tertiary Waripi Formation. The alteration of skarn is generally divided into two types, prograde skarn and retrograde skarn. Rock samples were collected from significant geological sites. Mineragraphy identified the minerals present, while petrography provided microscopic analysis of their textures and relationships between minerals. X-ray Diffraction (XRD) quantitatively determined the mineral phases using diffraction patterns. Based on petrography and XRD, the characteristics of prograde skarn is dominated by garnet-pyroxene mineral, which are higher than amphibole-carbonate mınerals, with very high liquid salinity. Meanwhile, retrograde skarn dominated by amphibole-carbonates minerals compared to garnet-pyroxene mineral, with low liquid salinity. The presence of other minerals or overlap in each rock unıt can occur due to inclusion deviation and is not dominant. The resulting minerals, such as sulphide minerals, particulary chalcopyrite and pyrite, shows in mineragraphy and XRD, which are abundantly distributed in prograde and retrograde skarn. The asociation of alteratıon skarn and copper bearing minerals at Big Gossan Mine is chalcopyrite, while bornite and other copper minerals are less developed constituting less than 1%. Copper mineralization is highly developed in retrograde skarn, along with very high distribution of chalcopyrite mineral.', 'Big Gossan, Copper mineralization, Skarn deposit, Underground mine, Waripi Formation', 'no', NULL, NULL, NULL, 'PT Geoservices', 1),
(32, 48, 'Takdir Noor Fitriadi', 'A Ternary Diagram Approach to Predicting of Depositional Controls in Subang and Pemalang, the Northern Coastal Plain of Java', NULL, 'Geohazards and It\'s Risk Assessment, Mitigation and Prevention', 'Geological Agency', '+6285624721838', NULL, NULL, 'pending', NULL, NULL, NULL, 'Oral Presentation', 'professional', 'POIG-003', '2026-02-19 01:00:53', '2026-02-19 01:00:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '+6285624721838', 'takdir.fitriadi@esdm.go.id', 'Geohazards and It\'s Risk Assessment, Mitigation and Prevention', 'Engineering Geology, Environment and Geohazard', 'Oral Presentation', 'This study evaluates the geological processes controlling sediment deposition in the northern coastal plains of Subang and Pemalang, Java, using clay mineral assemblages within a source-to-sink framework. Three clay minerals, kaolinite, illite–chlorite group, and smectite were selected as parameters sensitive to weathering intensity, source-rock lithology, and tectonic and climatic influences. Their relative abundances were plotted on a ternary diagram to assess differences in depositional controls and dominant governing factors in each area.\r\n\r\nThe ternary plotting results report distinct compositional trends between Subang and Pemalang. Pemalang samples tend to show relatively higher proportions of kaolinite and smectite compared to illite–chlorite, suggesting strong chemical weathering under humid tropical climatic conditions combined with sediment supply from tectonically active upland sources. In contrast, Subang sediments are characterized by a relative dominance of illite–chlorite with more constrained kaolinite contributions, reflecting stronger control by source-rock lithology and structural configuration influencing sediment routing. These differences in clay mineral distribution indicate that depositional mechanisms in the two place sectors are controlled by different combinations of tectonic, climatic, and lithological controls, despite their location within the same northern Java depositional system.\r\n\r\nFurthermore, the ternary plotting approach using these three key clay minerals demonstrates significant potential as a provenance analysis tool in other regions with comparable geological settings. Variations in the relative proportions of kaolinite, illite–chlorite, and smectite can be employed to distinguish the dominant influence of climate, tectonics, or source lithology in sedimentary systems. Accordingly, this method not only facilitates reconstruction of sedimentary evolution but also provides a predictive basis for assessing sediment compaction behavior and related geotechnical implications, including the potential linkage between depositional characteristics and land subsidence in actively evolving coastal basins.', 'kaolinite; illite–chlorite; smectite; ternary diagram; depositional controls; land subsidence; northern Java coast, Subang, Pemalang', 'no', NULL, NULL, NULL, 'Geological Agency', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('Student','Professional','International Delegate') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `affiliation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('Admin','Reviewer','Author') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Author',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `full_name`, `whatsapp`, `category`, `email`, `email_verified_at`, `password`, `affiliation`, `phone_number`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Admin IAGI', NULL, NULL, NULL, 'admin@iagi-geosea2026.com', '2025-12-31 15:03:00', '$2y$12$mWLlgBc7zRI37GH7JPXgaeDE9HF.fRViIn9n27RKZ9j73ka5F.8cK', NULL, NULL, 'Admin', '8OxezGCMEv7VlSvYl4L9V2VPy3gYtzoVYgSj00ph5yCI0I6MZORFRcKoJvSd', '2025-12-31 15:03:00', '2026-01-01 17:39:41'),
(3, 'Dr. Reviewer IAGI', 'Dr. Reviewer IAGI', '+628123456789', 'Professional', 'reviewer@iagi-geosea2026.com', '2026-01-10 22:04:35', '$2y$12$KgcyYMtb9ckGmVZJqHtR.epEL2pdEdSQAoLiKD8.GfhbOaLZBbXEm', 'IAGI', NULL, 'Reviewer', NULL, '2026-01-01 18:19:03', '2026-01-10 22:04:35'),
(4, 'Dr. John Smith', NULL, NULL, NULL, 'reviewer1@iagi-geosea.com', '2026-01-10 22:04:35', '$2y$12$GgTA093GLi1DYE9mNTYmYuyzEne14e/9YevMrQOI6TLqjiSoaf8qO', NULL, NULL, 'Reviewer', NULL, '2026-01-09 02:51:36', '2026-01-10 22:04:35'),
(5, 'Prof. Maria Garcia', NULL, NULL, NULL, 'reviewer2@iagi-geosea.com', '2026-01-10 22:04:35', '$2y$12$4imPRu32JaFScQCUhaUtReX3bBiJFLPUZMiArjhxiHtMwg8Ypfh7K', NULL, NULL, 'Reviewer', NULL, '2026-01-09 02:51:36', '2026-01-10 22:04:35'),
(6, 'Dr. Ahmad Rahman', NULL, NULL, NULL, 'reviewer3@iagi-geosea.com', '2026-01-10 22:04:35', '$2y$12$NJVwx/ZKGpmW4AR5ejTroOHZIiyvc6g/2dglBCORME0XKNyRtaLy2', NULL, NULL, 'Reviewer', NULL, '2026-01-09 02:51:36', '2026-01-10 22:04:35'),
(7, 'Dr. Sarah Chen', NULL, NULL, NULL, 'reviewer4@iagi-geosea.com', '2026-01-10 22:04:35', '$2y$12$t54qH1/1PAfwmqjOCrGH8u5b9yB4wIG0yJR5TQp1AJIUEEGcSiIFy', NULL, NULL, 'Reviewer', NULL, '2026-01-09 02:51:36', '2026-01-10 22:04:35'),
(8, 'Oral', NULL, NULL, NULL, 'oral@gmail.com', '2026-01-10 22:15:33', '$2y$12$oU6vYCaNJ.m2ow/ab7fSc.37fGdloL7e7QIJrMFLp8OyKwSdtmD5C', NULL, NULL, 'Reviewer', NULL, '2026-01-10 22:06:09', '2026-01-10 22:15:33'),
(12, 'cingire687@gmail.com', 'wahyu Utomo', '085771593522', 'Professional', 'cingire687@gmail.com', '2026-02-09 23:50:10', '$2y$12$ouyqXzBOU.cUKW8/mkZKb.3lCtdXPxYNffFlNiOjtNEWc38LssjtG', 'Informatika', NULL, 'Author', 'YZs7jL645W64063pRSEIn1wpp1FKYj6kJT8GYvrx8emceHVvlm5PgZSUtwly', '2026-02-04 17:39:46', '2026-02-09 23:50:10'),
(14, 'hendarkohardhanto@gmail.com', 'Hendarko Hinu Hardhanto', '081380993981', 'Professional', 'hendarkohardhanto@gmail.com', '2026-02-12 18:39:15', '$2y$12$iFU3Ox/iJu2EpzR9rkbdee028lKtMCcKiRrTLJ2qQnjD.QLGgw7LO', 'Britmindo', NULL, 'Author', NULL, '2026-02-07 19:22:21', '2026-02-12 18:39:15'),
(15, 'geologisrifaldy@gmail.com', 'Rifaldy', '082393982214', 'Professional', 'geologisrifaldy@gmail.com', '2026-02-12 18:39:13', '$2y$12$qkbqeS/TqsS2.68hfLDv7etfUg18qTKBPu8/Hrn03Obnrqj5DEvYC', 'PT Lanlino Mineral Resources', NULL, 'Author', NULL, '2026-02-08 11:44:34', '2026-02-12 18:39:13'),
(16, 'fajar.dewantoro.wy@hitachi-hightech.com', 'Fajar Dewantoro', '+62 811-8079-665', 'Professional', 'fajar.dewantoro.wy@hitachi-hightech.com', '2026-02-12 18:39:13', '$2y$12$qX9dp7rjvp1Y2rk8vbJMF.PWebN4Vbe8dMY739b0GS6KepAGjfRDa', 'Hitachi High-Tech Indonesia', NULL, 'Author', 'A2tMvJ1eem38JAbPr7vwbnefbxhTUmH6sLixznH4R1TiJqUd31cpdwYWzADH', '2026-02-08 19:42:46', '2026-02-12 18:39:13'),
(17, 'reviewer1', NULL, NULL, NULL, 'reviewer9@iagi-geosea2026.com', '2026-02-11 17:59:00', '$2y$12$0FlXsWb21l0XJoUlYYYc4uqWf1SdMgm6zqlUC5g79Ivn2FyAtLeVu', NULL, NULL, 'Reviewer', NULL, '2026-02-09 06:27:43', '2026-02-11 17:59:00'),
(19, 'harisberjaya@gmail.com', 'Haris Nur Eka Prasetya', '081325610937', 'Student', 'harisberjaya@gmail.com', '2026-02-12 18:39:11', '$2y$12$EM/m5Z03h/2OzIBuUYAImuhIKQIe4zc634tQrXZOFUcT2ZUmBNnWe', 'Bandung Institute of Technology', NULL, 'Author', NULL, '2026-02-09 08:39:18', '2026-02-12 18:39:11'),
(20, 'Ivan Ibrahim', 'Ivan Ibrahim', '081317704632', 'Professional', 'ivan@geoservices.co.id', '2026-02-12 18:39:10', '$2y$12$BVE5W6YC12Vy5M9Idn6CuehEl7cGLcaVwev6jXAF7jewlpa7KR4jK', 'PT. Geoservices, Ltd.', NULL, 'Author', 'dw5xQNT4pT9IOXMboac5QduTiqgDYmEMRrwRdEstAT3takMp3VQo7SEpi25y', '2026-02-09 21:06:01', '2026-02-12 18:39:10'),
(21, 'nuramln8486@gmail.com', 'Nur Amalina', '082398388676', 'Professional', 'nuramln8486@gmail.com', '2026-02-12 18:39:09', '$2y$12$ocfclG94UsSEE2krdPTqHOydnDKATyezPjL5.H4ypCyWXr.909cCy', 'PT GEOSERVICES', NULL, 'Author', '0mlFp8tm5X9YevvKQr6EM0zgFJhauHXAFTfzM3b4NOa0EpASl0GS9OEtzeJu', '2026-02-10 01:13:05', '2026-02-12 18:39:09'),
(22, 'Admin1', NULL, NULL, NULL, 'admin1@iagi-geosea2026.com', '2026-02-11 18:00:03', '$2y$12$VoukJotXmQwlW/Hhf/QoC.v47UM0Nm.i3R4wTJCQCF42l2YCdub2a', NULL, NULL, 'Admin', NULL, '2026-02-11 17:59:55', '2026-02-11 18:00:03'),
(23, 'Admin2', NULL, NULL, NULL, 'admin2@iagi-geosea2026.com', '2026-02-11 18:00:33', '$2y$12$x5Xqtb7B8O.gN023DFb5XOopyCcMfMMQKFGZ40gZ/XusY/l8saW2i', NULL, NULL, 'Admin', 'TATne8UTOvK4jq524jW4SVdSiecYMZn0aeZPzhFGA36bYGLlQCAmUS763Sd9', '2026-02-11 18:00:28', '2026-02-11 18:00:33'),
(24, 'Admin3', NULL, NULL, NULL, 'admin3@iagi-geosea2026.com', '2026-02-11 18:01:01', '$2y$12$I/AshkqTnL39ff3yL82jue7E28pH/citp43jijqyNTt/ExEANqxiW', NULL, NULL, 'Admin', NULL, '2026-02-11 18:00:58', '2026-02-11 18:01:01'),
(25, 'mineralogist2@geoservices.co.id', 'Miladia Farrah Ardhiana', '0895422764078', 'Professional', 'mineralogist2@geoservices.co.id', '2026-02-18 18:11:39', '$2y$12$9yoHHIdMnQw8MX1EROK85ORlY1IYelkevBwJpMXVlTtTI.9mSRjBm', 'PT Geoservices Ltd', NULL, 'Author', NULL, '2026-02-12 19:02:51', '2026-02-18 18:11:39'),
(26, 'abdurahmanmaulana1512@gmail.com', 'Muhammad Abdurahman Maulana', '089530900199', 'Student', 'abdurahmanmaulana1512@gmail.com', '2026-02-18 18:11:37', '$2y$12$NSyCVeWSnyjF2Ov.WqProubKb/iD/6.h/TP4.QawhZNYD7qN/bgMy', 'Universitas Jambi', NULL, 'Author', '6EJNTtGLPWqgxlJUjTS9OjQFsH5oKGKfYBJjCYVlaD0WSCKnaXb8x4a52RmJ', '2026-02-12 20:51:57', '2026-02-18 18:11:37'),
(27, 'firmanard738@gmail.com', 'Firman Ardiansyah', '085840014942', 'Student', 'firmanard738@gmail.com', '2026-02-18 18:11:36', '$2y$12$..bL4h4hxF67szdkqdtGiOkxKQa5bjxTdPM7LhkDGzfCt4S1bs3Ay', 'universitas Jambi', NULL, 'Author', 'ONgdOYIkiER6DppVFdgZdfp4Ry6BPh0sedYosVEyUwVic32m8tmyS8TNRnm4', '2026-02-12 21:04:17', '2026-02-18 18:11:36'),
(28, 'Hilmy Khairi', 'Hilmy Khairi', '087774466356', 'Professional', 'khairihilmy4@gmail.com', '2026-02-18 18:11:34', '$2y$12$goBM5b71XDaNpgTcL74Ez.jX7QsbxtBj1C.7FmsKQJKtzU/AjYIrG', 'PetroChina International Jabung Ltd', NULL, 'Author', 'GH2dLuMwJuJ2mRJARFNrEz7mE20BBPSn0vni30IOgbFcBxhtw0UOgMYgF60D', '2026-02-12 23:37:08', '2026-02-18 18:11:34'),
(29, 'Artantra', 'Artantra Ranggaprana', '081384955663', 'Professional', 'artantra.ranggaprana@gmail.com', '2026-02-18 18:11:32', '$2y$12$PC5TGSqj21DcF3wbvOle0.mVZuDh8E5r1NGMgxzkAESMFcjAu098C', 'Pertamina EP Zona 7', NULL, 'Author', 'tXYUMitsxaPDd4eKhfiV0PXUT9F0ZFteCu3hLHWTrACwnyGjrg1gbEqlUIni', '2026-02-13 01:00:27', '2026-02-18 18:11:32'),
(30, 'nasywantaufiqurrohman@gmail.com', 'Nasywan Taufiqurrohman Ananda Putra', '6285772555772', 'Student', 'nasywantaufiqurrohman@gmail.com', '2026-02-18 18:11:30', '$2y$12$Gncyo4ec1i7vDF6UMnUplem56SK2X0wBxnPZFXBce4BysylDWT1B.', 'Padjadjaran University', NULL, 'Author', '5OszPqgoXXug7w3UQqzCRoenl6UpC8dEENCqcCzzgZXJb28yPGEg5LlV4KPU', '2026-02-13 01:05:44', '2026-02-18 18:11:30'),
(31, 'nurqosimg@gmail.com', 'Nur Qosim Ghozali', '081311358658', 'Professional', 'nurqosimg@gmail.com', '2026-02-18 18:11:29', '$2y$12$wz8BfKlWolWSnF3voGO16.IYXt6kIas1mNk6ZUtQV0/a.2xHjqrmK', 'Pertamina Hulu Rokan', NULL, 'Author', NULL, '2026-02-13 02:00:10', '2026-02-18 18:11:29'),
(32, 'hafizhathaya@icloud.com', 'Hafizh Athaya', '087788982206', 'Student', 'hafizhathaya@icloud.com', '2026-02-18 18:11:27', '$2y$12$fxMJRsckTnAmfvpqMZeSR.JlDe8oVh4dxmT3Xvm0NTdzQC./v5hie', 'UPNVY', NULL, 'Author', NULL, '2026-02-13 04:42:01', '2026-02-18 18:11:27'),
(33, 'Muhammad Zelandi', 'Muhammad Zelandi, S.T., M.T.', '+62 81278652203', 'Professional', 'muhammadzelandi@unja.ac.id', '2026-02-18 18:11:25', '$2y$12$6kh6cQyKhTRik.k8hcm5Y.rHkrGmXjix6TDtDESf4YPfIZo2GbjDi', 'Universitas Jambi', NULL, 'Author', '5FZ72RYtw9RTj6ifo36a1JQP1kN0BSOjRFy5Qr5yWwrxLC2nsM2B6FpCAdIy', '2026-02-13 06:15:49', '2026-02-18 18:11:25'),
(34, 'hanankrnwn@gmail.com', 'Dinar Hananto Kurniawan, S.T., M.Eng', '085878233303', 'Professional', 'hanankrnwn@gmail.com', '2026-02-18 18:11:11', '$2y$12$OA5tu6HBAN/uDAGW4pggwO3FgDKGTZ4Nw2DzcsfaU97zF/dopmD52', 'Universitas Pembangunan Nasional \"Veteran\" Yogyakarta', NULL, 'Author', NULL, '2026-02-13 06:35:12', '2026-02-18 18:11:11'),
(35, 'annisacahyaranii@gmail.com', 'Annisa Cahyarani Devi', '081802191510', 'Student', 'annisacahyaranii@gmail.com', '2026-02-18 18:11:09', '$2y$12$8bJNLVC930HuYygn1SffiOvWLqzknh.GNxdFpiKU/qHt/r4Ne9Zve', 'UPN \"Veteran\" Yogyakarta', NULL, 'Author', NULL, '2026-02-13 07:37:19', '2026-02-18 18:11:09'),
(36, 'Dedy Pratama, S.T.', 'Dedy Pratama, S.T.', '082278888558', 'Professional', 'dedyp.geo@gmail.com', '2026-02-18 18:11:08', '$2y$12$VfU8q9duclP8dZ4tJHYzT.opBZn3s3skFa/cWSQ2KxgCM/vOhNkby', 'PT. Maruwai Coal', NULL, 'Author', NULL, '2026-02-13 19:12:24', '2026-02-18 18:11:08'),
(37, 'amandanurfahira948@gmail.com', 'Amanda Siti Nurfahira', '081316163244', 'Student', 'amandanurfahira948@gmail.com', '2026-02-18 18:11:06', '$2y$12$evGEMcq4mmqdkju.KSnibehFzEe6bh3KscIuBTmLH5l/t1j.cbB8C', 'Institut Teknologi Bandung', NULL, 'Author', 'B9UpVrb0FHcS3XIGb3DeApsxx2APKT0Dyhhk4Jm7CqX9lkk1WsNr7Da8yOp6', '2026-02-13 20:06:48', '2026-02-18 18:11:06'),
(38, 'syakhdhar@gmail.com', 'Muhammad Syaukan Akhdhar', '+6281243777217', 'Student', 'syakhdhar@gmail.com', '2026-02-18 18:11:01', '$2y$12$P34JnqIvJMoBswcGVcaT0OFo5Kyq/p4.MtdkZVGfEX4VPyw.M8CLa', 'Universitas Indonesia', NULL, 'Author', 'aNXNVPlyHooXhZyNznDBBawF7MbaCGzz2dgRNUfeNmtKbyE87KkmOmCwbTV8', '2026-02-14 08:21:55', '2026-02-18 18:11:01'),
(39, 'contact.bimapanggabean@gmail.com', 'Mochammad Bima Perkasa Panggabean', '085385679215', 'Student', 'contact.bimapanggabean@gmail.com', '2026-02-18 18:11:00', '$2y$12$7aJtckQl02QEep.8uL.TAOkIGQcL5K.Ybxmt9Jp.g7QrJPPORoUCu', 'Universitas Diponegoro', NULL, 'Author', 'QrXY5CJsmKseUF7ypGjMrfVoLI5wqJDTRN7f083h4oR2iBifbgQWrLQ8eZxG', '2026-02-14 09:26:52', '2026-02-18 18:11:00'),
(40, 'anindhiyoghani160305@gmail.com', 'Anindhiyo Ghani Kurniawan', '0857-1777-1104', 'Student', 'anindhiyoghani160305@gmail.com', '2026-02-18 18:10:58', '$2y$12$1s1pc4Ue/iRpnyeNOfdUZ.5W9Q7SxgRInrT8F8LYKiI4GMOf6Crau', 'Diponegoro University', NULL, 'Author', NULL, '2026-02-14 15:50:53', '2026-02-18 18:10:58'),
(41, 'nahdanbl@gmail.com', 'Nahda Nabila Ramadhani', '081553679415', 'Student', 'nahdanbl@gmail.com', '2026-02-18 18:10:55', '$2y$12$sA8DmGY8WS1PHoqD.VNE4OwMvypUbWyByeC87sooXmE.1AEM0TPx6', 'Hasanuddin University', NULL, 'Author', NULL, '2026-02-14 20:21:07', '2026-02-18 18:10:55'),
(42, 'dwi.rachmawati@unsoed.ac.id', 'Dwi Rachmawati', '085861188707', 'Professional', 'dwi.rachmawati@unsoed.ac.id', '2026-02-18 18:10:53', '$2y$12$5CM46ghvtj9pDGDKXdZ9y.fB5DiYMt96rdJ21OxywRDJ7hmvAwKMG', 'Universitas Jenderal Soedirman', NULL, 'Author', NULL, '2026-02-14 22:13:40', '2026-02-18 18:10:53'),
(43, 'estislh@gmail.com', 'Esti Solehatun', '085786786445', 'Student', 'estislh@gmail.com', '2026-02-18 18:10:52', '$2y$12$IR.Ev/Gjq6Tf7IpO1josi.55sibW66CVrr0IYjg1SMBi7dLkQ2.GS', 'Universitas Pembangunan Nasional \"Veteran\" Yogyakarta', NULL, 'Author', NULL, '2026-02-15 20:19:45', '2026-02-18 18:10:52'),
(44, 'natasyaputrisalsa14@gmail.com', 'Putri Natasya Salsabila', '0882003072791', 'Student', 'natasyaputrisalsa14@gmail.com', '2026-02-18 18:10:45', '$2y$12$g7W/mvNEwVM5WDEosiu61.n5/iVVjRuTGNY/N1EqNDT1FedfD/O5C', 'Universitas Sriwijaya', NULL, 'Author', 'l29vGUHowUQKGaX63WOASSABOsGMwbBsGNDJNi33lbftoZeAp6X9LYE9ZAAL', '2026-02-16 03:35:42', '2026-02-18 18:10:45'),
(45, 'joelmanurung05@gmail.com', 'Joel Maruba Manurung', '081268745657', 'Student', 'joelmanurung05@gmail.com', '2026-02-18 18:10:43', '$2y$12$fVIVeIB0dJPiRWMZf1FTtO3riYay3R1.TjuI5z55cOduq2b.3W2LG', 'Universitas Jember', NULL, 'Author', 'c6vynX55iltR1pFdme3QjqgjJlPi6BH9drCh60aXGahKlY4yglqaEkDIeI6y', '2026-02-17 02:27:20', '2026-02-18 18:10:43'),
(46, 'noah.wantah@yahoo.co.id', 'Noah Joel Theofillus W', '+62 821-6993-9522', 'Professional', 'noah.wantah@yahoo.co.id', '2026-02-18 18:10:40', '$2y$12$kjrtgOwCZA8IO73FtNkTc.Gxa0XGCPQTD0jmlAo01StELkIsb2xEy', 'Pertamina Hulu Rokan', NULL, 'Author', NULL, '2026-02-17 06:34:03', '2026-02-18 18:10:40'),
(47, 'prayudhadimas92@gmail.com', 'Dimas Prayudha', '085330552178', 'Student', 'prayudhadimas92@gmail.com', '2026-02-18 18:10:33', '$2y$12$aSdxB132Jm1DoQoeT7PA0Oo09hkM9tQu9syCfD1Pzm1k2ZVYq5X7q', 'Hasanuddin University', NULL, 'Author', 'zxn4WzGx2B0gr2BtMvyujlXSjnxSkrSMlIh8NE9mQf3ZwjoSALnw0tQO6JLD', '2026-02-17 16:55:57', '2026-02-18 18:10:33'),
(48, 'takdir.fitriadi@esdm.go.id', 'Takdir Noor Fitriadi, S.T.', '085624721838', 'Professional', 'takdir.fitriadi@esdm.go.id', '2026-02-18 18:10:29', '$2y$12$fXRTbnqgBFJsApXQxR.rAuYQJxbEF2FxXZVjDJc4whJtzJrvDJmVK', 'Geological Agency', NULL, 'Author', NULL, '2026-02-17 20:08:32', '2026-02-18 18:10:29'),
(49, 'Wanda Wira Perdana Hia', 'Wanda Wira Perdana Hia', '082272791176', 'Professional', 'wandawiraperdanahia@gmail.com', '2026-02-18 18:10:26', '$2y$12$cLhFk0K3uFCKbaUrcM1gK.rXQrXn6c14Q3OJn7w.wcbEUwJaSk1i.', 'Independent', NULL, 'Author', NULL, '2026-02-18 02:20:46', '2026-02-18 18:10:26'),
(50, 'afrianatmaja@gmail.com', 'Afrian Tri Atmaja', '082328934334', 'Professional', 'afrianatmaja@gmail.com', '2026-02-18 18:10:25', '$2y$12$IrO3XvCpPeOA2pICJW9Z7.rpuyMhM3ScnJSU.uGiIP4gJeRlCrAuS', 'UPN Veteran Yogyakarta', NULL, 'Author', NULL, '2026-02-18 02:25:32', '2026-02-18 18:10:25'),
(51, '111230051@student.upnyk.ac.id', 'Arsyad Faiz Alfianto', '081293007990', 'Student', '111230051@student.upnyk.ac.id', '2026-02-18 18:10:23', '$2y$12$RJavVJMKVVUkUF1uSdIbU.jxupmmoPAloIOqQ9eukIK234eeZTu4u', 'UNIVERSITAS PEMBANGUNAN NASIONAL \"VETERAN\" YOGYAKARTA', NULL, 'Author', NULL, '2026-02-18 05:46:13', '2026-02-18 18:10:23'),
(52, 'paramitabwi@gmail.com', 'Ni Made Paramita Dwi Lestari', '081335190074', 'Professional', 'paramitabwi@gmail.com', '2026-02-18 18:10:21', '$2y$12$8WD5RGBwchNT0dMf9IeqC.6gCoyQ8mV5b9rLdLoTyluZzgaeULQAG', 'PT. Bumi Sentosa Jaya', NULL, 'Author', NULL, '2026-02-18 06:24:45', '2026-02-18 18:10:21'),
(53, 'ririnnabila456@gmail.com', 'Ririn Nabillah', '083183346797', 'Student', 'ririnnabila456@gmail.com', '2026-02-18 18:10:14', '$2y$12$YUHCDwHNLBETDEY0HIGeIOqvhwcQvG0IZkGXQ8cQVQIGPwJ3ky8dW', 'Universitas Sriwijaya', NULL, 'Author', 'obwuDRgGCPfMNMQMh6UWB21KTPGHG9FX3JAH25rNDeqvBswJHW5gKw2E59ih', '2026-02-18 06:49:13', '2026-02-18 18:10:14'),
(54, 'larasptrii@gmail.com', 'Larasati Nugroho Putri', '085848112733', 'Student', 'larasptrii@gmail.com', '2026-02-18 18:10:19', '$2y$12$F/sqOz8GBgTjm7PfgrXYVujJmPVaV3epoHtERPHW8zE/GZbuIBEdm', 'UPN \"Veteran\" Yogyakarta', NULL, 'Author', 'E4m2BYTpUNSYosbBTtMScAa6D2dSJajRMO54NTQbp4EHg7q5Gu5dUbDT5VaR', '2026-02-18 08:14:17', '2026-02-18 18:10:19'),
(55, 'muhammadaldrian@gmail.com', 'Muhammad Aldrian Wicaksana', '082113848617', 'Professional', 'muhammadaldrian@gmail.com', '2026-02-18 18:09:27', '$2y$12$1cFmvwo7Y5mm7dDWTzcT4urdkEsuIhL2i4f6BHgGECjNF7oRQ08RG', 'PT GroundProbe Indonesia', NULL, 'Author', NULL, '2026-02-18 13:16:11', '2026-02-18 18:09:27'),
(56, 'khoirunnisaalfawaini@gmail.com', 'Khoirunnisa Alfawaini', '081375355443', 'Student', 'khoirunnisaalfawaini@gmail.com', NULL, '$2y$12$7LzPCZraKl/DOu57c8DufeFImx0bo.JlYKBAzPT/VNbMzF6VhUjwO', 'Universitas Sriwijaya', NULL, 'Author', NULL, '2026-02-18 19:57:14', '2026-02-18 19:57:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `email_settings`
--
ALTER TABLE `email_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landing_page_settings`
--
ALTER TABLE `landing_page_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `landing_page_settings_key_unique` (`key`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_visits`
--
ALTER TABLE `page_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_visits_page_visited_at_index` (`page`,`visited_at`),
  ADD KEY `page_visits_visited_at_index` (`visited_at`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_user_id_foreign` (`user_id`),
  ADD KEY `idx_payments_submission` (`submission_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_submission_id_foreign` (`submission_id`),
  ADD KEY `reviews_reviewer_id_foreign` (`reviewer_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `submissions_submission_code_unique` (`submission_code`),
  ADD KEY `idx_submissions_user_id` (`user_id`),
  ADD KEY `idx_submissions_status` (`status`),
  ADD KEY `idx_submissions_created_at` (`created_at`),
  ADD KEY `idx_submissions_code` (`submission_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_settings`
--
ALTER TABLE `email_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `landing_page_settings`
--
ALTER TABLE `landing_page_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `page_visits`
--
ALTER TABLE `page_visits`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=374;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_submission_id_foreign` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_submission_id_foreign` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
