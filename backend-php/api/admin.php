<?php
/**
 * API Admin & Analytics Dashboard (Native PHP + MySQL PDO)
 * Endpoints: GET (Stats), POST (Login)
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    handleAdminLogin($db);
} else if ($method === 'GET') {
    handleGetDashboardStats($db);
} else {
    sendJsonResponse(405, "Method $method Tidak Diizinkan");
}

/**
 * Handle Admin Login
 */
function handleAdminLogin($db) {
    $input = getJsonInput();

    if (empty($input['username']) || empty($input['password'])) {
        sendJsonResponse(400, "Username dan password wajib diisi");
    }

    $username = trim($input['username']);
    $password = trim($input['password']);

    $stmt = $db->prepare("SELECT * FROM tb_admin WHERE username = :user LIMIT 1");
    $stmt->execute([':user' => $username]);
    $admin = $stmt->fetch();

    if (!$admin) {
        sendJsonResponse(401, "Username atau password salah");
    }

    // Default master bypass or password verify
    $isValid = ($password === 'admin123') || password_verify($password, $admin['password']);

    if (!$isValid) {
        sendJsonResponse(401, "Username atau password salah");
    }

    // Generate simple auth token
    $token = base64_encode($admin['id'] . ":" . time() . ":" . bin2hex(random_bytes(8)));

    sendJsonResponse(200, "Login Berhasil! Selamat datang " . $admin['nama_admin'], [
        'token' => $token,
        'user' => [
            'id' => $admin['id'],
            'username' => $admin['username'],
            'name' => $admin['nama_admin'],
            'email' => $admin['email'],
            'role' => $admin['role']
        ]
    ]);
}

/**
 * Get Dashboard Statistics
 */
function handleGetDashboardStats($db) {
    // Total Pendaftar
    $ppdbTotal = $db->query("SELECT COUNT(*) as total FROM tb_ppdb")->fetch()['total'];

    // Pendaftar per Status
    $ppdbStatusStmt = $db->query("SELECT status, COUNT(*) as count FROM tb_ppdb GROUP BY status");
    $statusBreakdown = $ppdbStatusStmt->fetchAll();

    // Pendaftar per Jurusan Pilihan 1
    $majorBreakdownStmt = $db->query("SELECT first_choice_major as major, COUNT(*) as count FROM tb_ppdb GROUP BY first_choice_major");
    $majorBreakdown = $majorBreakdownStmt->fetchAll();

    // Total Guru
    $guruTotal = $db->query("SELECT COUNT(*) as total FROM tb_guru WHERE status_aktif = 1")->fetch()['total'];

    // Total Jurusan
    $jurusanTotal = $db->query("SELECT COUNT(*) as total FROM tb_jurusan")->fetch()['total'];

    // Total Pesan Unread
    $pesanUnread = $db->query("SELECT COUNT(*) as total FROM tb_pesan_kontak WHERE status = 'Belum Dibaca'")->fetch()['total'];

    sendJsonResponse(200, "Statistik Sistem PPDB SMK Nusa Bangsa", [
        'totalPPDB' => (int)$ppdbTotal,
        'totalGuru' => (int)$guruTotal,
        'totalJurusan' => (int)$jurusanTotal,
        'unreadMessages' => (int)$pesanUnread,
        'statusBreakdown' => $statusBreakdown,
        'majorBreakdown' => $majorBreakdown,
        'serverTime' => date('Y-m-d H:i:s')
    ]);
}
