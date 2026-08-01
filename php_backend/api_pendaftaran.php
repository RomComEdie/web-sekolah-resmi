<?php
/**
 * ===================================================================
 * API PENDAFTARAN SISWA BARU (PHP NATIVE)
 * Endpoint: POST /php_backend/api_pendaftaran.php
 * ===================================================================
 */

require_once __DIR__ . '/koneksi.php';

// Ambil input JSON atau POST Form Data
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?: $_POST;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metode HTTP request harus POST.'
    ]);
    exit();
}

// Sanitasi & Ekstrak variabel
$nisn             = trim($inputData['nisn'] ?? '');
$namaLengkap      = trim($inputData['namaLengkap'] ?? $inputData['nama_lengkap'] ?? '');
$jenisKelamin     = trim($inputData['jenisKelamin'] ?? $inputData['jenis_kelamin'] ?? 'Laki-Laki');
$tempatLahir      = trim($inputData['tempatLahir'] ?? $inputData['tempat_lahir'] ?? '-');
$tanggalLahir     = trim($inputData['tanggalLahir'] ?? $inputData['tanggal_lahir'] ?? null);
$noHp             = trim($inputData['noHp'] ?? $inputData['no_hp'] ?? '-');
$alamat           = trim($inputData['alamat'] ?? '-');
$jurusan          = trim($inputData['jurusan'] ?? 'RPL');
$asalSekolah      = trim($inputData['asalSekolah'] ?? $inputData['asal_sekolah'] ?? '');
$tahunLulus       = trim($inputData['tahunLulus'] ?? $inputData['tahun_lulus'] ?? '2026');
$namaOrangTua     = trim($inputData['namaOrangTua'] ?? $inputData['nama_orang_tua'] ?? '');
$noHpOrangTua     = trim($inputData['noHpOrangTua'] ?? $inputData['no_hp_orang_tua'] ?? '');
$pekerjaanOrangTua= trim($inputData['pekerjaanOrangTua'] ?? $inputData['pekerjaan_orang_tua'] ?? '-');

// Validasi Field Wajib
if (empty($nisn) || empty($namaLengkap) || empty($asalSekolah) || empty($namaOrangTua) || empty($noHpOrangTua)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Kolom Wajib (NISN, Nama Lengkap, Asal Sekolah, Nama Orang Tua, No HP Orang Tua) tidak boleh kosong!'
    ]);
    exit();
}

// 1. CEK UNIK NISN
try {
    $stmtCek = $pdo->prepare("SELECT COUNT(*) FROM pendaftaran_ppdb WHERE nisn = :nisn");
    $stmtCek->execute([':nisn' => $nisn]);
    if ($stmtCek->fetchColumn() > 0) {
        http_response_code(409); // Conflict
        echo json_encode([
            'success' => false,
            'message' => "NISN $nisn sudah terdaftar di database! NISN bersifat unik dan tidak boleh ganda."
        ]);
        exit();
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal memeriksa keunikan NISN: ' . $e->getMessage()]);
    exit();
}

// 2. GENERATE KODE REGISTRASI UNIK
$kodePendaftaran = 'REG-' . date('Y') . '-' . strtoupper($jurusan) . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);

// 3. INSERT DATABASE VIA PDO PREPARED STATEMENT
try {
    $sql = "INSERT INTO pendaftaran_ppdb (
        kode_pendaftaran, nisn, nama_lengkap, jenis_kelamin, tempat_lahir,
        tanggal_lahir, no_hp, alamat, jurusan, asal_sekolah, tahun_lulus,
        nama_orang_tua, no_hp_orang_tua, pekerjaan_orang_tua
    ) VALUES (
        :kode, :nisn, :nama, :jk, :tempat,
        :tgl, :nohp, :alamat, :jurusan, :asal, :thn,
        :ortu, :nohp_ortu, :kerja_ortu
    )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':kode'       => $kodePendaftaran,
        ':nisn'       => $nisn,
        ':nama'       => $namaLengkap,
        ':jk'         => $jenisKelamin,
        ':tempat'     => $tempatLahir,
        ':tgl'        => $tanggalLahir ?: date('Y-m-d'),
        ':nohp'       => $noHp,
        ':alamat'     => $alamat,
        ':jurusan'    => $jurusan,
        ':asal'       => $asalSekolah,
        ':thn'        => $tahunLulus,
        ':ortu'       => $namaOrangTua,
        ':nohp_ortu'  => $noHpOrangTua,
        ':kerja_ortu' => $pekerjaanOrangTua
    ]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran PPDB berhasil disimpan ke Database MySQL!',
        'data' => [
            'id' => $kodePendaftaran,
            'kodePendaftaran' => $kodePendaftaran,
            'nisn' => $nisn,
            'namaLengkap' => $namaLengkap,
            'jurusan' => $jurusan,
            'asalSekolah' => $asalSekolah,
            'namaOrangTua' => $namaOrangTua
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menyimpan pendaftaran ke MySQL: ' . $e->getMessage()
    ]);
}
?>
