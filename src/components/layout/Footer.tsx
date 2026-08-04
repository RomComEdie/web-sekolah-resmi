import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  ArrowUp, 
  Code, 
  Landmark, 
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { SCHOOL_INFO } from '../../data/schoolData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminModal }) => {
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

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const saved = localStorage.getItem('smk_website_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.ppdbWaveStatus) setPpdbWaveStatus(parsed.ppdbWaveStatus);
        } catch (e) { console.error(e); }
      }
    };
    window.addEventListener('smk_website_settings_updated', handleSettingsUpdate);
    window.addEventListener('ppdb_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('smk_website_settings_updated', handleSettingsUpdate);
      window.removeEventListener('ppdb_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const isPpdbClosed = ppdbWaveStatus === 'CLOSED';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1b3828] text-white border-t border-[#2d5a3f]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2d5a3f]">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2d5a3f] text-[#c5a059] flex items-center justify-center font-bold border border-[#c5a059]/40 shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-bold text-lg text-[#f7f2e7] tracking-tight">
                  SMK BHINNEKA NUSANTARA
                </span>
                <span className="block text-[11px] font-medium text-[#c5a059] tracking-wider uppercase">
                  NPSN: {SCHOOL_INFO.npsn} | Akreditasi {SCHOOL_INFO.accreditation}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              {SCHOOL_INFO.vision}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#c5a059] font-medium">
              <Award size={16} />
              <span>Sekolah Kejuruan Pusat Keunggulan Vokasi</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('beranda')} className="hover:text-white transition-colors">
                  Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profil')} className="hover:text-white transition-colors">
                  Profil & Visi Misi Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guru')} className="hover:text-white transition-colors">
                  Daftar Guru & Tenaga Pendidik
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pembelajaran')} className="hover:text-white transition-colors">
                  Menu Daftar Pembelajaran (Kurikulum)
                </button>
              </li>
              {!isPpdbClosed ? (
                <li>
                  <button onClick={() => onNavigate('ppdb')} className="hover:text-[#c5a059] transition-colors">
                    Daftar PPDB/MPLS 2026
                  </button>
                </li>
              ) : (
                <li>
                  <button onClick={() => onNavigate('kontak')} className="hover:text-[#c5a059] transition-colors">
                    Kontak & Informasi Sekolah
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Major Programs Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              Program Keahlian
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('jurusan-rpl')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Code size={13} className="text-[#c5a059]" />
                  <span>RPL (Software Eng)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jurusan-akl')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Landmark size={13} className="text-[#c5a059]" />
                  <span>AKL (Perbankan)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jurusan-tsm')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Wrench size={13} className="text-[#c5a059]" />
                  <span>TSM (Teknik Motor)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Address & Admin Link */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              Sekretariat & Akses Privat
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {SCHOOL_INFO.address}
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Telp: {SCHOOL_INFO.phone}</div>
              <div>WA: {SCHOOL_INFO.whatsapp}</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} SMK Bhinneka Nusantara. All Rights Reserved. Portal Resmi Pendaftaran & Profil Sekolah.
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-[#2d5a3f] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#1b3828] transition-colors border border-[#c5a059]/40 flex items-center gap-1 font-bold"
            title="Kembali ke atas"
          >
            <ArrowUp size={16} />
            <span>Ke Atas</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
