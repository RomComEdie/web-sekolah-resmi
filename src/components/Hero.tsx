import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Code2, Calculator, Wrench } from 'lucide-react';
import { SCHOOL_INFO, SCHOOL_STATS } from '../data/schoolData';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 neu-badge px-4 py-2 text-xs font-semibold text-[#2d5a46]">
              <Sparkles className="w-4 h-4 text-[#d4af37] animate-spin" />
              <span>PPDB T.A. 2026/2027 Telah Dibuka!</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Membangun Masa Depan Gemilang Bersama{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d5a46] via-[#386652] to-[#1e3a2d]">
                {SCHOOL_INFO.nama}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
              {SCHOOL_INFO.slogan}. Nikmati fasilitas belajar modern dengan 3 Program Keahlian unggulan berstandar nasional dan industri.
            </p>

            {/* Quick Major Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jurusan Pilihan:</span>
              <div className="neu-flat-sm px-3 py-1.5 text-xs font-semibold text-[#2d5a46] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#386652]" />
                <span>RPL (Software)</span>
              </div>
              <div className="neu-flat-sm px-3 py-1.5 text-xs font-semibold text-[#b8860b] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#d4af37]" />
                <span>AKL (Akuntansi)</span>
              </div>
              <div className="neu-flat-sm px-3 py-1.5 text-xs font-semibold text-[#386652] flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#2d5a46]" />
                <span>TSM (Otomotif)</span>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#386652] shrink-0" />
                <span>Validasi NISN Unik & Otomatis</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#386652] shrink-0" />
                <span>Langsung Cetak Bukti PDF PPDB</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#386652] shrink-0" />
                <span>Sistem Pendaftaran Online Resmi</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Pembelajaran Berstandar Industri</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#pendaftaran"
                className="neu-btn-primary px-7 py-3.5 text-sm font-bold tracking-wide flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <span>Isi Form Pendaftaran PPDB</span>
                <ArrowRight className="w-4 h-4 text-[#fef08a]" />
              </a>
            </div>
          </div>

          {/* Right Visual Neumorphic Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="neu-card p-6 relative z-10">
              <div className="relative rounded-2xl overflow-hidden neu-pressed p-2 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                  alt="Siswa SMK Prestasi Nusantara"
                  className="w-full h-64 sm:h-72 object-cover rounded-xl"
                />
                <div className="absolute top-4 right-4 neu-badge px-3 py-1.5 bg-[#e5ece8]/90 text-xs font-bold text-[#2d5a46] border border-[#d4af37]/40">
                  SMK Bisa & Hebat!
                </div>
              </div>

              {/* Floating Badge */}
              <div className="p-4 neu-flat rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 neu-circle flex items-center justify-center text-[#386652] font-bold text-lg">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Pendidikan Vokasi Unggulan</h4>
                  <p className="text-xs text-slate-500">
                    Fasilitas laboratorium modern & kemitraan industri terpercaya.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Grid Bar */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOOL_STATS.map((stat) => (
            <div key={stat.label} className="neu-card p-5 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2d5a46] tracking-tight">
                {stat.nilai}
              </div>
              <div className="font-bold text-slate-800 text-sm">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.deskripsi}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
