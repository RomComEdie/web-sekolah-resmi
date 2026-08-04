import { Teacher, MajorInfo, LearningSubject, Extracurricular, SchoolFacility, FAQItem } from '../types';

export const SCHOOL_INFO = {
  name: 'SMK Bhinneka Nusantara',
  tagline: 'Unggul, Berkarakter, Terampil & Siap Kerja',
  npsn: '20256891',
  accreditation: 'A (Unggul)',
  address: 'Jl. Kemang Pulo No.63, RT.005/RW.009, Jatibening Baru, Kec. Pd. Gede, Kota Bks, Jawa Barat 17421',
  phone: '(022) 7890-4321',
  whatsapp: '0812-3456-7890',
  email: 'info@smkbhinnekanusantara.sch.id',
  ppdbEmail: 'ppdb@smkbhinnekanusantara.sch.id',
  operationalHours: 'Senin - Jumat: 07.00 - 15.30 WIB',
  vision: 'Menjadi Sekolah Menengah Kejuruan unggulan yang menghasilkan lulusan berkarakter mulia, menguasai teknologi modern, dan siap bersaing di era industri 4.0.',
  missions: [
    'Menyelenggarakan pembelajaran berbasis kompetensi dan teknologi terkini sesuai standar DUDI (Dunia Usaha & Dunia Industri).',
    'Membentuk kepribadian siswa yang beriman, bertakwa, berbudi pekerti luhur, serta berkebinekaan global.',
    'Menjalin kemitraan strategis dengan perusahaan multinasional untuk penyaluran kerja dan magang industri.',
    'Mengembangkan jiwa kewirausahaan (entrepreneurship) berbasis digital dan keterampilan praktis.'
  ],
  stats: {
    studentsCount: 1280,
    teachersCount: 54,
    majorCount: 3,
    partnerCompanies: 48,
    employmentRate: '96.4%'
  },
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.9603251189783!2d106.93140377356049!3d-6.268948393719738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d701018c34d%3A0x25cf57d09e074361!2sSMK%20BINUS!5e0!3m2!1sen!2sid!4v1785116196230!5m2!1sen!2sid'
};

