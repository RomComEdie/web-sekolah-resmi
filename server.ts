import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// ================= XAMPP MYSQL DATABASE CONNECTION POOL =================
let dbPool: mysql.Pool | null = null;
let isDbConnected = false;

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smk_bhinneka';
  const port = Number(process.env.DB_PORT) || 3306;

  try {
    const rootConn = await mysql.createConnection({ host, user, password, port });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    dbPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await dbPool.getConnection();
    conn.release();
    isDbConnected = true;
    console.log(`[XAMPP MySQL] Connected successfully to database "${database}" on ${host}:${port}!`);

    // Ensure database tables exist
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS \`pendaftar_ppdb\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`registration_code\` VARCHAR(50) NOT NULL UNIQUE,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`nik_nisn\` VARCHAR(100) NOT NULL,
        \`birth_place_date\` VARCHAR(255) DEFAULT NULL,
        \`gender\` VARCHAR(20) DEFAULT NULL,
        \`address\` TEXT DEFAULT NULL,
        \`origin_school\` VARCHAR(255) DEFAULT NULL,
        \`phone_whatsapp\` VARCHAR(50) DEFAULT NULL,
        \`parent_name\` VARCHAR(255) DEFAULT NULL,
        \`parent_phone\` VARCHAR(50) DEFAULT NULL,
        \`first_choice_major\` VARCHAR(20) DEFAULT NULL,
        \`second_choice_major\` VARCHAR(20) DEFAULT NULL,
        \`registration_date\` VARCHAR(100) DEFAULT NULL,
        \`status\` VARCHAR(100) DEFAULT 'Tergrafis (Pending Verification)',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS \`pesan_kontak\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`nama\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) DEFAULT NULL,
        \`telepon\` VARCHAR(50) DEFAULT NULL,
        \`subjek\` VARCHAR(255) DEFAULT NULL,
        \`pesan\` TEXT NOT NULL,
        \`created_at\` VARCHAR(100) DEFAULT NULL,
        \`timestamp\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS \`pengumuman\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) DEFAULT 'Pengumuman',
        \`date\` VARCHAR(50) DEFAULT NULL,
        \`summary\` TEXT DEFAULT NULL,
        \`content\` TEXT DEFAULT NULL,
        \`author\` VARCHAR(100) DEFAULT 'Super Admin',
        \`is_important\` TINYINT(1) DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`timestamp\` VARCHAR(100) DEFAULT NULL,
        \`user\` VARCHAR(255) DEFAULT NULL,
        \`user_role\` VARCHAR(100) DEFAULT NULL,
        \`action\` VARCHAR(100) DEFAULT NULL,
        \`details\` TEXT DEFAULT NULL,
        \`ip\` VARCHAR(50) DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

  } catch (err: any) {
    isDbConnected = false;
    console.log(`[Database Status] MySQL XAMPP connection: ${err.message || 'Offline'}. Using in-memory store mode.`);
  }
}

// ================= SECURITY HEADERS & CORS MIDDLEWARE =================
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database to JS Object Mapping Helpers
function mapPPDBFromDb(r: any) {
  return {
    id: String(r.id),
    registrationCode: r.registration_code,
    fullName: r.full_name,
    nikNisn: r.nik_nisn,
    birthPlaceDate: r.birth_place_date || '',
    gender: r.gender || '',
    address: r.address || '',
    originSchool: r.origin_school || '',
    phoneWhatsapp: r.phone_whatsapp || '',
    parentName: r.parent_name || '',
    parentPhone: r.parent_phone || '',
    firstChoiceMajor: r.first_choice_major || '',
    secondChoiceMajor: r.second_choice_major || '',
    registrationDate: r.registration_date || '',
    status: r.status || 'Tergrafis (Pending Verification)'
  };
}

function mapAnnFromDb(r: any) {
  return {
    id: String(r.id),
    title: r.title,
    category: r.category,
    date: r.date,
    summary: r.summary,
    content: r.content,
    author: r.author,
    isImportant: Boolean(r.is_important)
  };
}

function mapPesanFromDb(r: any) {
  return {
    id: String(r.id),
    nama: r.nama,
    email: r.email,
    telepon: r.telepon,
    whatsapp: r.telepon,
    subjek: r.subjek,
    pesan: r.pesan,
    createdAt: r.created_at
  };
}

function mapAuditFromDb(r: any) {
  return {
    id: String(r.id),
    timestamp: r.timestamp,
    user: r.user,
    userRole: r.user_role,
    action: r.action,
    details: r.details,
    ip: r.ip
  };
}

// Audit Logger Helper
async function recordAuditLog(log: { id: string; user: string; userRole?: string; action: string; details: string; ip: string }) {
  const timestamp = new Date().toISOString();
  const entry = { ...log, timestamp };
  auditLogsStore.unshift(entry);
  if (isDbConnected && dbPool) {
    try {
      await dbPool.query(
        `INSERT INTO audit_logs (id, timestamp, user, user_role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [log.id, timestamp, log.user, log.userRole || null, log.action, log.details, log.ip]
      );
    } catch (err: any) {
      console.error('[MySQL Audit Error]:', err.message);
    }
  }
}

