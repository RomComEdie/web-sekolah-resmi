<?php
/**
 * ===================================================================
 * LANDING & HEALTH CHECK - BACKEND PHP NATIVE PPDB
 * SMK PRESTASI NUSANTARA
 * ===================================================================
 */

require_once __DIR__ . '/config.php';

$dbStatus = 'Unchecked';
$dbMessage = '';

try {
    require_once __DIR__ . '/koneksi.php';
    $stmt = $pdo->query("SELECT COUNT(*) FROM pendaftaran_ppdb");
    $totalReg = $stmt->fetchColumn();
    $dbStatus = 'Connected';
    $dbMessage = "Terhubung dengan sukses ke MySQL database '" . DB_NAME . "'. Total pendaftar: $totalReg siswa.";
} catch (Exception $e) {
    $dbStatus = 'Error';
    $dbMessage = $e->getMessage();
}

?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend PHP Native & MySQL - SMK Prestasi Nusantara</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #e5ece8; color: #1e293b; margin: 0; padding: 40px 20px; }
        .card { max-width: 800px; margin: 0 auto; background: #e5ece8; border-radius: 16px; padding: 32px; box-shadow: 8px 8px 16px #c4ceca, -8px -8px 16px #ffffff; }
        h1 { color: #386652; margin-top: 0; font-size: 24px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-error { background: #fee2e2; color: #b91c1c; }
        code { background: #d3dfd9; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
        ul { line-height: 1.8; }
        .code-box { background: #2d3748; color: #f7fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🐘 Backend PHP Native & MySQL Ready</h1>
        <p>Sistem PPDB Online SMK Prestasi Nusantara menggunakan <strong>PHP Native (PDO)</strong> dan <strong>Database MySQL / phpMyAdmin</strong>.</p>
        
        <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;">

        <h3>Status Koneksi Database:</h3>
        <?php if ($dbStatus === 'Connected'): ?>
            <span class="badge badge-success">✓ MYSQL CONNECTED</span>
            <p style="color: #15803d; font-weight: 500;"><?= htmlspecialchars($dbMessage) ?></p>
        <?php else: ?>
            <span class="badge badge-error">✕ CONNECTION ERROR</span>
            <p style="color: #b91c1c; font-weight: 500;"><?= htmlspecialchars($dbMessage) ?></p>
        <?php endif; ?>

        <h3>Daftar Endpoint API PHP Native:</h3>
        <ul>
            <li><code>POST /php_backend/api_pendaftaran.php</code> - Submit Form Pendaftaran PPDB</li>
            <li><code>GET /php_backend/api_check_nisn.php?nisn=0051234567</code> - Cek Unik NISN</li>
            <li><code>GET /php_backend/api_admin.php</code> - Ambil List Data Pendaftar</li>
            <li><code>PUT /php_backend/api_admin.php</code> - Update Data Pendaftar</li>
            <li><code>DELETE /php_backend/api_admin.php?id=REG-xxx</code> - Hapus Data Pendaftar</li>
        </ul>

        <h3>Panduan Import Database:</h3>
        <p>Import file <code>php_backend/database.sql</code> langsung ke dalam <strong>phpMyAdmin</strong> pada server XAMPP / Laragon / cPanel Anda.</p>
    </div>
</body>
</html>
