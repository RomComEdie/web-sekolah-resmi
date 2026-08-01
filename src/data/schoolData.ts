import { Teacher, Major, SchoolStat } from '../types';

export const SCHOOL_INFO = {
  nama: 'SMK Prestasi Nusantara',
  slogan: 'Mencetak Generasi Unggul, Berkarakter, dan Siap Kerja di Era Digital',
  npsn: '20108892',
  akreditasi: 'A (Unggul)',
  alamat: 'Jl. Pendidikan Raya No. 88, Kencana, Jakarta Selatan',
  telepon: '(021) 7890-1234',
  whatsapp: '0812-9988-7766',
  email: 'info@smkprestasinusantara.sch.id',
  website: 'www.smkprestasinusantara.sch.id',
  jamOperasional: 'Senin - Jumat, 07:00 - 15:30 WIB',
  sambutanKepsek: {
    nama: 'Dr. Hj. Sri Rahayu, M.Pd.',
    jabatan: 'Kepala Sekolah SMK Prestasi Nusantara',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    pesan: 'Selamat datang di SMK Prestasi Nusantara. Kami berkomitmen memberikan pendidikan vokasi berkualitas berbasis teknologi dan karakter mulia. Melalui kurikulum berbasis industri dan kemitraan dengan ratusan DUDI (Dunia Usaha & Dunia Industri), kami memastikan setiap lulusan memiliki kompetensi unggul, keterampilan praktis, serta siap bersaing di dunia kerja maupun kewirausahaan.'
  },
  visi: 'Menjadi Sekolah Menengah Kejuruan unggulan nasional yang menghasilkan lulusan profesional, berakhlak mulia, inovatif, dan berdaya saing global.',
  misi: [
    'Menyelenggarakan pembelajaran vokasi berbasis standar industri terkini.',
    'Meningkatkan kompetensi keahlian peserta didik melalui pembelajaran berbasis praktik unggulan.',
    'Membangun karakter siswa yang religius, disiplin, kreatif, dan berjiwa wirausaha.',
    'Memperluas jaringan kerja sama dengan Dunia Usaha dan Dunia Industri (DUDI).'
  ]
};

export const SCHOOL_STATS: SchoolStat[] = [
  {
    label: 'Total Siswa Aktif',
    nilai: '1.280+',
    deskripsi: 'Siswa terdaftar aktif di 3 program keahlian',
    iconName: 'Users'
  },
  {
    label: 'Program Keahlian',
    nilai: '3 Jurusan',
    deskripsi: 'Rekayasa Perangkat Lunak, Akuntansi, & Otomotif',
    iconName: 'GraduationCap'
  },
  {
    label: 'Mitra Industri (DUDI)',
    nilai: '85+',
    deskripsi: 'Perusahaan mitra tempat Prakerin & rekrutmen kerja',
    iconName: 'Building2'
  },
  {
    label: 'Pengajar Berpengalaman',
    nilai: '45+ Guru',
    deskripsi: 'Tenaga pendidik profesional & praktisi industri',
    iconName: 'Award'
  }
];

export const TEACHERS: Teacher[] = [
  {
    id: 't1',
    nama: 'Dr. Hj. Sri Rahayu',
    gelar: 'M.Pd.',
    jabatan: 'Kepala Sekolah',
    mataPelajaran: 'Manajemen Pendidikan & Kewirausahaan',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    motto: 'Pendidikan vokasi adalah kunci kemandirian bangsa.',
    kualifikasi: 'S3 Manajemen Pendidikan (UNJ)'
  },
  {
    id: 't2',
    nama: 'Rizky Pratama',
    gelar: 'S.Kom., M.T.',
    jabatan: 'Kepala Program Keahlian RPL',
    mataPelajaran: 'Pemrograman Web, Cloud & AI Engineering',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    motto: 'Logic will take you from A to B, coding takes you everywhere.',
    kualifikasi: 'S2 Teknik Informatika (ITB), Certified Fullstack Dev'
  },
  {
    id: 't3',
    nama: 'Siti Rahmawati',
    gelar: 'S.E., M.Ak.',
    jabatan: 'Kepala Program Keahlian AKL',
    mataPelajaran: 'Akuntansi Keuangan & Perbankan Syariah',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    motto: 'Keuangan yang tertata adalah fondasi bisnis yang kokoh.',
    kualifikasi: 'S2 Akuntansi (UI), Certified Public Accountant (CPA)'
  },
  {
    id: 't4',
    nama: 'Ir. Budi Santoso',
    gelar: 'S.T., M.T.',
    jabatan: 'Kepala Program Keahlian TSM',
    mataPelajaran: 'Teknik Injeksi Otomotif & Management Service',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    motto: 'Presisi dan keahlian tangan menghasilkan performa terbaik.',
    kualifikasi: 'S2 Teknik Mesin (ITS), Master Trainer Honda Tech'
  },
  {
    id: 't5',
    nama: 'Maya Indah',
    gelar: 'S.Pd.',
    jabatan: 'Guru & Koordinator Ekstrakurikuler',
    mataPelajaran: 'Bahasa Inggris Industri & TOEIC Prep',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    motto: 'Global language opens unlimited career opportunities.',
    kualifikasi: 'S1 Pendidikan Bahasa Inggris (UNY)'
  }
];

