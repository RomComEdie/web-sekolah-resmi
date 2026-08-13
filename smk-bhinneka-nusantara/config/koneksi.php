<?php
$host = "localhost";
$user = "root";
$pass = ""; // Jika pakai XAMPP biasanya kosong. Jika MAMP/Laragon, sesuaikan.
$db   = "smk_bhinneka_db";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}
?>