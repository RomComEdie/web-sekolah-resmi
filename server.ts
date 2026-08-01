import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'pendaftaran.json');

// Helper to read registrations
function readRegistrations() {
  if (!fs.existsSync(dbFilePath)) {
    // Initial sample data
    const initialData = [
      {
        id: "REG-2026-RPL-001",
        nisn: "0051234567",
        namaLengkap: "Ahmad Fauzi",
        jenisKelamin: "Laki-Laki",
        tempatLahir: "Jakarta",
        tanggalLahir: "2009-05-14",
        noHp: "081234567890",
        alamat: "Jl. Merdeka No. 12, Jakarta Selatan",
        jurusan: "RPL",
        asalSekolah: "SMP Negeri 1 Jakarta",
        tahunLulus: "2026",
        namaOrangTua: "Budi Santoso",
        noHpOrangTua: "081987654321",
        pekerjaanOrangTua: "Wiraswasta",
        createdAt: new Date().toISOString()
      },
      {
        id: "REG-2026-AKL-002",
        nisn: "0059876543",
        namaLengkap: "Siti Nurhaliza",
        jenisKelamin: "Perempuan",
        tempatLahir: "Bandung",
        tanggalLahir: "2009-08-22",
        noHp: "082345678901",
        alamat: "Jl. Asia Afrika No. 45, Bandung",
        jurusan: "AKL",
        asalSekolah: "MTs Negeri 2 Bandung",
        tahunLulus: "2026",
        namaOrangTua: "Rahmat Hidayat",
        noHpOrangTua: "082987654321",
        pekerjaanOrangTua: "PNS",
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Helper to write registrations
function writeRegistrations(data: any[]) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// API Routes

// GET all registrations
app.get('/api/pendaftaran', (req, res) => {
  const list = readRegistrations();
  res.json({ success: true, data: list });
});

// CHECK NISN uniqueness
app.get('/api/pendaftaran/check-nisn/:nisn', (req, res) => {
  const { nisn } = req.params;
  const list = readRegistrations();
  const exists = list.some((item: any) => item.nisn.trim() === nisn.trim());
  res.json({ exists });
});

// POST new registration
app.post('/api/pendaftaran', (req, res) => {
  const {
    nisn,
    namaLengkap,
    jenisKelamin,
    tempatLahir,
    tanggalLahir,
    noHp,
    alamat,
    jurusan,
    asalSekolah,
    tahunLulus,
    namaOrangTua,
    noHpOrangTua,
    pekerjaanOrangTua
  } = req.body;

  // Validation
  if (!nisn || !namaLengkap || !asalSekolah || !namaOrangTua || !noHpOrangTua) {
    return res.status(400).json({
      success: false,
      message: 'Semua field wajib (NISN, Data Diri, Asal Sekolah, Data Orang Tua) harus diisi!'
    });
  }

  const list = readRegistrations();

  // Check unique NISN
  const duplicate = list.find((item: any) => item.nisn.trim() === nisn.trim());
  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: `NISN ${nisn} sudah terdaftar di database! NISN bersifat Unik dan tidak boleh ganda.`
    });
  }

  const newId = `REG-${new Date().getFullYear()}-${jurusan || 'SMK'}-${String(list.length + 1).padStart(3, '0')}`;
  
  const newRegistration = {
    id: newId,
    nisn: nisn.trim(),
    namaLengkap,
    jenisKelamin: jenisKelamin || 'Laki-Laki',
    tempatLahir: tempatLahir || '-',
    tanggalLahir: tanggalLahir || '-',
    noHp: noHp || '-',
    alamat: alamat || '-',
    jurusan: jurusan || 'RPL',
    asalSekolah,
    tahunLulus: tahunLulus || new Date().getFullYear().toString(),
    namaOrangTua,
    noHpOrangTua,
    pekerjaanOrangTua: pekerjaanOrangTua || '-',
    createdAt: new Date().toISOString()
  };

  list.unshift(newRegistration);
  writeRegistrations(list);

  return res.status(201).json({
    success: true,
    message: 'Pendaftaran berhasil dikirim!',
    data: newRegistration
  });
});

// PUT update registration (CRUD)
app.put('/api/pendaftaran/:id', (req, res) => {
  const { id } = req.params;
  const list = readRegistrations();
  const index = list.findIndex((item: any) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data pendaftaran tidak ditemukan.' });
  }

  // If NISN changed, check uniqueness
  if (req.body.nisn && req.body.nisn.trim() !== list[index].nisn) {
    const duplicate = list.find((item: any) => item.nisn.trim() === req.body.nisn.trim() && item.id !== id);
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `NISN ${req.body.nisn} sudah digunakan oleh pendaftar lain.`
      });
    }
  }

  list[index] = { ...list[index], ...req.body, updatedAt: new Date().toISOString() };
  writeRegistrations(list);

  return res.json({ success: true, message: 'Data berhasil diperbarui', data: list[index] });
});

