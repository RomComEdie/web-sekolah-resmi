import React, { useState, useEffect } from 'react';
import { Award, Cpu, Shield, Dribbble, Music, Trophy, Compass, Camera, Sparkles, User, Calendar } from 'lucide-react';
import { EXTRACURRICULARS } from '../../data/schoolData';
import { Extracurricular } from '../../types';

interface ClubDisplayItem {
  id: string;
  name: string;
  category: string;
  description: string;
  schedule: string;
  supervisor?: string;
  achievements?: string[];
  achievementText?: string;
  image?: string;
}

export const ExtracurricularSection: React.FC = () => {
  const [ekskulList, setEkskulList] = useState<Extracurricular[]>(() => {
    const saved = localStorage.getItem('smk_extracurriculars_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return EXTRACURRICULARS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('smk_extracurriculars_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setEkskulList(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setEkskulList(EXTRACURRICULARS);
    };

    window.addEventListener('smk_ekskul_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('smk_ekskul_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getIconForCategory = (cat: string) => {
    if (cat.includes('Teknologi')) return Cpu;
    if (cat.includes('Kepemimpinan')) return Compass;
    if (cat.includes('Olahraga')) return Dribbble;
    if (cat.includes('Seni') || cat.includes('DKV')) return Camera;
    if (cat.includes('Kedisiplinan')) return Shield;
    return Sparkles;
  };

  return (
    <section id="ekstrakurikuler" className="py-20 bg-[#FAFBF9] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
          <div className="text-center md:text-left space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/20 text-[#1b3828] text-xs font-mono font-bold border border-[#c5a059]/40">
              <Trophy size={14} className="text-[#c5a059]" />
              <span>PENGEMBANGAN BAKAT & PRESTASI SISWA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1b3828] tracking-tight">
              Ekstrakurikuler & Organisasi Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Wadah pengembangan potensi diri, kepemimpinan, bakat seni, olahraga, dan penguasaan teknologi tingkat lanjut.
            </p>
          </div>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open_admin_cms', { detail: { subTab: 'EKSKUL_CMS' } }));
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] transition-all flex items-center gap-2 shadow-sm border border-[#c5a059]/40 cursor-pointer shrink-0"
            title="Kelola & Edit Ekstrakurikuler di Admin Portal"
          >
            <Trophy size={16} />
            <span>Kelola & Edit Ekstrakurikuler</span>
          </button>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ekskulList.map((club) => {
            const IconComp = getIconForCategory(club.category);
            const primaryAchievement = (club.achievements && club.achievements.length > 0)
              ? club.achievements[0]
              : 'Aktif Menghasilkan Prestasi Siswa';

            return (
              <div
                key={club.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Photo Banner if available */}
                  {club.image ? (
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img 
                        src={club.image} 
                        alt={club.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#1b3828]/85 text-[#c5a059] text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-[#c5a059]/40 shadow-xs">
                        {club.category}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 pb-2 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#e8f0eb] text-[#2d5a3f] flex items-center justify-center shadow-inner group-hover:bg-[#1b3828] group-hover:text-[#c5a059] transition-all">
                        <IconComp size={24} />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                        {club.category}
                      </span>
                    </div>
                  )}

                  {/* Club Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-extrabold text-[#1b3828] group-hover:text-[#2d5a3f] transition-colors leading-tight">
                      {club.name}
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {club.description}
                    </p>

                    {club.supervisor && (
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 pt-1">
                        <User size={13} className="text-[#c5a059] shrink-0" />
                        <span>Pembina: {club.supervisor}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Achievement & Schedule Badge */}
                <div className="p-6 pt-0 mt-2 space-y-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-2">
                    <Award size={15} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{primaryAchievement}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-end gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span>Jadwal: {club.schedule}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {ekskulList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Trophy className="mx-auto w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">Belum ada kegiatan ekstrakurikuler yang ditambahkan.</p>
          </div>
        )}

      </div>
    </section>
  );
};
