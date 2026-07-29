import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown, 
  Award, 
  Download, 
  BookOpen, 
  Users, 
  Code, 
  Landmark, 
  Wrench, 
  FileText 
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenRegistrationModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenRegistrationModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [majorsDropdownOpen, setMajorsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Sekolah' },
    { id: 'jurusan', label: 'Jurusan / Bidang', hasDropdown: true },
    { id: 'guru', label: 'Guru & Peran' },
    { id: 'pembelajaran', label: 'Daftar Pembelajaran' },
    { id: 'kontak', label: 'Kontak & Lokasi' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMajorsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar Info */}
      <div className="bg-[#1b3828] text-[#e8f0eb] py-2 px-4 text-xs font-medium border-b border-[#2d5a3f]/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href={`tel:${SCHOOL_INFO.phone}`} className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors">
              <Phone size={13} className="text-[#c5a059]" />
              <span>{SCHOOL_INFO.phone}</span>
            </a>
            <a href={`https://wa.me/${SCHOOL_INFO.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors">
              <Mail size={13} className="text-[#c5a059]" />
              <span>WA: {SCHOOL_INFO.whatsapp}</span>
            </a>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin size={13} className="text-[#c5a059]" />
              <span>Kota Sejahtera, Jawa Barat</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2d5a3f] text-[#f7f2e7] text-[11px] font-semibold border border-[#c5a059]/40">
              <Award size={12} className="text-[#c5a059]" /> Akreditasi {SCHOOL_INFO.accreditation}
            </span>
            <span className="text-slate-300">NPSN: {SCHOOL_INFO.npsn}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#ffffff]/95 backdrop-blur-md shadow-md py-3 border-b border-[#2d5a3f]/15' 
            : 'bg-[#FAFBF9] py-4 border-b border-slate-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <button 
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2d5a3f] text-[#c5a059] flex items-center justify-center shadow-sm border border-[#c5a059]/40 group-hover:bg-[#1b3828] transition-colors">
              <GraduationCap className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="block font-bold text-lg sm:text-xl text-[#1b3828] tracking-tight leading-none group-hover:text-[#2d5a3f] transition-colors">
                SMK NUSA BANGSA
              </span>
              <span className="block text-[11px] font-medium text-[#c5a059] mt-0.5 tracking-wider uppercase">
                Kejuruan Unggulan Vokasi
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="relative group/dropdown">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors ${
                        activeSection === item.id
                          ? 'text-[#2d5a3f] bg-[#e8f0eb]'
                          : 'text-slate-700 hover:text-[#2d5a3f] hover:bg-slate-100/80'
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="text-slate-400 group-hover/dropdown:rotate-180 transition-transform" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-1 w-64 rounded-xl bg-white shadow-xl border border-slate-200/80 py-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 z-50">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-[#c5a059] uppercase tracking-wider">
                        Program Keahlian
                      </div>
                      <button
                        onClick={() => handleNavClick('jurusan-rpl')}
                        className="w-full text-left px-3.5 py-2.5 text-sm text-slate-700 hover:bg-[#f2f7f4] hover:text-[#2d5a3f] flex items-center gap-2.5 font-medium"
                      >
                        <div className="p-1.5 rounded bg-[#e8f0eb] text-[#2d5a3f]">
                          <Code size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">RPL (Rekayasa Perangkat Lunak)</div>
                          <div className="text-[11px] text-slate-500">Software & Web Developer</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('jurusan-akl')}
                        className="w-full text-left px-3.5 py-2.5 text-sm text-slate-700 hover:bg-[#f2f7f4] hover:text-[#2d5a3f] flex items-center gap-2.5 font-medium"
                      >
                        <div className="p-1.5 rounded bg-[#f7f2e7] text-[#b38e47]">
                          <Landmark size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">AKL (Perbankan & Akuntansi)</div>
                          <div className="text-[11px] text-slate-500">Finansial & Banking Digital</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('jurusan-tsm')}
                        className="w-full text-left px-3.5 py-2.5 text-sm text-slate-700 hover:bg-[#f2f7f4] hover:text-[#2d5a3f] flex items-center gap-2.5 font-medium"
                      >
                        <div className="p-1.5 rounded bg-slate-100 text-slate-700">
                          <Wrench size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">TSM (Teknik Sepeda Motor)</div>
                          <div className="text-[11px] text-slate-500">Otomotif & Engine Diagnostic</div>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'text-[#2d5a3f] bg-[#e8f0eb]'
                      : 'text-slate-700 hover:text-[#2d5a3f] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('ppdb')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2d5a3f] text-[#f7f2e7] text-xs sm:text-sm font-bold shadow-sm hover:bg-[#1b3828] hover:shadow transition-all border border-[#c5a059]/40 active:scale-95"
            >
              <FileText size={16} className="text-[#c5a059]" />
              <span>Daftar PPDB</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#2d5a3f] hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-[#e8f0eb] text-[#2d5a3f]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>

                {item.hasDropdown && (
                  <div className="pl-4 pr-2 py-1 space-y-1 my-1 border-l-2 border-[#2d5a3f]/20">
                    <button
                      onClick={() => handleNavClick('jurusan-rpl')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#2d5a3f] flex items-center gap-2"
                    >
                      <Code size={14} className="text-[#2d5a3f]" />
                      <span>RPL (Rekayasa Perangkat Lunak)</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('jurusan-akl')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#2d5a3f] flex items-center gap-2"
                    >
                      <Landmark size={14} className="text-[#b38e47]" />
                      <span>AKL (Perbankan & Akuntansi)</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('jurusan-tsm')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#2d5a3f] flex items-center gap-2"
                    >
                      <Wrench size={14} className="text-slate-600" />
                      <span>TSM (Teknik Sepeda Motor)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => handleNavClick('ppdb')}
                className="w-full py-3 rounded-lg bg-[#2d5a3f] text-[#f7f2e7] font-bold text-sm flex items-center justify-center gap-2 border border-[#c5a059]/40 shadow-sm"
              >
                <FileText size={18} className="text-[#c5a059]" />
                <span>Daftar PPDB</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
