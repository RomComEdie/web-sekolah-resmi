import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, AlertCircle, CheckCircle2, RefreshCw, User, School, Users, FileText, Printer } from 'lucide-react';
import { RegistrationForm, RegistrationData } from '../types';
import { generateRegistrationPDF } from '../utils/pdfGenerator';

interface RegistrationFormProps {
  onRegistrationSuccess: (data: RegistrationData) => void;
  existingNISNs: string[];
}

export const RegistrationFormComponent: React.FC<RegistrationFormProps> = ({
  onRegistrationSuccess,
  existingNISNs
}) => {
  const [formData, setFormData] = useState<RegistrationForm>({
    nisn: '',
    namaLengkap: '',
    jenisKelamin: 'Laki-Laki',
    tempatLahir: '',
    tanggalLahir: '',
    noHp: '',
    alamat: '',
    jurusan: 'RPL',
    asalSekolah: '',
    tahunLulus: new Date().getFullYear().toString(),
    namaOrangTua: '',
    noHpOrangTua: '',
    pekerjaanOrangTua: ''
  });

  const [nisnStatus, setNisnStatus] = useState<'idle' | 'checking' | 'unique' | 'duplicate'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<RegistrationData | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check NISN uniqueness when NISN changes (minimum 10 characters)
  useEffect(() => {
    const trimmedNisn = formData.nisn.trim();
    if (!trimmedNisn || trimmedNisn.length < 10) {
      setNisnStatus('idle');
      return;
    }

    setNisnStatus('checking');

    // Debounce check
    const timer = setTimeout(async () => {
      // Local array check first
      const isLocalDuplicate = existingNISNs.some(n => n.trim() === trimmedNisn);

      if (isLocalDuplicate) {
        setNisnStatus('duplicate');
        return;
      }

      // Check server API
      try {
        const res = await fetch(`/api/pendaftaran/check-nisn/${encodeURIComponent(trimmedNisn)}`);
        const json = await res.json();
        if (json.exists) {
          setNisnStatus('duplicate');
        } else {
          setNisnStatus('unique');
        }
      } catch (err) {
        // Fallback to local check result
        setNisnStatus(isLocalDuplicate ? 'duplicate' : 'unique');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.nisn, existingNISNs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.nisn || formData.nisn.trim().length !== 10) {
      setErrorMessage('NISN wajib diisi persis 10 digit angka!');
      return;
    }

    if (!formData.namaLengkap.trim()) {
      setErrorMessage('Nama Lengkap wajib diisi!');
      return;
    }

    if (!formData.asalSekolah.trim()) {
      setErrorMessage('Asal Sekolah SMP/MTs wajib diisi!');
      return;
    }

    if (!formData.namaOrangTua.trim() || !formData.noHpOrangTua.trim()) {
      setErrorMessage('Data Orang Tua (Nama & No. HP) bersifat wajib!');
      return;
    }

    if (nisnStatus === 'duplicate') {
      setErrorMessage(`NISN ${formData.nisn} sudah terdaftar di sistem! NISN bersifat Unik dan tidak boleh ganda.`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan pendaftaran.');
      }

      const createdData: RegistrationData = result.data;
      setLastSubmitted(createdData);
      onRegistrationSuccess(createdData);

      // Auto generate & download PDF
      generateRegistrationPDF(createdData);

      setShowSuccessModal(true);

      // Reset form
      setFormData({
        nisn: '',
        namaLengkap: '',
        jenisKelamin: 'Laki-Laki',
        tempatLahir: '',
        tanggalLahir: '',
        noHp: '',
        alamat: '',
        jurusan: 'RPL',
        asalSekolah: '',
        tahunLulus: new Date().getFullYear().toString(),
        namaOrangTua: '',
        noHpOrangTua: '',
        pekerjaanOrangTua: ''
      });
      setNisnStatus('idle');

    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="pendaftaran" className="py-16 md:py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="neu-badge px-4 py-1.5 text-xs font-bold text-[#386652] uppercase tracking-widest">
            Formulir Resmi PPDB Online
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Pendaftaran Peserta Didik Baru
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Isi data dengan benar. Setelah mengirimkan formulir, Bukti Pendaftaran berbentuk <strong className="text-[#386652]">File PDF Siap Print</strong> akan otomatis diunduh!
          </p>
        </div>

        {/* Main Neumorphic Form Container */}
        <div className="neu-card p-6 sm:p-10 space-y-8">
          
          {errorMessage && (
            <div className="neu-pressed p-4 rounded-xl border border-red-300 bg-red-50/50 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-bold block">Gagal Memproses:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. KELOMPOK NISN & JURUSAN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base pb-2 border-b border-slate-300/40">
                <FileText className="w-5 h-5 text-[#386652]" />
                <h3>1. Identitas Utama & Pilihan Kejuruan</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NISN Input with Unique Validation */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    NISN (Nomor Induk Siswa Nasional) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nisn"
                      maxLength={10}
                      required
                      placeholder="Contoh: 0051234567 (10 Digit)"
                      value={formData.nisn}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData(prev => ({ ...prev, nisn: val }));
                      }}
                      className="neu-input w-full px-4 py-3 text-sm font-mono text-slate-800 tracking-wider"
                    />

                    <div className="absolute right-3 top-3 flex items-center">
                      {nisnStatus === 'checking' && (
                        <RefreshCw className="w-5 h-5 text-[#386652] animate-spin" />
                      )}
                      {nisnStatus === 'unique' && (
                        <span className="flex items-center gap-1 text-[#386652] font-bold text-xs">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="hidden sm:inline">NISN Tersedia (Unik)</span>
                        </span>
                      )}
                      {nisnStatus === 'duplicate' && (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                          <AlertCircle className="w-5 h-5" />
                          <span className="hidden sm:inline">NISN Sudah Terdaftar!</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {nisnStatus === 'duplicate' && (
                    <p className="text-xs text-red-600 font-medium pt-1">
                      ⚠️ NISN {formData.nisn} sudah terdaftar di database. NISN tidak boleh ganda!
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    * Wajib diisi 10 digit. NISN bersifat unique (tidak boleh terduplikasi di database).
                  </p>
                </div>

                {/* Pilihan Jurusan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Pilihan Jurusan (Kejuruan) <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm font-semibold text-slate-800 bg-[#e5ece8]"
                  >
                    <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                    <option value="AKL">Akuntansi & Keuangan Lembaga (AKL)</option>
                    <option value="TSM">Teknik Sepeda Motor (TSM)</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    Pilih 1 dari 3 konsentrasi keahlian yang diminati.
                  </p>
                </div>

              </div>
            </div>

            {/* 2. DATA DIRI SINGKAT */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base pb-2 border-b border-slate-300/40">
                <User className="w-5 h-5 text-[#b8860b]" />
                <h3>2. Data Diri Calon Siswa (Wajib)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    required
                    placeholder="Sesuai Ijazah SMP/MTs"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm font-semibold text-slate-800 bg-[#e5ece8]"
                  >
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    required
                    placeholder="Kota Lahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    required
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Nomor HP / WhatsApp Aktif Siswa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="noHp"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.noHp}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Alamat Lengkap Tempat Tinggal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat"
                    rows={2}
                    required
                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

              </div>
            </div>

            {/* 3. ASAL SEKOLAH */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base pb-2 border-b border-slate-300/40">
                <School className="w-5 h-5 text-[#386652]" />
                <h3>3. Asal Sekolah (Wajib)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Nama SMP / MTs Asal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="asalSekolah"
                    required
                    placeholder="Contoh: SMP Negeri 1 Jakarta / MTs Al-Azhar"
                    value={formData.asalSekolah}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Tahun Lulus <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tahunLulus"
                    required
                    value={formData.tahunLulus}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800 font-mono"
                  />
                </div>

              </div>
            </div>

            {/* 4. DATA ORANG TUA (WAJIB) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base pb-2 border-b border-slate-300/40">
                <Users className="w-5 h-5 text-[#b8860b]" />
                <h3>4. Data Orang Tua / Wali (Wajib)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Nama Ayah / Ibu / Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaOrangTua"
                    required
                    placeholder="Nama Orang Tua"
                    value={formData.namaOrangTua}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    No. HP / WA Orang Tua <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="noHpOrangTua"
                    required
                    placeholder="0819..."
                    value={formData.noHpOrangTua}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Pekerjaan Orang Tua <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pekerjaanOrangTua"
                    required
                    placeholder="Contoh: Wiraswasta / PNS / Karyawan"
                    value={formData.pekerjaanOrangTua}
                    onChange={handleChange}
                    className="neu-input w-full px-4 py-3 text-sm text-slate-800"
                  />
                </div>

              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-300/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span className="text-red-500 font-bold">*</span> Bidang bertanda bintang wajib diisi lengkap.
              </div>

              <button
                type="submit"
                disabled={submitting || nisnStatus === 'duplicate'}
                className="neu-btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold tracking-wide flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Menyimpan & Mencetak PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Kirim & Download PDF Bukti PPDB</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* SUCCESS & PDF PREVIEW MODAL */}
      {showSuccessModal && lastSubmitted && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="neu-card bg-[#e5ece8] p-6 sm:p-8 max-w-lg w-full space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 neu-circle mx-auto flex items-center justify-center text-[#386652] mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">Pendaftaran Berhasil!</h3>
              <p className="text-xs text-slate-600">
                Data calon siswa telah tersimpan di database dengan ID Registrasi:
              </p>
              <div className="font-mono text-sm font-bold text-[#386652] neu-pressed py-1.5 px-3 rounded-lg inline-block border border-white/40">
                {lastSubmitted.id}
              </div>
            </div>

            {/* Registration Highlights */}
            <div className="neu-pressed p-4 rounded-xl text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-300/40 pb-1">
                <span className="text-slate-500">NISN:</span>
                <span className="font-mono font-bold text-slate-800">{lastSubmitted.nisn}</span>
              </div>
              <div className="flex justify-between border-b border-slate-300/40 pb-1">
                <span className="text-slate-500">Nama Siswa:</span>
                <span className="font-bold text-slate-800">{lastSubmitted.namaLengkap}</span>
              </div>
              <div className="flex justify-between border-b border-slate-300/40 pb-1">
                <span className="text-slate-500">Jurusan:</span>
                <span className="font-bold text-[#386652]">{lastSubmitted.jurusan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Asal Sekolah:</span>
                <span className="font-medium">{lastSubmitted.asalSekolah}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              📄 File PDF Bukti Pendaftaran telah otomatis diunduh ke perangkat Anda. Jika unduhan tidak berjalan otomatis, klik tombol di bawah untuk mengunduh ulang.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => generateRegistrationPDF(lastSubmitted)}
                className="neu-btn-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Unduh / Cetak Ulang PDF</span>
              </button>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="neu-btn flex-1 py-2.5 text-xs font-bold text-slate-700"
              >
                Tutup Modal
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
