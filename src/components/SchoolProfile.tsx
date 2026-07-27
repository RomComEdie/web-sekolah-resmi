import React from 'react';
import { 
  Building2, 
  Target, 
  Compass, 
  Award, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { SCHOOL_INFO, SCHOOL_FACILITIES } from '../data/schoolData';

export const SchoolProfile: React.FC = () => {
  return (
    <section id="profil" className="py-20 bg-[#fafbf9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0eb] text-[#2d5a3f] text-xs font-bold uppercase tracking-wider border border-[#2d5a3f]/20">
            <Building2 size={14} className="text-[#c5a059]" />
            <span>Profil Sekolah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3828] tracking-tight">
            Mengenal Lebih Dekat <span className="text-[#2d5a3f]">SMK Nusa Bangsa</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Berdiri sejak tahun 2005 dengan komitmen melahirkan lulusan vokasi yang kompeten, berakhlak mulia, dan berdaya saing global di industri digital & otomotif.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Visi Card */}
          <div className="lg:col-span-5 bg-[#1b3828] text-white p-8 rounded-2xl border border-[#c5a059]/30 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2d5a3f]/40 rounded-full filter blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#2d5a3f] text-[#c5a059] flex items-center justify-center font-bold mb-6 border border-[#c5a059]/40">
                <Target size={26} />
              </div>
              <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-widest mb-2">Visi Sekolah</h3>
              <p className="text-lg sm:text-xl font-semibold leading-relaxed text-[#f7f2e7]">
                "{SCHOOL_INFO.vision}"
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#2d5a3f] flex items-center justify-between text-xs text-slate-300">
              <span>Akreditasi A Unggul (BAN-S/M)</span>
              <span className="text-[#c5a059] font-semibold">NPSN: {SCHOOL_INFO.npsn}</span>
            </div>
          </div>

          {/* Misi Card */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#e8f0eb] text-[#2d5a3f] flex items-center justify-center font-bold border border-[#2d5a3f]/20">
                  <Compass size={26} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-widest">Misi Sekolah</h3>
                  <h4 className="text-xl font-bold text-[#1b3828]">4 Pilar Pendorong Keunggulan</h4>
                </div>
              </div>

              <div className="space-y-4">
                {SCHOOL_INFO.missions.map((mission, index) => (
                  <div key={index} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f7f4] border border-[#dbe5de]">
                    <div className="w-6 h-6 rounded-full bg-[#2d5a3f] text-[#f7f2e7] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {mission}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles size={14} className="text-[#c5a059]" />
              <span>Kurikulum Merdeka Vokasi Terintegrasi Industri 4.0</span>
            </div>
          </div>

        </div>

        {/* Facilities Section */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">Fasilitas Penunjang</div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1b3828]">Fasilitas Belajar & Teaching Factory</h3>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Dilengkapi sarana modern berstandar industri untuk mendukung proses pembelajaran teori dan praktik secara optimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCHOOL_FACILITIES.map((facility) => (
              <div 
                key={facility.id}
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#2d5a3f]/40 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={facility.image} 
                    alt={facility.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1b3828]/80 text-[#f7f2e7] text-[11px] font-bold backdrop-blur-md border border-[#c5a059]/40">
                    {facility.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="text-lg font-bold text-[#1b3828] group-hover:text-[#2d5a3f] transition-colors">
                    {facility.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
