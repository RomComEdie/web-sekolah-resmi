-- ============================================================
-- DATABASE SCHEMA UNTUK XAMPP (phpMyAdmin) / MySQL / MariaDB
-- SIM / SIAKAD SMK BHINNEKA NUSANTARA
-- ============================================================

CREATE DATABASE IF NOT EXISTS `smk_bhinneka` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smk_bhinneka`;

-- 1. TABEL PENDAFTAR PPDB
CREATE TABLE IF NOT EXISTS `pendaftar_ppdb` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `registration_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `nik_nisn` VARCHAR(100) NOT NULL,
  `birth_place_date` VARCHAR(255) DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `origin_school` VARCHAR(255) DEFAULT NULL,
  `phone_whatsapp` VARCHAR(50) DEFAULT NULL,
  `parent_name` VARCHAR(255) DEFAULT NULL,
  `parent_phone` VARCHAR(50) DEFAULT NULL,
  `first_choice_major` VARCHAR(20) DEFAULT NULL,
  `second_choice_major` VARCHAR(20) DEFAULT NULL,
  `registration_date` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(100) DEFAULT 'Tergrafis (Pending Verification)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL PESAN KONTAK
CREATE TABLE IF NOT EXISTS `pesan_kontak` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `telepon` VARCHAR(50) DEFAULT NULL,
  `subjek` VARCHAR(255) DEFAULT NULL,
  `pesan` TEXT NOT NULL,
  `created_at` VARCHAR(100) DEFAULT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL PENGUMUMAN & BERITA
CREATE TABLE IF NOT EXISTS `pengumuman` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Pengumuman',
  `date` VARCHAR(50) DEFAULT NULL,
  `summary` TEXT DEFAULT NULL,
  `content` TEXT DEFAULT NULL,
  `author` VARCHAR(100) DEFAULT 'Super Admin',
  `is_important` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL AUDIT LOGS
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `timestamp` VARCHAR(100) DEFAULT NULL,
  `user` VARCHAR(255) DEFAULT NULL,
  `user_role` VARCHAR(100) DEFAULT NULL,
  `action` VARCHAR(100) DEFAULT NULL,
  `details` TEXT DEFAULT NULL,
  `ip` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEEDING SAMPLE DATA
INSERT INTO `pendaftar_ppdb` (`id`, `registration_code`, `full_name`, `nik_nisn`, `birth_place_date`, `gender`, `address`, `origin_school`, `phone_whatsapp`, `parent_name`, `parent_phone`, `first_choice_major`, `second_choice_major`, `registration_date`, `status`)
VALUES ('101', 'PPDB-2026-1001', 'Ahmad Rizky Pratama', '0081234567', 'Banjarmasin, 15 Mei 2008', 'Laki-laki', 'Jl. Ahmad Yani Km 5.5 No. 12', 'SMP Negeri 2 Banjarmasin', '081234567890', 'Bambang Pratama', '081234567899', 'RPL', 'AKL', '27 Juli 2026', 'Tergrafis (Pending Verification)')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

INSERT INTO `pengumuman` (`id`, `title`, `category`, `date`, `summary`, `content`, `author`, `is_important`)
VALUES 
('ANN-001', 'Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027', 'PPDB', '2026-07-01', 'Pendaftaran Siswa Baru resmi dibuka online mulai 1 Juli hingga 31 Agustus 2026 dengan beasiswa SPP.', 'SMK Bhinneka Nusantara resmi membuka Pendaftaran Peserta Didik Baru (PPDB) Gelombang 1. Bagi pendaftar 100 pertama mendapatkan bebas biaya pendaftaran & potongan SPP 20%.', 'Panitia PPDB', 1),
('ANN-002', 'Juara 1 LKS SMK Tingkat Provinsi Bidang Web Technologies', 'Prestasi', '2026-07-20', 'Siswa jurusan RPL & TKJ kembali mengukir prestasi emas dalam Lomba Kompetensi Siswa SMK.', 'Selamat kepada tim siswa RPL dan TKJ SMK Bhinneka Nusantara yang berhasil meraih Juara 1 LKS Tingkat Provinsi.', 'Humas Sekolah', 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
