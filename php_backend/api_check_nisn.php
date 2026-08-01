<?php
/**
 * ===================================================================
 * API CEK NISN UNIK (PHP NATIVE)
 * Endpoint: GET /php_backend/api_check_nisn.php?nisn=0051234567
 * ===================================================================
 */

require_once __DIR__ . '/koneksi.php';

$nisn = trim($_GET['nisn'] ?? '');

if (empty($nisn)) {
    echo json_encode(['exists' => false, 'message' => 'Parameter NISN tidak dispesifikasikan.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM pendaftaran_ppdb WHERE nisn = :nisn");
    $stmt->execute([':nisn' => $nisn]);
    $count = $stmt->fetchColumn();

    echo json_encode([
        'exists' => ($count > 0),
        'nisn'   => $nisn
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['exists' => false, 'error' => $e->getMessage()]);
}
?>
