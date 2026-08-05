<?php
/**
 * RESTful API Controller (PHP Native + PDO MySQL)
 * Handles PPDB Registration, Status Checking, Admin Auth & Contact Messages
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'ppdb';

// Response Helper
function jsonResponse($status, $code, $message, $data = null) {
    http_response_code($code);
    echo json_encode([
        'status' => $status,
        'code' => $code,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Input Sanitizer
function sanitize($val) {
    if (is_string($val)) {
        return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
    }
    return $val;
}

$rawInput = file_get_contents("php://input");
$inputData = json_decode($rawInput, true) ?? $_POST;

// 1. PPDB ROUTING
if ($action === 'ppdb') {
    if ($request_method === 'GET') {
        $code = $_GET['code'] ?? $_GET['q'] ?? '';
        
        if ($db) {
            if ($code) {
                $stmt = $db->prepare("SELECT * FROM pendaftar_ppdb WHERE registrationCode = :code OR nikNisn = :code OR nik = :code LIMIT 1");
                $stmt->execute([':code' => $code]);
                $result = $stmt->fetch();
                if ($result) {
                    jsonResponse('success', 200, 'Data pendaftaran ditemukan', $result);
                } else {
                    jsonResponse('error', 404, 'Data pendaftaran tidak ditemukan');
                }
            } else {
                $stmt = $db->query("SELECT * FROM pendaftar_ppdb ORDER BY id DESC LIMIT 100");
                $result = $stmt->fetchAll();
                jsonResponse('success', 200, 'List data pendaftaran', $result);
            }
        } else {
            // Fallback response when DB connection is not configured locally
            jsonResponse('success', 200, 'Backend API Online (PHP PDO Standby)');
        }
} elseif ($request_method === 'POST') {
        // Ambil SEMUA data dari input React / Form
        $fullName       = sanitize($inputData['fullName'] ?? $inputData['namaLengkap'] ?? '');
        $nikNisn        = sanitize($inputData['nikNisn'] ?? $inputData['nisn'] ?? '');
        $birthPlaceDate = sanitize($inputData['birthPlaceDate'] ?? $inputData['ttl'] ?? '');
        $gender         = sanitize($inputData['gender'] ?? $inputData['jenisKelamin'] ?? '');
        $address        = sanitize($inputData['address'] ?? $inputData['alamat'] ?? '');
        $originSchool   = sanitize($inputData['originSchool'] ?? $inputData['asalSekolah'] ?? '');
        $phone          = sanitize($inputData['phoneWhatsapp'] ?? $inputData['phone'] ?? '');
        $parentName     = sanitize($inputData['parentName'] ?? $inputData['namaOrangTua'] ?? '');
        $parentPhone    = sanitize($inputData['parentPhone'] ?? $inputData['noHpOrtu'] ?? '');
        $major          = sanitize($inputData['firstChoiceMajor'] ?? $inputData['selectedMajor'] ?? 'RPL');

        if (empty($fullName) || empty($nikNisn)) {
            jsonResponse('error', 400, 'Nama Lengkap dan NIK/NISN wajib diisi');
        }

        $regCode = 'PPDB-2026-' . rand(1000, 9999);

        if ($db) {
            try {
                // INSERT SEMUA FIELD KE MYSQL (SNAKE_CASE)
                $stmt = $db->prepare("
                    INSERT INTO pendaftar_ppdb (
                        registration_code, full_name, nik_nisn, birth_place_date, gender, 
                        address, origin_school, phone_whatsapp, parent_name, parent_phone, 
                        first_choice_major, status
                    ) VALUES (
                        :code, :name, :nik, :ttl, :gender, 
                        :address, :school, :phone, :parent_name, :parent_phone, 
                        :major, 'Tergrafis (Pending Verification)'
                    )
                ");

                $stmt->execute([
                    ':code'         => $regCode,
                    ':name'         => $fullName,
                    ':nik'          => $nikNisn,
                    ':ttl'          => $birthPlaceDate,
                    ':gender'       => $gender,
                    ':address'      => $address,
                    ':school'       => $originSchool,
                    ':phone'        => $phone,
                    ':parent_name'  => $parentName,
                    ':parent_phone' => $parentPhone,
                    ':major'        => $major
                ]);

                jsonResponse('success', 201, 'Pendaftaran PPDB berhasil disimpan!', [
                    'id'               => $db->lastInsertId(),
                    'registrationCode' => $regCode,
                    'fullName'         => $fullName,
                    'status'           => 'Tergrafis (Pending Verification)'
                ]);

            } catch (PDOException $e1) {
                // FALLBACK JIKA NAMA KOLOM DI MYSQL KAMU CAMELCASE
                try {
                    $stmt = $db->prepare("
                        INSERT INTO pendaftar_ppdb (
                            registrationCode, fullName, nikNisn, birthPlaceDate, gender, 
                            address, originSchool, phoneWhatsapp, parentName, parentPhone, 
                            firstChoiceMajor, status
                        ) VALUES (
                            :code, :name, :nik, :ttl, :gender, 
                            :address, :school, :phone, :parent_name, :parent_phone, 
                            :major, 'Tergrafis (Pending Verification)'
                        )
                    ");

                    $stmt->execute([
                        ':code'         => $regCode,
                        ':name'         => $fullName,
                        ':nik'          => $nikNisn,
                        ':ttl'          => $birthPlaceDate,
                        ':gender'       => $gender,
                        ':address'      => $address,
                        ':school'       => $originSchool,
                        ':phone'        => $phone,
                        ':parent_name'  => $parentName,
                        ':parent_phone' => $parentPhone,
                        ':major'        => $major
                    ]);

                    jsonResponse('success', 201, 'Pendaftaran PPDB berhasil disimpan!', [
                        'id'               => $db->lastInsertId(),
                        'registrationCode' => $regCode,
                        'fullName'         => $fullName,
                        'status'           => 'Tergrafis (Pending Verification)'
                    ]);
                } catch (PDOException $e2) {
                    jsonResponse('error', 500, 'Gagal menyimpan ke MySQL: ' . $e1->getMessage());
                }
            }
        }
    }

// Default Fallback
jsonResponse('success', 200, 'SIAKAD SMK Bhinneka Nusantara PHP API Running', ['version' => '2.5.0']);
