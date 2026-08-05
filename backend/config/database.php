<?php
/**
 * Database Connection & PDO Driver Configuration
 * Portal Sistem Informasi Akademik & PPDB SMK Bhinneka Nusantara
 */

declare(strict_types=1);

class Database {
    private string $host = "localhost";
    private string $db_name = "smk_bhinneka_db";
    private string $username = "root";
    private string $password = "";
    private ?PDO $conn = null;

    public function __construct() {
        // Read environment variables if available
        $this->host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: $this->host;
        $this->db_name = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: $this->db_name;
        $this->username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: $this->username;
        $this->password = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: $this->password;
    }

    public function getConnection(): ?PDO {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            // Log error internally without exposing credentials to caller
            error_log("Database Connection Error: " . $e->getMessage());
        }

        return $this->conn;
    }
}
