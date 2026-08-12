import React from 'react';
import { 
  Code, 
  Landmark, 
  Wrench, 
  Check, 
  Briefcase, 
  Cpu, 
  UserCheck, 
  ArrowRight, 
  Sparkles, 
  Monitor, 
  GraduationCap
} from 'lucide-react';
import { MAJORS_DATA } from '../../data/schoolData';
import { MajorInfo } from '../../types';

interface MajorsSectionProps {
  onNavigatePPDB: (majorCode: 'RPL' | 'AKL' | 'TSM') => void;
  selectedMajorId?: string;
}

export const MajorsSection: React.FC<MajorsSectionProps> = ({ onNavigatePPDB }) => {
  const [ppdbWaveStatus, setPpdbWaveStatus] = React.useState<string>(() => {
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
    window.addEventListener('smk_website_settings_updated', handleSettingsUpdate);
    window.addEventListener('ppdb_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('smk_website_settings_updated', handleSettingsUpdate);
      window.removeEventListener('ppdb_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const isPpdbClosed = ppdbWaveStatus === 'CLOSED';

  const getMajorIcon = (iconName: string, size = 22) => {
    switch (iconName) {
      case 'Code':
        return <Code size={size} />;
      case 'Landmark':
        return <Landmark size={size} />;
      case 'Wrench':
        return <Wrench size={size} />;
      default:
        return <Code size={size} />;
    }
  };

  return (
    <section id="jurusan" className="py-20 bg-[#f2f7f4] relative border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0eb] text-[#2d5a3f] text-xs font-bold uppercase tracking-wider border border-[#2d5a3f]/20">
            <Cpu size={14} className="text-[#c5a059]" />
            <span>Program Keahlian Unggulan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3828] tracking-tight">
            Jurusan & Konsentrasi Keahlian
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            3 Program Keahlian favorit yang dikembangkan khusus sesuai standar kurikulum industri modern (DUDI) dengan prospek kerja tinggi. Setiap jurusan dikelola dalam 1 unit program keahlian mandiri.
          </p>
        </div>

        {/* 1 Card per Major / Program Keahlian Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {MAJORS_DATA.map((major: MajorInfo) => {
            return (
              <div 
                key={major.id}
                id={`card-jurusan-${major.id}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Card Top Banner / Image */}
                <div>
                  {major.image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-slate-100">
                      <img 
                        src={major.image} 
                        alt={major.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1b3828]/90 via-[#1b3828]/30 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg bg-[#1b3828]/90 text-[#c5a059] text-xs font-black uppercase tracking-wider border border-[#c5a059]/40 backdrop-blur-md shadow-sm">
                          {major.code}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 text-slate-100 text-[11px] font-bold backdrop-blur-sm flex items-center gap-1 border border-white/20">
                          <GraduationCap size={13} className="text-[#c5a059]" />
                          {major.studentCount} Siswa
                        </span>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 mb-1 text-[#c5a059] font-bold text-xs uppercase tracking-wider">
                          {getMajorIcon(major.iconName, 16)}
                          <span>Program Keahlian</span>
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight drop-shadow-xs">
                          {major.title}
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-6 space-y-5">
                    {/* Head of Department */}
                    <div className="p-3 rounded-xl bg-[#FAFBF9] border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <UserCheck size={14} className="text-[#2d5a3f]" />
                        Kepala Program:
                      </span>
                      <strong className="text-[#1b3828] font-bold">{major.headOfDepartment}</strong>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {major.description}
                    </p>

                    {/* Competencies */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#1b3828] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#c5a059]" />
                        Kompetensi Utama:
                      </h4>
                      <ul className="space-y-1.5">
                        {major.competencies.slice(0, 3).map((comp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check size={14} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools / Software */}
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Software & Teknologi:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {major.softwareOrTools.map((tool, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-[#f2f7f4] border border-[#dbe5de] text-[11px] font-medium text-slate-700">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Career Prospects */}
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="text-[11px] font-bold text-[#2d5a3f] uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Briefcase size={13} className="text-[#c5a059]" />
                        Peluang Kerja & Prospek:
                      </h4>
                      <div className="space-y-1 text-xs text-slate-600">
                        {major.careerProspects.slice(0, 3).map((career, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] shrink-0" />
                            <span className="truncate">{career}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lab Facilities */}
                    {/* Lab facilitas */}
                    <div className="p-3 rounded-xl bg-[#1b3828] text-white space-y-1">
                      <div className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1">
                        <Monitor size={12} />
                        <span>Fasilitas Lab Utama:</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">
                        {major.labFacilities[0]}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Card Action CTA Footer */}
                <div className="p-6 pt-0">
                  {!isPpdbClosed ? (
                    <button
                      onClick={() => onNavigatePPDB(major.code as 'RPL' | 'AKL' | 'TSM')}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#2d5a3f] text-[#f7f2e7] font-bold text-xs sm:text-sm hover:bg-[#1b3828] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#c5a059]/30 group-hover:bg-[#1b3828]"
                    >
                      <span>Pilih & Daftar Jurusan {major.code}</span>
                      <ArrowRight size={16} className="text-[#c5a059] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const el = document.getElementById('pembelajaran');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#1b3828] text-[#c5a059] font-bold text-xs sm:text-sm hover:bg-[#2d5a3f] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm border border-[#c5a059]/30"
                    >
                      <span>Lihat Kurikulum {major.code}</span>
                      <ArrowRight size={16} className="text-[#c5a059]" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
