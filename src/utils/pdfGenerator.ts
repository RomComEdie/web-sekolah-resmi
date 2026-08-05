import { jsPDF } from 'jspdf';
import { RegistrationData } from '../types';

export const generateRegistrationPDF = (data: RegistrationData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const greenPrimary = [45, 90, 63];  // #2d5a3f
  const greenDark = [27, 56, 40];     // #1b3828
  const goldPrimary = [197, 160, 89]; // #c5a059
  const textDark = [44, 53, 49];

  // Top Accent Banner
  doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.rect(0, 0, 210, 12, 'F');
  
  doc.setFillColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.rect(0, 12, 210, 2, 'F');

  // Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('SMK BHINNEKA NUSANTARA', 105, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Jl. Kemang Pulo No.63, RT.005/RW.009, Jatibening Baru, Kec. Pd. Gede, Kota Bks, Jawa Barat 17421', 105, 29, { align: 'center' });
  doc.text('Telp: (022) 7890-4321 | WhatsApp: 0812-3456-7890 | Email: ppdb@smkbhinnekanusantara.sch.id', 105, 33, { align: 'center' });

  // Divider line
  doc.setDrawColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);
  doc.setLineWidth(0.8);
  doc.line(15, 37, 195, 37);

  // Document Title Badge
  doc.setFillColor(242, 247, 244);
  doc.roundedRect(15, 41, 180, 16, 2, 2, 'FD');
  doc.setDrawColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('FORMULIR PENDAFTARAN RESMI PPDB / MPLS ONLINE', 105, 48, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text(`KODE REGISTRASI: ${data.registrationCode}  |  STATUS: ${data.status.toUpperCase()}`, 105, 53, { align: 'center' });

  let y = 64;

  const drawSectionHeader = (title: string, currentY: number) => {
    doc.setFillColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);
    doc.rect(15, currentY, 180, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 19, currentY + 5);
    return currentY + 11;
  };

  const drawRow = (label: string, value: string, currentY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    doc.text(label, 20, currentY);

    doc.text(':', 68, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(value || '-', 72, currentY);

    return currentY + 6.5;
  };

  // Section 1: DATA DIRI CALON SISWA
  y = drawSectionHeader('1. Data Diri Calon Siswa (Wajib)', y);
  y = drawRow('Nama Lengkap', data.fullName, y);
  y = drawRow('NIK / NISN', data.nikNisn, y);
  y = drawRow('Tempat / Tgl Lahir', data.birthPlaceDate, y);
  y = drawRow('Jenis Kelamin', data.gender, y);
  y = drawRow('Asal Sekolah', data.originSchool, y);
  y = drawRow('Alamat Lengkap', data.address, y);

  y += 2;

  // Section 2: KONTAK & DATA ORANG TUA
  y = drawSectionHeader('2. Data Kontak & Orang Tua / Wali', y);
  y = drawRow('No. WhatsApp / HP', data.phoneWhatsapp, y);
  y = drawRow('Alamat Email', data.email, y);
  y = drawRow('Nama Orang Tua / Wali', data.parentName || 'Orang Tua / Wali Calon Siswa', y);
  y = drawRow('No. HP Orang Tua', data.parentPhone || data.phoneWhatsapp, y);

  y += 2;

  // Section 3: PILIHAN JURUSAN & PROGRAM
  y = drawSectionHeader('3. Pilihan Program & Jurusan Keahlian', y);
  y = drawRow('Program Pendaftaran', data.programType, y);
  y = drawRow('Pilihan Jurusan', `${data.firstChoiceMajor} - ${getMajorFullName(data.firstChoiceMajor)}`, y);
  if (data.secondChoiceMajor) {
    y = drawRow('Pilihan Jurusan 2', `${data.secondChoiceMajor} - ${getMajorFullName(data.secondChoiceMajor)}`, y);
  }
  y = drawRow('Tanggal Pendaftaran', data.registrationDate, y);

  y += 4;

  // Section 4: INSTRUKSI VERIFIKASI BERKAS
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(15, y, 180, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('PERSYARATAN DOKUMEN SAAT VERIFIKASI FISIK KE SEKOLAH:', 19, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  doc.text('[  ] 1. Cetakan Formulir Pendaftaran Online ini (2 Lembar)', 22, y + 10);
  doc.text('[  ] 2. Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMP/MTs (2 Lembar terlegalisir)', 22, y + 14);
  doc.text('[  ] 3. Fotokopi Kartu Keluarga (KK) & Akta Kelahiran (2 Lembar)', 22, y + 18);
  doc.text('[  ] 4. Pas Foto berwarna ukuran 3x4 cm latar merah/biru (3 Lembar)', 22, y + 22);

  y += 33;

  // QR / Barcode Box placeholder
  doc.setDrawColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);
  doc.setFillColor(255, 255, 255);
  doc.rect(15, y, 32, 32, 'FD');
  
  // Fake QR Pattern draw
  doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.rect(18, y + 3, 8, 8, 'F');
  doc.rect(36, y + 3, 8, 8, 'F');
  doc.rect(18, y + 21, 8, 8, 'F');
  doc.rect(28, y + 13, 6, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text('VALIDATED QR', 31, y + 30, { align: 'center' });

  // Signatures
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Kota Sejahtera, ${today}`, 145, y + 2, { align: 'center' });

  doc.text('Calon Siswa Baru,', 65, y + 7, { align: 'center' });
  doc.text('Panitia PPDB SMK Bhinneka Nusantara,', 145, y + 7, { align: 'center' });

  // Signature line
  doc.line(45, y + 27, 85, y + 27);
  doc.setFont('helvetica', 'bold');
  doc.text(data.fullName, 65, y + 31, { align: 'center' });

  doc.line(125, y + 27, 165, y + 27);
  doc.text('Tim Verifikasi PPDB', 145, y + 31, { align: 'center' });

  // Bottom Footer
  doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(240, 240, 240);
  doc.text('Formulir ini diterbitkan secara otomatis oleh Sistem PPDB Online SMK Bhinneka Nusantara.', 105, 291, { align: 'center' });

  // Save the PDF
  const filename = `Formulir_PPDB_SMK_Bhinneka_Nusantara_${data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};

export const generateHeadmasterExecutivePDF = (registrations: RegistrationData[], stats?: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const greenDark = [27, 56, 40];     // #1b3828
  const greenPrimary = [45, 90, 63];  // #2d5a3f
  const goldPrimary = [197, 160, 89]; // #c5a059

  // Top Banner
  doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.rect(0, 0, 210, 14, 'F');
  doc.setFillColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.rect(0, 14, 210, 2, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('SMK BHINNEKA NUSANTARA', 105, 25, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('LAPORAN PENGAWASAN EKSEKUTIF KEPALA SEKOLAH - PPDB T.A. 2026/2027', 105, 30, { align: 'center' });

  doc.setDrawColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);
  doc.setLineWidth(0.8);
  doc.line(15, 33, 195, 33);

  // Executive Summary Box
  doc.setFillColor(242, 247, 244);
  doc.roundedRect(15, 37, 180, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('RINGKASAN EKSEKUTIF PENERIMAAN SISWA BARU:', 20, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`• Total Pendaftar Terdata: ${registrations.length} Calon Siswa (Target: 150 Siswa)`, 22, 50);
  
  const acceptedCount = registrations.filter(r => r.status.includes('Diterima')).length;
  const pendingCount = registrations.filter(r => r.status.includes('Pending') || r.status.includes('Tergrafis')).length;
  const verifiedCount = registrations.filter(r => r.status.includes('Terverifikasi')).length;

  doc.text(`• Total Siswa Diterima Resmi: ${acceptedCount} Siswa`, 22, 55);
  doc.text(`• Total Berkas Terverifikasi: ${verifiedCount} Siswa | Pending Verifikasi: ${pendingCount} Siswa`, 22, 60);
  doc.text(`• Estimasi Potensi Penerimaan SPP & Seragam: Rp ${(registrations.length * 2500000).toLocaleString('id-ID')}`, 22, 65);

  // Breakdown per Major
  doc.setFillColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);
  doc.rect(15, 73, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DISTRIBUSI JURUSAN KELEMBAGAAN', 20, 78);

  const rplCount = registrations.filter(r => r.firstChoiceMajor === 'RPL').length;
  const aklCount = registrations.filter(r => r.firstChoiceMajor === 'AKL').length;
  const tsmCount = registrations.filter(r => r.firstChoiceMajor === 'TSM').length;

  let y = 85;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  doc.text(`1. Rekayasa Perangkat Lunak (RPL): ${rplCount} Siswa (${Math.round((rplCount/50)*100)}% kuota terisi)`, 22, y); y += 6;
  doc.text(`2. Akuntansi & Keuangan Lembaga (AKL): ${aklCount} Siswa (${Math.round((aklCount/50)*100)}% kuota terisi)`, 22, y); y += 6;
  doc.text(`3. Teknik Sepeda Motor (TSM): ${tsmCount} Siswa (${Math.round((tsmCount/50)*100)}% kuota terisi)`, 22, y); y += 10;

  // Student Sample Table Header
  doc.setFillColor(greenPrimary[0], greenPrimary[1], greenPrimary[2]);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('DAFTAR SAMPLING PENDAFTAR ULANG', 20, y + 5);
  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(27, 56, 40);
  doc.text('NO', 18, y);
  doc.text('KODE', 28, y);
  doc.text('NAMA SISWA', 65, y);
  doc.text('ASAL SEKOLAH', 120, y);
  doc.text('JURUSAN', 165, y);
  y += 4;

  doc.line(15, y, 195, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);

  registrations.slice(0, 10).forEach((item, idx) => {
    doc.text(String(idx + 1), 18, y);
    doc.text(item.registrationCode, 28, y);
    doc.text(item.fullName.substring(0, 25), 65, y);
    doc.text(item.originSchool.substring(0, 22), 120, y);
    doc.text(item.firstChoiceMajor, 165, y);
    y += 5.5;
  });

  // Signature Kepala Sekolah
  y = 230;
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(`Disahkan di Kota Sejahtera, ${today}`, 145, y, { align: 'center' });
  doc.text('Kepala SMK Bhinneka Nusantara,', 145, y + 6, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('Dr. Hj. Nurul Hidayah, M.Pd.', 145, y + 30, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('NIP. 19680315 199403 1 004', 145, y + 34, { align: 'center' });

  // Footer
  doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(240, 240, 240);
  doc.text('Dokumen Laporan Eksekutif Resmi ini dicetak secara sah melalui Portal SIAKAD Kepala Sekolah.', 105, 291, { align: 'center' });

  const filename = `Laporan_Eksekutif_Kepala_Sekolah_${today.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
};

function getMajorFullName(code: 'RPL' | 'AKL' | 'TSM'): string {
  switch (code) {
    case 'RPL':
      return 'Rekayasa Perangkat Lunak';
    case 'AKL':
      return 'Akuntansi & Keuangan Lembaga / Perbankan';
    case 'TSM':
      return 'Teknik Sepeda Motor';
    default:
      return code;
  }
}
