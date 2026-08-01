import React, { useState } from 'react';
import { Code2, Calculator, Wrench, Check, Briefcase, Award, ArrowRight } from 'lucide-react';
import { MAJORS } from '../data/schoolData';
import { Major } from '../types';

export const VocationalMajors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'RPL' | 'AKL' | 'TSM'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-7 h-7 text-[#386652]" />;
      case 'Calculator':
        return <Calculator className="w-7 h-7 text-[#d4af37]" />;
      case 'Wrench':
      default:
        return <Wrench className="w-7 h-7 text-[#b8860b]" />;
    }
  };

  const filteredMajors = activeTab === 'all' ? MAJORS : MAJORS.filter(m => m.id === activeTab);

  return (
    <section id="kejuruan" className="py-16 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="neu-badge px-4 py-1.5 text-xs font-bold text-[#386652] uppercase tracking-widest">
            Program Keahlian unggulan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Profil Kejuruan (3 Jurusan)
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Pilih minat keahlian terbaikmu. Masing-masing jurusan dirancang khusus sesuai standar kebutuhan industri terkini.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center items-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'all' ? 'neu-btn-primary' : 'neu-btn text-slate-700'
            }`}
          >
            Semua (3 Jurusan)
          </button>
          <button
            onClick={() => setActiveTab('RPL')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'RPL' ? 'neu-btn-primary' : 'neu-btn text-slate-700'
            }`}
          >
            Rekayasa Perangkat Lunak (RPL)
          </button>
          <button
            onClick={() => setActiveTab('AKL')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'AKL' ? 'neu-btn-primary' : 'neu-btn text-slate-700'
            }`}
          >
            Akuntansi & Perbankan (AKL)
          </button>
          <button
            onClick={() => setActiveTab('TSM')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'TSM' ? 'neu-btn-primary' : 'neu-btn text-slate-700'
            }`}
          >
            Teknik Sepeda Motor (TSM)
          </button>
        </div>

        {/* EXACTLY 1 CARD PER MAJOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredMajors.map((major: Major) => (
            <div
              key={major.id}
              className="neu-card p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="space-y-5">
                
                {/* Header Card */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 neu-circle flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(major.ikonName)}
                  </div>
                  <span className="neu-badge px-3 py-1 text-xs font-bold text-slate-700">
                    Akreditasi {major.akreditasi}
                  </span>
                </div>

                {/* Major Title */}
                <div>
                  <div className="text-xs font-extrabold uppercase text-[#386652] tracking-wider">
                    {major.singkatan}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 leading-snug">
                    {major.namaJurusan}
                  </h3>
                  <p className="text-xs text-slate-500 italic mt-1">{major.slogan}</p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium neu-pressed p-3.5 rounded-xl">
                  {major.deskripsi}
                </p>

                {/* Keahlian Utama */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#386652]" />
                    <span>Keahlian Utama:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {major.keahlianUtama.map((skill, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prospek Kerja */}
                <div className="space-y-2 pt-1 border-t border-slate-300/40">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>Prospek Karir:</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {major.prospekKerja.map((karir, idx) => (
                      <span key={idx} className="neu-flat-sm px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {karir}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Card Action */}
              <div className="pt-6 mt-6 border-t border-slate-300/40">
                <a
                  href="#pendaftaran"
                  className="neu-btn w-full py-2.5 px-4 text-xs font-bold text-slate-800 hover:text-[#386652] flex items-center justify-center gap-2 group-hover:bg-[#386652] group-hover:text-white transition-colors"
                >
                  <span>Pilih Jurusan {major.id}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#fef08a]" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
