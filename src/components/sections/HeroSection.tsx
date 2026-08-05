import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Code, 
  Landmark, 
  Wrench, 
  Download, 
  BookOpen 
} from 'lucide-react';
import { SCHOOL_INFO } from '../../data/schoolData';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [offsetY, setOffsetY] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#1b3828] text-white pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-[#2d5a3f]/40">
      {/* Parallax Background Glow & Geometric Pattern Elements */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          transform: `translateY(${offsetY * 0.15}px)`,
          backgroundImage: `radial-gradient(#c5a059 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
      
      {/* Floating Low Saturate Ambient Light Orbs */}
      <div 
        className="absolute top-10 right-10 w-96 h-96 bg-[#2d5a3f]/50 rounded-full filter blur-3xl pointer-events-none transition-transform duration-700"
        style={{ transform: `translateY(${offsetY * -0.08}px)` }}
      />
      <div 
        className="absolute -bottom-20 -left-10 w-80 h-80 bg-[#c5a059]/15 rounded-full filter blur-3xl pointer-events-none transition-transform duration-700"
        style={{ transform: `translateY(${offsetY * 0.1}px)` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Accreditation Badge */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#2d5a3f]/70 border border-[#c5a059]/40 text-[#f7f2e7] text-xs font-semibold backdrop-blur-sm shadow-inner">
              <img src={SCHOOL_INFO.logoUrl} alt="Logo SMK" className="w-7 h-7 rounded-full object-contain bg-white p-0.5 border-2 border-[#c5a059] shadow-xs shrink-0" />
              <span>Sekolah Kejuruan Terakreditasi {SCHOOL_INFO.accreditation}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
              <span className="text-slate-300">Tahun Ajaran 2026/2027</span>
              {isPpdbClosed && (
                <span className="px-2 py-0.5 rounded-md bg-red-900/80 text-red-200 border border-red-500/50 text-[10px] font-black uppercase tracking-wider ml-1">
                  PPDB Ditutup
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#f7f2e7] tracking-tight leading-[1.15]">
              Mencetak Generasi <span className="text-[#c5a059] underline decoration-[#c5a059]/40 underline-offset-8">Unggul</span>, Terampil & Siap Kerja
            </h1>

            {/* Subtitle / Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Selamat datang di portal resmi <strong className="text-white font-semibold">SMK Bhinneka Nusantara</strong>. 
              Fasilitas pembelajaran modern berbasis industri dengan 3 program keahlian favorit: 
              <span className="text-[#c5a059] font-medium"> Rekayasa Perangkat Lunak (RPL)</span>, 
              <span className="text-[#c5a059] font-medium"> Perbankan (AKL)</span>, dan 
              <span className="text-[#c5a059] font-medium"> Teknik Sepeda Motor (TSM)</span>.
            </p>

            {/* Quick Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-[#2d5a3f]/30 p-2.5 rounded-lg border border-[#2d5a3f]/50">
                <CheckCircle2 size={16} className="text-[#c5a059] shrink-0" />
                <span>96.4% Lulusan Kerja/Kuliah</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-[#2d5a3f]/30 p-2.5 rounded-lg border border-[#2d5a3f]/50">
                <CheckCircle2 size={16} className="text-[#c5a059] shrink-0" />
                <span>Lab Industry Standard</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-[#2d5a3f]/30 p-2.5 rounded-lg border border-[#2d5a3f]/50 col-span-2 sm:col-span-1">
                <CheckCircle2 size={16} className="text-[#c5a059] shrink-0" />
                <span>48+ Mitra Kerja DUDI</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              {!isPpdbClosed ? (
                <button
                  onClick={() => onNavigate('ppdb')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c5a059] text-[#1b3828] font-bold text-sm sm:text-base shadow-lg hover:bg-[#b38e47] hover:scale-[1.02] active:scale-95 transition-all border border-[#f7f2e7]/30"
                >
                  <span>Daftar PPDB/MPLS</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('profil')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c5a059] text-[#1b3828] font-bold text-sm sm:text-base shadow-lg hover:bg-[#b38e47] hover:scale-[1.02] active:scale-95 transition-all border border-[#f7f2e7]/30"
                >
                  <span>Lihat Profil Sekolah</span>
                  <ArrowRight size={18} />
                </button>
              )}

              <button
                onClick={() => onNavigate('jurusan')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#2d5a3f]/60 hover:bg-[#2d5a3f] text-[#f7f2e7] font-semibold text-sm sm:text-base border border-[#c5a059]/40 transition-all"
              >
                <BookOpen size={18} className="text-[#c5a059]" />
                <span>Lihat Jurusan</span>
              </button>

              <button
                onClick={() => onNavigate('pembelajaran')}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span>Daftar Kurikulum & Jadwal</span>
                <ArrowRight size={14} className="text-[#c5a059]" />
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with Parallax Depth Effects */}
          <div className="lg:col-span-5 relative">
            <div 
              className="relative rounded-2xl bg-gradient-to-b from-[#2d5a3f]/80 to-[#1b3828] p-2 border border-[#c5a059]/30 shadow-2xl transition-transform duration-500"
              style={{ transform: `translateY(${offsetY * -0.05}px)` }}
            >
              {/* Main School Featured Hero Image */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                  alt="Siswa SMK Bhinneka Nusantara" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b3828] via-transparent to-transparent opacity-80" />
                
                {/* Overlay Text in Image */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#1b3828]/85 backdrop-blur-md border border-[#c5a059]/30">
                  <div className="text-xs text-[#c5a059] font-bold uppercase tracking-wider">Lingkungan Belajar Asri & Modern</div>
                  <div className="text-sm font-semibold text-white mt-0.5">SMK Bhinneka Nusantara Kota Sejahtera</div>
                  <div className="text-[11px] text-slate-300">Teaching Factory & Sertifikasi Kompetensi Industri</div>
                </div>
              </div>

              {/* Parallax Floating Cards */}
              
              {/* Floating Badge 1: RPL */}
              <div 
                className="absolute -top-4 -left-4 bg-[#ffffff] text-slate-900 p-3 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3 animate-float-slow hidden sm:flex"
                style={{ transform: `translateY(${offsetY * 0.04}px)` }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#2d5a3f] text-[#c5a059] flex items-center justify-center font-bold">
                  <Code size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b3828]">Jurusan RPL</div>
                  <div className="text-[10px] text-slate-500 font-medium">Software & Web App</div>
                </div>
              </div>

              {/* Floating Badge 2: AKL */}
              <div 
                className="absolute top-1/2 -right-5 bg-[#ffffff] text-slate-900 p-3 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3 animate-float-reverse hidden sm:flex"
                style={{ transform: `translateY(${offsetY * -0.06}px)` }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#f7f2e7] text-[#b38e47] flex items-center justify-center font-bold">
                  <Landmark size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b3828]">Bank Mini AKL</div>
                  <div className="text-[10px] text-slate-500 font-medium">Finansial & Banking</div>
                </div>
              </div>

              {/* Floating Badge 3: TSM */}
              <div 
                className="absolute -bottom-5 left-8 bg-[#ffffff] text-slate-900 p-3 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3 animate-float-slow hidden sm:flex"
                style={{ transform: `translateY(${offsetY * 0.03}px)` }}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-[#c5a059] flex items-center justify-center font-bold">
                  <Wrench size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b3828]">Bengkel TSM</div>
                  <div className="text-[10px] text-slate-500 font-medium">Injeksi & Diagnostic</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Counter Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#2d5a3f]/40 border border-[#c5a059]/30 backdrop-blur-md">
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c5a059]">{SCHOOL_INFO.stats.studentsCount}+</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Siswa Active</div>
          </div>
          <div className="text-center p-2 border-l border-[#2d5a3f]/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c5a059]">{SCHOOL_INFO.stats.teachersCount}+</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Guru & Staf Pengajar</div>
          </div>
          <div className="text-center p-2 border-l border-[#2d5a3f]/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c5a059]">{SCHOOL_INFO.stats.partnerCompanies}+</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Mitra Industri DUDI</div>
          </div>
          <div className="text-center p-2 border-l border-[#2d5a3f]/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c5a059]">{SCHOOL_INFO.stats.employmentRate}</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Terserap Kerja & Kuliah</div>
          </div>
        </div>

      </div>
    </section>
  );
};
