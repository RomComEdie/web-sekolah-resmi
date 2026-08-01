import React from 'react';
import { UserCheck, BookOpen, Quote, Award } from 'lucide-react';
import { TEACHERS } from '../data/schoolData';

export const TeacherProfiles: React.FC = () => {
  return (
    <section id="guru" className="py-16 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="neu-badge px-4 py-1.5 text-xs font-bold text-[#386652] uppercase tracking-widest">
            Tenaga Pendidik Profesional
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Profil Guru & Kepala Program
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Didampingi oleh praktisi dan pendidik tersertifikasi yang berpengalaman di bidang akademis dan dunia industri.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEACHERS.map((teacher) => (
            <div key={teacher.id} className="neu-card p-6 flex flex-col justify-between space-y-5">
              
              <div className="space-y-4">
                {/* Photo & Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={teacher.foto}
                      alt={teacher.nama}
                      className="w-16 h-16 rounded-2xl object-cover neu-pressed p-1"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 neu-circle flex items-center justify-center text-[#386652]">
                      <UserCheck className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-snug">
                      {teacher.nama}, {teacher.gelar}
                    </h3>
                    <p className="text-xs text-[#386652] font-bold">{teacher.jabatan}</p>
                  </div>
                </div>

                {/* Subject & Qualification */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <BookOpen className="w-3.5 h-3.5 text-[#386652] shrink-0" />
                    <span className="font-medium">{teacher.mataPelajaran}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Award className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                    <span>{teacher.kualifikasi}</span>
                  </div>
                </div>

                {/* Quote */}
                <div className="neu-pressed p-3.5 rounded-xl flex items-start gap-2.5 text-xs italic text-slate-600">
                  <Quote className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <p>"{teacher.motto}"</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="pt-3 border-t border-slate-300/40 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>Status: Pengajar Aktif</span>
                <span className="text-[#386652] font-bold">Tersertifikasi Keahlian</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