export const MAJORS_DATA: MajorInfo[] = [
  {
    id: 'rpl',
    code: 'RPL',
    title: 'Rekayasa Perangkat Lunak',
    fullName: 'Program Keahlian Rekayasa Perangkat Lunak (Software Engineering)',
    shortDesc: 'Pengembangan Aplikasi Web, Mobile, Cloud, dan AI dengan standar teknologi industri modern.',
    description: 'Jurusan Rekayasa Perangkat Lunak (RPL) mendidik siswa menjadi Software Engineer modern, Web Developer, Mobile App Developer, dan Full-Stack Specialist. Siswa dibekali logika pemrograman, basis data, UI/UX design, hingga pengembangan AI sederhana dan cloud deployment.',
    iconName: 'Code',
    headOfDepartment: 'Hendra Wijaya, M.Kom.',
    studentCount: 420,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    competencies: [
      'Pemrograman Web Frontend & Backend (React, Node.js, PHP/Laravel)',
      'Pengembangan Aplikasi Mobile (Flutter & Android Studio)',
      'Manajemen Basis Data SQL & NoSQL (PostgreSQL, MySQL, Firebase)',
      'UI/UX Design, Wireframing & Prototyping (Figma)',
      'Version Control Git & GitHub Workflow',
      'Pengujian Perangkat Lunak & API Integration'
    ],
    careerProspects: [
      'Full-Stack / Frontend / Backend Web Developer',
      'Android & iOS Application Developer',
      'UI/UX Designer & Product Designer',
      'Database Administrator & Cloud Technician',
      'IT Support & Software Quality Assurance (QA)',
      'Tech Entrepreneur / Software Freelancer'
    ],
    softwareOrTools: ['VS Code', 'React & Next.js', 'Node.js & Express', 'Laravel', 'Figma', 'Git/GitHub', 'Postman'],
    labFacilities: [
      'Lab Komputer RPL High-Spec (Processor Core i7, RAM 16GB, SSD NVMe)',
      'Lab Server & Cloud Sandbox',
      'Ruang Design UI/UX dengan Dual Monitor',
      'Akses Wi-Fi Dedicated Fiber Optic 500 Mbps'
    ]
  },
  {
    id: 'akl',
    code: 'AKL',
    title: 'Akuntansi & Keuangan Lembaga / Perbankan',
    fullName: 'Program Keahlian Akuntansi, Perbankan & Keuangan Lembaga',
    shortDesc: 'Pengelolaan Keuangan Digital, Perbankan Syariah/Konvensional, dan Sistem Perpajakan Modern.',
    description: 'Jurusan Akuntansi dan Keuangan Lembaga (AKL / Perbankan) mempersiapkan tenaga profesional di bidang administrasi keuangan, analisis akuntansi digital, perbankan, dan perpajakan. Siswa langsung mempraktikkan transaksi di Bank Mini Sekolah.',
    iconName: 'Landmark',
    headOfDepartment: 'Siti Aminah, S.E., M.Ak.',
    studentCount: 390,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    competencies: [
      'Akuntansi Keuangan Perusahaan Jasa, Dagang & Manufaktur',
      'Aplikasi Akuntansi Komputer (MYOB, Accurate, Spreadsheet Advanced)',
      'Layanan Operasional Perbankan & Teller Bank Mini',
      'Pengelolaan Perpajakan (e-SPT & PPh/PPN)',
      'Analisis Laporan Keuangan & Audit Dasar',
      'Digital Banking & Literasi Keuangan Fintech'
    ],
    careerProspects: [
      'Staf Akuntansi & Keuangan Perusahaan',
      'Teller & Customer Service Bank',
      'Staf Perpajakan (Tax Accounting Officer)',
      'Internal Auditor & Bookkeeper',
      'Kasir & Staff Payroll',
      'Wirausaha / Konsultan Keuangan Usaha Mikro'
    ],
    softwareOrTools: ['Accurate Online', 'MYOB Accounting', 'Microsoft Excel Advanced', 'e-Faktur & e-SPT Tax', 'Bank Mini Core System'],
    labFacilities: [
      'Lab Bank Mini Terintegrasi (Simulasi Kasir & Teller)',
      'Lab Komputer Akuntansi Digital dengan Software Lisensi Resmi',
      'Mesin Hitung Uang & Printer Slip Transaksi Otomatis',
      'Ruang Arsip Laporan Keuangan'
    ]
  },
  {
    id: 'tsm',
    code: 'TSM',
    title: 'Teknik Sepeda Motor',
    fullName: 'Program Keahlian Teknik Sepeda Motor (Motorcycle Engineering)',
    shortDesc: 'Perawatan, Perbaikan Sistem Injeksi PGM-FI, Kelistrikan, dan Teknologi Otomotif Terbaru.',
    description: 'Jurusan Teknik Sepeda Motor (TSM) membekali siswa dengan keahlian teknik mekanik sepeda motor standar pabrikan resmi. Meliputi perawatan berkala, perbaikan mesin (overhaul), diagnosis sistem injeksi PGM-FI / EFI, hingga perawatan motor listrik (EV).',
    iconName: 'Wrench',
    headOfDepartment: 'Budi Santoso, S.T.',
    studentCount: 470,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    competencies: [
      'Perawatan & Perbaikan Mesin Sepeda Motor (Engine Tune-Up & Overhaul)',
      'Diagnosis & Troubleshooting Sistem Injeksi (EFI / PGM-FI Scanner)',
      'Sistem Kelistrikan, Pengapian & Starter Elektronik',
      'Perbaikan Chassis, Sistem Rem ABS, dan Suspensi',
      'Pengenalan Komponen Motor Listrik (Electric Vehicle)',
      'Manajemen Bengkel & Layanan Service Advisor'
    ],
    careerProspects: [
      'Mekanik / Teknisi Bengkel Resmi (Honda, Yamaha, Suzuki, dll)',
      'Service Advisor & Quality Inspector Otomotif',
      'Teknisi Perakitan Industri Otomotif (Plant Assembler)',
      'Pemilik Bengkel Mandiri (Wirausaha Otomotif)',
      'Teknisi Motor Listrik & Conversion Specialist',
      'Partman & Consultant Sparepart Otomotif'
    ],
    softwareOrTools: ['Diagnostic Scanner Tools', 'Engine Analyzer', 'Multitester Digital', 'Chassis Alignment Tool', 'Software Manual Repair Service'],
    labFacilities: [
      'Bengkel Standar Bengkel Resmi Honda/Yamaha (Teaching Factory)',
      'Pit Service & Hydraulic Bike Lift',
      'Komputer Diagnostic Scanner EFI PGM-FI',
      'Unit Motor Latihan Injeksi & Motor Listrik Terbaru'
    ]
  }
];

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 't1',
    name: 'Drs. H. Ahmad Fauzi, M.Pd.',
    role: 'Kepala Sekolah',
    department: 'Pimpinan',
    subject: 'Manajemen Pendidikan & Kepemimpinan',
    education: 'S2 Manajemen Pendidikan - Universitas Pendidikan Indonesia',
    nip: '19680312 199403 1 002',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    bio: 'Berpengalaman lebih dari 25 tahun dalam memajukan kualitas vokasi sekolah kejuruan, mendorong kolaborasi industri nasional.',
    quote: 'Pendidikan vokasi adalah kunci mencetak generasi terampil yang langsung berdampak bagi bangsa.'
  },
  {
    id: 't2',
    name: 'Dra. Ratna Dewi, M.M.',
    role: 'Wakil Kepala Sekolah Bidang Kurikulum',
    department: 'Pimpinan',
    subject: 'Kurikulum Merdeka & Vokasi',
    education: 'S2 Magister Manajemen - Universitas Padjadjaran',
    nip: '19720518 199802 2 001',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Merancang kurikulum pembelajaran berbasis Teaching Factory dan penyelarasan kompetensi DUDI.',
    quote: 'Kurikulum fleksibel dan adaptif menghasilkan lulusan yang siap menghadapi perubahan zaman.'
  },
  {
    id: 't3',
    name: 'Hendra Wijaya, M.Kom.',
    role: 'Kepala Program Keahlian RPL',
    department: 'RPL',
    subject: 'Pemrograman Web & Mobile',
    education: 'S2 Ilmu Komputer - Institut Teknologi Bandung',
    nip: '19850924 201001 1 012',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Praktisi IT dan Lead Software Developer yang membimbing tim lomba LKS RPL hingga tingkat Nasional.',
    quote: 'Coding bukan sekadar menulis perintah, tetapi tentang memecahkan masalah nyata masyarakat.'
  },
  {
    id: 't4',
    name: 'Rian Pratama, S.Kom.',
    role: 'Guru Produktif RPL',
    department: 'RPL',
    subject: 'Basis Data & Backend Development',
    education: 'S1 Teknik Informatika - Telkom University',
    nip: '19910411 201903 1 008',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Spesialis Laravel & React, pengampu mata pelajaran basis data dan arsitektur API.',
    quote: 'Struktur data yang rapi adalah fondasi utama sistem aplikasi yang kuat.'
  },
  {
    id: 't5',
    name: 'Siti Aminah, S.E., M.Ak.',
    role: 'Kepala Program Keahlian AKL',
    department: 'AKL',
    subject: 'Akuntansi Keuangan & Perbankan',
    education: 'S2 Akuntansi - Universitas Airlangga',
    nip: '19821105 200801 2 015',
    photoUrl: 'https://images.unsplash.com/photo-1580894732413-a70d8a83492a?auto=format&fit=crop&q=80&w=400',
    bio: 'Pengelola Bank Mini Sekolah dan pembina program sertifikasi Akuntansi Komputer.',
    quote: 'Ketelitian dan kejujuran adalah dua mahkota dalam dunia akuntansi dan keuangan.'
  },
  {
    id: 't6',
    name: 'Novi Rahmawati, S.E.',
    role: 'Guru Produktif AKL',
    department: 'AKL',
    subject: 'Komputer Akuntansi (MYOB/Accurate) & Perpajakan',
    education: 'S1 Pendidikan Akuntansi - UPI',
    nip: '19890815 201502 2 006',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    bio: 'Spesialis aplikasi perpajakan e-SPT dan Accurate Online, mengajar praktik akuntansi digital.',
    quote: 'Akuntansi digital mempermudah analisis bisnis modern dengan akurasi tinggi.'
  },
  {
    id: 't7',
    name: 'Budi Santoso, S.T.',
    role: 'Kepala Program Keahlian TSM',
    department: 'TSM',
    subject: 'Teknik Injeksi & Kelistrikan Otomotif',
    education: 'S1 Teknik Mesin - Universitas Negeri Yogyakarta',
    nip: '19810120 200604 1 009',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Instruktur bersertifikasi industri otomotif resmi Honda & Yamaha, koordinator Teaching Factory TSM.',
    quote: 'Presisi tinggi dalam diagnosis adalah rahasia teknisi otomotif profesional.'
  },
  {
    id: 't8',
    name: 'Agus Gunawan, A.Md.T.',
    role: 'Guru Produktif TSM & Kepala Bengkel',
    department: 'TSM',
    subject: 'Pemeliharaan Mesin Sepeda Motor',
    education: 'D3 Teknik Otomotif - Politeknik Negeri Bandung',
    nip: '19880630 201801 1 004',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'Ahli tune-up dan overhaul mesin sepeda motor dengan pengalaman 10+ tahun di bengkel industri.',
    quote: 'Disiplin K3 dan alat uji yang tepat menjamin keamanan serta performa mesin.'
  },
  {
    id: 't9',
    name: 'Maya Kartika, S.Pd.',
    role: 'Guru Bahasa Inggris & Coordinator English Club',
    department: 'Umum',
    subject: 'Bahasa Inggris Industri & TOEIC',
    education: 'S1 Pendidikan Bahasa Inggris - UNPAD',
    nip: '19930214 202012 2 011',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    bio: 'Pengajar Bahasa Inggris berfokus pada komunikasi bisnis dan persiapan sertifikasi TOEIC lulusan.',
    quote: 'English is not just a language, it is your bridge to global opportunities.'
  },
  {
    id: 't10',
    name: 'Rahmat Hidayat, S.Pd.I.',
    role: 'Guru Pendidikan Agama & Pembina Kerohanian',
    department: 'Umum',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    education: 'S1 Pendidikan Agama Islam - UIN',
    nip: '19870707 201201 1 003',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'Membina akhlak mulia, kegiatan keagamaan sekolah, serta program ekstrakulikuler keagamaan.',
    quote: 'Kecerdasan tanpa integritas moral adalah kehampaan.'
  }
];

