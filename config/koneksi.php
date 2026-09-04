<?php
$host = "localhost";
$user = "smk_user";
$pass = "password123"; // Jika pakai XAMPP biasanya kosong. Jika MAMP/Laragon, sesuaikan.,dan kalo pakai linux di situ make mariadb,jadi usser sama password
$db   = "smk_bhinneka";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}
?>