// ================= RATE LIMITER IN-MEMORY ENGINE =================
const rateLimitMap = new Map<string, { count: number; firstAccess: number }>();

const rateLimiter = (maxRequests: number, windowMs: number) => {
  return (req: any, res: any, next: any) => {
    const ip = (req.headers['x-forwarded-for'] as string || req.ip || '127.0.0.1').split(',')[0].trim();
    const now = Date.now();
    
    const record = rateLimitMap.get(ip);
    if (!record) {
      rateLimitMap.set(ip, { count: 1, firstAccess: now });
      return next();
    }

    if (now - record.firstAccess > windowMs) {
      rateLimitMap.set(ip, { count: 1, firstAccess: now });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        status: 'error',
        code: 429,
        message: "Terlalu banyak permintaan. Silakan tunggu beberapa saat lagi.",
        code_string: "RATE_LIMIT_EXCEEDED"
      });
    }

    record.count += 1;
    next();
  };
};

const authLimiter = rateLimiter(10, 15 * 60 * 1000); // 10 attempts per 15 mins
const submitLimiter = rateLimiter(20, 60 * 1000); // 20 requests per minute

// Input Sanitizer helper to prevent basic XSS
function sanitizeInput(val: any): any {
  if (typeof val === 'string') {
    return val.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  }
  if (typeof val === 'object' && val !== null) {
    for (const k in val) {
      val[k] = sanitizeInput(val[k]);
    }
  }
  return val;
}

// Toxic Words Filter Helper
const TOXIC_WORDS_SERVER = [
  'anjing', 'babi', 'kontol', 'memek', 'pepek', 'goblok', 'tolol', 
  'bangsat', 'bajingan', 'lonte', 'perek', 'asu', 'jancok', 'pantat', 
  'pantek', 'biadab', 'bego', 'monyet', 'idiot', 'pukimak', 'fuck', 'shit'
];

function containsToxicWordsServer(text: string): { isToxic: boolean; word?: string } {
  if (!text || typeof text !== 'string') return { isToxic: false };
  const lower = text.toLowerCase();
  for (const w of TOXIC_WORDS_SERVER) {
    if (lower.includes(w)) {
      return { isToxic: true, word: w };
    }
  }
  return { isToxic: false };
}

// In-memory registrations store for Node Express runtime
const registrationsStore: any[] = [];
const messagesStore: any[] = [];
const announcementsStore: any[] = [
  {
    id: "ANN-001",
    title: "Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027",
    category: "PPDB",
    date: "2026-07-01",
    summary: "Pendaftaran Siswa Baru resmi dibuka online mulai 1 Juli hingga 31 Agustus 2026 dengan beasiswa SPP.",
    content: "SMK Bhinneka Nusantara resmi membuka Pendaftaran Peserta Didik Baru (PPDB) Gelombang 1. Bagi pendaftar 100 pertama mendapatkan bebas biaya pendaftaran & potongan SPP 20%.",
    author: "Panitia PPDB",
    isImportant: true
  },
  {
    id: "ANN-002",
    title: "Juara 1 LKS SMK Tingkat Provinsi Bidang Web Technologies",
    category: "Prestasi",
    date: "2026-07-20",
    summary: "Siswa jurusan RPL & TKJ kembali mengukir prestasi emas dalam Lomba Kompetensi Siswa SMK.",
    content: "Selamat kepada tim siswa RPL dan TKJ SMK Bhinneka Nusantara yang berhasil meraih Juara 1 LKS Tingkat Provinsi.",
    author: "Humas Sekolah",
    isImportant: false
  }
];
const auditLogsStore: any[] = [
  {
    id: "LOG-001",
    timestamp: new Date().toISOString(),
    user: "System",
    action: "SERVER_START",
    details: "Server Backend SIAKAD SMK Online",
    ip: "127.0.0.1"
  }
];

