import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  GraduationCap, 
  Mail, 
  Award, 
  Quote, 
  X, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import { TEACHERS_DATA } from '../data/schoolData';
import { Teacher } from '../types';

export const TeachersSection: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeacherModal, setSelectedTeacherModal] = useState<Teacher | null>(null);

  const departments = ['Semua', 'Pimpinan', 'RPL', 'AKL', 'TSM', 'Umum'];

  const filteredTeachers = TEACHERS_DATA.filter((teacher) => {
    const matchesDept = selectedDept === 'Semua' || teacher.department === selectedDept;
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <section id="guru" className="py-20 bg-[#fafbf9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0eb] text-[#2d5a3f] text-xs font-bold uppercase tracking-wider border border-[#2d5a3f]/20">
            <Users size={14} className="text-[#c5a059]" />
            <span>Tenaga Pendidik & Kependidikan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3828] tracking-tight">
            Daftar & Profil Guru serta Perannya
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Guru-guru bersertifikasi dan praktisi berpengalaman yang berdedikasi membimbing dan membentuk karakter serta keahlian siswa.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedDept === dept
                    ? 'bg-[#1b3828] text-[#f7f2e7] shadow-sm border border-[#c5a059]/40'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dept === 'Semua' ? 'Semua Guru' : `Departemen ${dept}`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama guru / peran / mapel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#2d5a3f] focus:ring-1 focus:ring-[#2d5a3f]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

        </div>

        {/* Teacher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <div 
              key={teacher.id}
              onClick={() => setSelectedTeacherModal(teacher)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#2d5a3f]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={teacher.photoUrl} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1b3828]/85 text-[#c5a059] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-[#c5a059]/30">
                    {teacher.department}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider">
                    {teacher.role}
                  </div>
                  <h3 className="text-base font-bold text-[#1b3828] line-clamp-1 group-hover:text-[#2d5a3f] transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 line-clamp-1">
                    <BookOpen size={13} className="text-[#2d5a3f] shrink-0" />
                    <span>{teacher.subject}</span>
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2d5a3f]">
                <span>Lihat Profil Lengkap</span>
                <span className="w-6 h-6 rounded-full bg-[#e8f0eb] flex items-center justify-center text-[#2d5a3f] group-hover:bg-[#2d5a3f] group-hover:text-white transition-colors">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Users className="mx-auto w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Tidak ada guru ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba kata kunci pencarian atau filter departemen yang berbeda.</p>
          </div>
        )}

      </div>

      {/* Detailed Modal Popup */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-0 relative animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#1b3828] text-white p-6 relative">
              <button 
                onClick={() => setSelectedTeacherModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <img 
                  src={selectedTeacherModal.photoUrl} 
                  alt={selectedTeacherModal.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#c5a059] shadow-md"
                />
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2d5a3f] text-[#c5a059] text-[10px] font-bold uppercase mb-1 border border-[#c5a059]/40">
                    {selectedTeacherModal.role}
                  </span>
                  <h3 className="text-lg font-bold text-[#f7f2e7] leading-tight">
                    {selectedTeacherModal.name}
                  </h3>
                  <div className="text-xs text-slate-300 mt-1">
                    Departemen {selectedTeacherModal.department}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#f2f7f4] border border-[#dbe5de]">
                  <span className="font-bold text-slate-500 block mb-0.5">Mata Pelajaran Ampuhan:</span>
                  <span className="font-bold text-[#1b3828] text-sm">{selectedTeacherModal.subject}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 block mb-0.5">Pendidikan Terakhir:</span>
                  <span className="font-semibold text-slate-800">{selectedTeacherModal.education}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-500 block">NIP / NUPTK:</span>
                    <span className="font-mono text-slate-700">{selectedTeacherModal.nip}</span>
                  </div>
                  <CheckCircle2 size={18} className="text-[#2d5a3f]" />
                </div>
              </div>

              {/* Bio & Quote */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio & Pengalaman</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                  {selectedTeacherModal.bio}
                </p>
              </div>

              {selectedTeacherModal.quote && (
                <div className="p-3.5 rounded-xl bg-[#f7f2e7] border border-[#c5a059]/30 text-xs italic text-[#1b3828] flex items-start gap-2">
                  <Quote size={16} className="text-[#c5a059] shrink-0 mt-0.5" />
                  <span>"{selectedTeacherModal.quote}"</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setSelectedTeacherModal(null)}
                  className="w-full py-2.5 rounded-xl bg-[#1b3828] text-white font-bold text-xs hover:bg-[#2d5a3f] transition-colors"
                >
                  Tutup Profil
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
