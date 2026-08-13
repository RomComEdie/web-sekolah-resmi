<?php
session_start();
require_once '../config/koneksi.php';

// Proses Update Status PPDB oleh Superadmin
if (isset($_POST['update_status_ppdb'])) {
    $status_baru = $_POST['status_ppdb'];
    mysqli_query($koneksi, "UPDATE pengaturans SET nilai = '$status_baru' WHERE nama_pengaturan = 'status_ppdb'");
    echo "<script>alert('Status Gelombang PPDB Berhasil Diperbarui!'); window.location='index.php';</script>";
}

// Ambil status PPDB saat ini
$q_ppdb = mysqli_query($koneksi, "SELECT nilai FROM pengaturans WHERE nama_pengaturan = 'status_ppdb'");
$d_ppdb = mysqli_fetch_assoc($q_ppdb);
$status_ppdb_aktif = $d_ppdb['nilai'] ?? '1'; // Default 1


if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit();
}

$message = '';
$error = '';

// KELOLA ADMIN
if (isset($_POST['tambah_admin'])) {
    if (!isset($_SESSION['admin_role']) || $_SESSION['admin_role'] !== 'superadmin') {
        $error = "Akses ditolak!";
    } else {
        $username     = trim($_POST['username']);
        $password     = trim($_POST['password']);
        $nama_lengkap = trim($_POST['nama_lengkap']);
        $role         = $_POST['role'];

        if (!empty($username) && !empty($password) && !empty($nama_lengkap)) {
            $cek_user = mysqli_prepare($koneksi, "SELECT id FROM admin WHERE username = ?");
            mysqli_stmt_bind_param($cek_user, "s", $username);
            mysqli_stmt_execute($cek_user);
            mysqli_stmt_store_result($cek_user);

            if (mysqli_stmt_num_rows($cek_user) > 0) {
                $error = "Username sudah terdaftar!";
            } else {
                $password_hashed = password_hash($password, PASSWORD_BCRYPT);
                $stmt = mysqli_prepare($koneksi, "INSERT INTO admin (username, password, nama_lengkap, role) VALUES (?, ?, ?, ?)");
                mysqli_stmt_bind_param($stmt, "ssss", $username, $password_hashed, $nama_lengkap, $role);
                if (mysqli_stmt_execute($stmt)) { $message = "Admin baru berhasil ditambahkan!"; }
                mysqli_stmt_close($stmt);
            }
            mysqli_stmt_close($cek_user);
        }
    }
}

if (isset($_GET['hapus_admin'])) {
    if ($_SESSION['admin_role'] === 'superadmin') {
        $id_hapus = (int)$_GET['hapus_admin'];
        if ($id_hapus !== (int)$_SESSION['admin_id']) {
            $stmt = mysqli_prepare($koneksi, "DELETE FROM admin WHERE id = ?");
            mysqli_stmt_bind_param($stmt, "i", $id_hapus);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            $message = "Admin berhasil dihapus!";
        }
    }
}

// KELOLA BERITA
if (isset($_POST['tambah_berita'])) {
    $judul     = trim($_POST['judul']);
    $kategori  = trim($_POST['kategori']);
    $deskripsi = trim($_POST['deskripsi']);
    $gambar    = !empty($_POST['gambar']) ? trim($_POST['gambar']) : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
    $tanggal   = $_POST['tanggal'];
    $penulis   = trim($_POST['penulis']);

    $stmt = mysqli_prepare($koneksi, "INSERT INTO berita (judul, kategori, deskripsi, gambar, tanggal, penulis) VALUES (?, ?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssssss", $judul, $kategori, $deskripsi, $gambar, $tanggal, $penulis);
    if (mysqli_stmt_execute($stmt)) { $message = "Berita berhasil diterbitkan!"; }
    mysqli_stmt_close($stmt);
}

