<?php
/**
 * ===================================================================
 * API ADMIN CRUD PENDAFTAR (PHP NATIVE)
 * Endpoint: /php_backend/api_admin.php
 * Supports:
 * - GET: Fetch list pendaftar (opsional parameter ?search=fauzi)
 * - POST: Create pendaftar baru
 * - PUT: Update pendaftar by ID
 * - DELETE: Hapus pendaftar by ID
 * ===================================================================
 */

require_once __DIR__ . '/koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_REQUEST;

// 1. GET ALL / SEARCH PENDAFTAR
if ($method === 'GET') {
    try {
        $search = trim($_GET['search'] ?? '');
        if (!empty($search)) {
            $stmt = $pdo->prepare("SELECT * FROM pendaftaran_ppdb WHERE nama_lengkap LIKE :s OR nisn LIKE :s OR kode_pendaftaran LIKE :s ORDER BY id DESC");
            $stmt->execute([':s' => "%$search%"]);
        } else {
            $stmt = $pdo->query("SELECT * FROM pendaftaran_ppdb ORDER BY id DESC");
        }
        $rows = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'total'   => count($rows),
            'data'    => $rows
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 2. PUT: UPDATE PENDAFTAR
if ($method === 'PUT') {
    $id     = $data['id'] ?? $_GET['id'] ?? null;
    $nisn   = trim($data['nisn'] ?? '');
    $nama   = trim($data['nama_lengkap'] ?? $data['namaLengkap'] ?? '');
    $jurusan= trim($data['jurusan'] ?? 'RPL');
    $asal   = trim($data['asal_sekolah'] ?? $data['asalSekolah'] ?? '');

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parameter ID wajib diisi untuk update!']);
        exit();
    }

    try {
        // Cek jika NISN diubah dan dipakai pendaftar lain
        if (!empty($nisn)) {
            $stmtCek = $pdo->prepare("SELECT COUNT(*) FROM pendaftaran_ppdb WHERE nisn = :nisn AND id != :id");
            $stmtCek->execute([':nisn' => $nisn, ':id' => $id]);
            if ($stmtCek->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => "NISN $nisn sudah digunakan pendaftar lain!"]);
                exit();
            }
        }

        $stmt = $pdo->prepare("UPDATE pendaftaran_ppdb SET nisn = :nisn, nama_lengkap = :nama, jurusan = :jurusan, asal_sekolah = :asal WHERE id = :id OR kode_pendaftaran = :id");
        $stmt->execute([
            ':nisn'    => $nisn,
            ':nama'    => $nama,
            ':jurusan' => $jurusan,
            ':asal'    => $asal,
            ':id'      => $id
        ]);

        echo json_encode(['success' => true, 'message' => 'Data pendaftar berhasil diperbarui.']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 3. DELETE: HAPUS PENDAFTAR
if ($method === 'DELETE') {
    $id = $data['id'] ?? $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parameter ID wajib diisi untuk delete!']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM pendaftaran_ppdb WHERE id = :id OR kode_pendaftaran = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Data pendaftar berhasil dihapus.']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}
?>
