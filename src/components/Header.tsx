import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, Menu, X } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface HeaderProps {
  registrationCount?: number;
}

export const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tentang Sekolah', href: '#ringkasan' },
    { label: 'Jurusan (RPL, AKL, TSM)', href: '#kejuruan' },
    { label: 'Profil Guru', href: '#guru' },
    { label: 'Formulir PPDB', href: '#pendaftaran' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#e5ece8]/90 backdrop-blur-md border-b border-white/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 neu-circle flex items-center justify-center text-[#386652] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-800 block leading-tight">
                {SCHOOL_INFO.nama}
              </span>
              <span className="text-xs text-[#b8860b] font-semibold tracking-wide flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                Akreditasi {SCHOOL_INFO.akreditasi}
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-[#386652] transition-colors py-1 px-3 rounded-lg hover:bg-slate-300/40"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#pendaftaran"
              className="neu-btn-primary px-5 py-2 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#fef08a]" />
              <span>Daftar PPDB</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="neu-btn p-2.5 text-slate-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-300/50 neu-flat p-4 space-y-3">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 hover:text-[#386652] py-2 px-3 rounded-md hover:bg-slate-300/40"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-2 border-t border-slate-300/40 flex flex-col gap-2">
              <a
                href="#pendaftaran"
                onClick={() => setMobileMenuOpen(false)}
                className="neu-btn-primary w-full py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#fef08a]" />
                <span>Daftar PPDB Sekarang</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
