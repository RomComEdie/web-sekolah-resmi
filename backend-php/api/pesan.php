<?php
ob_start();
/**
 * API Pesan Kontak / Form Pertanyaan (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

// 1. SET HEADER CORS DI PALIING ATAS (CUKUP SEKALI)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. TANGANI PREFLIGHT REQUEST (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. KONEKSI DATABASE
require_once __DIR__ . '/../config/database.php';

// --- HELPER FUNCTIONS (WAJIB ADA AGAR TIDAK FATAL ERROR) ---

function getJsonInput() {
    $input = json_decode(file_get_contents("php://input"), true);
    return is_array($input) ? $input : $_POST;
}

function sendJsonResponse($statusCode, $message, $data = null, $extra = []) {
    http_response_code($statusCode);
    $response = array_merge([
        'status' => $statusCode >= 200 && $statusCode < 300 ? 'success' : 'error',
        'code' => $statusCode,
        'message' => $message,
        'data' => $data
    ], $extra);
    
    echo json_encode($response);
    exit(); // Hentikan eksekusi setelah kirim response
}

// --- MAIN ROUTER ---

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

// --- HANDLER FUNCTIONS ---

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