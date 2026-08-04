import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { SchoolProfile } from './components/sections/SchoolProfile';
import { MajorsSection } from './components/sections/MajorsSection';
import { TeachersSection } from './components/sections/TeachersSection';
import { CurriculumSection } from './components/sections/CurriculumSection';
import { AnnouncementsSection } from './components/sections/AnnouncementsSection';
import { ExtracurricularSection } from './components/sections/ExtracurricularSection';
import { FaqSection } from './components/sections/FaqSection';
import { PpdbSection } from './components/sections/PpdbSection';
import { MapAndContactSection } from './components/sections/MapAndContactSection';
import { AdminPortal } from './components/admin/AdminPortal';
import { StatusTrackerModal } from './components/sections/StatusTrackerModal';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [selectedMajorChoice, setSelectedMajorChoice] = useState<'RPL' | 'AKL' | 'TSM'>('RPL');
  const checkIsAdminUrl = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      hash === '#admin' ||
      path === '/admin' ||
      path.endsWith('/admin') ||
      search.includes('admin')
    );
  };

  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(checkIsAdminUrl);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

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
    const handleUrlChange = () => {
      if (checkIsAdminUrl()) {
        setIsAdminPortalOpen(true);
      }
    };

    window.addEventListener('open_admin_cms', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('open_admin_cms', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminPortalOpen(true);
    if (!checkIsAdminUrl()) {
      window.location.hash = '#admin';
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminPortalOpen(false);
    if (checkIsAdminUrl()) {
      window.history.pushState("", document.title, window.location.pathname.replace(/\/admin$/, '') || '/');
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId === 'ppdb' && isPpdbClosed) {
      const element = document.getElementById('kontak');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (sectionId === 'jurusan-rpl') {
      const el = document.getElementById('card-jurusan-rpl');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (sectionId === 'jurusan-akl') {
      const el = document.getElementById('card-jurusan-akl');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (sectionId === 'jurusan-tsm') {
      const el = document.getElementById('card-jurusan-tsm');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigatePPDBWithMajor = (majorCode: 'RPL' | 'AKL' | 'TSM') => {
    setSelectedMajorChoice(majorCode);
    if (isPpdbClosed) {
      scrollToSection('jurusan');
    } else {
      scrollToSection('ppdb');
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#fafbf9] text-slate-800 font-sans selection:bg-[#2d5a3f]/20 selection:text-[#1b3828] relative">
        {/* Sticky Top Header Navigation */}
        <Navbar 
          activeSection={activeSection} 
          onNavigate={scrollToSection} 
          onOpenAdminModal={handleOpenAdmin}
          onOpenStatusModal={() => setIsStatusModalOpen(true)}
        />

        {/* Main Page Sections */}
        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection onNavigate={scrollToSection} />

          {/* Profil Sekolah (Visi, Misi, Fasilitas) */}
          <SchoolProfile />

          {/* Penjelasan Bidang / Jurusan RPL, AKL, TSM (1 Card Per Jurusan) */}
          <MajorsSection 
            onNavigatePPDB={handleNavigatePPDBWithMajor} 
            selectedMajorId={
              activeSection === 'jurusan-rpl' ? 'rpl' :
              activeSection === 'jurusan-akl' ? 'akl' :
              activeSection === 'jurusan-tsm' ? 'tsm' : undefined
            }
          />

          {/* Berita & Pengumuman Resmi Sekolah */}
          <AnnouncementsSection />

          {/* Ekstrakurikuler & Prestasi Siswa */}
          <ExtracurricularSection />

          {/* Daftar & Profil Guru dan Perannya */}
          <TeachersSection />

          {/* Menu Daftar Pembelajaran & Kurikulum */}
          <CurriculumSection />

          {/* Pertanyaan Umum FAQ */}
          <FaqSection />

          {/* Fitur Pendaftaran MPLS / PPDB & Download Formulir */}
          {!isPpdbClosed && (
            <PpdbSection initialMajorChoice={selectedMajorChoice} />
          )}

          {/* Embed Map & Lokasi & Kontak */}
          <MapAndContactSection />
        </main>

        {/* Footer */}
        <Footer 
          onNavigate={scrollToSection} 
          onOpenAdminModal={handleOpenAdmin} 
        />

        {/* Status Tracker Modal */}
        <StatusTrackerModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
        />

        {/* Private Admin Portal Modal */}
        <AdminPortal 
          isOpen={isAdminPortalOpen} 
          onClose={handleCloseAdmin} 
        />

        {/* Floating Action Triggers */}
        {!isPpdbClosed && (
          <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="px-3.5 py-2.5 rounded-full bg-[#c5a059] text-[#1b3828] font-black text-xs hover:bg-[#b08c46] transition-all shadow-xl border border-amber-300 flex items-center gap-2 group backdrop-blur-md cursor-pointer"
              title="Cek Status Pendaftaran PPDB"
            >
              <Search size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Cek Status PPDB</span>
            </button>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}

