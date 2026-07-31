<?php
/**
 * API Guru & Tenaga Pendidik (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetGuru($db);
        break;
    case 'POST':
        handlePostGuru($db);
        break;
    case 'PUT':
        handlePutGuru($db);
        break;
    case 'DELETE':
        handleDeleteGuru($db);
        break;
    default:
        sendJsonResponse(405, "Method $method Tidak Diizinkan");
        break;
}

function handleGetGuru($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    $dept = isset($_GET['dept']) ? trim($_GET['dept']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : null;

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM tb_guru WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Data guru ditemukan", formatGuruOutput($row));
        } else {
            sendJsonResponse(404, "Guru dengan ID #$id tidak ditemukan");
        }
    }

    $query = "SELECT * FROM tb_guru WHERE status_aktif = 1";
    $params = [];

    if ($dept) {
        $query .= " AND departemen = :dept";
        $params[':dept'] = $dept;
    }

    if ($search) {
        $query .= " AND (nama_lengkap LIKE :search OR mata_pelajaran LIKE :search OR jabatan LIKE :search)";
        $params[':search'] = "%$search%";
    }

    $query .= " ORDER BY id ASC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $formatted = array_map('formatGuruOutput', $rows);

    sendJsonResponse(200, "Berhasil mengambil data guru & staf", $formatted, [
        'total' => count($formatted)
    ]);
}

function handlePostGuru($db) {
    $input = getJsonInput();

    if (empty($input['nama_lengkap']) || empty($input['jabatan']) || empty($input['mata_pelajaran'])) {
        sendJsonResponse(400, "Field nama_lengkap, jabatan, dan mata_pelajaran wajib diisi");
    }

    $sql = "INSERT INTO tb_guru (
        nip, nama_lengkap, jabatan, departemen, mata_pelajaran,
        pendidikan_terakhir, email, whatsapp, foto, bio, quote
    ) VALUES (
        :nip, :nama, :jabatan, :dept, :mapel,
        :pendidikan, :email, :wa, :foto, :bio, :quote
    )";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':nip' => isset($input['nip']) ? $input['nip'] : '',
            ':nama' => trim($input['nama_lengkap']),
            ':jabatan' => trim($input['jabatan']),
            ':dept' => isset($input['departemen']) ? $input['departemen'] : 'Umum',
            ':mapel' => trim($input['mata_pelajaran']),
            ':pendidikan' => isset($input['pendidikan_terakhir']) ? $input['pendidikan_terakhir'] : 'S1',
            ':email' => isset($input['email']) ? $input['email'] : '',
            ':wa' => isset($input['whatsapp']) ? $input['whatsapp'] : '',
            ':foto' => isset($input['foto']) ? $input['foto'] : '',
            ':bio' => isset($input['bio']) ? $input['bio'] : '',
            ':quote' => isset($input['quote']) ? $input['quote'] : ''
        ]);

        $newId = $db->lastInsertId();
        $getStmt = $db->prepare("SELECT * FROM tb_guru WHERE id = :id");
        $getStmt->execute([':id' => $newId]);

        sendJsonResponse(201, "Guru baru berhasil ditambahkan", formatGuruOutput($getStmt->fetch()));
    } catch (PDOException $e) {
        sendJsonResponse(500, "Gagal menambah data guru: " . $e->getMessage());
    }
}

function handlePutGuru($db) {
    $input = getJsonInput();
    if (empty($input['id'])) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk update guru");
    }

    $id = intval($input['id']);
    $stmt = $db->prepare("SELECT * FROM tb_guru WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        sendJsonResponse(404, "Guru dengan ID #$id tidak ditemukan");
    }

    $updateSql = "UPDATE tb_guru SET 
        nama_lengkap = :nama,
        jabatan = :jabatan,
        departemen = :dept,
        mata_pelajaran = :mapel,
        pendidikan_terakhir = :pendidikan,
        email = :email,
        whatsapp = :wa,
        foto = :foto,
        bio = :bio,
        quote = :quote
        WHERE id = :id";

    $upStmt = $db->prepare($updateSql);
    $upStmt->execute([
        ':nama' => isset($input['nama_lengkap']) ? $input['nama_lengkap'] : $existing['nama_lengkap'],
        ':jabatan' => isset($input['jabatan']) ? $input['jabatan'] : $existing['jabatan'],
        ':dept' => isset($input['departemen']) ? $input['departemen'] : $existing['departemen'],
        ':mapel' => isset($input['mata_pelajaran']) ? $input['mata_pelajaran'] : $existing['mata_pelajaran'],
        ':pendidikan' => isset($input['pendidikan_terakhir']) ? $input['pendidikan_terakhir'] : $existing['pendidikan_terakhir'],
        ':email' => isset($input['email']) ? $input['email'] : $existing['email'],
        ':wa' => isset($input['whatsapp']) ? $input['whatsapp'] : $existing['whatsapp'],
        ':foto' => isset($input['foto']) ? $input['foto'] : $existing['foto'],
        ':bio' => isset($input['bio']) ? $input['bio'] : $existing['bio'],
        ':quote' => isset($input['quote']) ? $input['quote'] : $existing['quote'],
        ':id' => $id
    ]);

    $getUpdated = $db->prepare("SELECT * FROM tb_guru WHERE id = :id");
    $getUpdated->execute([':id' => $id]);

    sendJsonResponse(200, "Data guru berhasil diperbarui", formatGuruOutput($getUpdated->fetch()));
}

function handleDeleteGuru($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if (!$id) {
        $input = getJsonInput();
        $id = isset($input['id']) ? intval($input['id']) : null;
    }

    if (!$id) {
        sendJsonResponse(400, "Parameter 'id' wajib diisi untuk menghapus data guru");
    }

    $stmt = $db->prepare("UPDATE tb_guru SET status_aktif = 0 WHERE id = :id");
    $stmt->execute([':id' => $id]);

    sendJsonResponse(200, "Data guru #$id berhasil dinonaktifkan");
}

function formatGuruOutput($row) {
    if (!$row) return null;
    return [
        'id' => (string)$row['id'],
        'nip' => $row['nip'],
        'name' => $row['nama_lengkap'],
        'role' => $row['jabatan'],
        'department' => $row['departemen'],
        'subject' => $row['mata_pelajaran'],
        'education' => $row['pendidikan_terakhir'],
        'photoUrl' => $row['foto'],
        'bio' => $row['bio'],
        'quote' => $row['quote'],
        'contactEmail' => $row['email'],
        'whatsapp' => $row['whatsapp']
    ];
}
