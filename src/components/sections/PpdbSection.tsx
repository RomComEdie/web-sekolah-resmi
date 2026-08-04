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
  Search,
  UploadCloud,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RegistrationData } from '../../types';
import { generateRegistrationPDF } from '../../utils/pdfGenerator';
import { submitPPDBRegistration, checkPPDBStatus } from '../../services/api';
import { checkToxicWords, checkRateLimit, recordActionTimestamp } from '../../utils/security';

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

  // Upload Documents State
  const [ijazahDocumentUrl, setIjazahDocumentUrl] = useState<string>('');
  const [kkDocumentUrl, setKkDocumentUrl] = useState<string>('');
  const [photoDocumentUrl, setPhotoDocumentUrl] = useState<string>('');

  // NISN Validation & Pre-check State
  const [nisnValidStatus, setNisnValidStatus] = useState<'idle' | 'checking' | 'invalid_format' | 'duplicate' | 'valid'>('idle');
  const [existingNisnRecord, setExistingNisnRecord] = useState<RegistrationData | null>(null);

  // Form Status & Security Warnings
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  // File Upload Helper to convert File to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFn: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFn(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Lookup Registration Status State
  const [searchCode, setSearchCode] = useState<string>('');
  const [foundRegistration, setFoundRegistration] = useState<RegistrationData | null>(null);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  // PPDB Wave Status (GELOMBANG_1_OPEN, GELOMBANG_2_OPEN, GELOMBANG_3_OPEN, CLOSED)
  const [ppdbWaveStatus, setPpdbWaveStatus] = useState<string>(() => {
    const saved = localStorage.getItem('smk_website_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.ppdbWaveStatus) return parsed.ppdbWaveStatus;
      } catch (e) { console.error(e); }
    }
    return 'GELOMBANG_1_OPEN';
  });

  React.useEffect(() => {
    const handleSettingsUpdate = () => {
      const saved = localStorage.getItem('smk_website_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.ppdbWaveStatus) setPpdbWaveStatus(parsed.ppdbWaveStatus);
        } catch (e) { console.error(e); }
      }
    };
    window.addEventListener('ppdb_settings_updated', handleSettingsUpdate);
    window.addEventListener('smk_website_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('ppdb_settings_updated', handleSettingsUpdate);
      window.removeEventListener('smk_website_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Handle NISN validation check with database
  const handleCheckNisn = async (nisnVal: string) => {
    const trimmed = nisnVal.trim();
    if (!trimmed) {
      setNisnValidStatus('idle');
      setExistingNisnRecord(null);
      return;
    }

    // Format validation: numbers only and at least 10 digits
    const isDigits = /^\d+$/.test(trimmed);
    if (!isDigits || trimmed.length < 10) {
      setNisnValidStatus('invalid_format');
      setExistingNisnRecord(null);
      return;
    }

    setNisnValidStatus('checking');

    try {
      // Check database API
      const apiRes = await checkPPDBStatus(trimmed);
      if (apiRes.success && apiRes.data) {
        setExistingNisnRecord(apiRes.data);
        setNisnValidStatus('duplicate');
        return;
      }

      // Local cache fallback check
      const stored = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
      const match = stored.find(item => item.nikNisn === trimmed);
      if (match) {
        setExistingNisnRecord(match);
        setNisnValidStatus('duplicate');
        return;
      }

      setExistingNisnRecord(null);
      setNisnValidStatus('valid');
    } catch (err) {
      setNisnValidStatus('valid');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSecurityWarning(null);

    // 1. Rate Limiting Check (30 seconds cooldown per registration)
    const rateCheck = checkRateLimit('ppdb_registration', 30);
    if (!rateCheck.allowed) {
      setSecurityWarning(`⏳ Permintaan pendaftaran terlalu cepat. Silakan tunggu ${rateCheck.waitSeconds} detik lagi sebelum mencoba kembali.`);
      return;
    }

    // 2. Toxic / Abusive Language Moderation
    const combinedContent = `${fullName} ${address} ${originSchool} ${parentName}`;
    const toxicCheck = checkToxicWords(combinedContent);
    if (toxicCheck.isToxic) {
      setSecurityWarning(`⚠️ Data pendaftaran mengandung kata yang tidak sopan / tidak sesuai. Harap isi data menggunakan bahasa yang baik dan santun.`);
      return;
    }

    // Validation for Mandatory Fields
    if (!fullName.trim()) {
      setErrorMessage('Nama Lengkap Wajib diisi!');
      return;
    }
    if (!nikNisn.trim()) {
      setErrorMessage('NIK / NISN Wajib diisi!');
      return;
    }

    // Validate NISN Format
    const isDigits = /^\d+$/.test(nikNisn.trim());
    if (!isDigits || nikNisn.trim().length < 10) {
      setNisnValidStatus('invalid_format');
      setErrorMessage('NISN harus terdiri dari minimal 10 digit angka!');
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

    // Final Database Verification for Duplicate NISN
    const checkRes = await checkPPDBStatus(nikNisn.trim());
    let existing: RegistrationData | null = checkRes.success && checkRes.data ? checkRes.data : null;

    if (!existing) {
      try {
        const stored = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
        const match = stored.find(item => item.nikNisn === nikNisn.trim());
        if (match) existing = match;
      } catch (e) {
        console.error(e);
      }
    }

    if (existing) {
      setIsSubmitting(false);
      setExistingNisnRecord(existing);
      setNisnValidStatus('duplicate');
      setErrorMessage(`NISN ${nikNisn.trim()} sudah terdaftar dalam database atas nama "${existing.fullName}" dengan Kode ${existing.registrationCode}. Pendaftaran ganda tidak diperbolehkan.`);
      return;
    }

    const docsStatus: 'Lengkap' | 'Belum Lengkap' = (ijazahDocumentUrl && kkDocumentUrl && photoDocumentUrl) ? 'Lengkap' : 'Belum Lengkap';

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
      ijazahDocumentUrl,
      kkDocumentUrl,
      photoDocumentUrl,
      documentsStatus: docsStatus
    };

    submitPPDBRegistration(payload).then((res) => {
      setIsSubmitting(false);
      if (res.data) {
        recordActionTimestamp('ppdb_registration');
        setSubmittedData(res.data);
        
        // Save copy to local cache
        try {
          const existingCache = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]');
          localStorage.setItem('smk_ppdb_registrations', JSON.stringify([res.data, ...existingCache]));
        } catch (e) {
          console.error(e);
        }

        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }).catch((err) => {
      setIsSubmitting(false);
      setErrorMessage('Gagal menyimpan pendaftaran ke database: ' + (err.message || 'Terjadi kesalahan'));
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
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Pilihan Jurusan Keahlian:</span>
                      <strong className="text-[#c5a059] font-bold text-sm">{submittedData.firstChoiceMajor}</strong>
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
            ) : ppdbWaveStatus === 'CLOSED' ? (
              /* PPDB CLOSED NOTICE */
              <div className="space-y-6 text-center animate-fadeIn p-2 sm:p-4">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border-2 border-amber-400 shadow-md">
                  <AlertTriangle size={40} />
                </div>

                <div className="space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider border border-red-300">
                    Status PPDB 2026/2027: RESMI DITUTUP
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#1b3828] pt-1">
                    Pendaftaran Online Selesai
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Seluruh kuota pagu pendaftaran siswa baru untuk jurusan <strong className="text-[#1b3828]">RPL, AKL, dan TSM</strong> Tahun Ajaran 2026/2027 telah <strong className="text-emerald-800">100% TERPENUHI</strong>.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1b3828] text-white border border-[#c5a059]/40 text-left space-y-4 shadow-lg">
                  <h4 className="text-sm font-bold text-[#c5a059] flex items-center gap-2 border-b border-[#2d5a3f] pb-2">
                    <Sparkles size={16} />
                    <span>Layanan Pertanyaan & Informasi Sekolah</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Meskipun pendaftaran online telah ditutup, Anda tetap dapat mengajukan pertanyaan seputar jadwal pendaftaran ulang, orientasi MPLS, atau kuota susulan dengan mengirim pesan melalui formulir kontak di bawah.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href="#kontak"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#c5a059] text-[#1b3828] font-black text-xs hover:bg-white transition-all text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Mail size={16} />
                      <span>Kirim Pesan Ke Sekolah</span>
                    </a>
                  </div>
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
                    <div className="sm:col-span-2 md:col-span-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          NISN / NIK Siswa <span className="text-red-500">*</span>
                        </label>
                        {nikNisn.trim().length >= 10 && (
                          <button
                            type="button"
                            onClick={() => handleCheckNisn(nikNisn)}
                            className="text-[11px] font-bold text-[#2d5a3f] hover:underline flex items-center gap-1"
                          >
                            Cek Database
                          </button>
                        )}
                      </div>
                      <input 
                        type="text"
                        required
                        maxLength={16}
                        placeholder="10 digit NISN (Contoh: 0081234567)"
                        value={nikNisn}
                        onChange={(e) => {
                          setNikNisn(e.target.value);
                          if (nisnValidStatus !== 'idle') {
                            setNisnValidStatus('idle');
                          }
                        }}
                        onBlur={(e) => handleCheckNisn(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none font-mono transition-colors ${
                          nisnValidStatus === 'duplicate' 
                            ? 'border-2 border-amber-500 bg-amber-50/60 focus:border-amber-600' 
                            : nisnValidStatus === 'valid'
                            ? 'border-2 border-emerald-500 bg-emerald-50/40 focus:border-emerald-600'
                            : nisnValidStatus === 'invalid_format'
                            ? 'border-2 border-red-400 bg-red-50/40'
                            : 'bg-[#FAFBF9] border border-slate-300 focus:border-[#2d5a3f] focus:ring-1 focus:ring-[#2d5a3f]'
                        }`}
                      />

                      {/* Real-time Status Feedback */}
                      {nisnValidStatus === 'checking' && (
                        <div className="mt-1.5 text-xs text-blue-600 flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                          Memeriksa NISN di database PPDB...
                        </div>
                      )}

                      {nisnValidStatus === 'invalid_format' && (
                        <div className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
                          <AlertCircle size={14} /> NISN harus berupa minimal 10 digit angka (contoh: 0081234567).
                        </div>
                      )}

                      {nisnValidStatus === 'valid' && (
                        <div className="mt-1.5 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-emerald-600" /> NISN Terverifikasi Belum Terdaftar (Siap disimpan ke database)
                        </div>
                      )}

                      {nisnValidStatus === 'duplicate' && existingNisnRecord && (
                        <div className="mt-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2.5 shadow-xs">
                          <div className="flex items-start gap-2">
                            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <strong className="block font-bold text-amber-900 text-xs uppercase tracking-wide">
                                NISN Terdeteksi Sudah Terdaftar Dalam Database!
                              </strong>
                              <p className="text-slate-700 leading-relaxed">
                                Siswa atas nama <strong className="text-amber-950">{existingNisnRecord.fullName}</strong> sudah terdaftar di database dengan Kode <span className="font-mono font-bold text-[#1b3828] bg-amber-200/60 px-1.5 py-0.5 rounded">{existingNisnRecord.registrationCode}</span>.
                              </p>
                              <p className="text-amber-800 text-[11px] font-medium">
                                🚫 Mencegah duplikasi data / spam: Anda tidak dapat mendaftar dua kali. Silakan unduh formulir resmi pendaftaran yang sudah tersimpan.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadPDF(existingNisnRecord)}
                            className="w-full py-2.5 px-4 rounded-lg bg-[#1b3828] text-[#f7f2e7] font-extrabold text-xs hover:bg-[#2d5a3f] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#c5a059]/40"
                          >
                            <Download size={15} className="text-[#c5a059]" />
                            <span>Download Formulir PDF Terdaftar ({existingNisnRecord.registrationCode})</span>
                          </button>
                        </div>
                      )}
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

                {/* SECURITY & VALIDATION WARNING BANNER */}
                {securityWarning && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-start gap-3 shadow-sm animate-pulse">
                    <ShieldAlert size={20} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="block text-rose-900 font-extrabold text-sm">Peringatan Keamanan</strong>
                      <p>{securityWarning}</p>
                    </div>
                  </div>
                )}

                {/* SECTION 3: PILIHAN JURUSAN */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#1b3828] border-b border-slate-200 pb-2">
                    <School className="text-[#c5a059]" size={20} />
                    <h3 className="text-base font-extrabold uppercase tracking-wide">
                      3. Pilihan Jurusan Keahlian
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pilihan Jurusan Keahlian <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={firstChoiceMajor}
                      onChange={(e) => setFirstChoiceMajor(e.target.value as 'RPL' | 'AKL' | 'TSM')}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFBF9] border border-slate-300 text-sm font-bold text-[#1b3828] focus:outline-none focus:border-[#2d5a3f]"
                    >
                      <option value="RPL">RPL - Rekayasa Perangkat Lunak & GDM</option>
                      <option value="AKL">AKL - Akuntansi & Keuangan Lembaga</option>
                      <option value="TSM">TSM - Teknik & Bisnis Sepeda Motor</option>
                    </select>
                  </div>
                </div>

                {/* SECTION 4: UPLOAD BERKAS PERSYARATAN */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-[#1b3828] border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2.5">
                      <UploadCloud className="text-[#c5a059]" size={20} />
                      <h3 className="text-base font-extrabold uppercase tracking-wide">
                        4. Upload Berkas Persyaratan (PDF / JPG / PNG)
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#2d5a3f] bg-[#e8f0eb] px-2.5 py-1 rounded-full">
                      Maksimal 5MB/file
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Upload Ijazah / SKL */}
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-[#FAFBF9] space-y-2 text-center flex flex-col items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">1. Ijazah / SKL SMP</span>
                      {ijazahDocumentUrl ? (
                        <div className="w-full space-y-2">
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                            <FileCheck size={16} />
                            <span>Ter-upload</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIjazahDocumentUrl('')}
                            className="text-[11px] text-rose-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <X size={12} /> Hapus File
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full py-2.5 px-3 rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#2d5a3f] transition-all flex flex-col items-center gap-1">
                          <UploadCloud size={18} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-[#2d5a3f]">Pilih File Ijazah</span>
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            onChange={(e) => handleFileUpload(e, setIjazahDocumentUrl)} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>

                    {/* Upload Kartu Keluarga */}
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-[#FAFBF9] space-y-2 text-center flex flex-col items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">2. Kartu Keluarga (KK)</span>
                      {kkDocumentUrl ? (
                        <div className="w-full space-y-2">
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                            <FileCheck size={16} />
                            <span>Ter-upload</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setKkDocumentUrl('')}
                            className="text-[11px] text-rose-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <X size={12} /> Hapus File
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full py-2.5 px-3 rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#2d5a3f] transition-all flex flex-col items-center gap-1">
                          <UploadCloud size={18} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-[#2d5a3f]">Pilih File KK</span>
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            onChange={(e) => handleFileUpload(e, setKkDocumentUrl)} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>

                    {/* Upload Pas Foto 3x4 */}
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-[#FAFBF9] space-y-2 text-center flex flex-col items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">3. Pas Foto 3x4</span>
                      {photoDocumentUrl ? (
                        <div className="w-full space-y-2">
                          {photoDocumentUrl.startsWith('data:image') && (
                            <img src={photoDocumentUrl} alt="Preview Pas Foto" className="w-12 h-16 object-cover rounded-lg mx-auto border border-slate-300" />
                          )}
                          <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1">
                            <FileCheck size={14} />
                            <span>Ter-upload</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPhotoDocumentUrl('')}
                            className="text-[11px] text-rose-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <X size={12} /> Hapus File
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full py-2.5 px-3 rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#2d5a3f] transition-all flex flex-col items-center gap-1">
                          <UploadCloud size={18} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-[#2d5a3f]">Pilih Pas Foto</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, setPhotoDocumentUrl)} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON & PDF DOWNLOAD PROMPT */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || nisnValidStatus === 'duplicate'}
                    className="w-full py-4 px-6 rounded-xl bg-[#2d5a3f] text-[#f7f2e7] font-extrabold text-sm sm:text-base hover:bg-[#1b3828] transition-all flex items-center justify-center gap-2 shadow-lg border border-[#c5a059]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Memproses Data & Simpan ke Database...</span>
                    ) : nisnValidStatus === 'duplicate' ? (
                      <span>🚫 NISN Sudah Terdaftar (Duplikasi Ditolak)</span>
                    ) : (
                      <>
                        <Download size={20} className="text-[#c5a059]" />
                        <span>Kirim Pendaftaran & Unduh Formulir PDF</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    Data NISN akan divalidasi dan disimpan ke database secara resmi sebelum formulir PDF pendaftaran dapat diunduh.
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
                  alt="Suasana Penerimaan Siswa Baru SMK Bhinneka Nusantara" 
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
                  <p className="text-slate-700">Datang ke sekretariat PPDB SMK Bhinneka Nusantara untuk verifikasi fisik & pengambilan seragam.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