// Seed sample pendaftar for admin testing if empty
if (registrationsStore.length === 0) {
  registrationsStore.push({
    id: '101',
    fullName: 'Ahmad Rizky Pratama',
    nikNisn: '0081234567',
    birthPlaceDate: 'Banjarmasin, 15 Mei 2008',
    gender: 'Laki-laki',
    address: 'Jl. Ahmad Yani Km 5.5 No. 12',
    originSchool: 'SMP Negeri 2 Banjarmasin',
    phoneWhatsapp: '081234567890',
    parentName: 'Bambang Pratama',
    parentPhone: '081234567899',
    firstChoiceMajor: 'RPL',
    secondChoiceMajor: 'AKL',
    registrationCode: 'PPDB-2026-1001',
    registrationDate: '27 Juli 2026',
    status: 'Tergrafis (Pending Verification)'
  });
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SMK Portal API Backend' });
});

// Database Connection Status Endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    status: 'success',
    code: 200,
    database: {
      connected: isDbConnected,
      driver: 'MySQL (XAMPP / MariaDB)',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      name: process.env.DB_NAME || 'smk_bhinneka',
      user: process.env.DB_USER || 'root',
      mode: isDbConnected ? 'REAL_MYSQL_XAMPP' : 'IN_MEMORY_FALLBACK'
    }
  });
});

// Anti SQL Injection & Security Guard
function detectSqlInjection(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(\#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%82)|r|(\%52))/i,
    /(exec(\s|\+)+|(s|x)p\w+|select|insert|update|delete|drop|union|create|alter|truncate)\b/i,
    /script/i
  ];
  return sqlInjectionPatterns.some(pattern => pattern.test(str));
}

