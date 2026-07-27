<?php
/**
 * API Mata Pelajaran / Kurikulum Pembelajaran (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetPembelajaran($db);
        break;
    case 'POST':
        handlePostPembelajaran($db);
        break;
    case 'PUT':
        handlePutPembelajaran($db);
        break;
    case 'DELETE':
        handleDeletePembelajaran($db);
        break;
    default:
        sendJsonResponse(405, "Method $method Tidak Diizinkan");
        break;
}

function handleGetPembelajaran($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    $major = isset($_GET['major']) ? trim($_GET['major']) : null;
    $grade = isset($_GET['grade']) ? trim($_GET['grade']) : null;

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM tb_mata_pelajaran WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Mata pelajaran ditemukan", formatSubjectOutput($row));
        } else {
            sendJsonResponse(404, "Mata pelajaran dengan ID #$id tidak ditemukan");
        }
    }

    $query = "SELECT * FROM tb_mata_pelajaran WHERE 1=1";
    $params = [];

    if ($major) {
        $query .= " AND (jurusan = :major OR jurusan = 'Semua')";
        $params[':major'] = $major;
    }

    if ($grade) {
        $query .= " AND (tingkat = :grade OR tingkat = 'Semua Tingkat')";
        $params[':grade'] = $grade;
    }

    $query .= " ORDER BY id ASC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $formatted = array_map('formatSubjectOutput', $rows);

    sendJsonResponse(200, "Berhasil mengambil daftar mata pelajaran", $formatted);
}

function handlePostPembelajaran($db) {
    $input = getJsonInput();

    if (empty($input['kode']) || empty($input['nama']) || empty($input['kategori'])) {
        sendJsonResponse(400, "Field kode, nama, dan kategori wajib diisi");
    }

    $sql = "INSERT INTO tb_mata_pelajaran (kode, nama, kategori, tingkat, jurusan, jam_per_minggu, deskripsi, foto)
            VALUES (:kode, :nama, :kategori, :tingkat, :jurusan, :jam, :deskripsi, :foto)";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':kode' => trim($input['kode']),
            ':nama' => trim($input['nama']),
            ':kategori' => $input['kategori'],
            ':tingkat' => isset($input['tingkat']) ? $input['tingkat'] : 'Kelas X',
            ':jurusan' => isset($input['jurusan']) ? $input['jurusan'] : 'Semua',
            ':jam' => isset($input['jam_per_minggu']) ? intval($input['jam_per_minggu']) : 2,
            ':deskripsi' => isset($input['deskripsi']) ? $input['deskripsi'] : '',
            ':foto' => isset($input['foto']) ? $input['foto'] : ''
        ]);

        $newId = $db->lastInsertId();
        $getStmt = $db->prepare("SELECT * FROM tb_mata_pelajaran WHERE id = :id");
        $getStmt->execute([':id' => $newId]);

        sendJsonResponse(201, "Mata pelajaran berhasil ditambahkan", formatSubjectOutput($getStmt->fetch()));
    } catch (PDOException $e) {
        sendJsonResponse(500, "Gagal menambah mata pelajaran: " . $e->getMessage());
    }
}

function handlePutPembelajaran($db) {
    $input = getJsonInput();
    if (empty($input['id'])) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk update");
    }

    $id = intval($input['id']);
    $stmt = $db->prepare("SELECT * FROM tb_mata_pelajaran WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        sendJsonResponse(404, "Mata pelajaran tidak ditemukan");
    }

    $sql = "UPDATE tb_mata_pelajaran SET 
        nama = :nama,
        kategori = :kategori,
        tingkat = :tingkat,
        jurusan = :jurusan,
        jam_per_minggu = :jam,
        deskripsi = :deskripsi,
        foto = :foto
        WHERE id = :id";

    $upStmt = $db->prepare($sql);
    $upStmt->execute([
        ':nama' => isset($input['nama']) ? $input['nama'] : $existing['nama'],
        ':kategori' => isset($input['kategori']) ? $input['kategori'] : $existing['kategori'],
        ':tingkat' => isset($input['tingkat']) ? $input['tingkat'] : $existing['tingkat'],
        ':jurusan' => isset($input['jurusan']) ? $input['jurusan'] : $existing['jurusan'],
        ':jam' => isset($input['jam_per_minggu']) ? intval($input['jam_per_minggu']) : $existing['jam_per_minggu'],
        ':deskripsi' => isset($input['deskripsi']) ? $input['deskripsi'] : $existing['deskripsi'],
        ':foto' => isset($input['foto']) ? $input['foto'] : $existing['foto'],
        ':id' => $id
    ]);

    $getUpdated = $db->prepare("SELECT * FROM tb_mata_pelajaran WHERE id = :id");
    $getUpdated->execute([':id' => $id]);

    sendJsonResponse(200, "Data mata pelajaran berhasil diperbarui", formatSubjectOutput($getUpdated->fetch()));
}

function handleDeletePembelajaran($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if (!$id) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk menghapus mata pelajaran");
    }

    $stmt = $db->prepare("DELETE FROM tb_mata_pelajaran WHERE id = :id");
    $stmt->execute([':id' => $id]);

    sendJsonResponse(200, "Mata pelajaran #$id berhasil dihapus");
}

function formatSubjectOutput($row) {
    if (!$row) return null;
    return [
        'id' => (string)$row['id'],
        'code' => $row['kode'],
        'name' => $row['nama'],
        'category' => $row['kategori'],
        'grade' => $row['tingkat'],
        'major' => $row['jurusan'],
        'weeklyHours' => (int)$row['jam_per_minggu'],
        'description' => $row['deskripsi'],
        'image' => $row['foto']
    ];
}
