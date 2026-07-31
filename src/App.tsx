import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SchoolProfile } from './components/SchoolProfile';
import { MajorsSection } from './components/MajorsSection';
import { TeachersSection } from './components/TeachersSection';
import { CurriculumSection } from './components/CurriculumSection';
import { PpdbSection } from './components/PpdbSection';
import { MapAndContactSection } from './components/MapAndContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [selectedMajorChoice, setSelectedMajorChoice] = useState<'RPL' | 'AKL' | 'TSM'>('RPL');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId === 'jurusan-rpl') {
      const el = document.getElementById('jurusan');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (sectionId === 'jurusan-akl') {
      const el = document.getElementById('jurusan');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (sectionId === 'jurusan-tsm') {
      const el = document.getElementById('jurusan');
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
    scrollToSection('ppdb');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbf9] text-slate-800 font-sans selection:bg-[#2d5a3f]/20 selection:text-[#1b3828]">
      {/* Sticky Top Header Navigation */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={scrollToSection} 
      />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* Hero Section with Parallax */}
        <HeroSection onNavigate={scrollToSection} />

        {/* Profil Sekolah (Visi, Misi, Fasilitas) */}
        <SchoolProfile />

        {/* Penjelasan Bidang / Jurusan RPL, AKL, TSM */}
        <MajorsSection 
          onNavigatePPDB={handleNavigatePPDBWithMajor} 
          selectedMajorId={
            activeSection === 'jurusan-rpl' ? 'rpl' :
            activeSection === 'jurusan-akl' ? 'akl' :
            activeSection === 'jurusan-tsm' ? 'tsm' : undefined
          }
        />

        {/* Daftar & Profil Guru dan Perannya */}
        <TeachersSection />

        {/* Menu Daftar Pembelajaran (Kurikulum & Ekskul) */}
        <CurriculumSection />

        {/* Fitur Pendaftaran MPLS / PPDB & Download Formulir */}
        <PpdbSection initialMajorChoice={selectedMajorChoice} />

        {/* Embed Map & Lokasi & Kontak */}
        <MapAndContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