// Admin Login Route with Security & SQL Injection Protection
app.post(['/api/admin/login', '/backend/api/admin.php'], (req, res) => {
  const { username, password, adminKey } = req.body;
  const rawKey = (password || adminKey || '').trim();
  const rawUser = (username || '').trim();

  // Anti SQL Injection Check
  if (detectSqlInjection(rawUser) || detectSqlInjection(rawKey)) {
    auditLogsStore.unshift({
      id: `LOG-SEC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'UNKNOWN_ATTACKER',
      action: 'SECURITY_ALERT_SQL_INJECTION',
      details: `Upaya SQL Injection diblokir dari IP: ${req.ip || '127.0.0.1'}`,
      ip: req.ip || '127.0.0.1'
    });

    return res.status(400).json({
      status: 'error',
      code: 400,
      message: '⚠️ Akses ditolak! Terdeteksi karakter atau pola berisiko (Anti SQL Injection Protection Active).'
    });
  }

  const keyToTest = rawKey;
  const userToTest = rawUser.toLowerCase();

  if (!userToTest || !keyToTest) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Username dan Password wajib diisi!'
    });
  }

  // 3 Dedicated Accounts Definition: Kepala Sekolah, Super Admin, and Panitia PPDB
  const accounts: Record<string, { keys: string[]; role: string; name: string; email: string; permissions: string[]; username?: string; assignedClass?: string; majorCode?: string; subject?: string }> = {
    'kepsek': {
      keys: ['kepsek123', 'KEPSEKBHINNEKA2026', 'kepsek2026', 'smk2026', 'kepalasekolah'],
      role: 'Kepala Sekolah',
      name: 'Drs. H. M. Supriyadi, M.Pd.',
      email: 'kepalasekolah@smkbhinnekanusantara.sch.id',
      permissions: ['VIEW_ALL_REPORTS', 'EXPORT_EXECUTIVE_PDF', 'MONITOR_AUDIT_LOGS', 'READ_ONLY_ACCESS']
    },
    'kepalasekolah': {
      keys: ['kepsek123', 'KEPSEKBHINNEKA2026', 'kepsek2026', 'smk2026', 'kepalasekolah'],
      role: 'Kepala Sekolah',
      name: 'Drs. H. M. Supriyadi, M.Pd.',
      email: 'kepalasekolah@smkbhinnekanusantara.sch.id',
      permissions: ['VIEW_ALL_REPORTS', 'EXPORT_EXECUTIVE_PDF', 'MONITOR_AUDIT_LOGS', 'READ_ONLY_ACCESS']
    },
    'admin': {
      keys: ['admin123', 'ADMINBHINNEKA2026', 'ADMIN-SMK2026', 'smk2026', 'masteradmin'],
      role: 'Super Admin',
      name: 'Administrator Utama PPDB',
      email: 'admin@smkbhinnekanusantara.sch.id',
      permissions: ['ADD_DATA', 'DELETE_DATA', 'ACCEPT_DATA', 'REJECT_DATA', 'UPDATE_STATUS', 'MANAGE_ANNOUNCEMENTS', 'FULL_CONTROL']
    },
    'superadmin': {
      keys: ['admin123', 'ADMINBHINNEKA2026', 'ADMIN-SMK2026', 'smk2026', 'masteradmin'],
      role: 'Super Admin',
      name: 'Administrator Utama PPDB',
      email: 'admin@smkbhinnekanusantara.sch.id',
      permissions: ['ADD_DATA', 'DELETE_DATA', 'ACCEPT_DATA', 'REJECT_DATA', 'UPDATE_STATUS', 'MANAGE_ANNOUNCEMENTS', 'FULL_CONTROL']
    },
    'panitia': {
      keys: ['panitia123', 'smk2026', 'panitia2026', 'ADMINBHINNEKA2026'],
      role: 'Panitia PPDB',
      name: 'Panitia Penerimaan Siswa Baru',
      email: 'panitia@smkbhinnekanusantara.sch.id',
      permissions: ['ADD_DATA', 'ACCEPT_DATA', 'UPDATE_STATUS', 'EXPORT_CSV']
    },
    'guru': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Dra. Endang Rahayu, S.Pd.',
      username: 'guru_rpl1',
      assignedClass: 'X RPL 1',
      majorCode: 'RPL',
      subject: 'Pemrograman Web & Mobile',
      email: 'endang.rahayu@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    },
    'guru_rpl1': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Dra. Endang Rahayu, S.Pd.',
      username: 'guru_rpl1',
      assignedClass: 'X RPL 1',
      majorCode: 'RPL',
      subject: 'Pemrograman Web & Mobile',
      email: 'endang.rahayu@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    },
    'guru_rpl2': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Drs. H. Ahmad Fauzi, M.Pd.',
      username: 'guru_rpl2',
      assignedClass: 'X RPL 2',
      majorCode: 'RPL',
      subject: 'Basis Data & Algoritma',
      email: 'ahmad.fauzi@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    },
    'guru_akl1': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Hj. Siti Nurhaliza, S.E., M.Ak.',
      username: 'guru_akl1',
      assignedClass: 'X AKL 1',
      majorCode: 'AKL',
      subject: 'Akuntansi Keuangan & Perbankan',
      email: 'siti.nurhaliza@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    },
    'guru_akl2': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Budi Santoso, S.Pd., M.M.',
      username: 'guru_akl2',
      assignedClass: 'X AKL 2',
      majorCode: 'AKL',
      subject: 'Praktikum Akuntansi Perusahaan',
      email: 'budi.santoso@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    },
    'guru_tsm1': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Ir. Bambang Hermawan, S.T.',
      username: 'guru_tsm1',
      assignedClass: 'X TSM 1',
      majorCode: 'TSM',
      subject: 'Teknik Mesin & Kelistrikan Otomotif',
      email: 'bambang.hermawan@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    },
    'gurupengajar': {
      keys: ['guru123', 'guru2026', 'smk2026', 'gurupengajar'],
      role: 'Guru Pengajar',
      name: 'Dra. Endang Rahayu, S.Pd.',
      username: 'guru_rpl1',
      assignedClass: 'X RPL 1',
      majorCode: 'RPL',
      subject: 'Pemrograman Web & Mobile',
      email: 'endang.rahayu@smk.sch.id',
      permissions: ['MONITOR_CLASS_STUDENTS', 'FILTER_BY_MAJOR', 'VIEW_STUDENT_PROFILES', 'TRACK_CLASS_PROGRESS']
    }
  };

  const matchedAccount = accounts[userToTest];

  if (matchedAccount && matchedAccount.keys.includes(keyToTest)) {
    const token = `token_${matchedAccount.role.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    // Log audit action
    recordAuditLog({
      id: `LOG-${Date.now()}`,
      user: matchedAccount.name,
      userRole: matchedAccount.role,
      action: 'LOGIN_SUCCESS',
      details: `Login sebagai ${matchedAccount.role} (${matchedAccount.email})`,
      ip: req.ip || '127.0.0.1'
    });

    return res.json({
      status: 'success',
      code: 200,
      message: `Selamat datang, ${matchedAccount.name}! Login berhasil sebagai ${matchedAccount.role}.`,
      token: token,
      user: {
        id: Date.now(),
        username: userToTest,
        name: matchedAccount.name,
        role: matchedAccount.role,
        email: matchedAccount.email,
        permissions: matchedAccount.permissions
      }
    });
  } else {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Username atau Password salah! Periksa kembali kredensial Anda.'
    });
  }
});

// Audit Logs Endpoint
app.get(['/api/admin/audit-logs'], async (req, res) => {
  if (isDbConnected && dbPool) {
    try {
      const [rows]: any = await dbPool.query(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200`);
      return res.json({
        status: 'success',
        code: 200,
        data: rows.map(mapAuditFromDb)
      });
    } catch (err: any) {
      console.error('[MySQL AuditLogs Error]:', err.message);
    }
  }
  res.json({
    status: 'success',
    code: 200,
    data: auditLogsStore
  });
});

// Admin Stats Route
app.get(['/api/admin/stats'], async (req, res) => {
  if (isDbConnected && dbPool) {
    try {
      const [ppdbRows]: any = await dbPool.query(`SELECT first_choice_major FROM pendaftar_ppdb`);
      const [pesanRows]: any = await dbPool.query(`SELECT COUNT(*) as cnt FROM pesan_kontak`);
      const totalRPL = ppdbRows.filter((r: any) => r.first_choice_major === 'RPL').length;
      const totalAKL = ppdbRows.filter((r: any) => r.first_choice_major === 'AKL').length;
      const totalTSM = ppdbRows.filter((r: any) => r.first_choice_major === 'TSM').length;

      return res.json({
        status: 'success',
        code: 200,
        data: {
          totalPPDB: ppdbRows.length,
          totalRPL,
          totalAKL,
          totalTSM,
          totalPesan: pesanRows[0]?.cnt || 0,
          serverTime: new Date().toISOString()
        }
      });
    } catch (err: any) {
      console.error('[MySQL Stats Error]:', err.message);
    }
  }

  const totalRPL = registrationsStore.filter(r => r.firstChoiceMajor === 'RPL').length;
  const totalAKL = registrationsStore.filter(r => r.firstChoiceMajor === 'AKL').length;
  const totalTSM = registrationsStore.filter(r => r.firstChoiceMajor === 'TSM').length;

  res.json({
    status: 'success',
    code: 200,
    data: {
      totalPPDB: registrationsStore.length,
      totalRPL,
      totalAKL,
      totalTSM,
      totalPesan: messagesStore.length,
      serverTime: new Date().toISOString()
    }
  });
});

// Delete PPDB Record (MySQL CRUD + Fallback)
app.delete(['/api/ppdb/:id', '/backend/api/ppdb.php/:id'], async (req, res) => {
  const { id } = req.params;

  if (isDbConnected && dbPool) {
    try {
      const [existing]: any = await dbPool.query(
        `SELECT * FROM pendaftar_ppdb WHERE id = ? OR registration_code = ? LIMIT 1`,
        [id, id]
      );
      if (existing && existing.length > 0) {
        await dbPool.query(
          `DELETE FROM pendaftar_ppdb WHERE id = ? OR registration_code = ?`,
          [id, id]
        );
        const removed = mapPPDBFromDb(existing[0]);
        return res.json({
          status: 'success',
          code: 200,
          message: `Data pendaftaran ${removed.fullName} (${removed.registrationCode}) berhasil dihapus dari database MySQL.`,
          data: removed
        });
      }
    } catch (err: any) {
      console.error('[MySQL Delete PPDB Error]:', err.message);
    }
  }

  const idx = registrationsStore.findIndex(r => r.id === id || r.registrationCode === id);
  if (idx !== -1) {
    const removed = registrationsStore.splice(idx, 1)[0];
    return res.json({
      status: 'success',
      code: 200,
      message: `Data pendaftaran ${removed.fullName} (${removed.registrationCode}) berhasil dihapus.`,
      data: removed
    });
  }
  return res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Data tidak ditemukan'
  });
});

// Update PPDB Status (MySQL CRUD + Fallback)
app.patch(['/api/ppdb/:id', '/backend/api/ppdb.php/:id'], async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isDbConnected && dbPool) {
    try {
      await dbPool.query(
        `UPDATE pendaftar_ppdb SET status = ? WHERE id = ? OR registration_code = ?`,
        [status, id, id]
      );
      const [updated]: any = await dbPool.query(
        `SELECT * FROM pendaftar_ppdb WHERE id = ? OR registration_code = ? LIMIT 1`,
        [id, id]
      );
      if (updated && updated.length > 0) {
        return res.json({
          status: 'success',
          code: 200,
          message: 'Status pendaftaran berhasil diperbarui di database MySQL.',
          data: mapPPDBFromDb(updated[0])
        });
      }
    } catch (err: any) {
      console.error('[MySQL Patch PPDB Error]:', err.message);
    }
  }

  const item = registrationsStore.find(r => r.id === id || r.registrationCode === id);
  if (item) {
    item.status = status || item.status;
    return res.json({
      status: 'success',
      code: 200,
      message: 'Status pendaftaran berhasil diperbarui.',
      data: item
    });
  }
  return res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Data tidak ditemukan'
  });
});

// Express PPDB Status Check Endpoint (MySQL CRUD + Fallback)
app.get(['/api/ppdb/check-status', '/backend/api/ppdb_status.php'], async (req, res) => {
  const query = String(req.query.q || req.query.code || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Masukkan NIK atau Nomor Pendaftaran!'
    });
  }

  if (isDbConnected && dbPool) {
    try {
      const [rows]: any = await dbPool.query(
        `SELECT * FROM pendaftar_ppdb WHERE LOWER(registration_code) = ? OR LOWER(nik_nisn) = ? LIMIT 1`,
        [query, query]
      );
      if (rows && rows.length > 0) {
        return res.json({
          status: 'success',
          code: 200,
          message: 'Data pendaftaran ditemukan di MySQL',
          data: mapPPDBFromDb(rows[0])
        });
      }
    } catch (err: any) {
      console.error('[MySQL Check Status Error]:', err.message);
    }
  }

  const found = registrationsStore.find((r) => 
    String(r.registrationCode || '').toLowerCase() === query ||
    String(r.nikNisn || '').toLowerCase() === query ||
    String(r.nik || '').toLowerCase() === query ||
    String(r.nisn || '').toLowerCase() === query
  );

  if (found) {
    return res.json({
      status: 'success',
      code: 200,
      message: 'Data pendaftaran ditemukan',
      data: found
    });
  } else {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Data pendaftaran tidak ditemukan. Mohon periksa kembali NIK atau Kode Pendaftaran Anda.'
    });
  }
});

// Announcements API Endpoints (MySQL CRUD + Fallback)
app.get(['/api/announcements', '/backend/api/announcements.php'], async (req, res) => {
  if (isDbConnected && dbPool) {
    try {
      const [rows]: any = await dbPool.query(`SELECT * FROM pengumuman ORDER BY created_at DESC`);
      return res.json({
        status: 'success',
        code: 200,
        data: rows.map(mapAnnFromDb)
      });
    } catch (err: any) {
      console.error('[MySQL Get Announcements Error]:', err.message);
    }
  }

  res.json({
    status: 'success',
    code: 200,
    data: announcementsStore
  });
});

app.post(['/api/announcements', '/backend/api/announcements.php'], async (req, res) => {
  const sanitized = sanitizeInput(req.body);
  const newId = `ANN-${Date.now()}`;
  const title = sanitized.title || 'Pengumuman Baru';
  const category = sanitized.category || 'Pengumuman';
  const dateStr = sanitized.date || new Date().toISOString().split('T')[0];
  const summary = sanitized.summary || sanitized.content?.substring(0, 120) || '';
  const content = sanitized.content || '';
  const author = sanitized.author || 'Super Admin Website';
  const isImportant = Boolean(sanitized.isImportant);

  if (isDbConnected && dbPool) {
    try {
      await dbPool.query(
        `INSERT INTO pengumuman (id, title, category, date, summary, content, author, is_important) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [newId, title, category, dateStr, summary, content, author, isImportant ? 1 : 0]
      );
      const newAnn = { id: newId, title, category, date: dateStr, summary, content, author, isImportant };
      return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Pengumuman berhasil diterbitkan di MySQL!',
        data: newAnn
      });
    } catch (err: any) {
      console.error('[MySQL Post Announcement Error]:', err.message);
    }
  }

  const newAnn = {
    id: newId,
    title,
    category,
    date: dateStr,
    summary,
    content,
    author,
    isImportant
  };

  announcementsStore.unshift(newAnn);
  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'Pengumuman berhasil diterbitkan!',
    data: newAnn
  });
});

