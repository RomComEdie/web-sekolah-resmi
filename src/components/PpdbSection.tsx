import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  School, 
  Calendar, 
  Sparkles, 
  QrCode, 
  Printer, 
  AlertCircle, 
  Info, 
  ArrowRight,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RegistrationData } from '../types';
import { generateRegistrationPDF } from '../utils/pdfGenerator';
import { submitPPDBRegistration, checkPPDBStatus } from '../services/api';

interface PpdbSectionProps {
  initialMajorChoice?: 'RPL' | 'AKL' | 'TSM';
}

export const PpdbSection: React.FC<PpdbSectionProps> = ({ initialMajorChoice = 'RPL' }) => {
  // Required Input State
  const [fullName, setFullName] = useState<string>('');
  const [nikNisn, setNikNisn] = useState<string>('');
  const [birthPlaceDate, setBirthPlaceDate] = useState<string>('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [address, setAddress] = useState<string>('');
  const [originSchool, setOriginSchool] = useState<string>('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [firstChoiceMajor, setFirstChoiceMajor] = useState<'RPL' | 'AKL' | 'TSM'>(initialMajorChoice);
  const [secondChoiceMajor, setSecondChoiceMajor] = useState<'RPL' | 'AKL' | 'TSM'>('AKL');

  // Form Status
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Lookup Registration Status State
  const [searchCode, setSearchCode] = useState<string>('');
  const [foundRegistration, setFoundRegistration] = useState<RegistrationData | null>(null);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation for Mandatory Fields: Name, Personal Data, Contact
    if (!fullName.trim()) {
      setErrorMessage('Nama Lengkap Wajib diisi!');
      return;
    }
    if (!nikNisn.trim()) {
      setErrorMessage('NIK / NISN Wajib diisi!');
      return;
    }
    if (!birthPlaceDate.trim()) {
      setErrorMessage('Tempat & Tanggal Lahir Wajib diisi!');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Alamat Lengkap Wajib diisi!');
      return;
    }
    if (!originSchool.trim()) {
      setErrorMessage('Asal Sekolah (SMP/MTs) Wajib diisi!');
      return;
    }
    if (!phoneWhatsapp.trim()) {
      setErrorMessage('Nomor WhatsApp / HP Aktif Wajib diisi!');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Alamat Email Aktif Wajib diisi dengan format valid!');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      programType: 'MPLS / PPDB Siswa Baru' as const,
      fullName: fullName.trim(),
      nikNisn: nikNisn.trim(),
      birthPlaceDate: birthPlaceDate.trim(),
      gender,
      address: address.trim(),
      originSchool: originSchool.trim(),
      phoneWhatsapp: phoneWhatsapp.trim(),
      email: email.trim(),
      parentName: parentName.trim() || 'Orang Tua / Wali',
      parentPhone: parentPhone.trim() || phoneWhatsapp.trim(),
      firstChoiceMajor,
      secondChoiceMajor,
    };

    submitPPDBRegistration(payload).then((res) => {
      setIsSubmitting(false);
      if (res.data) {
        setSubmittedData(res.data);
        
        // Save copy to local cache
        try {
          const existing = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]');
          localStorage.setItem('smk_ppdb_registrations', JSON.stringify([res.data, ...existing]));
        } catch (e) {
          console.error(e);
        }

        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }).catch(() => {
      setIsSubmitting(false);
    });
  };

  const handleDownloadPDF = (data: RegistrationData) => {
    generateRegistrationPDF(data);
  };

  const handleSearchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    if (!searchCode.trim()) return;

    // Check PHP API first
    const apiRes = await checkPPDBStatus(searchCode.trim());
    if (apiRes.success && apiRes.data) {
      setFoundRegistration(apiRes.data);
      return;
    }

    // Fallback local cache check
    try {
      const stored = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
      const match = stored.find(
        (item) => 
          item.registrationCode.toLowerCase() === searchCode.trim().toLowerCase() ||
          item.phoneWhatsapp.includes(searchCode.trim()) ||
          item.fullName.toLowerCase().includes(searchCode.trim().toLowerCase())
      );
      setFoundRegistration(match || null);
    } catch (err) {
      setFoundRegistration(null);
    }
  };

  return (
    <section id="ppdb" className="py-20 bg-[#fafbf9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b3828] text-[#c5a059] text-xs font-bold uppercase tracking-wider border border-[#c5a059]/40">
            <FileText size={14} className="text-[#c5a059]" />
            <span>FORMULIR PENDAFTARAN PPDB/MPLS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3828] tracking-tight">
            Pendaftaran Siswa Baru & Download Formulir
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Isi <strong className="text-[#1b3828]">Nama Lengkap, Data Diri, dan Kontak</strong> untuk mendaftar secara online. 
            Begitu data lengkap terisi, Anda dapat <strong className="text-[#2d5a3f]">langsung mengunduh Formulir Pendaftaran PDF resmi</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Registration Form / Download Ticket Result */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
            
            {/* If Form Already Submitted Successfully */}
            {submittedData ? (
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#e8f0eb] text-[#2d5a3f] flex items-center justify-center mx-auto border-2 border-[#2d5a3f] shadow-inner">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-[#f7f2e7] text-[#b38e47] text-xs font-bold uppercase border border-[#c5a059]/30">
                    Pendaftaran Berhasil Terkirim
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#1b3828] mt-2">
                    Selamat, {submittedData.fullName}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    Data pendaftaran Anda telah tersimpan. Silakan unduh formulir pendaftaran di bawah ini untuk disimpan dan dibawa saat verifikasi fisik sekolah.
                  </p>
                </div>

                {/* Ticket Details Box */}
                <div className="p-6 rounded-2xl bg-[#1b3828] text-white border border-[#c5a059]/40 text-left space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d5a3f] pb-3">
                    <div>
                      <div className="text-[10px] text-[#c5a059] font-bold uppercase">Kode Pendaftaran Resmi</div>
                      <div className="text-xl font-extrabold font-mono text-[#f7f2e7]">{submittedData.registrationCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-300 font-bold uppercase">Tanggal Daftar</div>
                      <div className="text-xs font-semibold text-slate-200">{submittedData.registrationDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Nama Lengkap:</span>
                      <strong className="text-white text-sm">{submittedData.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NIK / NISN:</span>
                      <strong className="text-white font-mono">{submittedData.nikNisn}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Asal Sekolah:</span>
                      <strong className="text-white">{submittedData.originSchool}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nomor WA / Kontak:</span>
                      <strong className="text-white font-mono">{submittedData.phoneWhatsapp}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pilihan Jurusan 1:</span>
                      <strong className="text-[#c5a059] font-bold">{submittedData.firstChoiceMajor}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pilihan Jurusan 2:</span>
                      <strong className="text-[#c5a059] font-bold">{submittedData.secondChoiceMajor}</strong>
                    </div>
                  </div>
                </div>

                {/* Primary Download Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handleDownloadPDF(submittedData)}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c5a059] text-[#1b3828] font-extrabold text-sm sm:text-base hover:bg-[#b38e47] transition-all flex items-center justify-center gap-2.5 shadow-lg active:scale-95 border border-[#f7f2e7]/30"
                  >
                    <Download size={20} />
                    <span>Download Formulir Pendaftaran (PDF)</span>
                  </button>

                  <button
                    onClick={() => setSubmittedData(null)}
                    className="w-full sm:w-auto px-5 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-200 transition-colors"
                  >
                    Daftar Kembali / Baru
                  </button>
                </div>

              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SECTION 1: NAMA LENGKAP & DATA DIRI (REQUIRED) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#1b3828] border-b border-slate-200 pb-2">
                    <User className="text-[#c5a059]" size={20} />
                    <h3 className="text-base font-extrabold uppercase tracking-wide">
                      1. Nama & Data Diri (Wajib)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Nama Lengkap */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap Calon Siswa <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Rizky Pratama"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f] focus:ring-1 focus:ring-[#2d5a3f] font-medium"
                      />
                    </div>

                    {/* NIK / NISN */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIK / NISN Siswa <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="16 digit NIK atau 10 digit NISN"
                        value={nikNisn}
                        onChange={(e) => setNikNisn(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f] focus:ring-1 focus:ring-[#2d5a3f]"
                      />
                    </div>

                    {/* Tempat & Tanggal Lahir */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tempat & Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: Bandung, 12 Agustus 2010"
                        value={birthPlaceDate}
                        onChange={(e) => setBirthPlaceDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f] focus:ring-1 focus:ring-[#2d5a3f]"
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    {/* Asal Sekolah */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Asal Sekolah (SMP / MTs) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: SMP Negeri 1 Kota Sejahtera"
                        value={originSchool}
                        onChange={(e) => setOriginSchool(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      />
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Rumah Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        rows={2}
                        required
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      />
                    </div>

                  </div>
                </div>

                {/* SECTION 2: DATA KONTAK (REQUIRED) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#1b3828] border-b border-slate-200 pb-2">
                    <Phone className="text-[#c5a059]" size={20} />
                    <h3 className="text-base font-extrabold uppercase tracking-wide">
                      2. Data Kontak Siswa & Orang Tua (Wajib)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Nomor WhatsApp / HP */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={phoneWhatsapp}
                        onChange={(e) => setPhoneWhatsapp(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      />
                    </div>

                    {/* Email Aktif */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Email Aktif <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="Contoh: siswa@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      />
                    </div>

                    {/* Nama Orang Tua / Wali */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Orang Tua / Wali (Opsional)
                      </label>
                      <input 
                        type="text"
                        placeholder="Nama Ayah/Ibu/Wali"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      />
                    </div>

                    {/* No HP Orang Tua */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        No. HP Orang Tua / Wali (Opsional)
                      </label>
                      <input 
                        type="tel"
                        placeholder="Nomor HP Orang Tua"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm focus:outline-none focus:border-[#2d5a3f]"
                      />
                    </div>

                  </div>
                </div>

                {/* SECTION 3: PILIHAN JURUSAN */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#1b3828] border-b border-slate-200 pb-2">
                    <School className="text-[#c5a059]" size={20} />
                    <h3 className="text-base font-extrabold uppercase tracking-wide">
                      3. Pilihan Jurusan Keahlian
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pilihan Jurusan Utama (1) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={firstChoiceMajor}
                        onChange={(e) => setFirstChoiceMajor(e.target.value as 'RPL' | 'AKL' | 'TSM')}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm font-bold text-[#1b3828] focus:outline-none focus:border-[#2d5a3f]"
                      >
                        <option value="RPL">RPL - Rekayasa Perangkat Lunak</option>
                        <option value="AKL">AKL - Perbankan & Akuntansi</option>
                        <option value="TSM">TSM - Teknik Sepeda Motor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pilihan Jurusan Cadangan (2) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={secondChoiceMajor}
                        onChange={(e) => setSecondChoiceMajor(e.target.value as 'RPL' | 'AKL' | 'TSM')}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#2d5a3f]"
                      >
                        <option value="AKL">AKL - Perbankan & Akuntansi</option>
                        <option value="RPL">RPL - Rekayasa Perangkat Lunak</option>
                        <option value="TSM">TSM - Teknik Sepeda Motor</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON & PDF DOWNLOAD PROMPT */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#2d5a3f] text-[#f7f2e7] font-extrabold text-sm sm:text-base hover:bg-[#1b3828] transition-all flex items-center justify-center gap-2 shadow-lg border border-[#c5a059]/40 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Memproses Data Pendaftaran...</span>
                    ) : (
                      <>
                        <Download size={20} className="text-[#c5a059]" />
                        <span>Kirim Pendaftaran & Unduh Formulir PDF</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    Setelah tombol diklik, formulir pendaftaran PDF dapat langsung Anda unduh & dicetak.
                  </p>
                </div>

              </form>
            )}

          </div>

          {/* Right Column: Status Checker & Instruction Box */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PPDB Status Lookup Box */}
            <div className="bg-[#1b3828] text-white p-6 rounded-3xl border border-[#c5a059]/30 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs uppercase tracking-wider">
                <Search size={16} />
                <span>Cek Status Pendaftaran</span>
              </div>
              <h4 className="text-base font-bold text-[#f7f2e7]">
                Sudah Pernah Mendaftar?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Masukkan Kode Pendaftaran (contoh: PPDB-2026-1042) atau Nomor WA pendaftar untuk mengunduh ulang formulir pendaftaran.
              </p>

              <form onSubmit={handleSearchStatus} className="space-y-3">
                <input 
                  type="text"
                  placeholder="Kode Pendaftaran / No. WA..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#2d5a3f]/60 border border-[#c5a059]/40 text-xs text-white placeholder-slate-300 focus:outline-none focus:border-[#c5a059]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#c5a059] text-[#1b3828] text-xs font-bold hover:bg-[#b38e47] transition-colors"
                >
                  Cari Data Pendaftaran
                </button>
              </form>

              {searchAttempted && (
                <div className="pt-2">
                  {foundRegistration ? (
                    <div className="p-3 rounded-xl bg-[#2d5a3f] border border-[#c5a059]/40 text-xs space-y-2">
                      <div className="font-bold text-[#f7f2e7]">{foundRegistration.fullName}</div>
                      <div className="text-[11px] text-[#c5a059] font-mono">{foundRegistration.registrationCode}</div>
                      <button
                        onClick={() => handleDownloadPDF(foundRegistration)}
                        className="w-full py-2 rounded-lg bg-[#c5a059] text-[#1b3828] font-bold text-[11px] flex items-center justify-center gap-1.5"
                      >
                        <Download size={14} /> Download PDF Formulir
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                      Data tidak ditemukan. Silakan isi form pendaftaran online baru.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Verification Instructions Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-2 border border-slate-200 shadow-xs">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600" 
                  alt="Suasana Penerimaan Siswa Baru SMK Nusa Bangsa" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[11px] font-bold text-white bg-[#1b3828]/80 px-2 py-0.5 rounded border border-[#c5a059]/30">
                  Gedung Pendaftaran PPDB
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#2d5a3f] font-bold text-xs uppercase tracking-wider">
                <Info size={16} className="text-[#c5a059]" />
                <span>Alur Setelah Mendaftar</span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#e8f0eb] text-[#2d5a3f] font-bold flex items-center justify-center shrink-0">1</div>
                  <p className="text-slate-700">Unduh & Cetak <strong>Formulir Pendaftaran PDF</strong> (2 lembar).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#e8f0eb] text-[#2d5a3f] font-bold flex items-center justify-center shrink-0">2</div>
                  <p className="text-slate-700">Siapkan berkas FC Ijazah/SKL, Kartu Keluarga, dan Pas Foto 3x4.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#e8f0eb] text-[#2d5a3f] font-bold flex items-center justify-center shrink-0">3</div>
                  <p className="text-slate-700">Datang ke sekretariat PPDB SMK Nusa Bangsa untuk verifikasi fisik & pengambilan seragam.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
