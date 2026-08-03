<?php
/**
 * Database Connection Configuration (PDO MySQL Native)
 * SMK Nusa Bangsa Backend API
 */

require_once __DIR__ . '/../cors.php';

class Database {
    // Ubah sesuai konfigurasi server MySQL Anda (XAMPP / Laragon / Cpanel / VPS)
    private $host = "127.0.0.1";
    private $db_name = "db_smk_nusa_bangsa";
    private $username = "root";
    private $password = "";
    private $port = "3306";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $exception) {
            sendJsonResponse(500, "Koneksi database MySQL gagal: " . $exception->getMessage(), null, [
                'hint' => 'Pastikan MySQL sudah dinyalakan dan database db_smk_nusa_bangsa sudah di-import melalui database.sql'
            ]);
        }

        return $this->conn;
    }
}
