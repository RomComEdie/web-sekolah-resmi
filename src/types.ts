export interface RegistrationForm {
  nisn: string;
  namaLengkap: string;
  jenisKelamin: 'Laki-Laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  noHp: string;
  alamat: string;
  jurusan: 'RPL' | 'AKL' | 'TSM';
  asalSekolah: string;
  tahunLulus: string;
  namaOrangTua: string;
  noHpOrangTua: string;
  pekerjaanOrangTua: string;
}

export interface RegistrationData extends RegistrationForm {
  id: string;
  createdAt: string;
  updatedAt?: string;
  statusPendaftaran?: 'Terverifikasi' | 'Menunggu' | 'Ditolak';
}

export interface Teacher {
  id: string;
  nama: string;
  gelar: string;
  jabatan: string;
  mataPelajaran: string;
  foto: string;
  motto: string;
  kualifikasi: string;
}

export interface Major {
  id: 'RPL' | 'AKL' | 'TSM';
  namaJurusan: string;
  singkatan: string;
  slogan: string;
  deskripsi: string;
  keahlianUtama: string[];
  prospekKerja: string[];
  fasilitasLab: string[];
  ikonName: string;
  bgGradien: string;
  akreditasi: string;
  kuota: number;
}

export interface SchoolStat {
  label: string;
  nilai: string;
  deskripsi: string;
  iconName: string;
}
