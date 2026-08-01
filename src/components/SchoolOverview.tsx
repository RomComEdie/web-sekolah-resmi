import React from 'react';
import { Target, Compass, Sparkles, Building, BookOpen, Cpu, ShieldCheck } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

export const SchoolOverview: React.FC = () => {
  const facilities = [
    { title: 'Laboratorium Komputer & RPL', desc: 'Core i7 PC, Server Cloud, iMac, Fiber Optic 1 Gbps', icon: Cpu },
    { title: 'Mini Bank & Lab Akuntansi AKL', desc: 'Sistem Simulasi Perbankan & Software MYOB/Accurate', icon: Building },
    { title: 'Bengkel AHASS Honda TSM', desc: 'Bike Lift Hidrolik, Scanner Injeksi FI & Diagnostic Tools', icon: Sparkles },
    { title: 'Ruang Praktik & Sertifikasi', desc: 'Tempat Uji Kompetensi Terlisensi Berstandar Industri', icon: ShieldCheck }
  ];

  return (
    <section id="ringkasan" className="py-16 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="neu-badge px-4 py-1.5 text-xs font-bold text-[#386652] uppercase tracking-widest">
            Profil & Identitas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Ringkasan {SCHOOL_INFO.nama}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Lembaga pendidikan vokasi terakreditasi A yang fokus mencetak lulusan kompeten, mandiri, dan berkarakter mulia.
          </p>
        </div>

        {/* Sambutan Kepsek & Visi Misi Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sambutan Kepala Sekolah Card */}
          <div className="lg:col-span-5 neu-card p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={SCHOOL_INFO.sambutanKepsek.foto}
                  alt={SCHOOL_INFO.sambutanKepsek.nama}
                  className="w-16 h-16 rounded-2xl object-cover neu-pressed p-1"
                />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {SCHOOL_INFO.sambutanKepsek.nama}
                  </h3>
                  <p className="text-xs text-[#386652] font-semibold">
                    {SCHOOL_INFO.sambutanKepsek.jabatan}
                  </p>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-600 italic leading-relaxed neu-pressed p-4 rounded-xl">
                "{SCHOOL_INFO.sambutanKepsek.pesan}"
              </blockquote>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-300/40 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>NPSN: {SCHOOL_INFO.npsn}</span>
              <span className="text-[#b8860b] font-bold">Akreditasi A (Unggul)</span>
            </div>
          </div>

          {/* Visi & Misi Card */}
          <div className="lg:col-span-7 neu-card p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#386652] font-bold text-base mb-2">
                <Target className="w-5 h-5 text-[#386652]" />
                <h3>Visi Sekolah</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium bg-[#e5ece8] p-4 neu-pressed rounded-xl border border-white/50">
                {SCHOOL_INFO.visi}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#b8860b] font-bold text-base mb-3">
                <Compass className="w-5 h-5 text-[#d4af37]" />
                <h3>Misi Sekolah</h3>
              </div>
              <ul className="space-y-2.5">
                {SCHOOL_INFO.misi.map((misiItem, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full neu-flat flex items-center justify-center text-[#386652] font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{misiItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Facilities Section */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-800">Fasilitas Utama Sekolah</h3>
            <p className="text-xs text-slate-500">Sarana prasarana modern menunjang praktek kerja siswa</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac) => {
              const IconComp = fac.icon;
              return (
                <div key={fac.title} className="neu-card p-5 space-y-3">
                  <div className="w-12 h-12 neu-circle flex items-center justify-center text-[#386652]">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{fac.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
