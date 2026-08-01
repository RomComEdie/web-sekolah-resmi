<?php
/**
 * ===================================================================
 * KONEKSI DATABASE MYSQL PHP NATIVE PDO
 * SMK PRESTASI NUSANTARA - SISTEM PPDB
 * ===================================================================
 */

require_once __DIR__ . '/config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal terhubung ke Database MySQL: ' . $e->getMessage(),
        'hint'    => 'Pastikan MySQL di phpMyAdmin / XAMPP sudah berjalan dan nama database db_smk_prestasi sudah dibuat.'
    ]);
    exit();
}
?>
