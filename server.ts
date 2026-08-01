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

// GET list and content of PHP Native backend files
app.get('/api/export/php-files', (req, res) => {
  const phpDir = path.join(process.cwd(), 'php_backend');
  if (!fs.existsSync(phpDir)) {
    return res.status(404).json({ success: false, message: 'Folder php_backend tidak ditemukan.' });
  }

  const files = [
    'config.php',
    'koneksi.php',
    'database.sql',
    'api_pendaftaran.php',
    'api_check_nisn.php',
    'api_admin.php',
    'index.php',
    'PETUNJUK_DATABASE.md'
  ];

  const result = files.map(filename => {
    const filePath = path.join(phpDir, filename);
    const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    return {
      filename,
      content,
      language: filename.endsWith('.sql') ? 'sql' : (filename.endsWith('.md') ? 'markdown' : 'php')
    };
  });

  res.json({ success: true, data: result });
});

// GET database.sql file content
app.get('/api/export/sql', (req, res) => {
  const sqlFilePath = path.join(process.cwd(), 'php_backend', 'database.sql');
  if (fs.existsSync(sqlFilePath)) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="database_smk.sql"');
    return res.send(fs.readFileSync(sqlFilePath, 'utf8'));
  }
  return res.status(404).send('File database.sql tidak ditemukan.');
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
