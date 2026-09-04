<?php
// config/buat_admin.php
require_once 'koneksi.php';

// 1. Buat / Pastikan Tabel Admin Ada
$query_table = "CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('superadmin', 'petugas_ppdb', 'redaksi') DEFAULT 'superadmin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!mysqli_query($koneksi, $query_table)) {
    die("Gagal membuat tabel admin: " . mysqli_error($koneksi));
}

// 2. Kosongkan dulu jika ada data mengantung, lalu insert akun baru
mysqli_query($koneksi, "TRUNCATE TABLE admin");

$username = 'admin';
$password_plain = 'Admin#12345';
$nama_lengkap = 'Administrator Utama';
$password_hashed = password_hash($password_plain, PASSWORD_BCRYPT);

$stmt = mysqli_prepare($koneksi, "INSERT INTO admin (username, password, nama_lengkap) VALUES (?, ?, ?)");
mysqli_stmt_bind_param($stmt, "sss", $username, $password_hashed, $nama_lengkap);

if (mysqli_stmt_execute($stmt)) {
    echo "<h3>✅ BERHASIL!</h3>";
    echo "Tabel 'admin' telah diperbarui dan disi ulang.<br><br>";
    echo "<b>Username:</b> <code>admin</code><br>";
    echo "<b>Password:</b> <code>Admin#12345</code><br><br>";
    echo "<a href='../admin/login.php'>👉 Klik di sini untuk mencoba Login</a>";
} else {
    echo "<h3>❌ GAGAL INSERT:</h3> " . mysqli_error($koneksi);
}

mysqli_stmt_close($stmt);
?>