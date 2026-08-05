# 🐘 Backend PHP Native & MySQL - SMK Nusa Bangsa

Dokumentasi resmi backend RESTful API berbasis **PHP Native (PDO MySQL)** untuk Portal PPDB Online, Profil Sekolah, Guru & Kurikulum Pembelajaran SMK Nusa Bangsa.

---

## 📁 Struktur Direktori Backend

```text
backend/
├── database/
│   └── database.sql     # File SQL Import untuk MySQL (Tabel & Seed Data)
├── config/
│   ├── database.php     # Konfigurasi Koneksi PDO Database MySQL
│   └── cors.php         # Handler CORS Header & Standard Format JSON
├── api/
│   ├── ppdb.php         # CRUD Pendaftaran PPDB / MPLS Online
│   ├── guru.php         # CRUD Data Guru & Tenaga Pendidik
│   ├── jurusan.php      # CRUD Program Keahlian / Jurusan
│   ├── pembelajaran.php # CRUD Mata Pelajaran & Kurikulum
│   ├── ekskul.php       # CRUD Ekstrakurikuler
│   ├── pesan.php        # CRUD Form Kontak & Pesan Masuk
│   └── admin.php        # Authentication Login & Statistik Dashboard
└── README.md            # Dokumentasi & Panduan Pemasangan
```

---

## 🛠️ Langkah-Langkah Integrasi Ke Server MySQL

### 1. Import Database Ke MySQL / phpMyAdmin

1. Buka **phpMyAdmin** (misal: `http://localhost/phpmyadmin`) di XAMPP / Laragon / CPanel Anda.
2. Buat database baru dengan nama: **`db_smk_nusa_bangsa`** (Collation: `utf8mb4_unicode_ci`).
3. Pilih database `db_smk_nusa_bangsa`, klik menu **Import**.
4. Pilih file **`backend/database/database.sql`**, lalu klik **Go** / **Kirim**.

---

### 2. Konfigurasi Koneksi Database (`config/database.php`)

Buka file `backend/config/database.php` dan sesuaikan kredensial server MySQL Anda:

```php
private $host = "127.0.0.1";
private $db_name = "db_smk_nusa_bangsa";
private $username = "root";       // Username MySQL Anda
private $password = "";           // Password MySQL Anda
private $port = "3306";
```

---

## 🔌 Dokumentasi RESTful API Endpoints

Semua endpoint mengembalikan format JSON standar:
```json
{
  "status": "success",
  "code": 200,
  "message": "Pesan deskriptif",
  "data": { ... }
}
```

### 1. Pendaftaran PPDB / MPLS Online (`/api/ppdb.php`)
- **`GET /api/ppdb.php`** : Mengambil semua pendaftar PPDB.
- **`GET /api/ppdb.php?code=PPDB-2026-1001`** : Mencari detail pendaftar berdasarkan **Kode Pendaftaran** atau **NIK/NISN**.
- **`POST /api/ppdb.php`** : Mendaftar siswa baru (Sistem otomatis menghasilkan Kode Pendaftaran `PPDB-2026-XXXX`).
  ```json
  {
    "fullName": "Ahmad Rizky",
    "nikNisn": "3273011205080001",
    "birthPlaceDate": "Bandung, 12 Mei 2008",
    "gender": "Laki-laki",
    "address": "Jl. Sukajadi No. 45",
    "originSchool": "SMPN 1 Bandung",
    "phoneWhatsapp": "081234567890",
    "email": "ahmad@gmail.com",
    "parentName": "Budi Pratama",
    "parentPhone": "081298765432",
    "firstChoiceMajor": "RPL",
    "secondChoiceMajor": "AKL"
  }
  ```
- **`PUT /api/ppdb.php`** : Memperbarui status kelolosan berkas pendaftar (opsional untuk panitia).
  ```json
  {
    "id": 1,
    "status": "Diterima",
    "catatan_panitia": "Berkas telah diverifikasi lengkap oleh panitia"
  }
  ```
- **`DELETE /api/ppdb.php?id=1`** : Menghapus data pendaftaran.

---

### 2. Data Guru & Pendidik (`/api/guru.php`)
- **`GET /api/guru.php`** : Mengambil semua data guru aktif.
- **`GET /api/guru.php?dept=RPL`** : Filter guru berdasarkan departemen (`Pimpinan`, `RPL`, `AKL`, `TSM`, `Umum`).
- **`POST /api/guru.php`** : Menambah guru baru.
- **`PUT /api/guru.php`** : Mengubah informasi profil guru.
- **`DELETE /api/guru.php?id=2`** : Menonaktifkan guru.

---

### 3. Program Keahlian / Jurusan (`/api/jurusan.php`)
- **`GET /api/jurusan.php`** : Mengambil daftar jurusan (`RPL`, `AKL`, `TSM`).
- **`GET /api/jurusan.php?code=RPL`** : Detail jurusan Rekayasa Perangkat Lunak.
- **`POST /api/jurusan.php`** : Menambah jurusan baru.
- **`PUT /api/jurusan.php`** : Memperbarui informasi jurusan.

---

### 4. Kurikulum & Mata Pelajaran (`/api/pembelajaran.php`)
- **`GET /api/pembelajaran.php`** : Mengambil semua mata pelajaran.
- **`GET /api/pembelajaran.php?major=RPL`** : Filter mata pelajaran khusus jurusan RPL.
- **`POST /api/pembelajaran.php`** : Menambah mata pelajaran baru.

---

### 5. Pesan Kontak (`/api/pesan.php`)
- **`GET /api/pesan.php`** : Melihat semua pertanyaan/pesan masuk dari calon siswa atau wali murid.
- **`POST /api/pesan.php`** : Mengirim pertanyaan baru dari website.
  ```json
  {
    "nama": "Dewi Lestari",
    "email": "dewi@gmail.com",
    "whatsapp": "08123456789",
    "subjek": "Tanya Jalur Prestasi",
    "pesan": "Apakah ada kuota beasiswa untuk juara FLS2N?"
  }
  ```

---

### 6. Admin Login & Statistik (`/api/admin.php`)
- **`POST /api/admin.php`** : Login Panitia PPDB / Admin.
  - Default Username: `admin`
  - Default Password: `admin123`
- **`GET /api/admin.php`** : Mengambil statistik total pendaftar, rekap per jurusan, pesan belum dibaca, dan total guru.

---

## ⚡ Pengujian API Menggunakan cURL / Postman

Contoh perintah cURL pendaftaran PPDB:
```bash
curl -X POST "http://localhost/smk-nusa-bangsa/backend-php/api/ppdb.php" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Muhammad Fikri",
    "nikNisn": "3273010101080005",
    "birthPlaceDate": "Bandung, 1 Januari 2008",
    "gender": "Laki-laki",
    "address": "Jl. Asia Afrika No. 10",
    "originSchool": "SMPN 2 Bandung",
    "phoneWhatsapp": "081299887766",
    "parentName": "Agus Hidayat",
    "parentPhone": "081288776655",
    "firstChoiceMajor": "RPL",
    "secondChoiceMajor": "TSM"
  }'
```

---

## 🟢 Siap Dihubungkan Dengan Aplikasi Frontend

Backend ini dilengkapi header **CORS (Cross-Origin Resource Sharing)** secara otomatis sehingga siap dihubungkan dengan aplikasi React/Vue/Flutter lokal maupun server hosting cPanel / VPS secara aman.