export const MAJORS: Major[] = [
  {
    id: 'RPL',
    namaJurusan: 'Rekayasa Perangkat Lunak',
    singkatan: 'RPL',
    slogan: 'Coding the Future with Modern Technologies & Artificial Intelligence',
    deskripsi: 'Program keahlian yang fokus mempraktekkan pembuatan aplikasi software, web dinamis, mobile apps (Android/iOS), database management, UI/UX design, hingga integrasi Artificial Intelligence (AI) sesuai kebutuhan industri IT global.',
    keahlianUtama: [
      'Web Development (React, PHP Native, Laravel, Node.js)',
      'Mobile App Development (Flutter & React Native)',
      'Database Design (MySQL, PostgreSQL, MongoDB)',
      'UI/UX Design & Prototyping (Figma)',
      'AI & Prompt Engineering Basics'
    ],
    prospekKerja: [
      'Full-Stack Web Developer',
      'Mobile Application Developer',
      'Database Administrator',
      'UI/UX Designer',
      'IT Consultant & Tech Entrepreneur'
    ],
    fasilitasLab: [
      'Lab iMac & PC Core i7 High-Performance',
      'Akses Internet Fiber Optic 1 Gbps Dedicated',
      'Server Lokal & Testing Device (Tablet/Smartphones)',
      'Ruang Innovation Hub & Coworking Space'
    ],
    ikonName: 'Code2',
    bgGradien: 'from-blue-500 to-indigo-600',
    akreditasi: 'A (Unggul)',
    kuota: 108
  },
  {
    id: 'AKL',
    namaJurusan: 'Akuntansi dan Keuangan Lembaga',
    singkatan: 'AKL / Perbankan',
    slogan: 'Precision, Integrity, & Financial Technology Expertise',
    deskripsi: 'Program keahlian yang membekali siswa dengan pemahaman mendalam tentang siklus akuntansi keuangan, pengelolaan kas, administrasi perpajakan, perbankan syariah/konvensional, serta aplikasi akuntansi komputer modern seperti MYOB dan Accurate.',
    keahlianUtama: [
      'Siklus Akuntansi Perusahaan Jasa, Dagang & Manufaktur',
      'Komputer Akuntansi (MYOB & Accurate Accounting)',
      'Administrasi Perpajakan (e-SPT & e-Faktur)',
      'Pengelolaan Kas Bank & Perbankan Syariah',
      'Fintech & Digital Banking Operations'
    ],
    prospekKerja: [
      'Staff Akuntansi & Pembukuan',
      'Teller & Customer Service Bank',
      'Staff Administrasi Pajak',
      'Junior Financial Auditor',
      'Kasir & Staff Payroll'
    ],
    fasilitasLab: [
      'Mini Bank Simulasi Perbankan Syariah & Konvensional',
      'Lab Akuntansi Komputer Terlisensi MYOB & Accurate',
      'Mesin Hitung Uang & Printer Slip Bank',
      'Pusat Literasi Keuangan & Perpajakan'
    ],
    ikonName: 'Calculator',
    bgGradien: 'from-emerald-500 to-teal-600',
    akreditasi: 'A (Unggul)',
    kuota: 108
  },
  {
    id: 'TSM',
    namaJurusan: 'Teknik Sepeda Motor',
    singkatan: 'TSM',
    slogan: 'Mastering Advanced Automotive Engineering & EFI Systems',
    deskripsi: 'Program keahlian otomotif yang berorientasi pada penguasaan teknik perbaikan, pemeliharaan berkala, sistem bahan bakar injeksi (PGM-FI), kelistrikan, sasis, serta manajemen operasional bengkel sepeda motor berstandar industri pabrikan.',
    keahlianUtama: [
      'Sistem Injeksi Bahan Bakar (PGM-FI Diagnostics)',
      'Overhaul Mesin 2-Tak & 4-Tak',
      'Troubleshooting Kelistrikan & Sistem Rem ABS',
      'Analisis Engine Diagnostic Scanner (HDS / OBD-II)',
      'Manajemen Operasional & Layanan Bengkel'
    ],
    prospekKerja: [
      'Mekanik Otomotif Sepeda Motor',
      'Service Advisor Bengkel Resmi (AHASS / Yamaha)',
      'Quality Control Inspector Pabrik Otomotif',
      'Pemilik & Entrepreneur Bengkel Sepeda Motor',
      'Teknisi Injeksi & Modifikasi Otomotif'
    ],
    fasilitasLab: [
      'Bengkel Standar Binaan Pabrikan Honda (AHASS)',
      'Bike Lift Hydraulic & Tool Sets Lengkap',
      'Diagnostic Scanner Fi & Gas Analyzer',
      'Unit Motor Injeksi Terbaru untuk Praktek'
    ],
    ikonName: 'Wrench',
    bgGradien: 'from-amber-500 to-orange-600',
    akreditasi: 'A (Unggul)',
    kuota: 72
  }
];
