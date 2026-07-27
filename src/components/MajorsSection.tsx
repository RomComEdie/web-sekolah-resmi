import React, { useState } from 'react';
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
  ChevronRight 
} from 'lucide-react';
import { MAJORS_DATA } from '../data/schoolData';
import { MajorInfo } from '../types';

interface MajorsSectionProps {
  onNavigatePPDB: (majorCode: 'RPL' | 'AKL' | 'TSM') => void;
  selectedMajorId?: string;
}

export const MajorsSection: React.FC<MajorsSectionProps> = ({ onNavigatePPDB, selectedMajorId }) => {
  const [activeMajor, setActiveMajor] = useState<'rpl' | 'akl' | 'tsm'>(
    (selectedMajorId as 'rpl' | 'akl' | 'tsm') || 'rpl'
  );

  const currentMajor = MAJORS_DATA.find((m) => m.id === activeMajor) || MAJORS_DATA[0];

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
            3 Program Keahlian favorit yang dikembangkan khusus sesuai standar kurikulum industri modern (DUDI) dengan prospek kerja tinggi.
          </p>
        </div>

        {/* Major Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {MAJORS_DATA.map((major) => {
            const isActive = major.id === activeMajor;
            return (
              <button
                key={major.id}
                onClick={() => setActiveMajor(major.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between group ${
                  isActive
                    ? 'bg-[#1b3828] text-white border-[#c5a059]/50 shadow-lg scale-[1.01]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#2d5a3f]/40 hover:bg-[#FAFBF9]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-[#2d5a3f] text-[#c5a059] border border-[#c5a059]/40' 
                        : 'bg-[#e8f0eb] text-[#2d5a3f]'
                    }`}
                  >
                    {getMajorIcon(major.iconName, 24)}
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#c5a059]' : 'text-slate-500'}`}>
                      {major.code}
                    </div>
                    <div className="text-base sm:text-lg font-bold leading-snug">
                      {major.title}
                    </div>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'text-[#c5a059]' : 'text-slate-300 group-hover:text-[#2d5a3f]'}`}>
                  <ChevronRight size={20} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Major Display Board */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#1b3828] text-[#c5a059] text-xs font-bold uppercase tracking-wider border border-[#c5a059]/40">
                  Kode: {currentMajor.code}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#2d5a3f]" />
                  Kaprog: {currentMajor.headOfDepartment}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Siswa Active: {currentMajor.studentCount} Siswa
                </span>
              </div>

              <div>
                {currentMajor.image && (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6 border border-slate-200 group shadow-sm">
                    <img 
                      src={currentMajor.image} 
                      alt={currentMajor.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="font-bold bg-[#1b3828]/80 px-2.5 py-1 rounded-md border border-[#c5a059]/40 backdrop-blur-sm">
                        Suasana Praktik {currentMajor.code}
                      </span>
                      <span className="text-slate-200 text-[11px] font-medium hidden sm:inline">
                        Standar DUDI & Teaching Factory
                      </span>
                    </div>
                  </div>
                )}

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1b3828] tracking-tight">
                  {currentMajor.fullName}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                  {currentMajor.description}
                </p>
              </div>

              {/* Competencies List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#1b3828] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-[#c5a059]" />
                  Kompetensi Utama Yang Dikuasai
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentMajor.competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f2f7f4] border border-[#dbe5de] text-xs text-slate-700 font-medium">
                      <Check size={16} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Tech stack learned */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Software & Perangkat Industri Yang Dipelajari
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentMajor.softwareOrTools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#FAFBF9] border border-slate-200 text-xs font-semibold text-slate-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Career & Lab Column */}
            <div className="lg:col-span-5 bg-[#1b3828] text-white p-6 sm:p-8 rounded-2xl border border-[#c5a059]/30 space-y-6">
              
              {/* Career Prospects */}
              <div>
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-3">
                  <Briefcase size={16} />
                  <span>Prospek Karir & Peluang Kerja</span>
                </div>
                <div className="space-y-2">
                  {currentMajor.careerProspects.map((career, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Facilities */}
              <div className="pt-4 border-t border-[#2d5a3f]">
                <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-wider mb-3">
                  <Monitor size={16} />
                  <span>Fasilitas Lab Praktik</span>
                </div>
                <div className="space-y-2">
                  {currentMajor.labFacilities.map((facility, idx) => (
                    <div key={idx} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-[#2d5a3f]">
                      {facility}
                    </div>
                  ))}
                </div>
              </div>

              {/* Register CTA for this Major */}
              <div className="pt-4 border-t border-[#2d5a3f]">
                <button
                  onClick={() => onNavigatePPDB(currentMajor.code as 'RPL' | 'AKL' | 'TSM')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#c5a059] text-[#1b3828] font-bold text-sm hover:bg-[#b38e47] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Pilih & Daftar Jurusan {currentMajor.code}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
