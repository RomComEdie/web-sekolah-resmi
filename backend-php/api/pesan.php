<?php
/**
 * API Pesan Kontak / Form Pertanyaan (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetPesan($db);
        break;
    case 'POST':
        handlePostPesan($db);
        break;
    case 'PUT':
        handlePutPesan($db);
        break;
    case 'DELETE':
        handleDeletePesan($db);
        break;
    default:
        sendJsonResponse(405, "Method $method Tidak Diizinkan");
        break;
}

function handleGetPesan($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM tb_pesan_kontak WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Pesan ditemukan", $row);
        } else {
            sendJsonResponse(404, "Pesan #$id tidak ditemukan");
        }
    }

    $stmt = $db->query("SELECT * FROM tb_pesan_kontak ORDER BY id DESC");
    $rows = $stmt->fetchAll();

    sendJsonResponse(200, "Berhasil mengambil daftar pesan masuk", $rows, [
        'total' => count($rows)
    ]);
}

function handlePostPesan($db) {
    $input = getJsonInput();

    if (empty($input['nama']) || empty($input['email']) || empty($input['pesan'])) {
        sendJsonResponse(400, "Nama, email, dan isi pesan wajib diisi");
    }

    $sql = "INSERT INTO tb_pesan_kontak (nama, email, whatsapp, subjek, pesan, status)
            VALUES (:nama, :email, :wa, :subjek, :pesan, 'Belum Dibaca')";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':nama' => trim($input['nama']),
            ':email' => trim($input['email']),
            ':wa' => isset($input['whatsapp']) ? trim($input['whatsapp']) : '',
            ':subjek' => isset($input['subjek']) ? trim($input['subjek']) : 'Pertanyaan Informasi Sekolah',
            ':pesan' => trim($input['pesan'])
        ]);

        $newId = $db->lastInsertId();
        $getStmt = $db->prepare("SELECT * FROM tb_pesan_kontak WHERE id = :id");
        $getStmt->execute([':id' => $newId]);

        sendJsonResponse(201, "Pesan Anda telah berhasil dikirim ke Sekretariat SMK Nusa Bangsa", $getStmt->fetch());
    } catch (PDOException $e) {
        sendJsonResponse(500, "Gagal mengirim pesan: " . $e->getMessage());
    }
}

function handlePutPesan($db) {
    $input = getJsonInput();
    if (empty($input['id'])) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk update status pesan");
    }

    $id = intval($input['id']);
    $status = isset($input['status']) ? $input['status'] : 'Sudah Dibaca';

    $stmt = $db->prepare("UPDATE tb_pesan_kontak SET status = :status WHERE id = :id");
    $stmt->execute([':status' => $status, ':id' => $id]);

    sendJsonResponse(200, "Status pesan #$id berhasil diperbarui menjadi '$status'");
}

function handleDeletePesan($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if (!$id) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk menghapus pesan");
    }

    $stmt = $db->prepare("DELETE FROM tb_pesan_kontak WHERE id = :id");
    $stmt->execute([':id' => $id]);

    sendJsonResponse(200, "Pesan #$id berhasil dihapus");
}
