import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown, 
  Award, 
  BookOpen, 
  Code, 
  Landmark, 
  Wrench, 
  FileText,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { SCHOOL_INFO } from '../../data/schoolData';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdminModal?: () => void;
  onOpenStatusModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenAdminModal, onOpenStatusModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [ppdbWaveStatus, setPpdbWaveStatus] = useState<string>(() => {
    const saved = localStorage.getItem('smk_website_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.ppdbWaveStatus) return parsed.ppdbWaveStatus;
      } catch (e) { console.error(e); }
    }
    return 'GELOMBANG_1_OPEN';
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const saved = localStorage.getItem('smk_website_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.ppdbWaveStatus) setPpdbWaveStatus(parsed.ppdbWaveStatus);
        } catch (e) { console.error(e); }
      }
    };
    window.addEventListener('smk_website_settings_updated', handleSettingsUpdate);
    window.addEventListener('ppdb_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('smk_website_settings_updated', handleSettingsUpdate);
      window.removeEventListener('ppdb_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const isPpdbClosed = ppdbWaveStatus === 'CLOSED';

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
    { id: 'profil', label: 'Profil' },
    { id: 'jurusan', label: 'Jurusan', hasDropdown: true, badge: '3 Major' },
    { id: 'berita', label: 'Berita' },
    { id: 'ekstrakurikuler', label: 'Ekskul' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 transition-all duration-300"
    >
      {/* Top Bar Info */}
      <div className="bg-[#1b3828] text-[#e8f0eb] py-1.5 px-4 text-xs font-medium border-b border-[#2d5a3f]/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-5">
            <a href={`tel:${SCHOOL_INFO.phone}`} className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors">
              <Phone size={12} className="text-[#c5a059]" />
              <span>{SCHOOL_INFO.phone}</span>
            </a>
            <a href={`https://wa.me/${SCHOOL_INFO.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors">
              <Mail size={12} className="text-[#c5a059]" />
              <span>WA: {SCHOOL_INFO.whatsapp}</span>
            </a>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin size={12} className="text-[#c5a059]" />
              <span>Kota Sejahtera, Jawa Barat</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isPpdbClosed && onOpenStatusModal && (
              <button
                onClick={onOpenStatusModal}
                className="hover:text-[#c5a059] transition-all flex items-center gap-1 text-[11px] font-extrabold text-[#c5a059] bg-[#2d5a3f]/80 hover:bg-[#2d5a3f] px-2.5 py-0.5 rounded-full border border-[#c5a059]/40 cursor-pointer active:scale-95"
              >
                <Search size={11} />
                <span>Cek Status PPDB</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2d5a3f] text-[#f7f2e7] text-[11px] font-semibold border border-[#c5a059]/40">
              <Award size={11} className="text-[#c5a059]" /> Akreditasi {SCHOOL_INFO.accreditation}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dock Container Navigation Bar */}
      <nav 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'py-2 px-2 sm:px-4' 
            : 'py-3 px-2 sm:px-4'
        }`}
      >
        <div className={`max-w-7xl mx-auto rounded-3xl sm:rounded-full transition-all duration-300 px-3 sm:px-5 py-2 flex items-center justify-between ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(27,56,40,0.18)] border border-slate-200/90'
            : 'bg-[#FAFBF9]/95 backdrop-blur-md shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-200/80'
        }`}>
          {/* Logo Brand */}
          <button 
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#1b3828] to-[#2d5a3f] text-[#c5a059] flex items-center justify-center shadow-md border border-[#c5a059]/40 group-hover:scale-105 transition-all">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </div>
            <div>
              <span className="block font-black text-base sm:text-lg text-[#1b3828] tracking-tight leading-none group-hover:text-[#2d5a3f] transition-colors">
                SMK BHINNEKA NUSANTARA
              </span>
              <span className="block text-[10px] font-bold text-[#c5a059] mt-0.5 tracking-widest uppercase">
                Kejuruan Unggulan Vokasi
              </span>
            </div>
          </button>

          {/* Tactile Capsule Floating Nav Bar (Desktop) - Styled like the reference image */}
          <div className="hidden lg:flex items-center p-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 shadow-inner gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              if (item.hasDropdown) {
                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <motion.button
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1b3828] text-white shadow-[0_4px_14px_rgba(27,56,40,0.35)]'
                          : 'text-slate-700 hover:text-[#1b3828] hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                          isActive 
                            ? 'bg-[#c5a059] text-[#1b3828]' 
                            : 'bg-[#e8f0eb] text-[#2d5a3f]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={13} className={isActive ? 'text-[#c5a059]' : 'text-slate-400'} />
                      </motion.div>
                    </motion.button>

                    {/* Smooth Dropdown (Turun dari atas ke bawah, ultra-fluid) */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-0 mt-2 w-72 rounded-3xl bg-white/98 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(27,56,40,0.25)] border border-slate-200/90 p-2 z-50 overflow-hidden"
                        >
                          <div className="px-3 py-1.5 text-[10px] font-black text-[#c5a059] uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                            <span>Program Keahlian</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>

                          <div className="space-y-1">
                            {[
                              { id: 'jurusan-rpl', title: 'RPL (Software Engineering)', sub: 'Rekayasa Perangkat Lunak', icon: Code, bg: 'bg-[#e8f0eb]', text: 'text-[#2d5a3f]' },
                              { id: 'jurusan-akl', title: 'AKL (Akuntansi Digital)', sub: 'Perbankan & Keuangan', icon: Landmark, bg: 'bg-[#f7f2e7]', text: 'text-[#b38e47]' },
                              { id: 'jurusan-tsm', title: 'TSM (Otomotif Motor)', sub: 'Teknik Sepeda Motor', icon: Wrench, bg: 'bg-slate-100', text: 'text-slate-700' }
                            ].map((jur, idx) => {
                              const IconComp = jur.icon;
                              return (
                                <motion.button
                                  key={jur.id}
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04, duration: 0.2 }}
                                  whileHover={{ x: 3, scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleNavClick(jur.id)}
                                  className="w-full text-left p-2.5 rounded-2xl hover:bg-[#f2f7f4] flex items-center gap-3 transition-all cursor-pointer group"
                                >
                                  <div className={`p-2 rounded-xl ${jur.bg} ${jur.text} group-hover:scale-110 transition-transform shadow-xs`}>
                                    <IconComp size={16} />
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-[#2d5a3f] transition-colors">
                                      {jur.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">{jur.sub}</div>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1b3828] text-white shadow-[0_4px_14px_rgba(27,56,40,0.35)]'
                      : 'text-slate-700 hover:text-[#1b3828] hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right Action CTA Buttons (Capsule Pill Style) */}
          <div className="hidden sm:flex items-center space-x-2">
            {!isPpdbClosed && onOpenStatusModal && (
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenStatusModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 text-[#1b3828] text-xs font-black hover:bg-amber-100 transition-all border border-amber-300 shadow-xs cursor-pointer"
              >
                <Search size={13} className="text-[#c5a059]" />
                <span>Cek Status</span>
              </motion.button>
            )}

            {!isPpdbClosed ? (
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleNavClick('ppdb')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1b3828] to-[#2d5a3f] text-[#f7f2e7] text-xs font-black shadow-md hover:shadow-lg transition-all border border-[#c5a059]/40 cursor-pointer"
              >
                <FileText size={15} className="text-[#c5a059]" />
                <span>Daftar PPDB</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleNavClick('kontak')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b3828] text-[#c5a059] text-xs font-black shadow-md transition-all border border-[#c5a059]/40 cursor-pointer"
              >
                <Phone size={14} />
                <span>Hubungi Kami</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-slate-100 text-slate-800 hover:text-[#2d5a3f] hover:bg-slate-200 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Ultra Smooth Mobile Drawer Animation (Turun dari atas ke bawah, zero-jank close) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden mt-2 max-w-7xl mx-auto bg-white/98 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-4 space-y-3 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {navItems.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1b3828] text-white shadow-md'
                          : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-[#c5a059] text-[#1b3828]' : 'bg-[#e8f0eb] text-[#2d5a3f]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {!isPpdbClosed && onOpenStatusModal && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenStatusModal(); }}
                    className="w-full py-2.5 rounded-2xl bg-amber-50 text-[#1b3828] font-black text-xs flex items-center justify-center gap-2 border border-amber-300 cursor-pointer active:scale-98 transition-transform"
                  >
                    <Search size={15} className="text-[#c5a059]" />
                    <span>Cek Status Pendaftaran PPDB</span>
                  </button>
                )}

                {!isPpdbClosed ? (
                  <button
                    onClick={() => handleNavClick('ppdb')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1b3828] to-[#2d5a3f] text-[#f7f2e7] font-black text-xs flex items-center justify-center gap-2 border border-[#c5a059]/40 shadow-md cursor-pointer active:scale-98 transition-transform"
                  >
                    <FileText size={16} className="text-[#c5a059]" />
                    <span>Daftar PPDB / MPLS 2026</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('kontak')}
                    className="w-full py-3 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center justify-center gap-2 border border-[#c5a059]/40 shadow-md cursor-pointer active:scale-98 transition-transform"
                  >
                    <Phone size={16} />
                    <span>Hubungi Informasi Sekolah</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};


