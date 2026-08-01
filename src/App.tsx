import React, { useState, useEffect } from 'react';
import { ParallaxBackground } from './components/ParallaxBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SchoolOverview } from './components/SchoolOverview';
import { VocationalMajors } from './components/VocationalMajors';
import { TeacherProfiles } from './components/TeacherProfiles';
import { RegistrationFormComponent } from './components/RegistrationForm';
import { Footer } from './components/Footer';
import { AdminCrudModal } from './components/AdminCrudModal';
import { RegistrationData } from './types';

export default function App() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch registered students list from REST API
  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/pendaftaran');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setRegistrations(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch registrations from server', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const existingNISNs = registrations.map(r => r.nisn);

  // CRUD Operations
  const handleRegistrationSuccess = (newReg: RegistrationData) => {
    setRegistrations(prev => [newReg, ...prev]);
  };

  const handleDeleteRegistration = async (id: string) => {
    const res = await fetch(`/api/pendaftaran/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal menghapus data pendaftaran.');
    }
    setRegistrations(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateRegistration = async (updatedData: RegistrationData) => {
    const res = await fetch(`/api/pendaftaran/${encodeURIComponent(updatedData.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal mengupdate data.');
    }
    setRegistrations(prev =>
      prev.map(item => (item.id === updatedData.id ? json.data : item))
    );
  };

  const handleCreateRegistration = async (formData: any) => {
    const res = await fetch('/api/pendaftaran', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal membuat pendaftaran baru.');
    }
    setRegistrations(prev => [json.data, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#e5ece8] text-slate-800 relative font-sans selection:bg-[#386652] selection:text-white">
      {/* Background Animated Parallax Elements */}
      <ParallaxBackground />

      {/* Main Header Bar */}
      <Header
        registrationCount={registrations.length}
      />

      {/* Main Content Sections */}
      <main className="relative">
        <Hero />
        <SchoolOverview />
        <VocationalMajors />
        <TeacherProfiles />
        <RegistrationFormComponent
          onRegistrationSuccess={handleRegistrationSuccess}
          existingNISNs={existingNISNs}
        />
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Modals */}
      <AdminCrudModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        registrations={registrations}
        onRefresh={fetchRegistrations}
        onDelete={handleDeleteRegistration}
        onUpdate={handleUpdateRegistration}
        onCreate={handleCreateRegistration}
      />
    </div>
  );
}

