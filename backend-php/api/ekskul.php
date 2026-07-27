<?php
/**
 * API Ekstrakurikuler (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetEkskul($db);
        break;
    case 'POST':
        handlePostEkskul($db);
        break;
    case 'PUT':
        handlePutEkskul($db);
        break;
    case 'DELETE':
        handleDeleteEkskul($db);
        break;
    default:
        sendJsonResponse(405, "Method $method Tidak Diizinkan");
        break;
}

function handleGetEkskul($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM tb_ekstrakurikuler WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Ekstrakurikuler ditemukan", formatEkskulOutput($row));
        } else {
            sendJsonResponse(404, "Ekstrakurikuler dengan ID #$id tidak ditemukan");
        }
    }

    $stmt = $db->query("SELECT * FROM tb_ekstrakurikuler ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $formatted = array_map('formatEkskulOutput', $rows);

    sendJsonResponse(200, "Berhasil mengambil daftar ekstrakurikuler", $formatted);
}

function handlePostEkskul($db) {
    $input = getJsonInput();

    if (empty($input['nama']) || empty($input['kategori'])) {
        sendJsonResponse(400, "Field nama dan kategori wajib diisi");
    }

    $sql = "INSERT INTO tb_ekstrakurikuler (nama, kategori, jadwal, pembina, deskripsi, foto)
            VALUES (:nama, :kategori, :jadwal, :pembina, :deskripsi, :foto)";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':nama' => trim($input['nama']),
            ':kategori' => $input['kategori'],
            ':jadwal' => isset($input['jadwal']) ? $input['jadwal'] : '',
            ':pembina' => isset($input['pembina']) ? $input['pembina'] : '',
            ':deskripsi' => isset($input['deskripsi']) ? $input['deskripsi'] : '',
            ':foto' => isset($input['foto']) ? $input['foto'] : ''
        ]);

        $newId = $db->lastInsertId();
        $getStmt = $db->prepare("SELECT * FROM tb_ekstrakurikuler WHERE id = :id");
        $getStmt->execute([':id' => $newId]);

        sendJsonResponse(201, "Ekstrakurikuler berhasil ditambahkan", formatEkskulOutput($getStmt->fetch()));
    } catch (PDOException $e) {
        sendJsonResponse(500, "Gagal menambah ekstrakurikuler: " . $e->getMessage());
    }
}

function handlePutEkskul($db) {
    $input = getJsonInput();
    if (empty($input['id'])) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk update");
    }

    $id = intval($input['id']);
    $stmt = $db->prepare("SELECT * FROM tb_ekstrakurikuler WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        sendJsonResponse(404, "Ekstrakurikuler tidak ditemukan");
    }

    $sql = "UPDATE tb_ekstrakurikuler SET 
        nama = :nama,
        kategori = :kategori,
        jadwal = :jadwal,
        pembina = :pembina,
        deskripsi = :deskripsi,
        foto = :foto
        WHERE id = :id";

    $upStmt = $db->prepare($sql);
    $upStmt->execute([
        ':nama' => isset($input['nama']) ? $input['nama'] : $existing['nama'],
        ':kategori' => isset($input['kategori']) ? $input['kategori'] : $existing['kategori'],
        ':jadwal' => isset($input['jadwal']) ? $input['jadwal'] : $existing['jadwal'],
        ':pembina' => isset($input['pembina']) ? $input['pembina'] : $existing['pembina'],
        ':deskripsi' => isset($input['deskripsi']) ? $input['deskripsi'] : $existing['deskripsi'],
        ':foto' => isset($input['foto']) ? $input['foto'] : $existing['foto'],
        ':id' => $id
    ]);

    $getUpdated = $db->prepare("SELECT * FROM tb_ekstrakurikuler WHERE id = :id");
    $getUpdated->execute([':id' => $id]);

    sendJsonResponse(200, "Data ekstrakurikuler berhasil diperbarui", formatEkskulOutput($getUpdated->fetch()));
}

function handleDeleteEkskul($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if (!$id) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk menghapus ekstrakurikuler");
    }

    $stmt = $db->prepare("DELETE FROM tb_ekstrakurikuler WHERE id = :id");
    $stmt->execute([':id' => $id]);

    sendJsonResponse(200, "Ekstrakurikuler #$id berhasil dihapus");
}

function formatEkskulOutput($row) {
    if (!$row) return null;
    return [
        'id' => (string)$row['id'],
        'name' => $row['nama'],
        'category' => $row['kategori'],
        'schedule' => $row['jadwal'],
        'supervisor' => $row['pembina'],
        'description' => $row['deskripsi'],
        'image' => $row['foto']
    ];
}
