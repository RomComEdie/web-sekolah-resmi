-- ========================================================
-- DATABASE SCHEMA & SEED DATA FOR MYSQL / phpMyAdmin
-- Sistem PPDB SMK Prestasi Nusantara (PHP Native)
-- File: database.sql
-- ========================================================

-- 1. Buat Database jika belum ada
CREATE DATABASE IF NOT EXISTS `db_smk_prestasi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_smk_prestasi`;

-- 2. Hapus tabel lama jika ingin reset
DROP TABLE IF EXISTS `pendaftaran_ppdb`;

-- 3. Struktur Tabel `pendaftaran_ppdb`
CREATE TABLE `pendaftaran_ppdb` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `kode_pendaftaran` VARCHAR(30) NOT NULL UNIQUE,
  `nisn` VARCHAR(10) NOT NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `jenis_kelamin` ENUM('Laki-Laki', 'Perempuan') NOT NULL DEFAULT 'Laki-Laki',
  `tempat_lahir` VARCHAR(50) NOT NULL DEFAULT '-',
  `tanggal_lahir` DATE DEFAULT NULL,
  `no_hp` VARCHAR(15) NOT NULL DEFAULT '-',
  `alamat` TEXT DEFAULT NULL,
  `jurusan` ENUM('RPL', 'AKL', 'TSM') NOT NULL DEFAULT 'RPL',
  `asal_sekolah` VARCHAR(100) NOT NULL,
  `tahun_lulus` VARCHAR(4) NOT NULL DEFAULT '2026',
  `nama_orang_tua` VARCHAR(100) NOT NULL,
  `no_hp_orang_tua` VARCHAR(15) NOT NULL,
  `pekerjaan_orang_tua` VARCHAR(50) NOT NULL DEFAULT '-',
  `status_pendaftaran` ENUM('Terverifikasi', 'Menunggu', 'Ditolak') DEFAULT 'Terverifikasi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_nisn` (`nisn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Sample Data Pendaftar Awal
INSERT INTO `pendaftaran_ppdb` (
  `kode_pendaftaran`, `nisn`, `nama_lengkap`, `jenis_kelamin`,
  `tempat_lahir`, `tanggal_lahir`, `no_hp`, `alamat`,
  `jurusan`, `asal_sekolah`, `tahun_lulus`, `nama_orang_tua`,
  `no_hp_orang_tua`, `pekerjaan_orang_tua`
) VALUES
('REG-2026-RPL-001', '0051234567', 'Ahmad Fauzi', 'Laki-Laki', 'Jakarta', '2009-05-14', '081234567890', 'Jl. Merdeka No. 12, Jakarta Selatan', 'RPL', 'SMP Negeri 1 Jakarta', '2026', 'Budi Santoso', '081987654321', 'Wiraswasta'),
('REG-2026-AKL-002', '0059876543', 'Siti Nurhaliza', 'Perempuan', 'Bandung', '2009-08-22', '082345678901', 'Jl. Asia Afrika No. 45, Bandung', 'AKL', 'MTs Negeri 2 Bandung', '2026', 'Rahmat Hidayat', '082987654321', 'PNS');