app.put(['/api/announcements/:id', '/backend/api/announcements.php/:id'], async (req, res) => {
  const { id } = req.params;
  const sanitized = sanitizeInput(req.body);

  if (isDbConnected && dbPool) {
    try {
      const [existing]: any = await dbPool.query(`SELECT * FROM pengumuman WHERE id = ? LIMIT 1`, [id]);
      if (existing && existing.length > 0) {
        const cur = existing[0];
        const title = sanitized.title ?? cur.title;
        const category = sanitized.category ?? cur.category;
        const dateStr = sanitized.date ?? cur.date;
        const summary = sanitized.summary ?? cur.summary;
        const content = sanitized.content ?? cur.content;
        const author = sanitized.author ?? cur.author;
        const isImportant = sanitized.isImportant !== undefined ? (sanitized.isImportant ? 1 : 0) : cur.is_important;

        await dbPool.query(
          `UPDATE pengumuman SET title = ?, category = ?, date = ?, summary = ?, content = ?, author = ?, is_important = ? WHERE id = ?`,
          [title, category, dateStr, summary, content, author, isImportant, id]
        );

        return res.json({
          status: 'success',
          code: 200,
          message: 'Pengumuman berhasil diperbarui di database MySQL!',
          data: { id, title, category, date: dateStr, summary, content, author, isImportant: Boolean(isImportant) }
        });
      }
    } catch (err: any) {
      console.error('[MySQL Put Announcement Error]:', err.message);
    }
  }

  const item = announcementsStore.find(a => a.id === id);
  if (item) {
    if (sanitized.title) item.title = sanitized.title;
    if (sanitized.category) item.category = sanitized.category;
    if (sanitized.summary) item.summary = sanitized.summary;
    if (sanitized.content) item.content = sanitized.content;
    if (sanitized.author) item.author = sanitized.author;
    if (sanitized.isImportant !== undefined) item.isImportant = Boolean(sanitized.isImportant);
    if (sanitized.date) item.date = sanitized.date;
    return res.json({
      status: 'success',
      code: 200,
      message: 'Pengumuman berhasil diperbarui!',
      data: item
    });
  }
  return res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Pengumuman tidak ditemukan'
  });
});

