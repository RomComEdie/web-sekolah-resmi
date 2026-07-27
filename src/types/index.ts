export interface Teacher {
  id: string;
  name: string;
  role: string; // e.g. Kepala Sekolah, Kaprog RPL, Guru Produktif
  department: 'Pimpinan' | 'RPL' | 'AKL' | 'TSM' | 'Umum';
  subject: string;
  education: string;
  nip: string;
  photoUrl: string;
  bio: string;
  quote?: string;
  contactEmail?: string;
}

export interface MajorInfo {
  id: 'rpl' | 'akl' | 'tsm';
  code: string;
  title: string;
  fullName: string;
  description: string;
  shortDesc: string;
  iconName: string;
  headOfDepartment: string;
  competencies: string[];
  careerProspects: string[];
  softwareOrTools: string[];
  labFacilities: string[];
  studentCount: number;
  image?: string;
}

export interface LearningSubject {
  id: string;
  code: string;
  name: string;
  category: 'Muatan Nasional' | 'Muatan Kejuruan (Produktif)' | 'Muatan Kewilayahan';
  grade: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat';
  major?: 'RPL' | 'AKL' | 'TSM' | 'Semua';
  weeklyHours: number;
  description: string;
  syllabusHighlights: string[];
  image?: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  category: 'Akademik & Teknologi' | 'Olahraga' | 'Seni & Budaya' | 'Kepemimpinan';
  schedule: string;
  supervisor: string;
  description: string;
  achievements: string[];
  icon: string;
  image?: string;
}

export interface RegistrationData {
  id: string;
  registrationCode: string; // e.g. PPDB-2026-1042
  programType: 'MPLS / PPDB Siswa Baru' | 'Siswa Pindahan';
  // Required Name
  fullName: string;
  
  // Personal Data (Data Diri)
  nikNisn: string;
  birthPlaceDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  originSchool: string;
  
  // Contact (Kontak)
  phoneWhatsapp: string;
  email: string;
  parentName: string;
  parentPhone: string;
  
  // Major Selection
  firstChoiceMajor: 'RPL' | 'AKL' | 'TSM';
  secondChoiceMajor: 'RPL' | 'AKL' | 'TSM';
  
  registrationDate: string;
  status: 'Tergrafis (Pending Verification)' | 'Lolos Berkas' | 'Diterima';
}

export interface SchoolFacility {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'PPDB' | 'Jurusan' | 'Fasilitas' | 'Pembelajaran';
}
