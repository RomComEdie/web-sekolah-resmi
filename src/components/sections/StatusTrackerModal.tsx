import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, AlertCircle, FileText, Download, Building2, User, Phone, GraduationCap, MapPin } from 'lucide-react';
import { generateRegistrationPDF } from '../../utils/pdfGenerator';
import { useToast } from '../ui/Toast';

interface StatusTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatusTrackerModal: React.FC<StatusTrackerModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch(`/api/ppdb/check-status?q=${encodeURIComponent(query.trim())}`);
      const resData = await response.json();

      if (response.ok && resData.status === 'success') {
        setResult(resData.data);
        showToast('Data Pendaftaran Ditemukan!', `Status: ${resData.data.status}`, 'success');
      } else {
        setErrorMsg(resData.message || 'Data pendaftaran tidak ditemukan.');
        showToast('Data Tidak Ditemukan', 'Periksa NIK atau Kode Pendaftaran Anda.', 'error');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server database. Silakan coba beberapa saat lagi.');
      showToast('Koneksi Terganggu', 'Periksa jaringan internet Anda.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    generateRegistrationPDF({
      id: result.id || 'reg-' + Date.now(),
      fullName: result.fullName || result.nama || 'Calon Siswa',
      nikNisn: result.nikNisn || result.nik || result.nisn || '-',
      birthPlaceDate: result.birthPlaceDate || result.birthDate || '-',
      gender: result.gender || '-',
      address: result.address || '-',
      originSchool: result.originSchool || result.previousSchool || '-',
      phoneWhatsapp: result.phoneWhatsapp || result.phone || '-',
      parentName: result.parentName || '-',
      parentPhone: result.parentPhone || '-',
      email: result.email || 'calonsiswa@gmail.com',
      programType: result.programType || 'Reguler T.A. 2026/2027',
      firstChoiceMajor: result.firstChoiceMajor || result.selectedMajor || 'RPL',
      secondChoiceMajor: result.secondChoiceMajor || 'AKL',
      registrationCode: result.registrationCode || result.regNumber || 'PPDB-2026-0001',
      registrationDate: result.registrationDate || result.submittedAt || new Date().toLocaleDateString('id-ID'),
      status: result.status || 'Terverifikasi'
    });
    showToast('PDF Berhasil Diunduh', 'Bukti pendaftaran disimpan ke perangkat Anda.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAFBF9] text-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden relative flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b3828] to-[#2d5a3f] text-white p-6 sm:p-8 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-mono font-bold border border-[#c5a059]/30">
              <Search size={12} />
              <span>LAYANAN MANDIRI PPDB 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cek Status Pendaftaran PPDB
            </h2>
            <p className="text-xs text-slate-200">
              Lacak status verifikasi berkas & hasil seleksi secara real-time
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0 border border-white/20 relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-extrabold text-[#1b3828] uppercase tracking-wider">
              Masukkan NIK / NISN / Nomor Pendaftaran
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Contoh: PPDB-2026-0001 atau 3275012304050001"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2d5a3f] focus:ring-2 focus:ring-[#2d5a3f]/20 transition-all shadow-sm"
                />
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 bg-[#1b3828] text-white rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#2d5a3f] active:scale-95 transition-all shadow-md shrink-0 border border-[#c5a059]/30 disabled:opacity-50"
              >
                {isLoading ? 'Mencari...' : 'Cek Status'}
              </button>
            </div>
          </form>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-lg relative overflow-hidden animate-in fade-in duration-300">
              
              {/* Status Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                    Nomor Pendaftaran
                  </span>
                  <strong className="text-base sm:text-lg font-black text-[#1b3828] font-mono">
                    {result.registrationCode || result.regNumber || 'PPDB-2026-0001'}
                  </strong>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs border ${
                  result.status?.includes('Terverifikasi') || result.status?.includes('Lulus')
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : result.status?.includes('Ditolak')
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {result.status?.includes('Terverifikasi') || result.status?.includes('Lulus') ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  <span>{result.status || 'Pending Verification'}</span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <User size={16} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-medium block">Nama Lengkap</span>
                    <strong className="text-slate-800 font-bold">{result.fullName || result.nama || '-'}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <GraduationCap size={16} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-medium block">Pilihan Jurusan</span>
                    <strong className="text-[#1b3828] font-bold">{result.firstChoiceMajor || result.selectedMajor || 'RPL'}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building2 size={16} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-medium block">Sekolah Asal</span>
                    <strong className="text-slate-800 font-bold">{result.originSchool || result.previousSchool || '-'}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-medium block">Nomor HP / WhatsApp</span>
                    <strong className="text-slate-800 font-bold">{result.phoneWhatsapp || result.phone || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 italic">
                  *Silakan unduh bukti pendaftaran untuk diserahkan saat daftar ulang.
                </span>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#b08c46] text-[#1b3828] font-black text-xs transition-all flex items-center gap-2 shadow-md active:scale-95 border border-amber-200"
                >
                  <Download size={15} />
                  <span>Unduh Kartu Bukti PDF</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Panitia PPDB SMK Bhinneka Nusantara &bull; Hotline WA: 0812-3456-7890
        </div>

      </div>
    </div>
  );
};
