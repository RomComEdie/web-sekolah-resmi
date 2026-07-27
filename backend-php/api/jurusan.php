<?php
/**
 * API Program Keahlian / Jurusan (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetJurusan($db);
        break;
    case 'POST':
        handlePostJurusan($db);
        break;
    case 'PUT':
        handlePutJurusan($db);
        break;
    case 'DELETE':
        handleDeleteJurusan($db);
        break;
    default:
        sendJsonResponse(405, "Method $method Tidak Diizinkan");
        break;
}

function handleGetJurusan($db) {
    $code = isset($_GET['code']) ? strtoupper(trim($_GET['code'])) : null;
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($code) {
        $stmt = $db->prepare("SELECT * FROM tb_jurusan WHERE kode = :code LIMIT 1");
        $stmt->execute([':code' => $code]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Data jurusan ditemukan", formatJurusanOutput($row));
        } else {
            sendJsonResponse(404, "Jurusan dengan kode '$code' tidak ditemukan");
        }
    }

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM tb_jurusan WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Data jurusan ditemukan", formatJurusanOutput($row));
        } else {
            sendJsonResponse(404, "Jurusan ID #$id tidak ditemukan");
        }
    }

    $stmt = $db->query("SELECT * FROM tb_jurusan ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $formatted = array_map('formatJurusanOutput', $rows);

    sendJsonResponse(200, "Berhasil mengambil daftar jurusan", $formatted);
}

function handlePostJurusan($db) {
    $input = getJsonInput();

    if (empty($input['kode']) || empty($input['nama_jurusan']) || empty($input['nama_lengkap'])) {
        sendJsonResponse(400, "Field kode, nama_jurusan, dan nama_lengkap wajib diisi");
    }

    $sql = "INSERT INTO tb_jurusan (kode, nama_jurusan, nama_lengkap, head_of_department, deskripsi_singkat, deskripsi_lengkap, jumlah_siswa, foto)
            VALUES (:kode, :nama, :lengkap, :head, :singkat, :deskripsi, :siswa, :foto)";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':kode' => strtoupper(trim($input['kode'])),
            ':nama' => trim($input['nama_jurusan']),
            ':lengkap' => trim($input['nama_lengkap']),
            ':head' => isset($input['head_of_department']) ? $input['head_of_department'] : '',
            ':singkat' => isset($input['deskripsi_singkat']) ? $input['deskripsi_singkat'] : '',
            ':deskripsi' => isset($input['deskripsi_lengkap']) ? $input['deskripsi_lengkap'] : '',
            ':siswa' => isset($input['jumlah_siswa']) ? intval($input['jumlah_siswa']) : 0,
            ':foto' => isset($input['foto']) ? $input['foto'] : ''
        ]);

        $newId = $db->lastInsertId();
        $getStmt = $db->prepare("SELECT * FROM tb_jurusan WHERE id = :id");
        $getStmt->execute([':id' => $newId]);

        sendJsonResponse(201, "Program Keahlian baru berhasil ditambahkan", formatJurusanOutput($getStmt->fetch()));
    } catch (PDOException $e) {
        sendJsonResponse(500, "Gagal menambah jurusan: " . $e->getMessage());
    }
}

function handlePutJurusan($db) {
    $input = getJsonInput();
    if (empty($input['id']) && empty($input['kode'])) {
        sendJsonResponse(400, "Parameter 'id' atau 'kode' diperlukan untuk update");
    }

    $id = isset($input['id']) ? intval($input['id']) : null;
    $kode = isset($input['kode']) ? strtoupper(trim($input['kode'])) : null;

    $stmt = $id ? $db->prepare("SELECT * FROM tb_jurusan WHERE id = :id") : $db->prepare("SELECT * FROM tb_jurusan WHERE kode = :kode");
    $stmt->execute($id ? [':id' => $id] : [':kode' => $kode]);
    $existing = $stmt->fetch();

    if (!$existing) {
        sendJsonResponse(404, "Data jurusan tidak ditemukan");
    }

    $sql = "UPDATE tb_jurusan SET 
        nama_jurusan = :nama,
        nama_lengkap = :lengkap,
        head_of_department = :head,
        deskripsi_singkat = :singkat,
        deskripsi_lengkap = :deskripsi,
        jumlah_siswa = :siswa,
        foto = :foto
        WHERE id = :id";

    $upStmt = $db->prepare($sql);
    $upStmt->execute([
        ':nama' => isset($input['nama_jurusan']) ? $input['nama_jurusan'] : $existing['nama_jurusan'],
        ':lengkap' => isset($input['nama_lengkap']) ? $input['nama_lengkap'] : $existing['nama_lengkap'],
        ':head' => isset($input['head_of_department']) ? $input['head_of_department'] : $existing['head_of_department'],
        ':singkat' => isset($input['deskripsi_singkat']) ? $input['deskripsi_singkat'] : $existing['deskripsi_singkat'],
        ':deskripsi' => isset($input['deskripsi_lengkap']) ? $input['deskripsi_lengkap'] : $existing['deskripsi_lengkap'],
        ':siswa' => isset($input['jumlah_siswa']) ? intval($input['jumlah_siswa']) : $existing['jumlah_siswa'],
        ':foto' => isset($input['foto']) ? $input['foto'] : $existing['foto'],
        ':id' => $existing['id']
    ]);

    $getUpdated = $db->prepare("SELECT * FROM tb_jurusan WHERE id = :id");
    $getUpdated->execute([':id' => $existing['id']]);

    sendJsonResponse(200, "Data jurusan berhasil diperbarui", formatJurusanOutput($getUpdated->fetch()));
}

function handleDeleteJurusan($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if (!$id) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk menghapus jurusan");
    }

    $stmt = $db->prepare("DELETE FROM tb_jurusan WHERE id = :id");
    $stmt->execute([':id' => $id]);

    sendJsonResponse(200, "Jurusan #$id berhasil dihapus");
}

function formatJurusanOutput($row) {
    if (!$row) return null;
    return [
        'id' => strtolower($row['kode']),
        'code' => $row['kode'],
        'title' => $row['nama_jurusan'],
        'fullName' => $row['nama_lengkap'],
        'headOfDepartment' => $row['head_of_department'],
        'shortDesc' => $row['deskripsi_singkat'],
        'description' => $row['deskripsi_lengkap'],
        'studentCount' => (int)$row['jumlah_siswa'],
        'image' => $row['foto']
    ];
}
