import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  Sparkles, 
  Check, 
  Award, 
  Code2, 
  Building2, 
  Cog, 
  Compass, 
  Trophy, 
  MessageSquare, 
  Calendar, 
  Download, 
  FileCheck 
} from 'lucide-react';
import { LEARNING_SUBJECTS, EXTRACURRICULARS } from '../../data/schoolData';
import { LearningSubject, Extracurricular } from '../../types';

export const CurriculumSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kurikulum' | 'ekskul'>('kurikulum');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('Semua');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('Semua');

  const filteredSubjects = LEARNING_SUBJECTS.filter((subject) => {
    const matchesMajor = selectedMajorFilter === 'Semua' || subject.major === selectedMajorFilter || subject.major === 'Semua';
    const matchesGrade = selectedGradeFilter === 'Semua' || subject.grade === selectedGradeFilter || subject.grade === 'Semua Tingkat';
    return matchesMajor && matchesGrade;
  });

  const getExtraIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 size={20} />;
      case 'Building2':
        return <Building2 size={20} />;
      case 'Cog':
        return <Cog size={20} />;
      case 'Compass':
        return <Compass size={20} />;
      case 'Trophy':
        return <Trophy size={20} />;
      case 'MessageSquare':
        return <MessageSquare size={20} />;
      default:
        return <Award size={20} />;
    }
  };

  return (
    <section id="pembelajaran" className="py-20 bg-[#f2f7f4] relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0eb] text-[#2d5a3f] text-xs font-bold uppercase tracking-wider border border-[#2d5a3f]/20">
            <BookOpen size={14} className="text-[#c5a059]" />
            <span>Menu Daftar Pembelajaran</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3828] tracking-tight">
            Kurikulum Merdeka & Ekstrakurikuler
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Struktur mata pelajaran kejuruan produktif, muatan nasional, serta program pengembangan bakat siswa di luar jam pelajaran.
          </p>
        </div>

        {/* Main Section Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('kurikulum')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'kurikulum'
                  ? 'bg-[#1b3828] text-[#f7f2e7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen size={16} className={activeTab === 'kurikulum' ? 'text-[#c5a059]' : ''} />
              <span>Daftar Mata Pelajaran</span>
            </button>
            <button
              onClick={() => setActiveTab('ekskul')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ekskul'
                  ? 'bg-[#1b3828] text-[#f7f2e7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy size={16} className={activeTab === 'ekskul' ? 'text-[#c5a059]' : ''} />
              <span>Kegiatan Ekstrakurikuler</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DAFTAR MATA PELAJARAN */}
        {activeTab === 'kurikulum' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Jurusan:</span>
                {['Semua', 'RPL', 'AKL', 'TSM'].map((major) => (
                  <button
                    key={major}
                    onClick={() => setSelectedMajorFilter(major)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedMajorFilter === major
                        ? 'bg-[#2d5a3f] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {major === 'Semua' ? 'Semua Jurusan' : major}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat:</span>
                {['Semua', 'Kelas X', 'Kelas XI', 'Kelas XII'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGradeFilter(grade)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedGradeFilter === grade
                        ? 'bg-[#1b3828] text-[#c5a059]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500 font-medium text-sm">
                    Tidak ada paket pembelajaran untuk kombinasi Jurusan & Tingkat yang dipilih.
                  </p>
                </div>
              ) : (
                filteredSubjects.map((subject) => (
                  <div 
                    key={subject.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Subject Feature Image Header */}
                      {subject.image && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                          <img 
                            src={subject.image} 
                            alt={subject.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#1b3828]/90 text-[#c5a059] text-[10px] font-mono font-bold backdrop-blur-md border border-[#c5a059]/40 flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                            <span>Jurusan {subject.major}</span>
                          </div>
                          <div className="absolute top-3 right-3 text-[11px] font-extrabold text-white bg-[#2d5a3f]/90 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                            {subject.grade}
                          </div>
                          <div className="absolute bottom-3 left-4 right-4 text-white">
                            <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono font-extrabold block">
                              Kode: {subject.code}
                            </span>
                            <h3 className="text-base font-black text-white leading-tight drop-shadow-xs">
                              {subject.name}
                            </h3>
                          </div>
                        </div>
                      )}

                      <div className="p-6 space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {subject.description}
                        </p>

                        <div className="pt-1">
                          <div className="text-[11px] font-bold text-[#1b3828] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[#c5a059]" />
                            <span>Materi & Pokok Bahasan Utama:</span>
                          </div>
                          <div className="space-y-2">
                            {subject.syllabusHighlights.map((hl, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                <Check size={14} className="text-[#2d5a3f] shrink-0 mt-0.5" />
                                <span>{hl}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">{subject.category}</span>
                      <span className="flex items-center gap-1 font-extrabold text-[#2d5a3f] bg-[#e8f0eb] px-2.5 py-1 rounded-md border border-[#2d5a3f]/20">
                        <Clock size={13} className="text-[#c5a059]" /> {subject.weeklyHours} Jam/Minggu
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 2: EKSTRAKURIKULER */}
        {activeTab === 'ekskul' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {EXTRACURRICULARS.map((extra) => (
              <div 
                key={extra.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Extracurricular Feature Image Header */}
                  {extra.image && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img 
                        src={extra.image} 
                        alt={extra.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1b3828]/85 text-[#c5a059] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-[#c5a059]/30">
                        {extra.category}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e8f0eb] text-[#2d5a3f] flex items-center justify-center font-bold shrink-0">
                        {getExtraIcon(extra.icon)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#1b3828] group-hover:text-[#2d5a3f] transition-colors">
                          {extra.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {extra.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#f2f7f4] border border-[#dbe5de] space-y-1 text-xs">
                      <div className="text-slate-500 font-medium">
                        Jadwal Latihan: <strong className="text-slate-800">{extra.schedule}</strong>
                      </div>
                      <div className="text-slate-500 font-medium">
                        Pembina: <strong className="text-slate-800">{extra.supervisor}</strong>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Prestasi Terbaru:
                      </div>
                      {extra.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#2d5a3f] font-medium">
                          <Trophy size={13} className="text-[#c5a059] shrink-0" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2d5a3f] font-bold">
                  <span>Terbuka untuk semua siswa</span>
                  <Award size={16} className="text-[#c5a059]" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
