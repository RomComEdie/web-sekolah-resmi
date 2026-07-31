<?php
/**
 * API PPDB / MPLS Online (Native PHP + MySQL PDO)
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetPPDB($db);
        break;
    case 'POST':
        handlePostPPDB($db);
        break;
    case 'PUT':
        handlePutPPDB($db);
        break;
    case 'DELETE':
        handleDeletePPDB($db);
        break;
    default:
        sendJsonResponse(405, "Method $method Tidak Diizinkan");
        break;
}

/**
 * READ (GET) Pendaftar PPDB
 */
function handleGetPPDB($db) {
    // Check if query parameter code or id is specified
    $code = isset($_GET['code']) ? trim($_GET['code']) : null;
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : null;
    $major = isset($_GET['major']) ? trim($_GET['major']) : null;
    $status = isset($_GET['status']) ? trim($_GET['status']) : null;

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM tb_ppdb WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Data pendaftar ditemukan", $row);
        } else {
            sendJsonResponse(404, "Pendaftar dengan ID #$id tidak ditemukan");
        }
    }

    if ($code) {
        $stmt = $db->prepare("SELECT * FROM tb_ppdb WHERE registration_code = :code OR nik_nisn = :code LIMIT 1");
        $stmt->execute([':code' => $code]);
        $row = $stmt->fetch();
        if ($row) {
            sendJsonResponse(200, "Data pendaftaran ditemukan", $row);
        } else {
            sendJsonResponse(404, "Nomor pendaftaran atau NIK/NISN '$code' tidak ditemukan");
        }
    }

    // Dynamic Filter Query
    $query = "SELECT * FROM tb_ppdb WHERE 1=1";
    $params = [];

    if ($search) {
        $query .= " AND (full_name LIKE :search OR registration_code LIKE :search OR nik_nisn LIKE :search OR origin_school LIKE :search)";
        $params[':search'] = "%$search%";
    }

    if ($major) {
        $query .= " AND (first_choice_major = :major OR second_choice_major = :major)";
        $params[':major'] = $major;
    }

    if ($status) {
        $query .= " AND status = :status";
        $params[':status'] = $status;
    }

    $query .= " ORDER BY id DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    sendJsonResponse(200, "Berhasil mengambil data list PPDB", $results, [
        'total' => count($results)
    ]);
}

/**
 * CREATE (POST) Pendaftaran Baru
 */
function handlePostPPDB($db) {
    $input = getJsonInput();

    // Field Validation
    $requiredFields = [
        'fullName', 'nikNisn', 'birthPlaceDate', 'gender', 
        'address', 'originSchool', 'phoneWhatsapp', 
        'parentName', 'parentPhone', 'firstChoiceMajor', 'secondChoiceMajor'
    ];

    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            sendJsonResponse(400, "Field '$field' wajib diisi");
        }
    }

    // Check duplicate NIK/NISN
    $checkStmt = $db->prepare("SELECT id, registration_code FROM tb_ppdb WHERE nik_nisn = :nik LIMIT 1");
    $checkStmt->execute([':nik' => trim($input['nikNisn'])]);
    if ($existing = $checkStmt->fetch()) {
        sendJsonResponse(400, "NIK / NISN '" . $input['nikNisn'] . "' sudah terdaftar sebelumnya dengan Kode: " . $existing['registration_code'], $existing);
    }

    // Auto Generate Registration Code (e.g. PPDB-2026-1045)
    $year = date('Y');
    $countStmt = $db->query("SELECT MAX(id) as max_id FROM tb_ppdb");
    $maxRow = $countStmt->fetch();
    $nextNumber = 1001 + ($maxRow['max_id'] ? $maxRow['max_id'] : 0);
    $regCode = "PPDB-" . $year . "-" . $nextNumber;

    $sql = "INSERT INTO tb_ppdb (
        registration_code, program_type, full_name, nik_nisn, birth_place_date,
        gender, address, origin_school, phone_whatsapp, email, parent_name,
        parent_phone, first_choice_major, second_choice_major, status
    ) VALUES (
        :regCode, :programType, :fullName, :nikNisn, :birthPlaceDate,
        :gender, :address, :originSchool, :phoneWhatsapp, :email, :parentName,
        :parentPhone, :firstChoiceMajor, :secondChoiceMajor, 'Tergrafis (Pending Verification)'
    )";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':regCode' => $regCode,
            ':programType' => isset($input['programType']) ? $input['programType'] : 'MPLS / PPDB Siswa Baru',
            ':fullName' => trim($input['fullName']),
            ':nikNisn' => trim($input['nikNisn']),
            ':birthPlaceDate' => trim($input['birthPlaceDate']),
            ':gender' => $input['gender'],
            ':address' => trim($input['address']),
            ':originSchool' => trim($input['originSchool']),
            ':phoneWhatsapp' => trim($input['phoneWhatsapp']),
            ':email' => isset($input['email']) ? trim($input['email']) : '',
            ':parentName' => trim($input['parentName']),
            ':parentPhone' => trim($input['parentPhone']),
            ':firstChoiceMajor' => $input['firstChoiceMajor'],
            ':secondChoiceMajor' => $input['secondChoiceMajor']
        ]);

        $newId = $db->lastInsertId();

        $getNewStmt = $db->prepare("SELECT * FROM tb_ppdb WHERE id = :id");
        $getNewStmt->execute([':id' => $newId]);
        $newRecord = $getNewStmt->fetch();

        sendJsonResponse(201, "Pendaftaran PPDB berhasil dibuat dengan Kode: $regCode", $newRecord);
    } catch (PDOException $e) {
        sendJsonResponse(500, "Gagal menyimpan pendaftaran: " . $e->getMessage());
    }
}

