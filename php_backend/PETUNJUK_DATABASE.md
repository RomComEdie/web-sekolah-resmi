# PANDUAN INTEGRASI BACKEND PHP NATIVE & MYSQL phpMyAdmin
**SMK PRESTASI NUSANTARA - PPDB ONLINE**

---

## 📋 PERSYARATAN
- Web Server: **XAMPP / Laragon / Nginx / Apache / cPanel**
- PHP: **Version 7.4 / 8.0 / 8.1 / 8.2 / 8.3+** dengan ekstensi `pdo_mysql` aktif
- Database: **MySQL / MariaDB** dengan **phpMyAdmin**

---

## 🛠️ LANGKAH 1: IMPORT DATABASE KE phpMyAdmin
1. Buka browser dan akses **phpMyAdmin** (biasanya di `http://localhost/phpmyadmin` atau via cPanel).
2. Klik tab **SQL** atau buat database baru bernama `db_smk_prestasi`.
3. Buka file `php_backend/database.sql` yang ada dalam folder project ini.
4. Salin seluruh isi skrip SQL tersebut, lalu tempelkan ke tab **SQL** phpMyAdmin dan klik **Go / Kirim**.
5. Tabel `pendaftaran_ppdb` akan otomatis terbentuk beserta constraint keunikan NISN dan data pendaftar awal.

---

## ⚙️ LANGKAH 2: KONFIGURASI `config.php`
Buka file `php_backend/config.php` dan sesuaikan kredensial database Anda:

```php
define('DB_HOST', 'localhost');       // Host MySQL (default: localhost)
define('DB_NAME', 'db_smk_prestasi'); // Nama Database
define('DB_USER', 'root');            // Username MySQL
define('DB_PASS', '');                // Password MySQL (default XAMPP kosong)
```

---

## 🚀 LANGKAH 3: PENGUJIAN API PHP NATIVE

### 1. Submit Pendaftaran Baru (POST)
- **URL**: `http://localhost/php_backend/api_pendaftaran.php`
- **Body (JSON / Form Data)**:
```json
{
  "nisn": "0081122334",
  "namaLengkap": "Budi Raharjo",
  "jenisKelamin": "Laki-Laki",
  "tempatLahir": "Jakarta",
  "tanggalLahir": "2009-01-15",
  "noHp": "081299887766",
  "alamat": "Jl. Sudirman No 10",
  "jurusan": "RPL",
  "asalSekolah": "SMPN 5 Jakarta",
  "tahunLulus": "2026",
  "namaOrangTua": "Agus Raharjo",
  "noHpOrangTua": "081388776655",
  "pekerjaanOrangTua": "Swasta"
}
```

### 2. Cek Keunikan NISN (GET)
- **URL**: `http://localhost/php_backend/api_check_nisn.php?nisn=0081122334`

### 3. Get Data Pendaftar (GET)
- **URL**: `http://localhost/php_backend/api_admin.php`

---

## 🔒 FITUR KEAMANAN & KEUNGGULAN PHP NATIVE PDO:
1. **Prepared Statements**: Mencegah serangan SQL Injection.
2. **Strict NISN Uniqueness**: Memastikan 1 NISN hanya bisa digunakan 1 kali pendaftaran.
3. **PDO Error Handling**: Mengembalikan response standar JSON dengan HTTP Code yang tepat (201, 400, 409, 500).