// DELETE registration (CRUD)
app.delete('/api/pendaftaran/:id', (req, res) => {
  const { id } = req.params;
  let list = readRegistrations();
  const exists = list.some((item: any) => item.id === id);

  if (!exists) {
    return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
  }

  list = list.filter((item: any) => item.id !== id);
  writeRegistrations(list);

  return res.json({ success: true, message: 'Data pendaftaran berhasil dihapus.' });
});

// GET database.sql file content
app.get('/api/export/sql', (req, res) => {
  const sqlScript = `-- ========================================================
-- DATABASE SCHEMA & SEED DATA FOR SMK PRESTASI NUSANTARA
-- System: Penerimaan Peserta Didik Baru (PPDB)
-- File: database_smk.sql
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`db_smk_prestasi\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_smk_prestasi\`;

-- --------------------------------------------------------
-- Table structure for \`pendaftaran_ppdb\`
-- --------------------------------------------------------

DROP TABLE IF EXISTS \`pendaftaran_ppdb\`;

CREATE TABLE \`pendaftaran_ppdb\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`kode_pendaftaran\` VARCHAR(30) NOT NULL UNIQUE,
  \`nisn\` VARCHAR(10) NOT NULL,
  \`nama_lengkap\` VARCHAR(100) NOT NULL,
  \`jenis_kelamin\` ENUM('Laki-Laki', 'Perempuan') NOT NULL,
  \`tempat_lahir\` VARCHAR(50) NOT NULL,
  \`tanggal_lahir\` DATE NOT NULL,
  \`no_hp\` VARCHAR(15) NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`jurusan\` ENUM('RPL', 'AKL', 'TSM') NOT NULL,
  \`asal_sekolah\` VARCHAR(100) NOT NULL,
  \`tahun_lulus\` VARCHAR(4) NOT NULL,
  \`nama_orang_tua\` VARCHAR(100) NOT NULL,
  \`no_hp_orang_tua\` VARCHAR(15) NOT NULL,
  \`pekerjaan_orang_tua\` VARCHAR(50) NOT NULL,
  \`status_pendaftaran\` ENUM('Terverifikasi', 'Menunggu', 'Ditolak') DEFAULT 'Terverifikasi',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_nisn\` (\`nisn\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table \`pendaftaran_ppdb\`
-- --------------------------------------------------------

INSERT INTO \`pendaftaran_ppdb\` (
  \`kode_pendaftaran\`, \`nisn\`, \`nama_lengkap\`, \`jenis_kelamin\`,
  \`tempat_lahir\`, \`tanggal_lahir\`, \`no_hp\`, \`alamat\`,
  \`jurusan\`, \`asal_sekolah\`, \`tahun_lulus\`, \`nama_orang_tua\`,
  \`no_hp_orang_tua\`, \`pekerjaan_orang_tua\`
) VALUES
('REG-2026-RPL-001', '0051234567', 'Ahmad Fauzi', 'Laki-Laki', 'Jakarta', '2009-05-14', '081234567890', 'Jl. Merdeka No. 12, Jakarta Selatan', 'RPL', 'SMP Negeri 1 Jakarta', '2026', 'Budi Santoso', '081987654321', 'Wiraswasta'),
('REG-2026-AKL-002', '0059876543', 'Siti Nurhaliza', 'Perempuan', 'Bandung', '2009-08-22', '082345678901', 'Jl. Asia Afrika No. 45, Bandung', 'AKL', 'MTs Negeri 2 Bandung', '2026', 'Rahmat Hidayat', '082987654321', 'PNS');
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="database_smk.sql"');
  res.send(sqlScript);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