if (isset($_GET['hapus_berita'])) {
    $id = (int)$_GET['hapus_berita'];
    $stmt = mysqli_prepare($koneksi, "DELETE FROM berita WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    header("Location: index.php");
    exit();
}

// KELOLA EKSKUL
if (isset($_POST['tambah_ekskul'])) {
    $nama      = trim($_POST['nama']);
    $ikon      = trim($_POST['ikon']);
    $deskripsi = trim($_POST['deskripsi']);

    $stmt = mysqli_prepare($koneksi, "INSERT INTO ekskul (nama, ikon, deskripsi) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "sss", $nama, $ikon, $deskripsi);
    if (mysqli_stmt_execute($stmt)) { $message = "Ekskul berhasil ditambahkan!"; }
    mysqli_stmt_close($stmt);
}

if (isset($_GET['hapus_ekskul'])) {
    $id = (int)$_GET['hapus_ekskul'];
    $stmt = mysqli_prepare($koneksi, "DELETE FROM ekskul WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    header("Location: index.php");
    exit();
}

$query_admin  = mysqli_query($koneksi, "SELECT id, username, nama_lengkap, role FROM admin ORDER BY id DESC");
$query_berita = mysqli_query($koneksi, "SELECT * FROM berita ORDER BY id DESC");
$query_ekskul = mysqli_query($koneksi, "SELECT * FROM ekskul ORDER BY id DESC");
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin — SMK Bhinneka</title>
    <!-- FontAwesome Icon Favicon (Ganti Emoji) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- CSS Modern Minimalis -->
    <link rel="stylesheet" href="../css/dashboard_modern.css?v=<?= time(); ?>">
 
</head>
<body>

<div class="container">
    <!-- Header -->
    <div class="header">
        <h2><i class="fa-solid fa-shapes"></i> Admin Workspace</h2>
        <div class="user-info">
            <span>Halo, <b><?= htmlspecialchars($_SESSION['admin_name']) ?></b></span>
            <a href="../index.php" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Web Utama</a>
            <a href="logout.php" class="logout"><i class="fa-solid fa-right-from-bracket"></i> Keluar</a>
        </div>
    </div>

    <?php if ($message): ?><div class="alert-success"><i class="fa-solid fa-circle-check"></i> <?= htmlspecialchars($message) ?></div><?php endif; ?>
    <?php if ($error): ?><div class="alert-error"><i class="fa-solid fa-circle-exclamation"></i> <?= htmlspecialchars($error) ?></div><?php endif; ?>

    <!-- 1. KELOLA ADMIN (KHUSUS SUPERADMIN) -->
    <?php if (isset($_SESSION['admin_role']) && $_SESSION['admin_role'] === 'superadmin'): ?>
    <div class="card">
        <h3><i class="fa-solid fa-user-gear"></i> Kelola Tim Administrasi</h3>
        <form method="POST">
            <div class="grid">
                <input type="text" name="nama_lengkap" placeholder="Nama Lengkap" required>
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <select name="role" required>
                    <option value="superadmin">Superadmin</option>
                    <option value="petugas_ppdb">Petugas PPDB</option>
                    <option value="redaksi">Redaksi</option>
                </select>
            </div>
            <button type="submit" name="tambah_admin" class="btn-neu">
                <i class="fa-solid fa-user-plus"></i> Tambah Pengguna
            </button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Pengguna</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($adm = mysqli_fetch_assoc($query_admin)): ?>
                <tr>
                    <td><b><?= htmlspecialchars($adm['nama_lengkap']) ?></b></td>
                    <td><code><?= htmlspecialchars($adm['username']) ?></code></td>
                    <td><span class="badge"><?= htmlspecialchars($adm['role']) ?></span></td>
                    <td>
                        <?php if ((int)$adm['id'] !== (int)$_SESSION['admin_id']): ?>
                            <a href="?hapus_admin=<?= $adm['id'] ?>" class="btn-del" onclick="return confirm('Hapus admin ini?')">Hapus</a>
                        <?php else: ?>
                            <small style="color:#a0aec0;">(Akun Anda)</small>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>

    <!-- Card Kontrol Status PPDB -->
    <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 20px;">
        <h3><i class="fa-solid fa-toggle-on"></i> Kontrol Status PPDB</h3>
        <p>Atur apakah form pendaftaran siswa baru ditampilkan atau disembunyikan di landing page.</p>
        
        <form method="POST">
            <label style="font-weight: bold; display: block; margin-bottom: 10px;">Status Gelombang PPDB Saat Ini:</label>
            <select name="status_ppdb" style="padding: 10px; border-radius: 8px; border: 1px solid #ccc; font-weight: bold; width: 200px;">
                <option value="1" <?= $status_ppdb_aktif == '1' ? 'selected' : '' ?>>🟢 DIBUKA (Aktif)</option>
                <option value="0" <?= $status_ppdb_aktif == '0' ? 'selected' : '' ?>>🔴 DITUTUP (Sembunyi)</option>
            </select>
            <button type="submit" name="update_status_ppdb" style="background: #0e382b; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-left: 10px;">
                Simpan Perubahan
            </button>
        </form>
    </div>

    <!-- 2. KELOLA BERITA -->
    <div class="card">
        <h3><i class="fa-regular fa-newspaper"></i> Publikasi Berita & Publikasi</h3>
        <form method="POST">
            <div class="grid">
                <input type="text" name="judul" placeholder="Judul Berita Baru" required>
                <input type="text" name="kategori" placeholder="Kategori (cth: Prestasi)" required>
                <input type="date" name="tanggal" required>
                <input type="text" name="penulis" value="Redaksi Sekolah">
            </div>
            <input type="url" name="gambar" placeholder="URL Gambar Header" style="margin-bottom:15px;">
            <textarea name="deskripsi" placeholder="Ringkasan singkat berita..." rows="3" required style="margin-bottom:15px;"></textarea>
            <button type="submit" name="tambah_berita" class="btn-neu">
                <i class="fa-solid fa-paper-plane"></i> Terbitkan Berita
            </button>
        </form>

        <table>
            <thead>
                <tr><th>Judul</th><th>Kategori</th><th>Tanggal</th><th>Aksi</th></tr>
            </thead>
            <tbody>
                <?php while ($row = mysqli_fetch_assoc($query_berita)): ?>
                <tr>
                    <td><b><?= htmlspecialchars($row['judul']) ?></b></td>
                    <td><span class="badge"><?= htmlspecialchars($row['kategori']) ?></span></td>
                    <td><?= $row['tanggal'] ?></td>
                    <td><a href="?hapus_berita=<?= $row['id'] ?>" class="btn-del" onclick="return confirm('Hapus berita ini?')">Hapus</a></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>

    <!-- 3. KELOLA EKSKUL -->
<!-- 3. KELOLA EKSKUL (Input Ramah Pengguna) -->
    <div class="card">
        <h3><i class="fa-solid fa-trophy"></i> Ekstrakurikuler Sekolah</h3>
        <form method="POST">
            <div class="grid">
                <input type="text" name="nama" placeholder="Nama Ekstrakurikuler (cth: Paskibra)" required>
                
                <!-- Dropdown Ikon Siap Pakai (User Tinggal Pilih) -->
                <select name="ikon" required>
                    <option value="">-- Pilih Jenis Ikon --</option>
                    <option value="fa-volleyball">🏐 Olahraga / Voli / Basket</option>
                    <option value="fa-futbol">⚽ Sepakbola / Futsal</option>
                    <option value="fa-music">🎵 Seni Musik / Padus</option>
                    <option value="fa-shield-halved">🛡️ Paskibra / Pramuka</option>
                    <option value="fa-laptop-code">💻 Computer / IT Club</option>
                    <option value="fa-camera">📸 Fotografi / Jurnalistik</option>
                    <option value="fa-book-quran">📖 Rohis / Keagamaan</option>
                    <option value="fa-heart-pulse">🩺 PMR / Kesehatan</option>
                    <option value="fa-trophy">🏆 Umum / Prestasi</option>
                </select>
            </div>
            <textarea name="deskripsi" placeholder="Deskripsi ringkas kegiatan ekskul..." rows="2" required style="margin-bottom:15px;"></textarea>
            <button type="submit" name="tambah_ekskul" class="btn-neu">
                <i class="fa-solid fa-plus"></i> Tambah Ekskul
            </button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Ikon</th>
                    <th>Nama Ekstrakurikuler</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = mysqli_fetch_assoc($query_ekskul)): ?>
                <tr>
                    <td>
                        <span class="badge" style="padding: 8px 12px;">
                            <i class="fa-solid <?= htmlspecialchars($row['ikon']) ?>" style="font-size:16px;"></i>
                        </span>
                    </td>
                    <td><b><?= htmlspecialchars($row['nama']) ?></b></td>
                    <td><?= htmlspecialchars($row['deskripsi']) ?></td>
                    <td>
                        <a href="?hapus_ekskul=<?= $row['id'] ?>" class="btn-del" onclick="return confirm('Hapus ekskul ini?')">Hapus</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>