/**
 * UPDATE (PUT) Status / Data Pendaftaran
 */
function handlePutPPDB($db) {
    $input = getJsonInput();

    if (empty($input['id']) && empty($input['registration_code'])) {
        sendJsonResponse(400, "Parameter 'id' atau 'registration_code' diperlukan untuk update");
    }

    $identifier = !empty($input['id']) ? intval($input['id']) : trim($input['registration_code']);
    $isId = is_int($identifier);

    // Verify existing
    $checkSql = $isId ? "SELECT * FROM tb_ppdb WHERE id = :id" : "SELECT * FROM tb_ppdb WHERE registration_code = :code";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute($isId ? [':id' => $identifier] : [':code' => $identifier]);
    $existing = $checkStmt->fetch();

    if (!$existing) {
        sendJsonResponse(404, "Data pendaftar tidak ditemukan");
    }

    $status = isset($input['status']) ? $input['status'] : $existing['status'];
    $catatan = isset($input['catatan_panitia']) ? $input['catatan_panitia'] : $existing['catatan_panitia'];
    $fullName = isset($input['fullName']) ? $input['fullName'] : $existing['full_name'];
    $firstChoice = isset($input['firstChoiceMajor']) ? $input['firstChoiceMajor'] : $existing['first_choice_major'];

    $updateSql = "UPDATE tb_ppdb SET 
        status = :status,
        catatan_panitia = :catatan,
        full_name = :fullName,
        first_choice_major = :firstChoice
        WHERE id = :id";

    $stmt = $db->prepare($updateSql);
    $stmt->execute([
        ':status' => $status,
        ':catatan' => $catatan,
        ':fullName' => $fullName,
        ':firstChoice' => $firstChoice,
        ':id' => $existing['id']
    ]);

    $fetchUpdated = $db->prepare("SELECT * FROM tb_ppdb WHERE id = :id");
    $fetchUpdated->execute([':id' => $existing['id']]);

    sendJsonResponse(200, "Data pendaftar PPDB berhasil diperbarui", $fetchUpdated->fetch());
}

/**
 * DELETE (DELETE) Pendaftar PPDB
 */
function handleDeletePPDB($db) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if (!$id) {
        $input = getJsonInput();
        $id = isset($input['id']) ? intval($input['id']) : null;
    }

    if (!$id) {
        sendJsonResponse(400, "Parameter 'id' wajib diberikan untuk hapus data");
    }

    $stmt = $db->prepare("DELETE FROM tb_ppdb WHERE id = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() > 0) {
        sendJsonResponse(200, "Data pendaftar #$id berhasil dihapus dari database");
    } else {
        sendJsonResponse(404, "Data pendaftar #$id tidak ditemukan");
    }
}