export const LEARNING_SUBJECTS: LearningSubject[] = [
  // RPL (Rekayasa Perangkat Lunak)
  {
    id: 'rpl-x',
    code: 'RPL-X',
    name: 'Pembelajaran RPL - Kelas X',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas X',
    major: 'RPL',
    weeklyHours: 12,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    description: 'Dasar-dasar logika algoritma pemrograman, pemrograman berbasis teks (Python/C++), pengenalan struktur data, dan dasar web HTML5/CSS3.',
    syllabusHighlights: ['Logika & Algoritma Pemrograman', 'Pemrograman Berbasis Teks (C++/Python)', 'Dasar Web Development (HTML, CSS, JS)', 'Dasar Sistem Basis Data SQL']
  },
  {
    id: 'rpl-xi',
    code: 'RPL-XI',
    name: 'Pembelajaran RPL - Kelas XI',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas XI',
    major: 'RPL',
    weeklyHours: 18,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600',
    description: 'Pengembangan aplikasi web modern (React/Tailwind), aplikasi mobile cross-platform (Flutter), perancangan ERD, dan integrasi API RESTful.',
    syllabusHighlights: ['Pemrograman Web Modern (React & Node.js)', 'Pemrograman Mobile (Flutter Cross-Platform)', 'Perancangan ERD & Query SQL/NoSQL', 'Object Oriented Programming (OOP)']
  },
  {
    id: 'rpl-xii',
    code: 'RPL-XII',
    name: 'Pembelajaran RPL - Kelas XII',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas XII',
    major: 'RPL',
    weeklyHours: 20,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    description: 'Pengembangan Produk Kreatif Software, deployment Cloud Infrastructure & DevOps, Praktik Kerja Lapangan (PKL), serta Persiapan UKK Vokasi.',
    syllabusHighlights: ['Proyek Softwaredan Portfolio Industri', 'Cloud Server & RESTful API Deployment', 'Produk Kreatif & Kewirausahaan (PKK)', 'Uji Kompetensi Keahlian (UKK) RPL']
  },

  // AKL (Akuntansi & Keuangan Lembaga)
  {
    id: 'akl-x',
    code: 'AKL-X',
    name: 'Pembelajaran AKL - Kelas X',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas X',
    major: 'AKL',
    weeklyHours: 12,
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=600',
    description: 'Dasar-dasar akuntansi perusahaan jasa dan dagang, penggunaan spreadsheet bisnis (Excel), etika profesi keuangan, dan dasar administrasi.',
    syllabusHighlights: ['Persamaan Dasar & Siklus Akuntansi', 'Aplikasi Spreadsheet Bisnis (Ms. Excel)', 'Etika Profesi & Komunikasi Bisnis', 'Dasar-Dasar Administrasi Keuangan']
  },
  {
    id: 'akl-xi',
    code: 'AKL-XI',
    name: 'Pembelajaran AKL - Kelas XI',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas XI',
    major: 'AKL',
    weeklyHours: 18,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    description: 'Pengoperasian Komputer Akuntansi terstandar industri (MYOB & Accurate Online), akuntansi keuangan manufaktur, serta administrasi perpajakan.',
    syllabusHighlights: ['Komputer Akuntansi (MYOB & Accurate)', 'Akuntansi Keuangan Perusahaan Manufaktur', 'Administrasi Perpajakan (PPh & PPN)', 'Pengelolaan Kas Kecil & Rekonsiliasi Bank']
  },
  {
    id: 'akl-xii',
    code: 'AKL-XII',
    name: 'Pembelajaran AKL - Kelas XII',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas XII',
    major: 'AKL',
    weeklyHours: 20,
    image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=600',
    description: 'Praktik operasional Bank Mini & Teller, e-SPT Perpajakan digital, analisis laporan keuangan, Praktik Kerja Lapangan, serta UKK Akuntansi.',
    syllabusHighlights: ['Simulasi Layanan Bank Mini & Teller', 'Pelaporan Perpajakan Digital (e-SPT)', 'Analisis Laporan Keuangan & Audit', 'Uji Kompetensi Keahlian (UKK) AKL']
  },

  // TSM (Teknik Sepeda Motor)
  {
    id: 'tsm-x',
    code: 'TSM-X',
    name: 'Pembelajaran TSM - Kelas X',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas X',
    major: 'TSM',
    weeklyHours: 12,
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=600',
    description: 'Dasar teknik otomotif, penggunaan alat ukur presisi (micrometer/dial gauge), keselamatan kerja (K3LH), serta dasar kelistrikan & chassis.',
    syllabusHighlights: ['Dasar Teknik Otomotif & Alat Ukur Presisi', 'Keselamatan Kerja Bengkel (K3LH)', 'Dasar Kelistrikan & Sistem Pengapian', 'Pengenalan Komponen Engine 2-Tak/4-Tak']
  },
  {
    id: 'tsm-xi',
    code: 'TSM-XI',
    name: 'Pembelajaran TSM - Kelas XI',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas XI',
    major: 'TSM',
    weeklyHours: 18,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
    description: 'Pemeliharaan dan perbaikan mesin sepeda motor (engine overhaul), perbaikan sistem transmisi otomatis CVT, chassis, dan rem ABS.',
    syllabusHighlights: ['Pemeliharaan Mesin & Head Cylinder Overhaul', 'Sistem Transmisi Otomatis CVT & Manual', 'Perbaikan Chassis, Suspensi & Rem ABS', 'Perbaikan Kelistrikan Body & Starter']
  },
  {
    id: 'tsm-xii',
    code: 'TSM-XII',
    name: 'Pembelajaran TSM - Kelas XII',
    category: 'Muatan Kejuruan (Produktif)',
    grade: 'Kelas XII',
    major: 'TSM',
    weeklyHours: 20,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    description: 'Diagnosis sistem injeksi PGM-FI/EFI dengan Scanner Tool modern, teknologi motor listrik (EV), Teaching Factory, serta UKK Otomotif.',
    syllabusHighlights: ['Diagnosis Injeksi PGM-FI (EFI Diagnostic Tools)', 'Pengenalan & Perawatan Motor Listrik (EV)', 'Manajemen Bengkel & Service Advisor', 'Uji Kompetensi Keahlian (UKK) TSM']
  }
];

