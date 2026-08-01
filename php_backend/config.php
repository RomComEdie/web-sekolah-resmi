<?php
/**
 * ===================================================================
 * KONFIGURASI DATABASE MYSQL & PHP NATIVE
 * SMK PRESTASI NUSANTARA - SISTEM PPDB ONLINE
 * ===================================================================
 * Sesuaikan parameter di bawah ini dengan konfigurasi phpMyAdmin /
 * web hosting (cPanel, XAMPP, Laragon, dll).
 */

// Host Database MySQL (default: localhost atau 127.0.0.1)
define('DB_HOST', 'localhost');

// Nama Database MySQL yang telah diimport via phpMyAdmin
define('DB_NAME', 'db_smk_prestasi');

// Username Database MySQL (default XAMPP: root, Laragon: root)
define('DB_USER', 'root');

// Password Database MySQL (default XAMPP: empty/kosong, Laragon: empty)
define('DB_PASS', '');

// Charset & Collation
define('DB_CHARSET', 'utf8mb4');

// Timezone Indonesia
date_default_timezone_set('Asia/Jakarta');

// CORS Header Config (Atur domain frontend jika di-host terpisah)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
