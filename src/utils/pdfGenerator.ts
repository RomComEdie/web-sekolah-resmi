import { jsPDF } from 'jspdf';
import { RegistrationData } from '../types';
import { SCHOOL_INFO } from '../data/schoolData';

export function generateRegistrationPDF(data: RegistrationData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Box / Kop Surat
  doc.setFillColor(230, 238, 248); // Neumorphic light soft background
  doc.rect(10, 10, pageWidth - 20, 32, 'F');

  // School Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138); // Deep Blue
  doc.text('PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(SCHOOL_INFO.nama.toUpperCase(), pageWidth / 2, 25, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${SCHOOL_INFO.alamat} | Telp: ${SCHOOL_INFO.telepon}`, pageWidth / 2, 31, { align: 'center' });
  doc.text(`Website: ${SCHOOL_INFO.email} | NPSN: ${SCHOOL_INFO.npsn}`, pageWidth / 2, 36, { align: 'center' });

  // Divider Line
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  doc.line(10, 44, pageWidth - 10, 44);
  doc.setLineWidth(0.3);
  doc.line(10, 45.5, pageWidth - 10, 45.5);

  // Title: Kartu Pendaftaran
  doc.setFillColor(37, 99, 235);
  doc.rect(10, 50, pageWidth - 20, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('BUKTI TANDA TERIMA PENDAFTARAN SISWA BARU (PPDB 2026/2027)', pageWidth / 2, 56.5, { align: 'center' });

  // Registration ID Box
  let y = 67;
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 12, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, y, pageWidth - 20, 12, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`NO. REGISTRASI: ${data.id}`, 15, y + 8);
  
  const statusStr = 'STATUS: TERVERIFIKASI & TERDAFTAR';
  doc.setTextColor(16, 185, 129); // Green
  doc.text(statusStr, pageWidth - 15, y + 8, { align: 'right' });

  y += 18;

  // Helper function for rows
  const addSectionTitle = (title: string) => {
    doc.setFillColor(224, 231, 255);
    doc.rect(10, y, pageWidth - 20, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text(title, 14, y + 5);
    y += 10;
  };

  const addDataRow = (label: string, value: string, isBold = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 15, y);

    doc.text(':', 65, y);

    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42);
    
    // Wrap long strings if needed
    const splitVal = doc.splitTextToSize(value || '-', pageWidth - 75);
    doc.text(splitVal, 68, y);

    y += splitVal.length * 6;
  };

  // 1. DATA CALON SISWA
  addSectionTitle('I. DATA CALON PESERTA DIDIK');
  addDataRow('NISN (Nomor Unik)', data.nisn, true);
  addDataRow('Nama Lengkap', data.namaLengkap, true);
  addDataRow('Jenis Kelamin', data.jenisKelamin);
  addDataRow('Tempat, Tanggal Lahir', `${data.tempatLahir}, ${data.tanggalLahir}`);
  addDataRow('Nomor HP / WhatsApp', data.noHp);
  addDataRow('Alamat Lengkap', data.alamat);

  const jurusanFullName = 
    data.jurusan === 'RPL' ? 'Rekayasa Perangkat Lunak (RPL)' :
    data.jurusan === 'AKL' ? 'Akuntansi & Keuangan Lembaga (AKL)' :
    'Teknik Sepeda Motor (TSM)';

  addDataRow('Pilihan Jurusan', jurusanFullName, true);

  y += 3;

  // 2. DATA ASAL SEKOLAH
  addSectionTitle('II. DATA ASAL SEKOLAH');
  addDataRow('Nama Sekolah Asal', data.asalSekolah, true);
  addDataRow('Tahun Lulus', data.tahunLulus);

  y += 3;

  // 3. DATA ORANG TUA / WALI
  addSectionTitle('III. DATA ORANG TUA / WALI');
  addDataRow('Nama Orang Tua / Wali', data.namaOrangTua, true);
  addDataRow('No. HP / WA Orang Tua', data.noHpOrangTua);
  addDataRow('Pekerjaan Orang Tua', data.pekerjaanOrangTua);

  y += 5;

  // Catatan Persyaratan Ulang Box
  doc.setFillColor(254, 243, 199); // Soft Yellow
  doc.rect(10, y, pageWidth - 20, 22, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.rect(10, y, pageWidth - 20, 22, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('PETUNJUK DAFTAR ULANG & PERSYARATAN BERKAS:', 14, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  doc.text('1. Cetak lembar Bukti Pendaftaran ini dan bawa saat verifikasi berkas di Sekretariat PPDB SMK Prestasi Nusantara.', 14, y + 10);
  doc.text('2. Melampirkan Fotokopi Ijazah/SKL SMP (2 lembar), Kartu Keluarga, Akta Kelahiran, Pasfoto 3x4 (3 lembar).', 14, y + 14);
  doc.text('3. Jadwal verifikasi berkas: Senin - Sabtu (08.00 - 14.00 WIB) paling lambat 7 hari kerja setelah pendaftaran.', 14, y + 18);

  y += 28;

  // Signature Block
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  doc.text(`Jakarta, ${dateStr}`, pageWidth - 25, y, { align: 'right' });
  
  doc.text('Calon Peserta Didik,', 25, y + 6);
  doc.text('Panitia PPDB,', pageWidth - 25, y + 6, { align: 'right' });

  y += 24;

  doc.setFont('helvetica', 'bold');
  doc.text(`( ${data.namaLengkap} )`, 25, y);
  doc.text('( Panitia PPDB SMK Prestasi )', pageWidth - 25, y, { align: 'right' });

  // Footer stamp note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Dicetak secara otomatis oleh Sistem PPDB SMK Prestasi Nusantara pada ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 287, { align: 'center' });

  // Save the PDF
  const filename = `Bukti_PPDB_${data.nisn}_${data.namaLengkap.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
