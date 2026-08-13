<?php
session_start();
require_once '../config/koneksi.php';

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: index.php");
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (!empty($username) && !empty($password)) {
        $stmt = mysqli_prepare($koneksi, "SELECT id, username, password, nama_lengkap, role FROM admin WHERE username = ?");
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($user = mysqli_fetch_assoc($result)) {
            if (password_verify($password, $user['password'])) {
                session_regenerate_id(true);

                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id']        = $user['id'];
                $_SESSION['admin_name']      = $user['nama_lengkap'];
                $_SESSION['admin_role']      = $user['role'];

                header("Location: index.php");
                exit();
            } else {
                $error = "Password yang Anda masukkan salah!";
            }
        } else {
            $error = "Username tidak ditemukan!";
        }
        mysqli_stmt_close($stmt);
    } else {
        $error = "Harap isi semua kolom!";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin — SMK Bhinneka Nusantara</title>
    <!-- CSS Neumorphism Dipisah ke File Terpisah -->
    <link rel="stylesheet" href="style_login.css">
</head>
<body>
<style>
    * {
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    /* Latar belakang Forest Green terang/lembut */
    background-color: #d4e0d7;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

/* Kartu Utama Neumorphism */
.login-card {
    background: #d4e0d7;
    padding: 40px 30px;
    border-radius: 30px;
    width: 350px;
    /* Bayangan gelap (hijau tua pudar) & terang (putih) */
    box-shadow: 10px 10px 20px #b3bfb6, 
                -10px -10px 20px #f5fff8;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Lingkaran Avatar Atas */
.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #d4e0d7;
    box-shadow: inset 4px 4px 8px #b3bfb6, 
                inset -4px -4px 8px #f5fff8;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    color: #2e4a3b;
    margin-bottom: 20px;
}

.title {
    color: #1e3327; /* Forest Deep Dark untuk teks */
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 4px 0;
    text-align: center;
}

.subtitle {
    color: #4a6354;
    font-size: 13px;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 500;
}

form {
    width: 100%;
}

.input-group {
    margin-bottom: 20px;
}

/* Input Cekung (Inset) */
input {
    width: 100%;
    padding: 14px 20px;
    border-radius: 20px;
    border: none;
    outline: none;
    background: #d4e0d7;
    color: #1e3327;
    font-size: 14px;
    box-shadow: inset 4px 4px 8px #b3bfb6, 
                inset -4px -4px 8px #f5fff8;
    transition: all 0.3s ease;
}

input::placeholder {
    color: #789081;
}

input:focus {
    box-shadow: inset 6px 6px 10px #b3bfb6, 
                inset -6px -6px 10px #f5fff8;
}

/* Tombol Timbul Akses Forest Green */
button {
    width: 100%;
    padding: 14px;
    border-radius: 20px;
    border: none;
    background: #2d5a43; /* Hijau Hutan Solid */
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 6px 6px 12px #b3bfb6, 
                -6px -6px 12px #f5fff8;
    transition: all 0.2s ease;
    margin-top: 10px;
}

button:hover {
    background: #234734;
    transform: translateY(-2px);
    box-shadow: 8px 8px 16px #b3bfb6, 
                -8px -8px 16px #f5fff8;
}

button:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 6px #b3bfb6, 
                -2px -2px 6px #f5fff8;
}

/* Notifikasi Pesan Error Cekung */
.error {
    background: #d4e0d7;
    color: #9b2c2c;
    padding: 12px 15px;
    border-radius: 15px;
    font-size: 12px;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: inset 3px 3px 6px #b3bfb6, 
                inset -3px -3px 6px #f5fff8;
    font-weight: 600;
}
</style>
<div class="login-card">
    <div class="avatar">
        🌲
    </div>
    
    <h2 class="title">SMK Bhinneka</h2>
    <div class="subtitle">Portal Admin Sekolah</div>

    <?php if ($error): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST">
        <div class="input-group">
            <input type="text" name="username" placeholder="Username" required autocomplete="off">
        </div>
        <div class="input-group">
            <input type="password" name="password" placeholder="Password" required>
        </div>
        <button type="submit">Masuk Ke Dashboard</button>
    </form>
</div>

</body>
</html>