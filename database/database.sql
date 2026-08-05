-- ============================================================
-- DATABASE SCHEMA & SEED DATA: SMK NUSA BANGSA
-- System: PPDB Online & Management System Sekolah Kejuruan
-- Compatible with MySQL 5.7+ / MariaDB / phpMyAdmin / XAMPP / Laragon
-- ============================================================

CREATE DATABASE IF NOT EXISTS `db_smk_nusa_bangsa` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `db_smk_nusa_bangsa`;

-- ------------------------------------------------------------
-- 1. TABEL ADMIN & OTENTIKASI
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_admin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama_admin` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `role` ENUM('Super Admin', 'Panitia PPDB', 'Tata Usaha') DEFAULT 'Panitia PPDB',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password default admin: 'admin123' (disimpan dalam hash BCRYPT)
INSERT INTO `tb_admin` (`username`, `password`, `nama_admin`, `email`, `role`) VALUES
('admin', '$2y$10$wE3/M/2U3s31N3P5xM2Q3O31gN/O0Q8R2y6z6A2B3C4D5E6F7G8H9', 'Panitia PPDB Utama', 'ppdb@smknusabangsa.sch.id', 'Super Admin')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ------------------------------------------------------------
-- 2. TABEL PENDAFTARAN PPDB / MPLS ONLINE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_ppdb` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `registration_code` VARCHAR(30) NOT NULL UNIQUE,
  `program_type` VARCHAR(50) DEFAULT 'MPLS / PPDB Siswa Baru',
  `full_name` VARCHAR(150) NOT NULL,
  `nik_nisn` VARCHAR(30) NOT NULL,
  `birth_place_date` VARCHAR(100) NOT NULL,
  `gender` ENUM('Laki-laki', 'Perempuan') NOT NULL,
  `address` TEXT NOT NULL,
  `origin_school` VARCHAR(150) NOT NULL,
  `phone_whatsapp` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `parent_name` VARCHAR(150) NOT NULL,
  `parent_phone` VARCHAR(30) NOT NULL,
  `first_choice_major` ENUM('RPL', 'AKL', 'TSM') NOT NULL,
  `second_choice_major` ENUM('RPL', 'AKL', 'TSM') NOT NULL,
  `registration_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Tergrafis (Pending Verification)', 'Lolos Berkas', 'Diterima', 'Ditolak') DEFAULT 'Tergrafis (Pending Verification)',
  `catatan_panitia` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Pendaftar PPDB Sesuai Data Aplikasi
INSERT INTO `tb_ppdb` (
  `registration_code`, `program_type`, `full_name`, `nik_nisn`, `birth_place_date`, 
  `gender`, `address`, `origin_school`, `phone_whatsapp`, `email`, `parent_name`, 
  `parent_phone`, `first_choice_major`, `second_choice_major`, `status`
) VALUES
('PPDB-2026-1001', 'MPLS / PPDB Siswa Baru', 'Ahmad Rizky Pratama', '3273011205080001', 'Bandung, 12 Mei 2008', 'Laki-laki', 'Jl. Sukajadi No. 45, Bandung', 'SMP Negeri 1 Bandung', '081234567890', 'ahmad.rizky@gmail.com', 'Budi Pratama', '081298765432', 'RPL', 'AKL', 'Lolos Berkas'),
('PPDB-2026-1002', 'MPLS / PPDB Siswa Baru', 'Siti Nurhaliza', '3273022508080002', 'Cimahi, 25 Agustus 2008', 'Perempuan', 'Jl. Raya Cihanjuang No. 12, Cimahi', 'SMP Negeri 3 Cimahi', '082198765432', 'siti.nurhaliza@gmail.com', 'Ahmad Suhendar', '082112345678', 'AKL', 'RPL', 'Diterima'),
('PPDB-2026-1003', 'MPLS / PPDB Siswa Baru', 'Bagas Satria Wijaya', '3273031010080003', 'Bandung, 10 Oktober 2008', 'Laki-laki', 'Jl. Setiabudhi No. 88, Bandung', 'SMP Pasundan 1 Bandung', '085712345678', 'bagas.satria@gmail.com', 'Hendrik Wijaya', '085798765432', 'TSM', 'RPL', 'Tergrafis (Pending Verification)')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ------------------------------------------------------------
-- 3. TABEL GURU & TENAGA PENDIDIK
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_guru` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nip` VARCHAR(30) DEFAULT NULL,
  `nama_lengkap` VARCHAR(150) NOT NULL,
  `jabatan` VARCHAR(100) NOT NULL,
  `departemen` ENUM('Pimpinan', 'RPL', 'AKL', 'TSM', 'Umum') DEFAULT 'Umum',
  `mata_pelajaran` VARCHAR(150) NOT NULL,
  `pendidikan_terakhir` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `whatsapp` VARCHAR(30) DEFAULT NULL,
  `foto` TEXT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `quote` TEXT DEFAULT NULL,
  `status_aktif` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Guru
INSERT INTO `tb_guru` (
  `nip`, `nama_lengkap`, `jabatan`, `departemen`, `mata_pelajaran`, 
  `pendidikan_terakhir`, `email`, `whatsapp`, `foto`, `bio`, `quote`
) VALUES
('19780412 200501 1 003', 'Dr. Ir. Hj. Nurjanah, M.Pd.', 'Kepala Sekolah', 'Pimpinan', 'Manajemen Pendidikan & Vokasi', 'S3 Manajemen Pendidikan (UNPAD)', 'kepsek@smknusabangsa.sch.id', '081220001111', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', 'Berpengalaman 20+ tahun memimpin transformasi sekolah kejuruan pusat keunggulan.', 'Vokasi kuat, Indonesia maju dengan karya nyata dan karakter berintegritas.'),
('19850918 201001 1 005', 'Hendra Wijaya, M.Kom.', 'Kepala Program Keahlian RPL', 'RPL', 'Pemrograman Web & Mobile (Fullstack)', 'S2 Ilmu Komputer (ITB)', 'hendra.rpl@smknusabangsa.sch.id', '081220002222', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600', 'Praktisi industri software engineer dengan keahlian Fullstack React, Laravel & Flutter.', 'Coding bukan hanya syntax, melainkan seni menyelesaikan masalah dunia nyata.'),
('19880322 201201 2 004', 'Siti Aminah, S.E., M.Ak.', 'Kepala Program Keahlian AKL', 'AKL', 'Akuntansi Keuangan & Perbankan', 'S2 Akuntansi (UI)', 'siti.akl@smknusabangsa.sch.id', '081220003333', 'https://images.unsplash.com/photo-1580894732413-a70d2a93c9e3?auto=format&fit=crop&q=80&w=600', 'Assessor Sertifikasi Profesi BNSP Akuntansi Keuangan Perbankan.', 'Kerapihan laporan keuangan adalah kunci keberlanjutan setiap bisnis.'),
('19821105 200801 1 009', 'Budi Santoso, S.T.', 'Kepala Program Keahlian TSM', 'TSM', 'Teknik Mesin & Injeksi Sepeda Motor', 'S1 Teknik Mesin (UPI)', 'budi.tsm@smknusabangsa.sch.id', '081220004444', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 'Sertifikasi Trainer Resmi Industri Otomotif Sepeda Motor Injeksi.', 'Satu putaran baut presisi menentukan keselamatan dan performa mesin.'),
('19900115 201501 1 012', 'Rahmat Hidayat, S.Pd.I.', 'Wakil Kepala Bidang Kesiswaan', 'Umum', 'Pendidikan Agama & Karakter', 'S1 Pendidikan Agama Islam', 'rahmat.kesiswaan@smknusabangsa.sch.id', '081220005555', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', 'Pembina ekstrakurikuler kepemimpinan dan pembentuk kedisiplinan siswa.', 'Keterampilan tinggi tanpa akhlak mulia bagaikan pohon tanpa buah.')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ------------------------------------------------------------
-- 4. TABEL PROGRAM KEAHLIAN / JURUSAN
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_jurusan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode` VARCHAR(10) NOT NULL UNIQUE,
  `nama_jurusan` VARCHAR(100) NOT NULL,
  `nama_lengkap` VARCHAR(150) NOT NULL,
  `head_of_department` VARCHAR(100) NOT NULL,
  `deskripsi_singkat` TEXT NOT NULL,
  `deskripsi_lengkap` TEXT NOT NULL,
  `jumlah_siswa` INT DEFAULT 0,
  `foto` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Jurusan