app.delete(['/api/announcements/:id', '/backend/api/announcements.php/:id'], async (req, res) => {
  const { id } = req.params;

  if (isDbConnected && dbPool) {
    try {
      const [existing]: any = await dbPool.query(`SELECT * FROM pengumuman WHERE id = ? LIMIT 1`, [id]);
      if (existing && existing.length > 0) {
        await dbPool.query(`DELETE FROM pengumuman WHERE id = ?`, [id]);
        return res.json({
          status: 'success',
          code: 200,
          message: `Berita "${existing[0].title}" berhasil dihapus dari MySQL`,
          data: mapAnnFromDb(existing[0])
        });
      }
    } catch (err: any) {
      console.error('[MySQL Delete Announcement Error]:', err.message);
    }
  }

  const idx = announcementsStore.findIndex(a => a.id === id);
  if (idx !== -1) {
    const deleted = announcementsStore.splice(idx, 1)[0];
    return res.json({
      status: 'success',
      code: 200,
      message: `Berita "${deleted.title}" berhasil dihapus`,
      data: deleted
    });
  }
  return res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Pengumuman tidak ditemukan'
  });
});

// Express PPDB API Endpoint (MySQL CRUD + Fallback)
app.get(['/api/ppdb', '/backend/api/ppdb.php'], async (req, res) => {
  const queryCode = req.query.code as string;

  if (isDbConnected && dbPool) {
    try {
      if (queryCode) {
        const [rows]: any = await dbPool.query(
          `SELECT * FROM pendaftar_ppdb WHERE registration_code = ? OR nik_nisn = ? LIMIT 1`,
          [queryCode, queryCode]
        );
        if (rows && rows.length > 0) {
          return res.json({
            status: 'success',
            code: 200,
            message: 'Data pendaftaran ditemukan',
            data: mapPPDBFromDb(rows[0])
          });
        } else {
          return res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Data pendaftaran tidak ditemukan'
          });
        }
      } else {
        const [rows]: any = await dbPool.query(`SELECT * FROM pendaftar_ppdb ORDER BY created_at DESC`);
        return res.json({
          status: 'success',
          code: 200,
          data: rows.map(mapPPDBFromDb)
        });
      }
    } catch (err: any) {
      console.error('[MySQL GET PPDB Error]:', err.message);
    }
  }

  if (queryCode) {
    const found = registrationsStore.find(
      (r) => r.registrationCode === queryCode || r.nikNisn === queryCode
    );
    if (found) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Data pendaftaran ditemukan',
        data: found
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }
  }
  return res.json({
    status: 'success',
    code: 200,
    data: registrationsStore
  });
});