export const EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 'e1',
    name: 'Nusa Coding Club (RPL)',
    category: 'Akademik & Teknologi',
    schedule: 'Rabu & Jumat (15.30 - 17.30 WIB)',
    supervisor: 'Hendra Wijaya, M.Kom.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
    description: 'Wadah komunitasi pengembang muda untuk belajar algoritma kompetitif, ikutan Hackathon, dan membuat website/app sekolah.',
    achievements: ['Juara 1 LKS Web Technologies Jawa Barat 2025', 'Juara 2 Hackathon Pelajar Nasional 2024'],
    icon: 'Code2'
  },
  {
    id: 'e2',
    name: 'Bank Mini & Tax Club (AKL)',
    category: 'Akademik & Teknologi',
    schedule: 'Selasa & Kamis (15.30 - 17.00 WIB)',
    supervisor: 'Siti Aminah, S.E., M.Ak.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    description: 'Klub operasional transaksi keuangan, edukasi perbankan siswa, dan riset literasi investasi usia muda.',
    achievements: ['Penghargaan Bank Mini Sekolah Teraktif Se-Kota Sejahtera', 'Juara 1 Olimpiade Akuntansi Vokasi 2025'],
    icon: 'Building2'
  },
  {
    id: 'e3',
    name: 'Otomotif & Racing Workshop (TSM)',
    category: 'Akademik & Teknologi',
    schedule: 'Senin & Sabtu (15.30 - 18.00 WIB)',
    supervisor: 'Budi Santoso, S.T.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
    description: 'Komunitas oprek motor injeksi, perawatan motor guru & karyawan, serta riset modifikasi ramah lingkungan.',
    achievements: ['Juara 2 Kontes Mekanik Siswa Honda 2025', 'Pemenang Modifikasi Safety Riding 2024'],
    icon: 'Cog'
  },
  {
    id: 'e4',
    name: 'Pramuka Ambalan Bhinneka Nusantara',
    category: 'Kepemimpinan',
    schedule: 'Jumat (13.30 - 16.00 WIB)',
    supervisor: 'Rahmat Hidayat, S.Pd.I.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600',
    description: 'Ekstrakurikuler wajib pembentuk karakter kedisiplinan, kemandirian, navigasi, dan kepemimpinan siswa.',
    achievements: ['Juara Umum Raimuna Cabang Kota 2024', 'Regu Tergiat Lomba LCTP Pramuka 2025'],
    icon: 'Compass'
  },
  {
    id: 'e5',
    name: 'Futsal & Basketball Team',
    category: 'Olahraga',
    schedule: 'Selasa & Sabtu (16.00 - 18.00 WIB)',
    supervisor: 'Agus Gunawan, A.Md.T.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600',
    description: 'Latihan rutin olahraga kebugaran dan pembinaan atlet muda untuk kejuaraan antar sekolah.',
    achievements: ['Juara 1 Turnamen Futsal Pelajar SMK 2025', 'Runner Up Liga Basket Vokasi 2024'],
    icon: 'Trophy'
  },
  {
    id: 'e6',
    name: 'English Debating & Public Speaking',
    category: 'Akademik & Teknologi',
    schedule: 'Senin & Kamis (15.30 - 17.00 WIB)',
    supervisor: 'Maya Kartika, S.Pd.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
    description: 'Klub mengasah kemampuan bicara bahasa Inggris, debat isu global, dan persiapan lomba speech.',
    achievements: ['Juara 2 National English Debate Student League 2025'],
    icon: 'MessageSquare'
  }
];