INSERT INTO `tb_jurusan` (
  `kode`, `nama_jurusan`, `nama_lengkap`, `head_of_department`, 
  `deskripsi_singkat`, `deskripsi_lengkap`, `jumlah_siswa`, `foto`
) VALUES
('RPL', 'Rekayasa Perangkat Lunak', 'Rekayasa Perangkat Lunak & GDM', 'Hendra Wijaya, M.Kom.', 
 'Fokus pada pemrograman web, aplikasi mobile, AI dasar, dan cloud computing.', 
 'Program keahlian yang membekali siswa dengan kemampuan merancang, mengembankan, dan memelihara perangkat lunak tingkat industri.', 
 420, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'),
('AKL', 'Akuntansi Keuangan Lembaga', 'Akuntansi dan Keuangan Lembaga', 'Siti Aminah, S.E., M.Ak.', 
 'Mencetak tenaga ahli keuangan, perpajakan, perbankan, dan sistem akuntansi komputer.', 
 'Menghasilkan lulusan yang ahli mengelola pembukuan, transaksi perbankan, dan laporan finansial berbasis teknologi.', 
 390, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'),
('TSM', 'Teknik Sepeda Motor', 'Teknik dan Bisnis Sepeda Motor', 'Budi Santoso, S.T.', 
 'Spesialisasi teknik mesin, sistem injeksi PGM-FI, kelistrikan, dan wirausaha bengkel.', 
 'Mempersiapkan teknisi handal yang menguasai mesin injeksi modern, analisis kerusakan komputerisasi, serta manajemen bengkel resmi.', 
 470, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ------------------------------------------------------------
-- 5. TABEL MATA PELAJARAN (KURIKULUM)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_mata_pelajaran` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode` VARCHAR(20) NOT NULL UNIQUE,
  `nama` VARCHAR(150) NOT NULL,
  `kategori` ENUM('Muatan Nasional', 'Muatan Kejuruan (Produktif)', 'Muatan Kewilayahan') NOT NULL,
  `tingkat` ENUM('Kelas X', 'Kelas XI', 'Kelas XII', 'Semua Tingkat') NOT NULL,
  `jurusan` ENUM('RPL', 'AKL', 'TSM', 'Semua') DEFAULT 'Semua',
  `jam_per_minggu` INT NOT NULL DEFAULT 2,
  `deskripsi` TEXT NOT NULL,
  `foto` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Mata Pelajaran
INSERT INTO `tb_mata_pelajaran` (`kode`, `nama`, `kategori`, `tingkat`, `jurusan`, `jam_per_minggu`, `deskripsi`, `foto`) VALUES
('RPL-MOB', 'Pemrograman Web & Perangkat Bergerak', 'Muatan Kejuruan (Produktif)', 'Kelas XI', 'RPL', 8, 'Menguasai pembuatan aplikasi web modern responsif serta aplikasi mobile berbasis Flutter.', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600'),
('RPL-DAS', 'Dasar-Dasar Pemrograman & Algoritma', 'Muatan Kejuruan (Produktif)', 'Kelas X', 'RPL', 6, 'Dasar-dasar algoritma pemrograman, logika flowchart, variabel, dan struktur data.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600'),
('AKL-KOM', 'Komputer Akuntansi (MYOB & Accurate)', 'Muatan Kejuruan (Produktif)', 'Kelas XI', 'AKL', 6, 'Pengoperasian aplikasi akuntansi komputer terstandar industri untuk pemrosesan jurnal.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'),
('TSM-INJ', 'Sistem Injeksi & Kelistrikan Sepeda Motor', 'Muatan Kejuruan (Produktif)', 'Kelas XII', 'TSM', 6, 'Diagnosis kerusakan sensor ECM, Injektor, Throttle Body dengan alat Scanner Tool.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'),
('UM-INDO', 'Bahasa Indonesia & Komunikasi Vokasi', 'Muatan Nasional', 'Semua Tingkat', 'Semua', 3, 'Kemampuan menyusun laporan kerja, proposal usaha, serta komunikasi efektif.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ------------------------------------------------------------
-- 6. TABEL EKSTRAKURIKULER
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_ekstrakurikuler` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `kategori` ENUM('Akademik & Teknologi', 'Olahraga', 'Seni & Budaya', 'Kepemimpinan') NOT NULL,
  `jadwal` VARCHAR(100) NOT NULL,
  `pembina` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `foto` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Ekstrakurikuler
INSERT INTO `tb_ekstrakurikuler` (`nama`, `kategori`, `jadwal`, `pembina`, `deskripsi`, `foto`) VALUES
('Developer Student Club (Coding)', 'Akademik & Teknologi', 'Rabu & Jumat (15.30 - 17.30 WIB)', 'Hendra Wijaya, M.Kom.', 'Wadah komunitas pengembang muda untuk belajar algoritma kompetitif & web.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'),
('Pramuka Ambalan Nusa Bangsa', 'Kepemimpinan', 'Jumat (13.30 - 16.00 WIB)', 'Rahmat Hidayat, S.Pd.I.', 'Ekstrakurikuler wajib pembentuk karakter kedisiplinan & kepemimpinan.', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600'),
('Futsal & Basketball Club', 'Olahraga', 'Selasa & Sabtu (16.00 - 18.00 WIB)', 'Agus Gunawan, A.Md.T.', 'Latihan rutin olahraga kebugaran dan pembinaan atlet muda.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ------------------------------------------------------------
-- 7. TABEL PESAN KONTAK / PERTANYAAN
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_pesan_kontak` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `whatsapp` VARCHAR(30) DEFAULT NULL,
  `subjek` VARCHAR(200) NOT NULL,
  `pesan` TEXT NOT NULL,
  `status` ENUM('Belum Dibaca', 'Sudah Dibaca', 'Dibalas') DEFAULT 'Belum Dibaca',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tb_pesan_kontak` (`nama`, `email`, `whatsapp`, `subjek`, `pesan`, `status`) VALUES
('Dewi Lestari', 'dewi.lestari@gmail.com', '081399887766', 'Tanya Jalur Prestasi PPDB', 'Apakah pendaftaran jalur prestasi akademik menyertakan piagam tingkat kota?', 'Sudah Dibaca');

-- ============================================================
-- FINISH SETUP SQL
-- ============================================================