app.post(['/api/ppdb', '/backend/api/ppdb.php'], async (req, res) => {
  const input = req.body;
  if (!input.fullName || !input.nikNisn) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Nama Lengkap dan NIK/NISN wajib diisi'
    });
  }

  const trimmedNik = String(input.nikNisn).trim();

  if (isDbConnected && dbPool) {
    try {
      const [existing]: any = await dbPool.query(
        `SELECT * FROM pendaftar_ppdb WHERE nik_nisn = ? LIMIT 1`,
        [trimmedNik]
      );
      if (existing && existing.length > 0) {
        return res.status(409).json({
          status: 'error',
          code: 409,
          message: `NISN ${input.nikNisn} sudah terdaftar atas nama ${existing[0].full_name}`,
          data: mapPPDBFromDb(existing[0])
        });
      }

      const generatedCode = `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newId = String(Date.now());
      const regDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const statusVal = input.status || 'Tergrafis (Pending Verification)';

      await dbPool.query(
        `INSERT INTO pendaftar_ppdb (id, registration_code, full_name, nik_nisn, birth_place_date, gender, address, origin_school, phone_whatsapp, parent_name, parent_phone, first_choice_major, second_choice_major, registration_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId,
          generatedCode,
          input.fullName,
          trimmedNik,
          input.birthPlaceDate || null,
          input.gender || null,
          input.address || null,
          input.originSchool || null,
          input.phoneWhatsapp || null,
          input.parentName || null,
          input.parentPhone || null,
          input.firstChoiceMajor || null,
          input.secondChoiceMajor || null,
          regDate,
          statusVal
        ]
      );

      const newRecord = {
        ...input,
        id: newId,
        registrationCode: generatedCode,
        registrationDate: regDate,
        status: statusVal
      };

      return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Pendaftaran PPDB berhasil disimpan di MySQL!',
        data: newRecord
      });
    } catch (err: any) {
      console.error('[MySQL POST PPDB Error]:', err.message);
    }
  }

  // Check duplicate NISN in memory store
  const existing = registrationsStore.find(
    (r) => r.nikNisn === trimmedNik
  );
  if (existing) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: `NISN ${input.nikNisn} sudah terdaftar atas nama ${existing.fullName}`,
      data: existing
    });
  }

  const generatedCode = `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRecord = {
    ...input,
    id: String(Date.now()),
    registrationCode: generatedCode,
    registrationDate: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    status: 'Tergrafis (Pending Verification)'
  };

  registrationsStore.unshift(newRecord);

  return res.status(201).json({
    status: 'success',
    code: 201,
    message: 'Pendaftaran PPDB berhasil disimpan!',
    data: newRecord
  });
});

// Contact Message API Endpoint (MySQL CRUD + Fallback)
app.post(['/api/pesan', '/backend/api/pesan.php'], submitLimiter, async (req, res) => {
  const body = req.body || {};
  const messageText = String(body.pesan || body.message || '');
  const senderName = String(body.nama || body.name || '');

  const toxicCheck = containsToxicWordsServer(`${senderName} ${messageText}`);
  if (toxicCheck.isToxic) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: `Pesan Anda tidak terkirim karena mengandung kata yang tidak sopan. Harap gunakan bahasa yang baik dan santun.`,
      code_string: 'TOXIC_CONTENT_DETECTED'
    });
  }

  const newId = String(Date.now());
  const createdAt = new Date().toLocaleString('id-ID');

  if (isDbConnected && dbPool) {
    try {
      await dbPool.query(
        `INSERT INTO pesan_kontak (id, nama, email, telepon, subjek, pesan, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newId, senderName, body.email || null, body.telepon || body.whatsapp || null, body.subjek || null, messageText, createdAt]
      );
      return res.json({
        status: 'success',
        code: 200,
        message: 'Pesan Anda telah berhasil terkirim dan tersimpan di database MySQL!'
      });
    } catch (err: any) {
      console.error('[MySQL POST Pesan Error]:', err.message);
    }
  }

  const msg = {
    id: newId,
    ...req.body,
    createdAt
  };
  messagesStore.unshift(msg);
  res.json({
    status: 'success',
    code: 200,
    message: 'Pesan Anda telah berhasil terkirim ke panitia sekolah!'
  });
});

app.get(['/api/pesan', '/backend/api/pesan.php'], async (req, res) => {
  if (isDbConnected && dbPool) {
    try {
      const [rows]: any = await dbPool.query(`SELECT * FROM pesan_kontak ORDER BY timestamp DESC`);
      return res.json({
        status: 'success',
        code: 200,
        data: rows.map(mapPesanFromDb)
      });
    } catch (err: any) {
      console.error('[MySQL GET Pesan Error]:', err.message);
    }
  }
  res.json({
    status: 'success',
    code: 200,
    data: messagesStore
  });
});

async function startServer() {
  await initDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