export const SCHOOL_FACILITIES: SchoolFacility[] = [
  {
    id: 'f1',
    title: 'Lab Komputer RPL High Performance',
    description: '60 Unit PC High-Spec Core i7, RAM 16GB, Dual Display Monitor, dan Akses Internet Dedicated 500 Mbps.',
    category: 'Fasilitas Belajar',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'f2',
    title: 'Bank Mini & Laboratorium Keuangan AKL',
    description: 'Laboratorium simulasi transaksi perbankan lengkap dengan mesin teller, printer validasi, dan software Accurate Online.',
    category: 'Fasilitas Belajar',
    image: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'f3',
    title: 'Bengkel TSM Standar Resmi (Teaching Factory)',
    description: 'Bengkel praktik lengkap dengan 8 Pit Service, Hydraulic Bike Lift, Diagnostik Scanner Honda PGM-FI, dan alat ukur presisi.',
    category: 'Fasilitas Belajar',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'f4',
    title: 'Perpustakaan Digital & Learning Center',
    description: 'Koleksi ribuan e-book, jurnal teknik, ruang baca ber-AC yang nyaman, serta stasioner laptop mandiri.',
    category: 'Sarana Umum',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'f5',
    title: 'Lapangan Olahraga Multifungsi',
    description: 'Lapangan serbaguna berkualifikasi standar untuk Basket, Futsal, Voli, serta upacara bendera.',
    category: 'Sarana Olahraga',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'f6',
    title: 'Aulia & Smart Hall Center',
    description: 'Gedung serbaguna berkapasitas 800 orang equipped sound system konser dan videotron LED untuk seminar & wisuda.',
    category: 'Sarana Umum',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Apa saja syarat wajib untuk mendaftar PPDB / MPLS di SMK Bhinneka Nusantara?',
    answer: 'Syarat wajib utama sangat mudah: cukup mengisi Nama Lengkap, Data Diri (NIK/NISN, TTL, Asal Sekolah, Alamat), dan Kontak Aktif (Nomor WA & Email) pada formulir online kami. Setelah mengisi data wajib tersebut, Anda bisa langsung mengunduh Formulir Pendaftaran resmi.',
    category: 'PPDB'
  },
  {
    question: 'Apakah formulir pendaftaran bisa langsung diunduh setelah mengisi data?',
    answer: 'Ya! Sistem kami memiliki fitur instant download formulir pendaftaran berbentuk PDF resmi berstempel dan ber-QR code. Anda dapat menyimpan PDF tersebut atau mencetaknya untuk dibawa saat verifikasi berkas fisik.',
    category: 'PPDB'
  },
  {
    question: 'Bagaimana prospek kelanjutan studi atau kerja bagi lulusan SMK Bhinneka Nusantara?',
    answer: 'SMK Bhinneka Nusantara memiliki kerja sama DUDI dengan 48+ perusahaan nasional dan BUMN. Lulusan kami dapat langsung terserap kerja melalui Bursa Kerja Khusus (BKK), melanjutkan kuliah di PTN/PTS favorit, atau berwirausaha mandiri.',
    category: 'Jurusan'
  },
  {
    question: 'Apakah ada biaya pendaftaran formulir PPDB online?',
    answer: 'Pengisian dan pengunduhan formulir pendaftaran online di SMK Bhinneka Nusantara 100% GRATIS (Tanpa Biaya Registrasi Formulir).',
    category: 'PPDB'
  },
  {
    question: 'Berapa daya tampung siswa untuk jurusan RPL, AKL, dan TSM?',
    answer: 'Daya tampung untuk tahun ajaran baru 2026/2027 adalah: RPL (4 Kelas / 144 Siswa), AKL (3 Kelas / 108 Siswa), TSM (4 Kelas / 144 Siswa). Pendaftaran akan ditutup otomatis jika kuota telah terpenuhi.',
    category: 'PPDB'
  }
];
