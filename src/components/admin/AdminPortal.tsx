import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { TeacherPortalView } from './TeacherPortalView';
import { KepalaSekolahPortalView } from './KepalaSekolahPortalView';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  UserCheck, 
  LogOut, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  FileSpreadsheet, 
  UploadCloud,
  Eye, 
  EyeOff,
  CheckCircle, 
  Clock, 
  X, 
  AlertCircle, 
  Users, 
  Code, 
  Landmark, 
  Wrench,
  FileText,
  Mail,
  MessageSquare,
  Database,
  Sparkles,
  Filter,
  Check,
  Building2,
  Server,
  Layers,
  ArrowRight,
  Crown,
  Plus,
  CheckCircle2,
  XCircle,
  FilePlus2,
  FileCheck,
  GraduationCap,
  BookOpen,
  ClipboardList,
  School,
  NotebookPen,
  Menu,
  ChevronLeft,
  ChevronRight,
  Globe,
  Megaphone,
  Settings,
  Send,
  Printer,
  Radio,
  BadgeCheck,
  Edit3,
  Edit,
  Trophy
} from 'lucide-react';
import { RegistrationData, Teacher, Extracurricular } from '../../types';
import { TEACHERS_DATA, EXTRACURRICULARS } from '../../data/schoolData';
import { 
  adminLogin, 
  fetchAllPPDBRegistrations, 
  updateRegistrationStatus, 
  deletePPDBRecord, 
  fetchContactMessages, 
  createPPDBRecordAdmin, 
  fetchAuditLogs,
  fetchAnnouncementsList,
  createAnnouncementApi,
  updateAnnouncementApi,
  deleteAnnouncementApi
} from '../../services/api';
import { generateRegistrationPDF, generateHeadmasterExecutivePDF } from '../../utils/pdfGenerator';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'OVERVIEW' | 'PPDB_DATA' | 'WEBSITE_CMS' | 'PPDB_COMMAND' | 'CLASS_MONITOR' | 'MESSAGES' | 'SECURITY';

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('smk_admin_token') ? true : false;
  });
  const [username, setUsername] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = localStorage.getItem('smk_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Website CMS Settings (Super Admin - Pengurus Website Utama & PJ PPDB)
  const [websiteSettings, setWebsiteSettings] = useState(() => {
    const saved = localStorage.getItem('smk_website_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      announcementHeadline: '📢 PENDAFTARAN PPDB SMK BHINNEKA NUSANTARA T.A. 2026/2027 GELOMBANG 1 RESMI DIBUKA!',
      runningBannerText: '🎉 Dapatkan Bebas Biaya Formulir Pendaftaran & Beasiswa Prestasi bagi 50 Pendaftar Pertama! Hubungi Sekretariat PPDB.',
      ppdbWaveStatus: 'GELOMBANG_1_OPEN', // GELOMBANG_1_OPEN, GELOMBANG_2_OPEN, CLOSED
      registrationFee: 'GRATIS (Rp 0)',
      rplQuota: 108,
      aklQuota: 108,
      tsmQuota: 72,
      penanggungJawabName: 'Drs. H. Ahmad Subagja, M.Pd',
      penanggungJawabRole: 'Penanggung Jawab Utama PPDB & Pengurus Website',
      penanggungJawabNip: 'NIP. 19750812 200212 1 003',
      hotlineWhatsapp: '0812-8888-9900',
      secretariatLocation: 'Gedung Rektorat Lt. 1, SMK Bhinneka Nusantara, Tangerang',
    };
  });
  const [showSavedToast, setShowSavedToast] = useState(false);

  // News & Announcements CMS State (Kelola Berita & Pengumuman Utama)
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState<boolean>(false);
  const [annCmsSubTab, setAnnCmsSubTab] = useState<'SETTINGS' | 'NEWS_LIST' | 'CREATE_NEWS' | 'GURU_CMS' | 'EKSKUL_CMS'>('SETTINGS');
  
  // Teachers CMS State
  const [teachersCmsList, setTeachersCmsList] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('smk_teachers_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return TEACHERS_DATA;
  });
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState<boolean>(false);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState<string>('');
  const [teacherForm, setTeacherForm] = useState<{
    name: string;
    role: string;
    department: 'Pimpinan' | 'RPL' | 'AKL' | 'TSM' | 'Umum';
    subject: string;
    education: string;
    nip: string;
    photoUrl: string;
    bio: string;
    quote: string;
  }>({
    name: '',
    role: '',
    department: 'RPL',
    subject: '',
    education: 'S1 Pendidikan Komputer',
    nip: '',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: '',
    quote: ''
  });

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name.trim() || !teacherForm.role.trim()) {
      alert('Nama dan Jabatan Guru wajib diisi!');
      return;
    }

    let updated: Teacher[] = [];
    if (editingTeacherId) {
      updated = teachersCmsList.map(t => t.id === editingTeacherId ? {
        ...t,
        ...teacherForm
      } : t);
      alert(`✅ Profil guru ${teacherForm.name} berhasil diperbarui!`);
    } else {
      const newTeacher: Teacher = {
        id: `GURU-${Date.now()}`,
        ...teacherForm
      };
      updated = [newTeacher, ...teachersCmsList];
      alert(`🎉 Guru ${teacherForm.name} berhasil ditambahkan ke profil sekolah!`);
    }

    setTeachersCmsList(updated);
    localStorage.setItem('smk_teachers_data', JSON.stringify(updated));
    window.dispatchEvent(new Event('smk_teachers_updated'));
    setIsAddingTeacher(false);
    setEditingTeacherId(null);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus profil guru "${name}"?`)) {
      const updated = teachersCmsList.filter(t => t.id !== id);
      setTeachersCmsList(updated);
      localStorage.setItem('smk_teachers_data', JSON.stringify(updated));
      window.dispatchEvent(new Event('smk_teachers_updated'));
      alert(`✅ Profil guru ${name} telah dihapus.`);
    }
  };

  const handleTeacherPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File foto terlalu besar (Maks 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setTeacherForm({ ...teacherForm, photoUrl: evt.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  // Extracurriculars CMS State
  const [ekskulCmsList, setEkskulCmsList] = useState<Extracurricular[]>(() => {
    const saved = localStorage.getItem('smk_extracurriculars_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return EXTRACURRICULARS;
  });
  const [editingEkskulId, setEditingEkskulId] = useState<string | null>(null);
  const [isAddingEkskul, setIsAddingEkskul] = useState<boolean>(false);
  const [ekskulForm, setEkskulForm] = useState<{
    name: string;
    category: 'Akademik & Teknologi' | 'Olahraga' | 'Seni & Budaya' | 'Kepemimpinan';
    schedule: string;
    supervisor: string;
    description: string;
    achievements: string;
    image: string;
  }>({
    name: '',
    category: 'Akademik & Teknologi',
    schedule: 'Jumat, 15:30 WIB',
    supervisor: '',
    description: '',
    achievements: '',
    image: ''
  });

  const handleSaveEkskul = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ekskulForm.name.trim() || !ekskulForm.description.trim()) {
      alert('Nama dan Deskripsi Ekstrakurikuler wajib diisi!');
      return;
    }

    const achievementsList = ekskulForm.achievements
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    let updated: Extracurricular[] = [];
    if (editingEkskulId) {
      updated = ekskulCmsList.map(item => item.id === editingEkskulId ? {
        ...item,
        name: ekskulForm.name,
        category: ekskulForm.category,
        schedule: ekskulForm.schedule,
        supervisor: ekskulForm.supervisor,
        description: ekskulForm.description,
        achievements: achievementsList.length > 0 ? achievementsList : ['Aktif Menghasilkan Prestasi Siswa'],
        image: ekskulForm.image
      } : item);
      alert(`✅ Ekstrakurikuler ${ekskulForm.name} berhasil diperbarui!`);
    } else {
      const newEkskul: Extracurricular = {
        id: `EKSKUL-${Date.now()}`,
        name: ekskulForm.name,
        category: ekskulForm.category,
        schedule: ekskulForm.schedule,
        supervisor: ekskulForm.supervisor,
        description: ekskulForm.description,
        achievements: achievementsList.length > 0 ? achievementsList : ['Aktif Menghasilkan Prestasi Siswa'],
        icon: 'Trophy',
        image: ekskulForm.image
      };
      updated = [newEkskul, ...ekskulCmsList];
      alert(`🎉 Ekstrakurikuler ${ekskulForm.name} berhasil ditambahkan ke website!`);
    }

    setEkskulCmsList(updated);
    localStorage.setItem('smk_extracurriculars_data', JSON.stringify(updated));
    window.dispatchEvent(new Event('smk_ekskul_updated'));
    setIsAddingEkskul(false);
    setEditingEkskulId(null);
  };

  const handleDeleteEkskul = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ekstrakurikuler "${name}"?`)) {
      const updated = ekskulCmsList.filter(item => item.id !== id);
      setEkskulCmsList(updated);
      localStorage.setItem('smk_extracurriculars_data', JSON.stringify(updated));
      window.dispatchEvent(new Event('smk_ekskul_updated'));
      alert(`✅ Ekstrakurikuler ${name} telah dihapus.`);
    }
  };

  const handleEkskulPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File foto terlalu besar (Maks 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setEkskulForm({ ...ekskulForm, image: evt.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Form State for Creating/Editing News
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Pengumuman',
    summary: '',
    content: '',
    author: 'Pengurus Website Utama',
    isImportant: false,
    date: new Date().toISOString().split('T')[0]
  });
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Semua');

  const loadAnnouncementsData = async () => {
    setIsLoadingAnnouncements(true);
    try {
      const data = await fetchAnnouncementsList();
      setAnnouncementsList(data);
    } catch (e) {
      console.warn('Failed loading announcements', e);
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  const handleSaveNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      alert('Judul dan Isi Berita / Pengumuman wajib diisi!');
      return;
    }

    if (editingNewsId) {
      const res = await updateAnnouncementApi(editingNewsId, newsForm);
      if (res.success) {
        const updated = announcementsList.map(item => item.id === editingNewsId ? { ...item, ...newsForm } : item);
        setAnnouncementsList(updated);
        localStorage.setItem('smk_announcements', JSON.stringify(updated));
        window.dispatchEvent(new Event('smk_announcements_updated'));
        alert(`✅ Berita "${newsForm.title}" berhasil diperbarui!`);
        setEditingNewsId(null);
        setNewsForm({
          title: '',
          category: 'Pengumuman',
          summary: '',
          content: '',
          author: 'Pengurus Website Utama',
          isImportant: false,
          date: new Date().toISOString().split('T')[0]
        });
        setAnnCmsSubTab('NEWS_LIST');
      }
    } else {
      const res = await createAnnouncementApi(newsForm);
      if (res.success) {
        const newItem = res.data || {
          id: `ANN-${Date.now()}`,
          ...newsForm
        };
        const updated = [newItem, ...announcementsList];
        setAnnouncementsList(updated);
        localStorage.setItem('smk_announcements', JSON.stringify(updated));
        window.dispatchEvent(new Event('smk_announcements_updated'));
        alert(`🎉 Berita / Pengumuman "${newsForm.title}" berhasil ditambahkan & terbit di website utama!`);
        setNewsForm({
          title: '',
          category: 'Pengumuman',
          summary: '',
          content: '',
          author: 'Pengurus Website Utama',
          isImportant: false,
          date: new Date().toISOString().split('T')[0]
        });
        setAnnCmsSubTab('NEWS_LIST');
      }
    }
  };

  const handleEditNews = (item: any) => {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title || '',
      category: item.category || 'Pengumuman',
      summary: item.summary || '',
      content: item.content || '',
      author: item.author || 'Pengurus Website Utama',
      isImportant: Boolean(item.isImportant),
      date: item.date || new Date().toISOString().split('T')[0]
    });
    setAnnCmsSubTab('CREATE_NEWS');
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus berita / pengumuman "${title}"?`)) {
      await deleteAnnouncementApi(id);
      const updated = announcementsList.filter(a => a.id !== id);
      setAnnouncementsList(updated);
      localStorage.setItem('smk_announcements', JSON.stringify(updated));
      window.dispatchEvent(new Event('smk_announcements_updated'));
      alert(`🗑️ Berita "${title}" telah berhasil dihapus dari website utama.`);
    }
  };

  // Penanggung Jawab PPDB WA Broadcast Simulator
  const [selectedWaTemplate, setSelectedWaTemplate] = useState<'VERIFIED' | 'LULUS' | 'DAFTAR_ULANG'>('VERIFIED');
  const [isBroadcastingWa, setIsBroadcastingWa] = useState(false);
  const [waBroadcastLogs, setWaBroadcastLogs] = useState<string[]>([]);

  const handleSaveWebsiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('smk_website_settings', JSON.stringify(websiteSettings));
    window.dispatchEvent(new Event('smk_website_settings_updated'));
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleRunWaBroadcast = async () => {
    setIsBroadcastingWa(true);
    setWaBroadcastLogs(['🚀 Memulai Server Gateway WhatsApp API PPDB 2026...']);

    const targetList = registrations.slice(0, 5); // sample/all pendaftar
    for (let i = 0; i < targetList.length; i++) {
      await new Promise(res => setTimeout(res, 500));
      const r = targetList[i];
      setWaBroadcastLogs(prev => [
        `✅ [WA Sent] Ke: ${r.fullName} (${r.phoneWhatsapp}) - Status: ${r.status}`,
        ...prev
      ]);
    }

    await new Promise(res => setTimeout(res, 400));
    setWaBroadcastLogs(prev => [
      `🎉 Selesai! Berhasil mengirimkan ${targetList.length} pesan WhatsApp verifikasi/pengumuman.`,
      ...prev
    ]);
    setIsBroadcastingWa(false);
  };

  const handleApproveAllPending = async () => {
    if (window.confirm('Apakah Anda sebagai Penanggung Jawab Utama PPDB ingin menyetujui (Diterima) semua pendaftar dengan status Pending?')) {
      const updated = registrations.map(r => {
        if (r.status.includes('Pending') || r.status.includes('Tergrafis')) {
          return { ...r, status: 'Diterima' as const };
        }
        return r;
      });
      setRegistrations(updated);
      localStorage.setItem('smk_ppdb_registrations', JSON.stringify(updated));
      alert('✅ Berhasil! Semua pendaftar pending telah disetujui & Diterima sebagai Siswa Baru 2026.');
    }
  };

  // Super Admin Excel Export & Import Engine
  const handleExportExcel = () => {
    if (!registrations || registrations.length === 0) {
      alert('⚠️ Tidak ada data pendaftar untuk di-export ke Excel.');
      return;
    }

    const excelData = registrations.map((r, index) => ({
      'No': index + 1,
      'Kode Pendaftaran': r.registrationCode || '',
      'Tipe Program': r.programType || 'PPDB Siswa Baru',
      'Nama Lengkap': r.fullName || '',
      'NIK / NISN': r.nikNisn || '',
      'Tempat & Tgl Lahir': r.birthPlaceDate || '',
      'Jenis Kelamin': r.gender || '',
      'Asal Sekolah': r.originSchool || '',
      'Nomor WA / HP': r.phoneWhatsapp || '',
      'Email': r.email || '',
      'Nama Orang Tua / Wali': r.parentName || '',
      'No. HP Orang Tua': r.parentPhone || '',
      'Alamat Rumah': r.address || '',
      'Jurusan Pilihan 1': r.firstChoiceMajor || '',
      'Tanggal Pendaftaran': r.registrationDate || '',
      'Status Pendaftaran': r.status || '',
      'Status Berkas': r.documentsStatus || (r.ijazahDocumentUrl ? 'Lengkap' : 'Belum Lengkap')
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data PPDB');

    worksheet['!cols'] = [
      { wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
      { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 25 },
      { wch: 22 }, { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 18 }, { wch: 20 }, { wch: 15 }
    ];

    XLSX.writeFile(workbook, `Data_Pendaftar_PPDB_SMK_Bhinneka_Nusantara_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<any>(ws);

        if (!rawData || rawData.length === 0) {
          alert('⚠️ File Excel kosong atau format kolom tidak dikenali.');
          return;
        }

        const importedRecords: RegistrationData[] = rawData.map((item, idx) => {
          const fullName = item['Nama Lengkap'] || item['fullName'] || item['Nama'] || `Siswa Import ${idx + 1}`;
          const nikNisn = String(item['NIK / NISN'] || item['nikNisn'] || item['NISN'] || item['NIK'] || `${Math.floor(1000000000 + Math.random() * 9000000000)}`);
          const regCode = item['Kode Pendaftaran'] || item['registrationCode'] || `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          
          return {
            id: 'IMP-' + Date.now() + '-' + idx,
            registrationCode: regCode,
            programType: 'MPLS / PPDB Siswa Baru',
            fullName: String(fullName).trim(),
            nikNisn: String(nikNisn).trim(),
            birthPlaceDate: item['Tempat & Tgl Lahir'] || item['birthPlaceDate'] || 'Tangerang, 10 Januari 2008',
            gender: (item['Jenis Kelamin'] === 'Perempuan' || item['gender'] === 'Perempuan') ? 'Perempuan' : 'Laki-laki',
            originSchool: item['Asal Sekolah'] || item['originSchool'] || 'SMP Negeri 1',
            phoneWhatsapp: String(item['Nomor WA / HP'] || item['phoneWhatsapp'] || item['No WA'] || '081234567890'),
            email: String(item['Email'] || item['email'] || `${String(fullName).toLowerCase().replace(/\s+/g, '')}@gmail.com`),
            parentName: item['Nama Orang Tua / Wali'] || item['parentName'] || 'Orang Tua / Wali',
            parentPhone: String(item['No. HP Orang Tua'] || item['parentPhone'] || '081234567890'),
            address: item['Alamat Rumah'] || item['address'] || 'Kab. Tangerang, Banten',
            firstChoiceMajor: (['RPL', 'AKL', 'TSM'].includes(item['Jurusan Pilihan 1'] || item['firstChoiceMajor'])) ? (item['Jurusan Pilihan 1'] || item['firstChoiceMajor']) : 'RPL',
            registrationDate: item['Tanggal Pendaftaran'] || new Date().toLocaleDateString('id-ID'),
            status: item['Status Pendaftaran'] || 'Diterima',
            documentsStatus: 'Lengkap'
          };
        });

        const existingNisns = new Set(registrations.map(r => r.nikNisn));
        const newUniqueRecords = importedRecords.filter(r => !existingNisns.has(r.nikNisn));

        if (newUniqueRecords.length === 0) {
          alert('⚠️ Semua data dalam file Excel sudah terdaftar sebelumnya (NISN Duplikat).');
          return;
        }

        const merged = [...newUniqueRecords, ...registrations];
        setRegistrations(merged);
        localStorage.setItem('smk_ppdb_registrations', JSON.stringify(merged));

        alert(`🎉 Berhasil mengimpor ${newUniqueRecords.length} data pendaftar baru dari file Excel!`);
      } catch (err: any) {
        alert('❌ Gagal mengolah file Excel: ' + (err.message || 'Format file tidak sesuai'));
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Modal State for Super Admin Adding Student
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    nikNisn: '',
    birthPlaceDate: '',
    gender: 'Laki-laki',
    originSchool: '',
    phoneWhatsapp: '',
    parentName: '',
    parentPhone: '',
    firstChoiceMajor: 'RPL' as 'RPL' | 'AKL' | 'TSM',
    status: 'Terverifikasi & Diterima'
  });

  // Role Helpers
  const isKepsek = adminUser?.role === 'Kepala Sekolah';
  const isGuru = adminUser?.role === 'Guru Pengajar';
  const isSuperAdmin = adminUser?.role === 'Super Admin' || adminUser?.role === 'Panitia PPDB' || (!isKepsek && !isGuru);

  // Forced View Mode for switching between Kepsek, Teacher Dashboard, and Admin Dashboard
  const [forcedViewMode, setForcedViewMode] = useState<'AUTO' | 'KEPSEK' | 'TEACHER' | 'ADMIN'>('AUTO');
  const isShowingKepsekPortal = (isKepsek && forcedViewMode !== 'ADMIN') || forcedViewMode === 'KEPSEK';
  const isShowingTeacherPortal = (isGuru && forcedViewMode !== 'ADMIN' && !isShowingKepsekPortal) || forcedViewMode === 'TEACHER';

  // Login Role Tab Selection
  const [selectedRoleTab, setSelectedRoleTab] = useState<'ADMIN' | 'TEACHER' | 'KEPSEK'>('ADMIN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auto populate credentials when role tab changes
  const handleSelectRoleTab = (role: 'ADMIN' | 'TEACHER' | 'KEPSEK') => {
    setSelectedRoleTab(role);
    setLoginError('');
    if (role === 'KEPSEK') {
      setUsername('kepsek');
      setAdminKey('kepsek123');
    } else if (role === 'TEACHER') {
      setUsername('guru_rpl1');
      setAdminKey('guru123');
    } else {
      setUsername('admin');
      setAdminKey('admin123');
    }
  };

  // Teacher Handlers for Adding, Updating, and Deleting Students
  const handleTeacherAddStudent = (studentData: any) => {
    const newRecord: RegistrationData = {
      id: 'REG-' + Date.now().toString().slice(-6),
      registrationCode: 'PPDB-2026-' + Math.floor(1000 + Math.random() * 9000),
      programType: 'MPLS / PPDB Siswa Baru',
      fullName: studentData.fullName,
      nikNisn: studentData.nikNisn,
      birthPlaceDate: studentData.birthPlaceDate || 'Tangerang, 12 Mei 2008',
      gender: studentData.gender || 'Laki-laki',
      originSchool: studentData.originSchool || 'SMP Negeri 1 Sepatan',
      phoneWhatsapp: studentData.phoneWhatsapp || '081234567890',
      email: studentData.email || `${studentData.fullName.toLowerCase().replace(/\s+/g, '')}@siswa.smk.id`,
      parentName: studentData.parentName || 'Bapak / Ibu Wali',
      parentPhone: studentData.parentPhone || studentData.phoneWhatsapp || '081298765432',
      address: studentData.address || 'Jl. Raya Sepatan, Tangerang',
      firstChoiceMajor: studentData.firstChoiceMajor || 'RPL',
      status: studentData.status || 'Diterima',
      registrationDate: new Date().toLocaleDateString('id-ID')
    };

    setRegistrations(prev => [newRecord, ...prev]);
  };

  const handleTeacherUpdateStudent = (id: string, updatedFields: Partial<RegistrationData>) => {
    setRegistrations(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const handleTeacherDeleteStudent = (id: string) => {
    setRegistrations(prev => prev.filter(item => item.id !== id));
  };

  // Teacher Class Monitoring State
  const [teacherClassFilter, setTeacherClassFilter] = useState<'ALL' | 'RPL' | 'AKL' | 'TSM'>('RPL');
  const [teacherNotes, setTeacherNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('smk_teacher_notes');
    return saved ? JSON.parse(saved) : {};
  });
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const handleSaveTeacherNote = (id: string, noteText: string) => {
    setSavingNoteId(id);
    const updated = { ...teacherNotes, [id]: noteText };
    setTeacherNotes(updated);
    localStorage.setItem('smk_teacher_notes', JSON.stringify(updated));
    setTimeout(() => setSavingNoteId(null), 600);
  };

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<AdminTab>('PPDB_DATA');
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<'ALL' | 'RPL' | 'AKL' | 'TSM'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<RegistrationData | null>(null);
  const [selectedMessageDetail, setSelectedMessageDetail] = useState<any | null>(null);

  // Lock body scroll when admin portal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Load Data on Auth
  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const loadAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [ppdbData, msgData, logs] = await Promise.all([
        fetchAllPPDBRegistrations(),
        fetchContactMessages(),
        fetchAuditLogs()
      ]);
      
      loadAnnouncementsData();
      
      // Merge local storage cache with server data
      const local = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
      const map = new Map<string, RegistrationData>();

      ppdbData.forEach(item => map.set(item.nikNisn, item));
      local.forEach(item => {
        if (!map.has(item.nikNisn)) {
          map.set(item.nikNisn, item);
        }
      });

      setRegistrations(Array.from(map.values()));
      setMessages(msgData);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCreateStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.nikNisn) {
      alert('Nama Lengkap dan NIK/NISN wajib diisi!');
      return;
    }

    setIsCreatingStudent(true);
    const result = await createPPDBRecordAdmin(newStudent);
    setIsCreatingStudent(false);

    if (result.success && result.data) {
      alert(`Berhasil! Data pendaftaran "${result.data.fullName}" (${result.data.registrationCode}) telah disimpan di database backend.`);
      setRegistrations(prev => [result.data!, ...prev]);
      
      const local = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
      localStorage.setItem('smk_ppdb_registrations', JSON.stringify([result.data, ...local]));

      setIsAddModalOpen(false);
      setNewStudent({
        fullName: '',
        nikNisn: '',
        birthPlaceDate: '',
        gender: 'Laki-laki',
        originSchool: '',
        phoneWhatsapp: '',
        parentName: '',
        parentPhone: '',
        firstChoiceMajor: 'RPL',
        status: 'Terverifikasi & Diterima'
      });
    } else {
      alert(result.message || 'Gagal menyimpan data ke backend');
    }
  };

  // Delete & Kepsek Alert Modal States
  const [recordToDelete, setRecordToDelete] = useState<RegistrationData | null>(null);
  const [showKepsekReadOnlyAlert, setShowKepsekReadOnlyAlert] = useState<boolean>(false);

  const handleInitiateDelete = (record: RegistrationData) => {
    if (isKepsek) {
      setShowKepsekReadOnlyAlert(true);
      return;
    }
    setRecordToDelete(record);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    const targetId = recordToDelete.id || recordToDelete.registrationCode || recordToDelete.nikNisn;
    const targetNikNisn = recordToDelete.nikNisn;
    const targetRegCode = recordToDelete.registrationCode;

    // Direct deletion call to backend API
    await deletePPDBRecord(targetId);
    
    // Filter out from state matching all identifiers safely
    setRegistrations(prev => prev.filter(r => {
      const isMatchId = targetId && r.id && r.id === targetId;
      const isMatchCode = targetRegCode && r.registrationCode && r.registrationCode === targetRegCode;
      const isMatchNik = targetNikNisn && r.nikNisn && r.nikNisn === targetNikNisn;
      return !(isMatchId || isMatchCode || isMatchNik);
    }));
    
    // Filter out from local storage
    const local = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
    const filtered = local.filter(r => {
      const isMatchId = targetId && r.id && r.id === targetId;
      const isMatchCode = targetRegCode && r.registrationCode && r.registrationCode === targetRegCode;
      const isMatchNik = targetNikNisn && r.nikNisn && r.nikNisn === targetNikNisn;
      return !(isMatchId || isMatchCode || isMatchNik);
    });
    localStorage.setItem('smk_ppdb_registrations', JSON.stringify(filtered));

    if (selectedRecordDetail && (selectedRecordDetail.id === recordToDelete.id || selectedRecordDetail.nikNisn === recordToDelete.nikNisn)) {
      setSelectedRecordDetail(null);
    }

    setRecordToDelete(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (isKepsek) {
      setShowKepsekReadOnlyAlert(true);
      return;
    }

    await updateRegistrationStatus(id, newStatus);
    
    setRegistrations(prev => prev.map(item => {
      if (item.id === id || item.registrationCode === id || item.nikNisn === id) {
        return { ...item, status: newStatus as any };
      }
      return item;
    }));
    
    const local = JSON.parse(localStorage.getItem('smk_ppdb_registrations') || '[]') as RegistrationData[];
    const updatedLocal = local.map(item => {
      if (item.id === id || item.registrationCode === id || item.nikNisn === id) {
        return { ...item, status: newStatus as any };
      }
      return item;
    });
    localStorage.setItem('smk_ppdb_registrations', JSON.stringify(updatedLocal));

    if (selectedRecordDetail && (selectedRecordDetail.id === id || selectedRecordDetail.nikNisn === id || selectedRecordDetail.registrationCode === id)) {
      setSelectedRecordDetail({ ...selectedRecordDetail, status: newStatus as any });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !adminKey.trim()) {
      setLoginError('Username dan Admin Key wajib diisi!');
      return;
    }

    setIsLoggingIn(true);
    const res = await adminLogin(username.trim(), adminKey.trim());
    setIsLoggingIn(false);

    if (res.success && res.token) {
      setIsAuthenticated(true);
      setAdminUser(res.user);
      localStorage.setItem('smk_admin_token', res.token);
      localStorage.setItem('smk_admin_user', JSON.stringify(res.user));
    } else {
      setLoginError(res.message || 'Akses ditolak: Admin Key atau Username tidak valid');
    }
  };

  const handleQuickLogin = async (userStr: string, keyStr: string) => {
    setUsername(userStr);
    setAdminKey(keyStr);
    setLoginError('');
    setIsLoggingIn(true);

    const res = await adminLogin(userStr, keyStr);
    setIsLoggingIn(false);

    if (res.success && res.token) {
      setIsAuthenticated(true);
      setAdminUser(res.user);
      localStorage.setItem('smk_admin_token', res.token);
      localStorage.setItem('smk_admin_user', JSON.stringify(res.user));
    } else {
      setLoginError(res.message || 'Akses ditolak.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('smk_admin_token');
    localStorage.removeItem('smk_admin_user');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('Tidak ada data pendaftaran untuk di-export.');
      return;
    }

    const headers = ['Kode Pendaftaran', 'NISN/NIK', 'Nama Lengkap', 'Tempat Tanggal Lahir', 'Jenis Kelamin', 'Asal Sekolah', 'No WA Siswa', 'Nama Orang Tua', 'No WA Ortu', 'Pilihan Jurusan', 'Tanggal Daftar', 'Status'];
    
    const rows = registrations.map(r => [
      `"${r.registrationCode}"`,
      `"${r.nikNisn}"`,
      `"${r.fullName}"`,
      `"${r.birthPlaceDate}"`,
      `"${r.gender}"`,
      `"${r.originSchool}"`,
      `"${r.phoneWhatsapp}"`,
      `"${r.parentName}"`,
      `"${r.parentPhone}"`,
      `"${r.firstChoiceMajor}"`,
      `"${r.registrationDate}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DATA_PPDB_SMK_BHINNEKA_NUSANTARA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredRegistrations = registrations.filter(item => {
    const matchesSearch = 
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nikNisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originSchool.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMajor = selectedMajorFilter === 'ALL' || item.firstChoiceMajor === selectedMajorFilter;

    const matchesStatus = selectedStatusFilter === 'ALL' || 
      (selectedStatusFilter === 'PENDING' && item.status.includes('Pending')) ||
      (selectedStatusFilter === 'VERIFIED' && item.status.includes('Terverifikasi')) ||
      (selectedStatusFilter === 'ACCEPTED' && item.status.includes('Diterima')) ||
      (selectedStatusFilter === 'REJECTED' && item.status.includes('Ditolak'));

    return matchesSearch && matchesMajor && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#e4ece7] text-slate-800 overflow-y-auto font-sans selection:bg-[#2d5a3f]/20 selection:text-[#1b3828] overscroll-contain">
      
      {/* ================= DEDICATED RESPONSIVE ROLE LOGIN VIEW ================= */}
      {!isAuthenticated ? (
        <div className="min-h-screen flex flex-col justify-between bg-[#e4ece7] text-slate-800 relative overflow-y-auto p-4 sm:p-6 font-sans">
          
          {/* Subtle Ambient Soft Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d5a3f]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Login Navigation */}
          <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#e4ece7] text-[#1b3828] flex items-center justify-center font-black shadow-[4px_4px_8px_#c2cebe,-4px_-4px_8px_#ffffff] border border-white/60">
                <Building2 size={20} className="text-[#2d5a3f]" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-black text-[#1b3828] tracking-tight block">
                  SMK BHINNEKA NUSANTARA
                </strong>
                <span className="text-[10px] text-slate-500 font-bold block">
                  SIAKAD & PORTAL OTORISASI INTEGRATED 2026
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-full bg-[#e4ece7] text-slate-700 hover:text-[#1b3828] text-xs font-bold transition-all shadow-[4px_4px_8px_#c2cebe,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_5px_#c2cebe,inset_-2px_-2px_5px_#ffffff] flex items-center gap-1.5 border border-white/60 min-h-[44px]"
            >
              <span>Website Utama</span>
              <X size={15} />
            </button>
          </header>

          {/* Main Login Form Container */}
          <main className="flex-1 max-w-lg w-full mx-auto flex flex-col items-center justify-center relative z-10 my-auto py-6">
            
            {/* Neumorphic Outer Soft Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-[#e4ece7] rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 shadow-[12px_12px_24px_#bdc9bf,-12px_-12px_24px_#ffffff] border border-white/80 flex flex-col items-center text-center space-y-5 relative"
            >
              
              {/* Header Icon */}
              <div className="relative">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),6px_6px_12px_rgba(0,0,0,0.1)] border-2 transition-all duration-300 ${
                  selectedRoleTab === 'KEPSEK'
                    ? 'bg-amber-950 text-amber-400 border-amber-400/60'
                    : selectedRoleTab === 'TEACHER'
                    ? 'bg-blue-950 text-blue-400 border-blue-400/60'
                    : 'bg-[#1b3828] text-[#c5a059] border-[#c5a059]/60'
                }`}>
                  {selectedRoleTab === 'KEPSEK' ? (
                    <Crown size={38} className="text-amber-400 animate-pulse" />
                  ) : selectedRoleTab === 'TEACHER' ? (
                    <GraduationCap size={38} className="text-blue-400" />
                  ) : (
                    <Building2 size={38} className="text-[#c5a059]" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#c5a059] text-[#1b3828] flex items-center justify-center font-black shadow-md text-xs border border-white">
                  <ShieldCheck size={16} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h1 className="text-lg sm:text-2xl font-black text-[#1b3828] tracking-tight">
                  Portal Otorisasi SMK Bhinneka
                </h1>
                <p className="text-xs font-bold text-slate-500">
                  Sistem Informasi Akademik & Penerimaan Peserta Didik Baru
                </p>
              </div>

              {/* ROLE SELECTOR TABS */}
              <div className="w-full p-1.5 rounded-2xl bg-[#d8e3dc] shadow-[inset_3px_3px_6px_#bdc9bf,inset_-3px_-3px_6px_#ffffff] grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectRoleTab('ADMIN')}
                  className={`py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 min-h-[44px] ${
                    selectedRoleTab === 'ADMIN'
                      ? 'bg-[#1b3828] text-white shadow-md border border-emerald-500/40'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 size={14} className={selectedRoleTab === 'ADMIN' ? 'text-[#c5a059]' : ''} />
                  <span>Super Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRoleTab('TEACHER')}
                  className={`py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 min-h-[44px] ${
                    selectedRoleTab === 'TEACHER'
                      ? 'bg-blue-700 text-white shadow-md border border-blue-400/40'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap size={14} className={selectedRoleTab === 'TEACHER' ? 'text-blue-300' : ''} />
                  <span>Guru / Wali</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRoleTab('KEPSEK')}
                  className={`py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 min-h-[44px] ${
                    selectedRoleTab === 'KEPSEK'
                      ? 'bg-amber-600 text-slate-950 shadow-md border border-amber-300/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Crown size={14} className={selectedRoleTab === 'KEPSEK' ? 'text-slate-950' : ''} />
                  <span>Kepala Sekolah</span>
                </button>
              </div>

              {/* ROLE ACCESS INFORMATION BOX */}
              <div className={`w-full p-3.5 rounded-2xl text-left border text-xs font-medium leading-relaxed transition-all ${
                selectedRoleTab === 'KEPSEK'
                  ? 'bg-amber-500/10 border-amber-400/40 text-amber-950'
                  : selectedRoleTab === 'TEACHER'
                  ? 'bg-blue-500/10 border-blue-400/40 text-blue-950'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950'
              }`}>
                <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-wider mb-1">
                  <ShieldCheck size={14} />
                  <span>
                    {selectedRoleTab === 'KEPSEK' && 'Akses Supervisi Eksekutif Kepala Sekolah'}
                    {selectedRoleTab === 'TEACHER' && 'Akses Pengajar & Wali Kelas (SIAKAD)'}
                    {selectedRoleTab === 'ADMIN' && 'Akses Operasional PPDB & Super Admin'}
                  </span>
                </div>
                <p className="text-[11px] opacity-90">
                  {selectedRoleTab === 'KEPSEK' && 'Supervisi agenda rapat, pengajuan izin guru, laporan keuangan, dan evaluasi kinerja dewan guru secara komprehensif.'}
                  {selectedRoleTab === 'TEACHER' && 'Kelola presensi murid, jadwal jam mengajar, nilai ujian UTS/UAS, dan jurnal harian wali kelas.'}
                  {selectedRoleTab === 'ADMIN' && 'Kelola penuh pendaftar siswa PPDB baru, verifikasi berkas, cetak bukti pendaftaran PDF, dan pesan pertanyaan masuk.'}
                </p>
              </div>

              {/* Error Alert */}
              {loginError && (
                <div className="w-full p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="w-full space-y-4 text-left">
                
                {/* Username Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 ml-3">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-5 py-3.5 rounded-full bg-[#e4ece7] text-slate-900 placeholder-slate-400 font-medium text-xs sm:text-sm shadow-[inset_4px_4px_8px_#bdc9bf,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#2d5a3f]/30 transition-all min-h-[44px]"
                    />
                    <UserCheck size={18} className="absolute left-4 top-3.5 text-slate-500" />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 ml-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan Password"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#e4ece7] text-slate-900 placeholder-slate-400 font-medium text-xs sm:text-sm shadow-[inset_4px_4px_8px_#bdc9bf,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#2d5a3f]/30 transition-all font-mono min-h-[44px]"
                    />
                    <KeyRound size={18} className="absolute left-4 top-3.5 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-700 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className={`w-full py-3.5 px-6 rounded-full text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-[6px_6px_14px_#bdc9bf,-6px_-6px_14px_#ffffff] hover:opacity-95 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center gap-2 border disabled:opacity-50 min-h-[48px] ${
                    selectedRoleTab === 'KEPSEK'
                      ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 border-amber-300'
                      : selectedRoleTab === 'TEACHER'
                      ? 'bg-gradient-to-r from-blue-700 to-blue-900 border-blue-400'
                      : 'bg-gradient-to-r from-[#2d5a3f] to-[#1b3828] border-emerald-500/30'
                  }`}
                >
                  {isLoggingIn ? (
                    <span>Memverifikasi Otorisasi...</span>
                  ) : (
                    <>
                      <Lock size={16} className={selectedRoleTab === 'KEPSEK' ? 'text-slate-950' : 'text-[#c5a059]'} />
                      <span>Masuk Portal {selectedRoleTab === 'KEPSEK' ? 'Kepala Sekolah' : selectedRoleTab === 'TEACHER' ? 'Guru' : 'Super Admin'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Shield Badge */}
              <div className="w-full pt-3 border-t border-slate-300/60 flex items-center justify-center gap-2 text-[11px] font-bold text-[#1b3828]">
                <ShieldCheck size={15} className="text-emerald-700 shrink-0" />
                <span>Terproteksi Sistem Enkripsi RBAC & Security Guard</span>
              </div>

            </motion.div>
          </main>

          {/* Login Footer */}
          <footer className="py-3 text-center text-[11px] text-slate-500 font-medium relative z-10">
            &copy; {new Date().getFullYear()} SMK Bhinneka Nusantara • Sistem Informasi PPDB & SIAKAD
          </footer>
        </div>
      ) : isShowingKepsekPortal ? (
        <KepalaSekolahPortalView
          adminUser={adminUser}
          registrations={registrations}
          onLogout={handleLogout}
          onBackToAdmin={!isKepsek ? () => setForcedViewMode('ADMIN') : undefined}
        />
      ) : isShowingTeacherPortal ? (
        <TeacherPortalView
          adminUser={adminUser}
          registrations={registrations}
          onAddStudent={handleTeacherAddStudent}
          onUpdateStudent={handleTeacherUpdateStudent}
          onDeleteStudent={handleTeacherDeleteStudent}
          onLogout={handleLogout}
          onBackToAdmin={!isGuru ? () => setForcedViewMode('ADMIN') : undefined}
        />
      ) : (
        
        /* ================= DEDICATED SUPER ADMIN & PPDB PORTAL ================= */
        <div className="min-h-screen flex flex-col bg-[#f4f6f4] text-slate-800 font-sans">
          
          {/* MOBILE TOP HEADER BAR */}
          <header className="lg:hidden bg-[#1b3828] text-white px-3.5 py-2.5 border-b border-[#2d5a3f] flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-xl bg-[#2d5a3f] text-white hover:bg-emerald-700 transition-colors shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center border border-[#386d4d]"
                title="Buka Menu Navigasi"
              >
                <Menu size={20} />
              </button>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs font-black text-white tracking-tight truncate">
                    {activeTab === 'WEBSITE_CMS' && 'CMS Website Utama'}
                    {activeTab === 'PPDB_COMMAND' && 'PJ PPDB 2026'}
                    {activeTab === 'PPDB_DATA' && 'Data Pendaftar PPDB'}
                    {activeTab === 'MESSAGES' && 'Pesan Masuk'}
                    {activeTab === 'OVERVIEW' && 'Ringkasan & Statistik'}
                    {activeTab === 'CLASS_MONITOR' && 'Monitoring Murid'}
                    {activeTab === 'SECURITY' && 'Keamanan System'}
                  </h1>
                  <span className="px-1.5 py-0.2 rounded bg-[#c5a059] text-[#1b3828] font-black text-[9px] uppercase tracking-wider shrink-0">
                    Pengurus & PJ
                  </span>
                </div>
                <span className="text-[10px] text-slate-300 font-medium block truncate">
                  SMK Bhinneka Nusantara
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onClose}
                className="py-1.5 px-2.5 rounded-xl bg-[#2d5a3f] text-[#c5a059] hover:bg-emerald-700 hover:text-white font-extrabold text-xs transition-all flex items-center gap-1 border border-[#386d4d] min-h-[36px]"
                title="Ke Website Utama"
              >
                <Globe size={14} />
                <span className="text-[11px] hidden sm:inline">Website Utama</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="py-1.5 px-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-xs border border-emerald-300 min-h-[36px]"
                title="Tambah Pendaftar Siswa Baru"
              >
                <Plus size={16} />
                <span className="text-[11px]">Tambah</span>
              </button>

              <button
                onClick={loadAllAdminData}
                className="p-2 rounded-xl bg-[#2d5a3f] text-slate-200 hover:text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center border border-[#386d4d]"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={isLoadingData ? 'animate-spin' : ''} />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-900/70 text-red-200 hover:bg-red-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center border border-red-700/50"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden relative">
            
            {/* MOBILE DRAWER SIDEBAR OVERLAY */}
            <AnimatePresence>
              {isMobileSidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
                  />
                  <motion.aside
                    initial={{ x: -320 }}
                    animate={{ x: 0 }}
                    exit={{ x: -320 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-0 left-0 bottom-0 w-72 bg-[#1b3828] text-white z-50 flex flex-col border-r border-[#2d5a3f] shadow-2xl lg:hidden overflow-y-auto"
                  >
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-[#2d5a3f] flex items-center justify-between bg-[#142b1f]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#2d5a3f] text-[#c5a059] flex items-center justify-center font-black border border-[#c5a059]/40 shadow-inner">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-white tracking-tight">SMK BHINNEKA</h3>
                          <span className="text-[10px] text-[#c5a059] font-bold block">PPDB Admin Portal</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-2 rounded-xl bg-[#2d5a3f] text-slate-200 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Drawer Menu Navigation */}
                    <div className="flex-1 p-3 space-y-5">
                      
                      {/* Section 0: Otoritas Pengurus Website & Penanggung Jawab PPDB */}
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                          Otoritas Website & PJ PPDB
                        </span>
                        <div className="space-y-1">
                          {[
                            { id: 'WEBSITE_CMS', label: 'Kelola Website Utama (CMS)', icon: Globe },
                            { id: 'PPDB_COMMAND', label: 'Penanggung Jawab PPDB', icon: BadgeCheck }
                          ].map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setActiveTab(item.id as AdminTab);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
                                  isActive
                                    ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                                    : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={18} className={isActive ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                                  <span>{item.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                          Operasional PPDB & Pesan
                        </span>
                        <div className="space-y-1">
                          {[
                            { id: 'PPDB_DATA', label: 'Data Pendaftar PPDB', icon: Users, badge: registrations.length },
                            { id: 'MESSAGES', label: 'Pesan & Pertanyaan Masuk', icon: MessageSquare, badge: messages.length },
                            { id: 'OVERVIEW', label: 'Ringkasan & Statistik', icon: Layers }
                          ].map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setActiveTab(item.id as AdminTab);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
                                  isActive
                                    ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                                    : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={18} className={isActive ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge !== undefined && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                    isActive ? 'bg-[#1b3828] text-white' : 'bg-[#2d5a3f] text-[#c5a059]'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                          Monitoring Akademik
                        </span>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('CLASS_MONITOR');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
                              activeTab === 'CLASS_MONITOR'
                                ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                                : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <GraduationCap size={18} className={activeTab === 'CLASS_MONITOR' ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                              <span>Monitoring Kelas & Murid</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                          Akses Lintas Portal
                        </span>
                        <div className="space-y-1.5">
                          <button
                            onClick={() => {
                              setForcedViewMode('KEPSEK');
                              setIsMobileSidebarOpen(false);
                            }}
                            className="w-full py-2.5 px-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center gap-2.5 transition-all min-h-[44px]"
                          >
                            <Crown size={16} className="text-amber-400" />
                            <span>Switch Portal Kepala Sekolah</span>
                          </button>
                          <button
                            onClick={() => {
                              setForcedViewMode('TEACHER');
                              setIsMobileSidebarOpen(false);
                            }}
                            className="w-full py-2.5 px-3.5 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold flex items-center gap-2.5 transition-all min-h-[44px]"
                          >
                            <GraduationCap size={16} className="text-blue-400" />
                            <span>Switch Portal Guru</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                          Keamanan & Security
                        </span>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('SECURITY');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
                              activeTab === 'SECURITY'
                                ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                                : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <ShieldCheck size={18} className={activeTab === 'SECURITY' ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                              <span>Akses Key & Security</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Drawer User Info */}
                    <div className="p-4 border-t border-[#2d5a3f] bg-[#142b1f] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#2d5a3f] text-[#c5a059] font-black text-xs flex items-center justify-center shrink-0 border border-[#c5a059]/40">
                        {adminUser?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="truncate flex-1">
                        <strong className="text-xs text-white block truncate">{adminUser?.name || 'Super Admin'}</strong>
                        <span className="text-[10px] text-[#c5a059] font-medium block truncate">{adminUser?.role || 'Panitia PPDB'}</span>
                      </div>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* DESKTOP COLLAPSIBLE SIDEBAR */}
            <motion.aside
              initial={false}
              animate={{ width: isSidebarOpen ? 260 : 80 }}
              className="hidden lg:flex bg-[#1b3828] text-white border-r border-[#2d5a3f] flex-col shrink-0 z-20 shadow-xl transition-all duration-300"
            >
              {/* Sidebar Header */}
              <div className="p-5 border-b border-[#2d5a3f] flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-[#2d5a3f] border border-[#c5a059]/40 flex items-center justify-center font-black text-[#c5a059] shadow-inner shrink-0">
                    <Building2 size={22} />
                  </div>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      <h1 className="font-black text-sm text-white tracking-wide truncate">
                        SMK BHINNEKA
                      </h1>
                      <p className="text-[10px] text-[#c5a059] font-extrabold uppercase tracking-widest truncate">
                        Super Admin Portal
                      </p>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 rounded-xl bg-[#2d5a3f]/60 hover:bg-[#2d5a3f] text-slate-200 transition-colors flex items-center justify-center"
                  title={isSidebarOpen ? 'Ciutkan Sidebar' : 'Perluas Sidebar'}
                >
                  {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>

              {/* Sidebar Menu Group */}
              <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-emerald-800">
                
                {/* Section 0: Otoritas Pengurus Website & Penanggung Jawab PPDB */}
                <div>
                  {isSidebarOpen && (
                    <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                      Pengurus Website & PJ PPDB
                    </span>
                  )}
                  <div className="space-y-1">
                    {[
                      { id: 'WEBSITE_CMS', label: 'Kelola Website Utama (CMS)', icon: Globe },
                      { id: 'PPDB_COMMAND', label: 'Penanggung Jawab PPDB', icon: BadgeCheck }
                    ].map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as AdminTab)}
                          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                              : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                          }`}
                          title={item.label}
                        >
                          <Icon size={18} className={isActive ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                          {isSidebarOpen && (
                            <span className="truncate flex-1 text-left">{item.label}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 1: PPDB */}
                <div>
                  {isSidebarOpen && (
                    <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                      Operasional Pendaftaran
                    </span>
                  )}
                  <div className="space-y-1">
                    {[
                      { id: 'PPDB_DATA', label: 'Data Pendaftar PPDB', icon: Users, badge: registrations.length },
                      { id: 'MESSAGES', label: 'Pesan & Pertanyaan', icon: MessageSquare, badge: messages.length },
                      { id: 'OVERVIEW', label: 'Ringkasan & Statistik', icon: Layers }
                    ].map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as AdminTab)}
                          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                              : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                          }`}
                          title={item.label}
                        >
                          <Icon size={18} className={isActive ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                          {isSidebarOpen && (
                            <span className="truncate flex-1 text-left">{item.label}</span>
                          )}
                          {isSidebarOpen && item.badge !== undefined && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive ? 'bg-[#1b3828] text-white' : 'bg-[#2d5a3f] text-[#c5a059]'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Akademik */}
                <div>
                  {isSidebarOpen && (
                    <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                      Ruang Guru & Kelas
                    </span>
                  )}
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('CLASS_MONITOR')}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        activeTab === 'CLASS_MONITOR'
                          ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                          : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                      }`}
                      title="Monitoring Kelas & Murid"
                    >
                      <GraduationCap size={18} className={activeTab === 'CLASS_MONITOR' ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                      {isSidebarOpen && <span className="truncate flex-1 text-left">Monitoring Kelas</span>}
                    </button>
                  </div>
                </div>

                {/* Section 3: Switch Portal */}
                <div>
                  {isSidebarOpen && (
                    <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                      Portal Lintas Otoritas
                    </span>
                  )}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setForcedViewMode('KEPSEK')}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-[11px] font-bold flex items-center gap-2 transition-all"
                      title="Switch Ke Portal Kepala Sekolah"
                    >
                      <Crown size={15} className="text-amber-400 shrink-0" />
                      {isSidebarOpen && <span className="truncate">Portal Kepsek</span>}
                    </button>
                    <button
                      onClick={() => setForcedViewMode('TEACHER')}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-bold flex items-center gap-2 transition-all"
                      title="Switch Ke Portal Guru"
                    >
                      <GraduationCap size={15} className="text-blue-400 shrink-0" />
                      {isSidebarOpen && <span className="truncate">Portal Guru</span>}
                    </button>
                  </div>
                </div>

                {/* Section 4: System Security */}
                <div>
                  {isSidebarOpen && (
                    <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-wider block mb-2 px-3">
                      Sistem & Keamanan
                    </span>
                  )}
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('SECURITY')}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        activeTab === 'SECURITY'
                          ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] font-black shadow-md'
                          : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                      }`}
                      title="Security Key & Otorisasi"
                    >
                      <ShieldCheck size={18} className={activeTab === 'SECURITY' ? 'text-[#1b3828]' : 'text-[#c5a059]'} />
                      {isSidebarOpen && <span className="truncate flex-1 text-left">Akses Key & RBAC</span>}
                    </button>
                  </div>
                </div>

              </div>

              {/* Desktop Sidebar Footer */}
              <div className="p-4 border-t border-[#2d5a3f] bg-[#142b1f]/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b3828] to-[#2d5a3f] text-[#c5a059] font-black text-xs flex items-center justify-center shrink-0 border border-[#c5a059]/50">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
                {isSidebarOpen && (
                  <div className="truncate flex-1">
                    <strong className="text-xs text-white block truncate">{adminUser?.name || 'Administrator'}</strong>
                    <span className="text-[10px] text-[#c5a059] font-medium block truncate">{adminUser?.role || 'Super Admin'}</span>
                  </div>
                )}
              </div>
            </motion.aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              
              {/* DESKTOP TOP HEADER NAVBAR */}
              <header className="hidden lg:flex bg-white/95 backdrop-blur-md text-slate-800 px-6 py-3.5 border-b border-slate-200/90 items-center justify-between sticky top-0 z-20 shadow-xs transition-all">
                {/* Left Side: Context & Active View Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-bold shadow-xs border border-[#2d5a3f] shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        SMK Bhinneka Nusantara • Pengurus Utama Website & PJ PPDB
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online (Full Control)
                      </span>
                    </div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                      {activeTab === 'WEBSITE_CMS' && 'Kelola Website Utama (CMS & Informasi Gelombang PPDB)'}
                      {activeTab === 'PPDB_COMMAND' && 'Pusat Penanggung Jawab Utama PPDB & Murid Baru'}
                      {activeTab === 'PPDB_DATA' && 'Data Pendaftar PPDB 2026'}
                      {activeTab === 'MESSAGES' && 'Pesan & Pertanyaan Masuk'}
                      {activeTab === 'OVERVIEW' && 'Ringkasan & Analisis Statistik'}
                      {activeTab === 'CLASS_MONITOR' && 'Monitoring Kelas & Murid'}
                      {activeTab === 'SECURITY' && 'Keamanan & Akses Key RBAC'}

                      {activeTab === 'PPDB_DATA' && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                          {registrations.length} Siswa
                        </span>
                      )}
                      {activeTab === 'MESSAGES' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                          {messages.length} Pesan
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* Right Side: Action Controls for Super Admin */}
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#1b3828] text-white hover:bg-[#2d5a3f] font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm border border-[#1b3828] hover:shadow-md cursor-pointer"
                  >
                    <Plus size={15} className="text-[#c5a059]" />
                    <span>+ Tambah Pendaftar</span>
                  </button>

                  <button
                    onClick={loadAllAdminData}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                    title="Sinkronkan Data Server"
                  >
                    <RefreshCw size={14} className={isLoadingData ? 'animate-spin text-emerald-600' : 'text-slate-500'} />
                    <span>Refresh</span>
                  </button>

                  {/* Export Excel (.xlsx) */}
                  <button
                    onClick={handleExportExcel}
                    className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Export Data ke File Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Export Excel (.xlsx)</span>
                  </button>

                  {/* Import Excel (.xlsx / .csv) */}
                  <label
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Import Data dari File Excel (.xlsx/.csv)"
                  >
                    <UploadCloud size={15} />
                    <span>Import Excel</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleImportExcel}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] hover:bg-[#2d5a3f] hover:text-white font-extrabold text-xs transition-all flex items-center gap-1.5 border border-[#c5a059]/40 shadow-xs cursor-pointer"
                    title="Kembali ke Tampilan Website Utama SMK Bhinneka"
                  >
                    <Globe size={14} className="text-[#c5a059]" />
                    <span>Lihat Website Utama</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-red-200 cursor-pointer"
                    title="Keluar Sesi Super Admin"
                  >
                    <LogOut size={14} />
                    <span>Keluar</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-1"
                    title="Tutup Portal Admin"
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              {/* MAIN CONTENT BODY */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

            {/* ================= TAB 0.1: WEBSITE_CMS (Pengurus Website Utama) ================= */}
            {activeTab === 'WEBSITE_CMS' && (
              <div className="space-y-6">
                
                {/* CMS Header Banner */}
                <div className="bg-gradient-to-r from-[#1b3828] via-[#2d5a3f] to-[#1b3828] text-white p-6 rounded-3xl border border-[#2d5a3f] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059] text-[#1b3828] text-[10px] font-black uppercase tracking-wider">
                        CMS Super Admin
                      </span>
                      <span className="text-[11px] text-slate-300 font-bold">
                        Otoritas Utama Website & Portal PPDB
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                      Pengurus Website Utama SMK Bhinneka Nusantara
                    </h3>
                    <p className="text-xs text-slate-200">
                      Anda bertindak sebagai pengurus server utama website sekolah. Semua perubahan pengumuman, running text, status gelombang PPDB, dan kuota jurusan akan langsung dipublikasikan.
                    </p>
                  </div>
                  {showSavedToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 border border-emerald-300"
                    >
                      <CheckCircle size={16} />
                      <span>Sistem Website Berhasil Diperbarui!</span>
                    </motion.div>
                  )}
                </div>

                {/* Sub Navigation Bar for CMS */}
                <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs max-w-full overflow-hidden">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-slate-300 w-full whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setAnnCmsSubTab('SETTINGS')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        annCmsSubTab === 'SETTINGS'
                          ? 'bg-[#1b3828] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Settings size={15} />
                      <span>Gelombang & Banner PPDB</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnnCmsSubTab('NEWS_LIST')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        annCmsSubTab === 'NEWS_LIST'
                          ? 'bg-[#1b3828] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Megaphone size={15} />
                      <span>Monitoring & List Berita ({announcementsList.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnnCmsSubTab('GURU_CMS')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        annCmsSubTab === 'GURU_CMS'
                          ? 'bg-[#1b3828] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Users size={15} />
                      <span>Kelola Profil Guru ({teachersCmsList.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnnCmsSubTab('EKSKUL_CMS')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        annCmsSubTab === 'EKSKUL_CMS'
                          ? 'bg-[#1b3828] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Trophy size={15} />
                      <span>Kelola Ekstrakurikuler ({ekskulCmsList.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingNewsId(null);
                        setNewsForm({
                          title: '',
                          category: 'Pengumuman',
                          summary: '',
                          content: '',
                          author: 'Pengurus Website Utama',
                          isImportant: false,
                          date: new Date().toISOString().split('T')[0]
                        });
                        setAnnCmsSubTab('CREATE_NEWS');
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        annCmsSubTab === 'CREATE_NEWS'
                          ? 'bg-[#c5a059] text-[#1b3828] shadow-xs font-black'
                          : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <Plus size={15} />
                      <span>+ Buat Berita Baru</span>
                    </button>
                  </div>
                </div>

                {/* SUB TAB 1: WEBSITE SETTINGS & BANNER */}
                {annCmsSubTab === 'SETTINGS' && (
                  <form onSubmit={handleSaveWebsiteSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Announcement & Running Text Settings */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-sm font-black text-[#1b3828] flex items-center gap-2">
                          <Megaphone size={18} className="text-[#c5a059]" />
                          <span>Running Text & Banner Pengumuman Website Utama</span>
                        </h4>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Headline Pengumuman Beranda (Header Banner)
                            </label>
                            <textarea
                              rows={2}
                              value={websiteSettings.announcementHeadline}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, announcementHeadline: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#1b3828] focus:border-[#1b3828] outline-none"
                              placeholder="Contoh: PENDAFTARAN PPDB GELOMBANG 1 DIBUKA..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Running Text Teks Berjalan Pengumuman PPDB
                            </label>
                            <textarea
                              rows={2}
                              value={websiteSettings.runningBannerText}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, runningBannerText: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#1b3828] focus:border-[#1b3828] outline-none"
                              placeholder="Contoh: Dapatkan Beasiswa Prestasi Bebas Biaya Formulir..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Kuota Pagu per Jurusan */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-sm font-black text-[#1b3828] flex items-center gap-2">
                          <Code size={18} className="text-[#2d5a3f]" />
                          <span>Pagu Kuota Pendaftaran Siswa Baru T.A. 2026/2027</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <label className="block text-xs font-bold text-[#1b3828]">RPL (Software & Web)</label>
                            <input
                              type="number"
                              value={websiteSettings.rplQuota}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, rplQuota: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-900 bg-white"
                            />
                            <span className="text-[10px] text-slate-500 block">Pendaftar: {registrations.filter(r => r.firstChoiceMajor === 'RPL').length} Siswa</span>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <label className="block text-xs font-bold text-[#1b3828]">AKL (Akuntansi)</label>
                            <input
                              type="number"
                              value={websiteSettings.aklQuota}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, aklQuota: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-900 bg-white"
                            />
                            <span className="text-[10px] text-slate-500 block">Pendaftar: {registrations.filter(r => r.firstChoiceMajor === 'AKL').length} Siswa</span>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <label className="block text-xs font-bold text-[#1b3828]">TSM (Sepeda Motor)</label>
                            <input
                              type="number"
                              value={websiteSettings.tsmQuota}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, tsmQuota: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-900 bg-white"
                            />
                            <span className="text-[10px] text-slate-500 block">Pendaftar: {registrations.filter(r => r.firstChoiceMajor === 'TSM').length} Siswa</span>
                          </div>
                        </div>
                      </div>

                      {/* Informasi Penanggung Jawab & Kontak Hotline */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-sm font-black text-[#1b3828] flex items-center gap-2">
                          <UserCheck size={18} className="text-[#c5a059]" />
                          <span>Identitas Penanggung Jawab PPDB & Hotline Sekretariat</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penanggung Jawab</label>
                            <input
                              type="text"
                              value={websiteSettings.penanggungJawabName}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, penanggungJawabName: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">NIP / Jabatan Penanggung Jawab</label>
                            <input
                              type="text"
                              value={websiteSettings.penanggungJawabNip}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, penanggungJawabNip: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Hotline PPDB</label>
                            <input
                              type="text"
                              value={websiteSettings.hotlineWhatsapp}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, hotlineWhatsapp: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Biaya Pendaftaran / Subsidized</label>
                            <input
                              type="text"
                              value={websiteSettings.registrationFee}
                              onChange={(e) => setWebsiteSettings({ ...websiteSettings, registrationFee: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Status Gelombang & Quick Save */}
                    <div className="space-y-6">
                      
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-sm font-black text-[#1b3828] flex items-center gap-2">
                          <Radio size={18} className="text-emerald-600 animate-pulse" />
                          <span>Status Gelombang Pendaftaran</span>
                        </h4>

                        <div className="space-y-2">
                          {[
                            { id: 'GELOMBANG_1_OPEN', title: 'Gelombang 1 DIBUKA', desc: 'Pendaftaran Online Aktif (Periode Januari - April 2026)' },
                            { id: 'GELOMBANG_2_OPEN', title: 'Gelombang 2 DIBUKA', desc: 'Pendaftaran Jalur Reguler (Periode Mei - Juni 2026)' },
                            { id: 'GELOMBANG_3_OPEN', title: 'Gelombang 3 DIBUKA', desc: 'Jalur Pemenuhan Kuota / Sisa Pagu (Juli - Agustus 2026)' },
                            { id: 'CLOSED', title: 'PENDAFTARAN DITUTUP (Profil Saja)', desc: 'Kuota Terpenuhi / Form pendaftaran di website otomatis disembunyikan' }
                          ].map((wave) => (
                            <label
                              key={wave.id}
                              className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                                websiteSettings.ppdbWaveStatus === wave.id
                                  ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="radio"
                                name="waveStatus"
                                checked={websiteSettings.ppdbWaveStatus === wave.id}
                                onChange={() => setWebsiteSettings({ ...websiteSettings, ppdbWaveStatus: wave.id })}
                                className="mt-1 text-[#1b3828] focus:ring-[#1b3828]"
                              />
                              <div>
                                <strong className="text-xs font-extrabold text-slate-900 block">{wave.title}</strong>
                                <span className="text-[11px] text-slate-600 block">{wave.desc}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-900 text-white p-6 rounded-3xl border border-emerald-800 space-y-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#c5a059] text-[#1b3828] flex items-center justify-center font-black shrink-0">
                            <Globe size={22} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">Publikasikan Ke Website Utama</h4>
                            <span className="text-[10px] text-[#c5a059] font-bold block uppercase tracking-wider">Super Admin Authoritative</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed">
                          Tekan tombol di bawah untuk menyimpan dan menayangkan perubahan konfigurasi ini langsung pada antarmuka publik pengunjung website.
                        </p>

                        <button
                          type="submit"
                          className="w-full py-3.5 px-4 rounded-xl bg-[#c5a059] text-[#1b3828] font-black text-xs hover:bg-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle size={18} />
                          <span>Simpan & Publis Perubahan</span>
                        </button>
                      </div>

                    </div>

                  </form>
                )}

                {/* SUB TAB 2: NEWS & ANNOUNCEMENTS LIST */}
                {annCmsSubTab === 'NEWS_LIST' && (
                  <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Cari judul berita atau isi..."
                          value={newsSearchTerm}
                          onChange={(e) => setNewsSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Kategori:</span>
                        <select
                          value={newsCategoryFilter}
                          onChange={(e) => setNewsCategoryFilter(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                        >
                          {['Semua', 'PPDB', 'Prestasi', 'Kegiatan', 'Pengumuman', 'Akademik'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* News Grid */}
                    {announcementsList.length === 0 ? (
                      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                        <Megaphone className="mx-auto text-slate-300" size={48} />
                        <h4 className="text-base font-bold text-slate-700">Belum Ada Berita Dipublikasikan</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Klik tombol "+ Buat Berita Baru" untuk menambahkan pengumuman atau informasi sekolah terbaru yang akan tampil di halaman utama.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {announcementsList
                          .filter(item => {
                            const matchSearch = item.title?.toLowerCase().includes(newsSearchTerm.toLowerCase()) || item.summary?.toLowerCase().includes(newsSearchTerm.toLowerCase());
                            const matchCat = newsCategoryFilter === 'Semua' || item.category === newsCategoryFilter;
                            return matchSearch && matchCat;
                          })
                          .map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#2d5a3f] transition-all">
                              <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    item.category === 'PPDB' ? 'bg-amber-100 text-amber-800' :
                                    item.category === 'Prestasi' ? 'bg-emerald-100 text-emerald-800' :
                                    item.category === 'Kegiatan' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {item.category || 'Pengumuman'}
                                  </span>

                                  {item.isImportant && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center gap-1">
                                      ★ PENTING
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm font-extrabold text-[#1b3828] line-clamp-2 leading-snug">
                                  {item.title}
                                </h4>

                                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                  {item.summary || item.content}
                                </p>
                              </div>

                              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                                <div>
                                  <span className="font-bold text-slate-700">{item.author || 'Super Admin'}</span>
                                  <span className="block text-[10px] text-slate-400">{item.date}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEditNews(item)}
                                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#1b3828] hover:text-white transition-all cursor-pointer"
                                    title="Edit Berita"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteNews(item.id, item.title)}
                                    className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                    title="Hapus Berita"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB TAB 3: CREATE / EDIT NEWS FORM */}
                {annCmsSubTab === 'CREATE_NEWS' && (
                  <form onSubmit={handleSaveNewsSubmit} className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 max-w-3xl mx-auto w-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-extrabold text-[#1b3828]">
                          {editingNewsId ? '✏️ Edit Berita / Pengumuman' : '📢 Publikasikan Berita / Pengumuman Baru'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Konten yang Anda terbitkan akan langsung muncul pada section "Berita & Pengumuman" di website utama.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAnnCmsSubTab('NEWS_LIST')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer shrink-0 self-start sm:self-center"
                      >
                        Kembali Ke List
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Berita / Pengumuman *</label>
                        <input
                          type="text"
                          required
                          value={newsForm.title}
                          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                          placeholder="Contoh: Pengumuman Hasil Seleksi Administrasi PPDB Gelombang 1"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] focus:border-[#1b3828] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                          <select
                            value={newsForm.category}
                            onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                          >
                            <option value="PPDB">PPDB</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Pengumuman">Pengumuman</option>
                            <option value="Akademik">Akademik</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Penulis / Author</label>
                          <input
                            type="text"
                            value={newsForm.author}
                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                            placeholder="Contoh: Humas Sekolah / Super Admin"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Rilis</label>
                          <input
                            type="date"
                            value={newsForm.date}
                            onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat (Muncul di Kartu Depan)</label>
                        <textarea
                          rows={2}
                          value={newsForm.summary}
                          onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                          placeholder="Tulis ringkasan 1-2 kalimat untuk tampilan cuplikan depan..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#1b3828] focus:border-[#1b3828] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Isi Lengkap Berita / Pengumuman *</label>
                        <textarea
                          rows={6}
                          required
                          value={newsForm.content}
                          onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                          placeholder="Tulis detail lengkap berita atau pengumuman resmi di sini..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#1b3828] focus:border-[#1b3828] outline-none"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <strong className="text-xs font-bold text-amber-900 block">Tandai Sebagai Berita Penting (Pinned Priority)</strong>
                          <span className="text-[11px] text-amber-700 block">Berita akan mendapat badge ★ PENTING di website utama</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={newsForm.isImportant}
                          onChange={(e) => setNewsForm({ ...newsForm, isImportant: e.target.checked })}
                          className="w-5 h-5 text-[#1b3828] rounded focus:ring-[#1b3828] cursor-pointer shrink-0 self-end sm:self-center"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAnnCmsSubTab('NEWS_LIST')}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer text-center w-full sm:w-auto"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#1b3828] text-white font-extrabold text-xs hover:bg-[#2d5a3f] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md w-full sm:w-auto"
                      >
                        <Send size={15} />
                        <span>{editingNewsId ? 'Simpan Perubahan Berita' : 'Terbitkan Ke Website Utama'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* SUB TAB 4: GURU & STAFF CMS */}
                {annCmsSubTab === 'GURU_CMS' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                      <div>
                        <h4 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                          <Users size={18} className="text-[#c5a059]" />
                          <span>Kelola Profil Guru & Tenaga Pendidik</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tambah, ubah, atau hapus profil guru dan staf yang tampil di website utama tanpa perlu mengubah kode sumber.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeacherId(null);
                          setTeacherForm({
                            name: '',
                            role: '',
                            department: 'RPL',
                            subject: '',
                            education: 'S1 Pendidikan Komputer',
                            nip: '',
                            photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
                            bio: '',
                            quote: ''
                          });
                          setIsAddingTeacher(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#1b3828] text-white font-black text-xs hover:bg-[#2d5a3f] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Plus size={16} />
                        <span>+ Tambah Profil Guru Baru</span>
                      </button>
                    </div>

                    {/* Form Add / Edit Teacher */}
                    {(isAddingTeacher || editingTeacherId) && (
                      <form onSubmit={handleSaveTeacher} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="text-sm font-extrabold text-[#1b3828]">
                            {editingTeacherId ? '✏️ Edit Profil Guru' : '➕ Tambah Guru Baru'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingTeacher(false);
                              setEditingTeacherId(null);
                            }}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Drs. H. Ahmad Subagja, M.Pd"
                              value={teacherForm.name}
                              onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Role *</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Kepala Sekolah / Kaprog RPL"
                              value={teacherForm.role}
                              onChange={(e) => setTeacherForm({ ...teacherForm, role: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Departemen / Bidang *</label>
                            <select
                              value={teacherForm.department}
                              onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value as any })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            >
                              <option value="Pimpinan">Pimpinan Sekolah</option>
                              <option value="RPL">RPL (Software & Web)</option>
                              <option value="AKL">AKL (Perbankan)</option>
                              <option value="TSM">TSM (Sepeda Motor)</option>
                              <option value="Umum">Umum / Muatan Nasional</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran Ampuhan</label>
                            <input
                              type="text"
                              placeholder="Contoh: Pemrograman Web & Perangkat Bergerak"
                              value={teacherForm.subject}
                              onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                            <input
                              type="text"
                              placeholder="Contoh: S2 Magister Pendidikan"
                              value={teacherForm.education}
                              onChange={(e) => setTeacherForm({ ...teacherForm, education: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">NIP / NUPTK (Opsional)</label>
                            <input
                              type="text"
                              placeholder="Contoh: 19750812 200212 1 003"
                              value={teacherForm.nip}
                              onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Foto Guru (Upload / URL)</label>
                            <div className="flex gap-2 items-center">
                              <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 border border-slate-300 shrink-0">
                                <span>Upload Foto</span>
                                <input type="file" accept="image/*" onChange={handleTeacherPhotoUpload} className="hidden" />
                              </label>
                              <input
                                type="text"
                                placeholder="Atau tempel URL Foto..."
                                value={teacherForm.photoUrl}
                                onChange={(e) => setTeacherForm({ ...teacherForm, photoUrl: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Pengalaman Singkat</label>
                            <textarea
                              rows={2}
                              placeholder="Pengalaman mengajar, keahlian, atau rekam jejak industri..."
                              value={teacherForm.bio}
                              onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kutipan Motivasi / Quote</label>
                            <input
                              type="text"
                              placeholder="Contoh: 'Pendidikan adalah kunci untuk membuka pintu emas kebebasan.'"
                              value={teacherForm.quote}
                              onChange={(e) => setTeacherForm({ ...teacherForm, quote: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingTeacher(false);
                              setEditingTeacherId(null);
                            }}
                            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#1b3828] text-white font-extrabold text-xs hover:bg-[#2d5a3f] shadow-sm flex items-center gap-1.5"
                          >
                            <CheckCircle size={15} />
                            <span>Simpan Profil Guru</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Search & Teacher List */}
                    <div className="space-y-4">
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Cari nama guru, jabatan, atau mata pelajaran..."
                          value={teacherSearchTerm}
                          onChange={(e) => setTeacherSearchTerm(e.target.value)}
                          className="w-full text-xs font-medium outline-none bg-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teachersCmsList
                          .filter(t => 
                            t.name.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
                            t.role.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
                            t.subject.toLowerCase().includes(teacherSearchTerm.toLowerCase())
                          )
                          .map((teacher) => (
                            <div key={teacher.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={teacher.photoUrl}
                                    alt={teacher.name}
                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                                  />
                                  <div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                                      {teacher.department}
                                    </span>
                                    <h5 className="text-sm font-bold text-[#1b3828] leading-tight mt-1 line-clamp-1">
                                      {teacher.name}
                                    </h5>
                                    <p className="text-[11px] font-medium text-[#c5a059] line-clamp-1">
                                      {teacher.role}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                                  <div><strong>Mapel:</strong> {teacher.subject}</div>
                                  <div><strong>Pendidikan:</strong> {teacher.education}</div>
                                  {teacher.nip && <div><strong>NIP:</strong> {teacher.nip}</div>}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTeacherId(teacher.id);
                                    setTeacherForm({
                                      name: teacher.name,
                                      role: teacher.role,
                                      department: teacher.department,
                                      subject: teacher.subject,
                                      education: teacher.education,
                                      nip: teacher.nip || '',
                                      photoUrl: teacher.photoUrl,
                                      bio: teacher.bio || '',
                                      quote: teacher.quote || ''
                                    });
                                    setIsAddingTeacher(false);
                                  }}
                                  className="flex-1 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs hover:bg-amber-100 flex items-center justify-center gap-1"
                                >
                                  <Edit size={14} /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                                  className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100"
                                  title="Hapus Guru"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 5: EKSKUL CMS */}
                {annCmsSubTab === 'EKSKUL_CMS' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                      <div>
                        <h4 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                          <Trophy size={18} className="text-[#c5a059]" />
                          <span>Kelola Kegiatan Ekstrakurikuler</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tambah ekstrakurikuler baru, unggah foto kegiatan, atur pembina dan jadwal latihan secara real-time.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingEkskulId(null);
                          setEkskulForm({
                            name: '',
                            category: 'Akademik & Teknologi',
                            schedule: 'Jumat, 15:30 WIB',
                            supervisor: '',
                            description: '',
                            achievements: '',
                            image: ''
                          });
                          setIsAddingEkskul(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#1b3828] text-white font-black text-xs hover:bg-[#2d5a3f] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Plus size={16} />
                        <span>+ Tambah Ekstrakurikuler Baru</span>
                      </button>
                    </div>

                    {/* Form Add / Edit Ekskul */}
                    {(isAddingEkskul || editingEkskulId) && (
                      <form onSubmit={handleSaveEkskul} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="text-sm font-extrabold text-[#1b3828]">
                            {editingEkskulId ? '✏️ Edit Ekstrakurikuler' : '➕ Tambah Ekstrakurikuler Baru'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingEkskul(false);
                              setEditingEkskulId(null);
                            }}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ekstrakurikuler *</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Robotics & Software Club"
                              value={ekskulForm.name}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                            <select
                              value={ekskulForm.category}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, category: e.target.value as any })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            >
                              <option value="Akademik & Teknologi">Akademik & Teknologi</option>
                              <option value="Olahraga">Olahraga</option>
                              <option value="Seni & Budaya">Seni & Budaya / DKV</option>
                              <option value="Kepemimpinan">Kepemimpinan & Kedisiplinan</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Jadwal Kegiatan / Latihan</label>
                            <input
                              type="text"
                              placeholder="Contoh: Jumat, 15:30 WIB"
                              value={ekskulForm.schedule}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, schedule: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Guru Pembina</label>
                            <input
                              type="text"
                              placeholder="Contoh: Ir. Budi Santoso, M.Kom"
                              value={ekskulForm.supervisor}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, supervisor: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Foto Kegiatan Ekskul (Upload / URL)</label>
                            <div className="flex gap-2 items-center">
                              <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 border border-slate-300 shrink-0">
                                <span>Upload Foto File</span>
                                <input type="file" accept="image/*" onChange={handleEkskulPhotoUpload} className="hidden" />
                              </label>
                              <input
                                type="text"
                                placeholder="Atau masukan URL Foto..."
                                value={ekskulForm.image}
                                onChange={(e) => setEkskulForm({ ...ekskulForm, image: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none"
                              />
                            </div>
                            {ekskulForm.image && (
                              <div className="mt-2 h-24 w-40 rounded-xl overflow-hidden border border-slate-200">
                                <img src={ekskulForm.image} alt="Preview Ekskul" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kegiatan *</label>
                            <textarea
                              rows={2}
                              required
                              placeholder="Jelaskan aktivitas, fokus pembinaan, dan daya tarik ekstrakurikuler..."
                              value={ekskulForm.description}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, description: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#1b3828] outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Prestasi Unggulan (Satu per baris)</label>
                            <textarea
                              rows={2}
                              placeholder="Juara 1 LKS Robotika Provinsi 2025&#10;Juara Umum LKBB Jabodetabek 2025"
                              value={ekskulForm.achievements}
                              onChange={(e) => setEkskulForm({ ...ekskulForm, achievements: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingEkskul(false);
                              setEditingEkskulId(null);
                            }}
                            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#1b3828] text-white font-extrabold text-xs hover:bg-[#2d5a3f] shadow-sm flex items-center gap-1.5"
                          >
                            <CheckCircle size={15} />
                            <span>Simpan Ekstrakurikuler</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Ekskul Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ekskulCmsList.map((club) => (
                        <div key={club.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between">
                          <div>
                            {club.image ? (
                              <div className="h-32 bg-slate-100 relative overflow-hidden">
                                <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-[#c5a059] text-[10px] font-bold">
                                  {club.category}
                                </span>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-[#1b3828]">{club.name}</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                                  {club.category}
                                </span>
                              </div>
                            )}

                            <div className="p-4 space-y-2">
                              <h5 className="text-sm font-bold text-[#1b3828] leading-snug">
                                {club.name}
                              </h5>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {club.description}
                              </p>
                              <div className="text-[11px] text-slate-500">
                                <strong>Jadwal:</strong> {club.schedule}
                              </div>
                              {club.supervisor && (
                                <div className="text-[11px] text-slate-500">
                                  <strong>Pembina:</strong> {club.supervisor}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-4 pt-0 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEkskulId(club.id);
                                setEkskulForm({
                                  name: club.name,
                                  category: club.category,
                                  schedule: club.schedule,
                                  supervisor: club.supervisor || '',
                                  description: club.description,
                                  achievements: club.achievements ? club.achievements.join('\n') : '',
                                  image: club.image || ''
                                });
                                setIsAddingEkskul(false);
                              }}
                              className="flex-1 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs hover:bg-amber-100 flex items-center justify-center gap-1"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEkskul(club.id, club.name)}
                              className="p-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100"
                              title="Hapus Ekskul"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================= TAB 0.2: PPDB_COMMAND (Penanggung Jawab PPDB) ================= */}
            {activeTab === 'PPDB_COMMAND' && (
              <div className="space-y-6">
                
                {/* Official Executive In-Charge Banner */}
                <div className="bg-gradient-to-r from-[#1b3828] via-[#2d5a3f] to-[#1b3828] text-white p-6 rounded-3xl border border-[#2d5a3f] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059] text-[#1b3828] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <BadgeCheck size={12} />
                        Penanggung Jawab Utama Siswa Baru
                      </span>
                      <span className="text-[11px] font-mono text-emerald-300 font-bold">
                        SK NO: 421.5/SK-PPDB/SMK-BN/I/2026
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                      Command Center Penanggung Jawab PPDB T.A. 2026/2027
                    </h3>
                    <p className="text-xs text-slate-200">
                      Pengawas Eksekutif & Penanggung Jawab Pendaftaran Siswa Baru. Mengendalikan verifikasi massal, pengiriman broadcast notifikasi WhatsApp, dan penerbitan SK kelulusan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleApproveAllPending}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all shadow-md flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>Setujui Lulus Massal (Pending)</span>
                    </button>
                    <button
                      onClick={() => generateHeadmasterExecutivePDF(registrations)}
                      className="px-4 py-2.5 rounded-xl bg-[#c5a059] text-[#1b3828] font-bold text-xs hover:bg-white transition-all shadow-md flex items-center gap-2"
                    >
                      <Printer size={16} />
                      <span>Cetak SK Penetapan PDF</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Broadcast Gateway & Automated Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                          <Send size={18} className="text-emerald-600" />
                          <span>Pusat Broadcast Gateway WhatsApp PPDB 2026</span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Kirim notifikasi otomatis verifikasi berkas & pengumuman kelulusan ke nomor WA calon siswa & orang tua.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200">
                        {registrations.length} Siswa Terdaftar
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Template Pesan Notifikasi Broadcast:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'VERIFIED', title: '1. Verifikasi Berkas', desc: 'Konfirmasi pendaftaran diterima & siap seleksi' },
                            { id: 'LULUS', title: '2. Pengumuman Lulus', desc: 'Pemberitahuan resmi DITERIMA di SMK Bhinneka' },
                            { id: 'DAFTAR_ULANG', title: '3. Undangan Daftar Ulang', desc: 'Jadwal penyerahan berkas & pengambilan seragam' }
                          ].map((tmpl) => (
                            <button
                              key={tmpl.id}
                              type="button"
                              onClick={() => setSelectedWaTemplate(tmpl.id as any)}
                              className={`p-3.5 rounded-2xl border text-left transition-all ${
                                selectedWaTemplate === tmpl.id
                                  ? 'bg-[#1b3828] text-white border-[#1b3828] shadow-md'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <strong className="text-xs font-black block">{tmpl.title}</strong>
                              <span className={`text-[10px] block mt-1 ${selectedWaTemplate === tmpl.id ? 'text-slate-200' : 'text-slate-500'}`}>
                                {tmpl.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 font-mono text-xs space-y-2 border border-emerald-800 relative">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#c5a059] block">
                          Pratinjau Pesan WA (Auto Variable Replace):
                        </span>
                        <p className="leading-relaxed whitespace-pre-line text-[11px]">
                          {selectedWaTemplate === 'VERIFIED' && `Halo [Nama Siswa], Pendaftaran PPDB SMK Bhinneka Nusantara Anda dengan Kode [Kode PPDB] telah DIVERIFIKASI OLEH PENANGGUNG JAWAB PPDB. Silakan simpan bukti pendaftaran ini.`}
                          {selectedWaTemplate === 'LULUS' && `SELAMAT! [Nama Siswa] NISN: [NISN], Anda dinyatakan RESMI DITERIMA sebagai Siswa Baru Jurusan [Jurusan] SMK Bhinneka Nusantara T.A 2026/2027.`}
                          {selectedWaTemplate === 'DAFTAR_ULANG' && `Pemberitahuan Daftar Ulang PPDB: Kepada Yth Orang Tua dari [Nama Siswa], dimohon hadir ke Sekretariat PPDB SMK Bhinneka Nusantara pada jam 08.00 WIB untuk verifikasi fisik & pengambilan seragam.`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleRunWaBroadcast}
                          disabled={isBroadcastingWa}
                          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          <Send size={16} className={isBroadcastingWa ? 'animate-bounce' : ''} />
                          <span>{isBroadcastingWa ? 'Mengirim Broadcast WA...' : 'Jalankan Broadcast WA Ke All Siswa'}</span>
                        </button>
                      </div>

                      {/* Log output */}
                      {waBroadcastLogs.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1 max-h-48 overflow-y-auto border border-slate-800">
                          {waBroadcastLogs.map((log, idx) => (
                            <div key={idx}>{log}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Executive Status */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                      <h4 className="text-sm font-black text-[#1b3828] flex items-center gap-2">
                        <BadgeCheck size={18} className="text-[#c5a059]" />
                        <span>Status Tanggung Jawab Operasional</span>
                      </h4>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                          <strong className="block font-black text-[#1b3828]">Penanggung Jawab Resmi PPDB:</strong>
                          <p className="font-semibold">{websiteSettings.penanggungJawabName}</p>
                          <span className="text-[10px] text-slate-600 block">{websiteSettings.penanggungJawabNip}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="block font-bold text-slate-800">Total Kuota Tersedia:</strong>
                          <span className="font-black text-slate-900 text-sm block">{websiteSettings.rplQuota + websiteSettings.aklQuota + websiteSettings.tsmQuota} Siswa</span>
                          <span className="text-[10px] text-slate-500">RPL: {websiteSettings.rplQuota} | AKL: {websiteSettings.aklQuota} | TSM: {websiteSettings.tsmQuota}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="block font-bold text-slate-800">Total Pendaftar Masuk:</strong>
                          <span className="font-black text-emerald-700 text-sm block">{registrations.length} Siswa</span>
                          <span className="text-[10px] text-slate-500">
                            Diterima: {registrations.filter(r => r.status.includes('Diterima')).length} Siswa | Pending: {registrations.filter(r => !r.status.includes('Diterima')).length} Siswa
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ================= TAB 1: OVERVIEW ================= */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-6">
                
                {/* Top Banner */}
                <div className="bg-gradient-to-r from-[#1b3828] via-[#2d5a3f] to-[#1b3828] text-white p-6 rounded-3xl border border-[#2d5a3f] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#c5a059] font-mono font-bold uppercase tracking-widest">
                      Status Real-Time Database Active
                    </span>
                    <h4 className="text-xl font-extrabold text-white">
                      Penerimaan Peserta Didik Baru (PPDB) T.A. 2026/2027
                    </h4>
                    <p className="text-xs text-slate-200">
                      Total Pendaftaran: <strong>{registrations.length} Siswa</strong> | Kuota Terisi: <strong>{Math.min(100, Math.round((registrations.length / 150) * 100))}% dari Target 150 Siswa</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('PPDB_DATA')}
                    className="px-4 py-2.5 rounded-xl bg-[#c5a059] text-[#1b3828] font-bold text-xs hover:bg-white transition-all flex items-center gap-2 shrink-0 shadow-md"
                  >
                    <span>Kelola Pendaftaran</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Stat Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Users size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Total Pendaftar</span>
                      <strong className="text-2xl font-black text-[#1b3828]">{registrations.length} Siswa</strong>
                      <span className="text-[11px] text-emerald-600 block font-semibold">Tersimpan di Database</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Diterima Resmi</span>
                      <strong className="text-2xl font-black text-emerald-800">
                        {registrations.filter(r => r.status.includes('Diterima')).length} Siswa
                      </strong>
                      <span className="text-[11px] text-slate-500 block">Lulus Seleksi Berkas</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Clock size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Verifikasi Pending</span>
                      <strong className="text-2xl font-black text-amber-800">
                        {registrations.filter(r => r.status.includes('Pending') || r.status.includes('Tergrafis')).length} Siswa
                      </strong>
                      <span className="text-[11px] text-amber-600 block font-semibold">Butuh Pemeriksaan</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#e8f0eb] text-[#2d5a3f] flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Pesan Inquiries</span>
                      <strong className="text-2xl font-black text-[#1b3828]">{messages.length} Pesan</strong>
                      <span className="text-[11px] text-slate-500 block">Form Kontak Website</span>
                    </div>
                  </div>
                </div>

                {/* Major Breakdown Progress */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-base font-extrabold text-[#1b3828] flex items-center gap-2">
                      <Code size={20} className="text-[#2d5a3f]" />
                      Sebaran Pendaftar per Program Keahlian (Jurusan)
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      Target Total Kuota: 150 Siswa
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* RPL */}
                    <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[#1b3828]">RPL (Software & Web)</strong>
                        <span className="text-xs font-extrabold text-[#2d5a3f]">
                          {registrations.filter(r => r.firstChoiceMajor === 'RPL').length} / 50 Siswa
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-[#2d5a3f] rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (registrations.filter(r => r.firstChoiceMajor === 'RPL').length / 50) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* AKL */}
                    <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[#1b3828]">AKL (Akuntansi Keuangan)</strong>
                        <span className="text-xs font-extrabold text-[#2d5a3f]">
                          {registrations.filter(r => r.firstChoiceMajor === 'AKL').length} / 50 Siswa
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-[#c5a059] rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (registrations.filter(r => r.firstChoiceMajor === 'AKL').length / 50) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* TSM */}
                    <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[#1b3828]">TSM (Teknik Sepeda Motor)</strong>
                        <span className="text-xs font-extrabold text-[#2d5a3f]">
                          {registrations.filter(r => r.firstChoiceMajor === 'TSM').length} / 50 Siswa
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-[#1b3828] rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (registrations.filter(r => r.firstChoiceMajor === 'TSM').length / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 2: DATA PENDAFTAR ================= */}
            {activeTab === 'PPDB_DATA' && (
              <div className="space-y-4">
                
                {/* Role Specific Notice Banner */}
                {isKepsek ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Crown size={18} className="text-amber-600 shrink-0" />
                      <div>
                        <strong className="block font-extrabold text-amber-950">Mode Kepala Sekolah (Pengawasan Eksekutif - Read-Only)</strong>
                        <span>Anda dapat memantau seluruh {registrations.length} data pendaftar, memfilter jurusan, dan mencetak dokumen eksekutif.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => generateHeadmasterExecutivePDF(registrations, {})}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-colors shrink-0"
                    >
                      Cetak Laporan PDF
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                      <div>
                        <strong className="block font-extrabold text-emerald-950">Mode Super Admin / Panitia PPDB (Akses Pengelolaan Penuh)</strong>
                        <span>Terhubung langsung ke backend API. Anda dapat **menambah pendaftar**, **menerima/verifikasi data**, & **menghapus record**.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2d5a3f] text-white font-extrabold text-xs hover:bg-[#1b3828] transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                    >
                      <Plus size={14} />
                      <span>+ Tambah Pendaftar</span>
                    </button>
                  </div>
                )}

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Cari NIK/NISN, Nama, atau Kode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAFBF9] border border-slate-300 text-xs focus:outline-none focus:border-[#2d5a3f]"
                      />
                      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={selectedMajorFilter}
                        onChange={(e) => setSelectedMajorFilter(e.target.value as any)}
                        className="px-3 py-2.5 rounded-xl bg-[#FAFBF9] border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2d5a3f] flex-1 sm:flex-initial"
                      >
                        <option value="ALL">Semua Jurusan</option>
                        <option value="RPL">RPL - Software</option>
                        <option value="AKL">AKL - Akuntansi</option>
                        <option value="TSM">TSM - Sepeda Motor</option>
                      </select>

                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-[#FAFBF9] border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2d5a3f] flex-1 sm:flex-initial"
                      >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING">Pending Verifikasi</option>
                        <option value="VERIFIED">Terverifikasi Berkas</option>
                        <option value="ACCEPTED">Diterima Resmi</option>
                        <option value="REJECTED">Ditolak</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 font-semibold self-end md:self-center">
                    Menampilkan <span className="font-bold text-[#1b3828]">{filteredRegistrations.length}</span> dari {registrations.length} Pendaftar
                  </div>
                </div>

                {/* Tablet & Desktop View: Table View */}
                <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#1b3828] text-white text-[11px] uppercase font-extrabold tracking-wider border-b border-[#2d5a3f]">
                          <th className="py-3.5 px-4">No & Kode</th>
                          <th className="py-3.5 px-4">NISN / NIK</th>
                          <th className="py-3.5 px-4">Nama Pendaftar</th>
                          <th className="py-3.5 px-4">Asal Sekolah</th>
                          <th className="py-3.5 px-4">Jurusan</th>
                          <th className="py-3.5 px-4">Tgl Daftar</th>
                          <th className="py-3.5 px-4">Status Otorisasi</th>
                          <th className="py-3.5 px-4 text-center">Aksi & Konfirmasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {filteredRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-500 font-medium">
                              {isLoadingData ? 'Memuat data dari database MySQL...' : 'Tidak ada data pendaftaran yang sesuai dengan filter.'}
                            </td>
                          </tr>
                        ) : (
                          filteredRegistrations.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-[#FAFBF9] transition-colors">
                              <td className="py-3.5 px-4">
                                <span className="text-slate-400 font-mono text-[11px] block">#{idx + 1}</span>
                                <strong className="text-[#1b3828] font-mono text-xs">{item.registrationCode}</strong>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-700">{item.nikNisn}</td>
                              <td className="py-3.5 px-4">
                                <strong className="text-slate-900 block font-bold">{item.fullName}</strong>
                                <span className="text-slate-500 text-[11px]">{item.gender} | WA: {item.phoneWhatsapp}</span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-700">{item.originSchool}</td>
                              <td className="py-3.5 px-4">
                                <span className="px-2.5 py-1 rounded-md bg-[#e8f0eb] text-[#1b3828] font-black text-[11px] border border-[#2d5a3f]/20">
                                  {item.firstChoiceMajor}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">{item.registrationDate}</td>
                              <td className="py-3.5 px-4">
                                <select
                                  disabled={isKepsek}
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                                    item.status.includes('Diterima') 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                      : item.status.includes('Terverifikasi')
                                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                                      : 'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  <option value="Tergrafis (Pending Verification)">Pending Verifikasi</option>
                                  <option value="Terverifikasi Berkas">Terverifikasi Berkas</option>
                                  <option value="Diterima Resmi">Terverifikasi & Diterima</option>
                                  <option value="Ditolak / Berkas Tidak Sesuai">Ditolak</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  {/* Quick Accept Button for Super Admin */}
                                  {isSuperAdmin && !item.status.includes('Diterima') && (
                                    <button
                                      onClick={() => handleStatusChange(item.id, 'Diterima Resmi')}
                                      className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-2xs"
                                      title="Terima & Verifikasi Pendaftaran Ini"
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>Terima</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => setSelectedRecordDetail(item)}
                                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#2d5a3f] hover:text-white transition-colors"
                                    title="Lihat Detail Form"
                                  >
                                    <Eye size={15} />
                                  </button>

                                  <button
                                    onClick={() => generateRegistrationPDF(item)}
                                    className="p-1.5 rounded-lg bg-[#e8f0eb] text-[#1b3828] hover:bg-[#1b3828] hover:text-white transition-colors"
                                    title="Download / Cetak PDF Resmi"
                                  >
                                    <Download size={15} />
                                  </button>

                                  <button
                                    onClick={() => handleInitiateDelete(item)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      isKepsek 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                                    }`}
                                    title={isKepsek ? 'Kepala Sekolah (Read-Only)' : 'Hapus Record dari Backend'}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Responsive Cards View for PPDB Students */}
                <div className="block sm:hidden space-y-3">
                  {filteredRegistrations.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
                      {isLoadingData ? 'Memuat data dari database...' : 'Tidak ada data pendaftaran yang sesuai dengan filter.'}
                    </div>
                  ) : (
                    filteredRegistrations.map((item, idx) => (
                      <div key={item.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        {/* Header Info */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                              <strong className="text-[#1b3828] font-mono text-xs">{item.registrationCode}</strong>
                            </div>
                            <h4 className="text-slate-900 text-sm font-black mt-0.5">{item.fullName}</h4>
                            <span className="text-slate-500 text-[11px] block font-mono">NISN: {item.nikNisn}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#e8f0eb] text-[#1b3828] font-black text-[11px] border border-[#2d5a3f]/20 shrink-0">
                            {item.firstChoiceMajor}
                          </span>
                        </div>

                        {/* Detail Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[10px] font-bold">Asal Sekolah:</span>
                            <span className="text-slate-800 font-semibold truncate block">{item.originSchool || '-'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[10px] font-bold">Tanggal Daftar:</span>
                            <span className="text-slate-800 font-semibold block">{item.registrationDate || '-'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[10px] font-bold">Gender / Kontak:</span>
                            <span className="text-slate-800 font-semibold truncate block">{item.gender || '-'} • WA: {item.phoneWhatsapp}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[10px] font-bold">Nama Wali:</span>
                            <span className="text-slate-800 font-semibold truncate block">{item.parentName || '-'}</span>
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <div>
                            <span className="text-slate-500 block text-[10px] font-bold mb-1">Status Verification Otorisasi:</span>
                            <select
                              disabled={isKepsek}
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none min-h-[40px] ${
                                item.status.includes('Diterima') 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                  : item.status.includes('Terverifikasi')
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Tergrafis (Pending Verification)">Pending Verifikasi</option>
                              <option value="Terverifikasi Berkas">Terverifikasi Berkas</option>
                              <option value="Diterima Resmi">Terverifikasi & Diterima</option>
                              <option value="Ditolak / Berkas Tidak Sesuai">Ditolak</option>
                            </select>
                          </div>

                          {/* Action Buttons Toolbar */}
                          <div className="flex items-center gap-1.5 pt-1 flex-wrap sm:flex-nowrap">
                            {isSuperAdmin && !item.status.includes('Diterima') && (
                              <button
                                onClick={() => handleStatusChange(item.id, 'Diterima Resmi')}
                                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-2xs min-h-[40px]"
                              >
                                <CheckCircle2 size={14} />
                                <span>Terima</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedRecordDetail(item)}
                              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-[#2d5a3f] hover:text-white transition-colors flex items-center justify-center gap-1 min-h-[40px]"
                              title="Lihat Form Detail"
                            >
                              <Eye size={15} />
                              <span>Detail</span>
                            </button>

                            <button
                              onClick={() => generateRegistrationPDF(item)}
                              className="py-2 px-3 rounded-xl bg-[#e8f0eb] text-[#1b3828] font-bold text-xs hover:bg-[#1b3828] hover:text-white transition-colors flex items-center justify-center gap-1 min-h-[40px]"
                              title="Cetak PDF"
                            >
                              <Download size={15} />
                              <span>PDF</span>
                            </button>

                            <button
                              onClick={() => handleInitiateDelete(item)}
                              className={`p-2.5 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                                isKepsek 
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                  : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                              }`}
                              title="Hapus Data Siswa Ini"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* ================= TAB 3: MONITORING KELAS & MURID (GURU) ================= */}
            {activeTab === 'CLASS_MONITOR' && (
              <motion.div 
                key="CLASS_MONITOR"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Guru Header Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white p-6 rounded-3xl border border-blue-700/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 border border-blue-300/30 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                      <GraduationCap size={14} /> Portal Pemantauan Guru Pengajar & Wali Kelas
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Pemantauan Murid, Kesiapan Belajar & Kontak Orang Tua
                    </h3>
                    <p className="text-xs text-blue-100/90 max-w-2xl">
                      Portal ini memudahkan Guru Pengajar dan Wali Kelas untuk memantau pendaftar per kelas/jurusan, mengecek kelengkapan berkas, dan menyimpan catatan kesiapan belajar siswa.
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-right shrink-0">
                    <span className="text-[10px] text-blue-200 block uppercase font-bold">Wali Kelas Active</span>
                    <strong className="text-sm font-extrabold text-white block">Dra. Endang Rahayu, S.Pd.</strong>
                    <span className="text-[11px] text-blue-300 font-mono block">NIP. 19780512 200501 2 004</span>
                  </div>
                </div>

                {/* Class Filter Tabs & Search */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
                    <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                      <School size={16} className="text-blue-600" /> Pilih Kelas/Jurusan:
                    </span>
                    {[
                      { code: 'RPL', label: 'X RPL (Software)' },
                      { code: 'AKL', label: 'X AKL (Akuntansi)' },
                      { code: 'TSM', label: 'X TSM (Otomotif)' },
                      { code: 'ALL', label: 'Semua Kelas' }
                    ].map(tab => (
                      <button
                        key={tab.code}
                        onClick={() => setTeacherClassFilter(tab.code as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                          teacherClassFilter === tab.code
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Cari nama atau NISN murid..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  </div>
                </div>

                {/* Teacher Roster Table - Desktop & Tablet View */}
                <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={18} className="text-blue-600" />
                      <strong className="text-xs font-extrabold text-slate-800">
                        Daftar Murid {teacherClassFilter === 'ALL' ? 'Seluruh Jurusan' : `Kelas ${teacherClassFilter}`}
                      </strong>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      Total: <strong>{registrations.filter(r => teacherClassFilter === 'ALL' || r.firstChoiceMajor === teacherClassFilter).length} Murid Terdaftar</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Nama & NISN Murid</th>
                          <th className="py-3 px-4">Jurusan</th>
                          <th className="py-3 px-4">Asal Sekolah</th>
                          <th className="py-3 px-4">Kontak Ortu / WA</th>
                          <th className="py-3 px-4">Status Berkas</th>
                          <th className="py-3 px-4 min-w-[240px]">Catatan Guru / Wali Kelas</th>
                          <th className="py-3 px-4 text-center">Form</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {registrations.filter(r => {
                          const matchesClass = teacherClassFilter === 'ALL' || r.firstChoiceMajor === teacherClassFilter;
                          const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.nikNisn.includes(searchTerm);
                          return matchesClass && matchesSearch;
                        }).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                              Belum ada murid terdaftar di kelas jurusan ini.
                            </td>
                          </tr>
                        ) : (
                          registrations.filter(r => {
                            const matchesClass = teacherClassFilter === 'ALL' || r.firstChoiceMajor === teacherClassFilter;
                            const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.nikNisn.includes(searchTerm);
                            return matchesClass && matchesSearch;
                          }).map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-3.5 px-4">
                                <strong className="text-slate-900 block font-bold text-xs">{item.fullName}</strong>
                                <span className="text-slate-400 text-[11px] font-mono">NISN: {item.nikNisn}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-extrabold text-[11px] border border-blue-300/50">
                                  {item.firstChoiceMajor}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 font-medium">{item.originSchool}</td>
                              <td className="py-3.5 px-4">
                                <span className="text-slate-800 font-semibold block">{item.parentName || 'Orang Tua'}</span>
                                <a
                                  href={`https://wa.me/${(item.parentPhone || item.phoneWhatsapp).replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline font-mono text-[11px] font-bold flex items-center gap-1"
                                >
                                  <MessageSquare size={12} />
                                  <span>{item.parentPhone || item.phoneWhatsapp}</span>
                                </a>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black inline-block ${
                                  item.status.includes('Diterima')
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                  {item.status.includes('Diterima') ? 'Siap Masuk Kelas' : 'Berkas Pending'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Tambah catatan guru/wali kelas..."
                                    value={teacherNotes[item.id] || ''}
                                    onChange={(e) => setTeacherNotes({ ...teacherNotes, [item.id]: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-slate-50"
                                  />
                                  <button
                                    onClick={() => handleSaveTeacherNote(item.id, teacherNotes[item.id] || '')}
                                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 shrink-0 flex items-center gap-1 shadow-2xs"
                                    title="Simpan Catatan Guru"
                                  >
                                    {savingNoteId === item.id ? <Check size={14} className="text-amber-300" /> : <NotebookPen size={13} />}
                                    <span>{savingNoteId === item.id ? 'Tersimpan' : 'Simpan'}</span>
                                  </button>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => setSelectedRecordDetail(item)}
                                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                                  title="Lihat Detail Profil Murid"
                                >
                                  <Eye size={15} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Responsive Roster Cards View */}
                <div className="block sm:hidden space-y-3">
                  {registrations.filter(r => {
                    const matchesClass = teacherClassFilter === 'ALL' || r.firstChoiceMajor === teacherClassFilter;
                    const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.nikNisn.includes(searchTerm);
                    return matchesClass && matchesSearch;
                  }).length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-xs font-medium">
                      Belum ada murid terdaftar di kelas jurusan ini.
                    </div>
                  ) : (
                    registrations.filter(r => {
                      const matchesClass = teacherClassFilter === 'ALL' || r.firstChoiceMajor === teacherClassFilter;
                      const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.nikNisn.includes(searchTerm);
                      return matchesClass && matchesSearch;
                    }).map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                          <div>
                            <strong className="text-slate-900 text-sm font-extrabold block">{item.fullName}</strong>
                            <span className="text-slate-400 text-[11px] font-mono">NISN: {item.nikNisn}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-extrabold text-[11px] border border-blue-300/50 shrink-0">
                            {item.firstChoiceMajor}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Asal Sekolah:</span>
                            <span className="text-slate-700 font-semibold truncate block">{item.originSchool || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Status Berkas:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block mt-0.5 ${
                              item.status.includes('Diterima')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status.includes('Diterima') ? 'Siap Masuk Kelas' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-slate-500 text-[10px] font-bold block">Kontak Ortu / Wali Kelas:</span>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{item.parentName || 'Orang Tua'}</span>
                            <a
                              href={`https://wa.me/${(item.parentPhone || item.phoneWhatsapp).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <MessageSquare size={12} />
                              <span>{item.parentPhone || item.phoneWhatsapp}</span>
                            </a>
                          </div>
                        </div>

                        {/* Catatan Guru Input */}
                        <div className="pt-1 space-y-1.5">
                          <span className="text-slate-500 text-[10px] font-bold block">Catatan Guru / Wali Kelas:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Tulis catatan..."
                              value={teacherNotes[item.id] || ''}
                              onChange={(e) => setTeacherNotes({ ...teacherNotes, [item.id]: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-slate-50 min-h-[40px]"
                            />
                            <button
                              onClick={() => handleSaveTeacherNote(item.id, teacherNotes[item.id] || '')}
                              className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shrink-0 flex items-center gap-1 min-h-[40px]"
                            >
                              {savingNoteId === item.id ? <Check size={14} className="text-amber-300" /> : <NotebookPen size={14} />}
                              <span>{savingNoteId === item.id ? 'Saved' : 'Simpan'}</span>
                            </button>
                            <button
                              onClick={() => setSelectedRecordDetail(item)}
                              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                              title="Detail"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </motion.div>
            )}

            {/* ================= TAB 4: PESAN & PERTANYAAN ================= */}
            {activeTab === 'MESSAGES' && (
              <motion.div 
                key="MESSAGES"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1b3828]">
                      Daftar Pesan Masuk dari Calon Orang Tua / Siswa
                    </h3>
                    <p className="text-xs text-slate-500">Pesan pertanyaan yang dikirimkan melalui Form Kontak Website Sekolah</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1b3828] text-[#c5a059] font-bold text-xs">
                    {messages.length} Pesan
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                      Belum ada pesan pertanyaan masuk.
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={msg.id || index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                          <div>
                            <strong className="text-sm font-bold text-[#1b3828] block">{msg.nama}</strong>
                            <span className="text-[11px] text-slate-400 block">{msg.email} | WA: {msg.whatsapp || '-'}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                            {msg.createdAt || 'Baru Saja'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-[#2d5a3f] block mb-1">
                            Subjek: {msg.subjek || 'Pertanyaan Umum'}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed bg-[#FAFBF9] p-3 rounded-xl border border-slate-100">
                            "{msg.pesan}"
                          </p>
                        </div>

                        {msg.whatsapp && (
                          <a
                            href={`https://wa.me/${msg.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            <MessageSquare size={14} />
                            <span>Balas via WhatsApp</span>
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ================= TAB 5: AKUN & SECURITY ================= */}
            {activeTab === 'SECURITY' && (
              <motion.div 
                key="SECURITY"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1b3828] flex items-center gap-2">
                      <ShieldCheck size={20} className="text-[#2d5a3f]" />
                      Daftar Otorisasi Akun & Key Terdaftar di System RBAC
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Otorisasi hak akses privat terdaftar terenkripsi di Express Node.js & MySQL database server.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[10px] font-black">
                          ROLE: KEPALA SEKOLAH
                        </span>
                        <strong className="text-sm text-[#1b3828] block mt-1">Drs. H. M. Supriyadi, M.Pd. (Kepala Sekolah)</strong>
                        <span className="text-xs text-slate-600 font-mono">Username: kepsek | Key: KEPSEKBHINNEKA2026</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black shrink-0">
                        Supervisi & Pengelolaan Data Sekolah
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-black">
                          ROLE: GURU PENGAJAR
                        </span>
                        <strong className="text-sm text-[#1b3828] block mt-1">Dra. Endang Rahayu, S.Pd. (Guru & Wali Kelas)</strong>
                        <span className="text-xs text-slate-600 font-mono">Username: guru | Key: guru123</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-900 text-xs font-black shrink-0">
                        Pemantauan Kelas & Presensi Murid
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-[#1b3828] text-[#c5a059] font-mono text-[10px] font-extrabold">
                          ROLE: SUPER ADMIN
                        </span>
                        <strong className="text-sm text-[#1b3828] block mt-1">Administrator Utama System PPDB</strong>
                        <span className="text-xs text-slate-600 font-mono">Username: admin | Key: ADMINBHINNEKA2026</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black shrink-0">
                        Pengelolaan Penuh (Full Control)
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-[#2d5a3f] text-white font-mono text-[10px] font-bold">
                          ROLE: PANITIA PPDB
                        </span>
                        <strong className="text-sm text-[#1b3828] block mt-1">Panitia Verifikasi Lapangan</strong>
                        <span className="text-xs text-slate-500 font-mono">Username: panitia | Key: smk2026</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold shrink-0">
                        Verifikasi & Export CSV
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit Trail Activity Log */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1b3828] flex items-center gap-2">
                        <Clock size={20} className="text-[#2d5a3f]" />
                        Audit Trail & Aktivitas Backend Real-Time
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Catatan riwayat login dan aktivitas manipulasi data oleh setiap role user.
                      </p>
                    </div>
                    <button
                      onClick={loadAllAdminData}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Refresh Log
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-[#fafbf9]">
                    {auditLogs.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        Belum ada aktivitas baru terdeteksi.
                      </div>
                    ) : (
                      auditLogs.slice(-10).reverse().map((log, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-white transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-lg bg-[#1b3828] text-[#c5a059] font-mono text-[10px] font-extrabold">
                              {log.userRole || 'SYSTEM'}
                            </span>
                            <div>
                              <strong className="text-slate-900 block font-bold">{log.action}</strong>
                              <span className="text-slate-500 text-[11px]">{log.details}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

          </main>
            </div>
          </div>
        </div>
      )}

      {/* Detail Record Modal */}
      <AnimatePresence>
        {selectedRecordDetail && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl relative max-h-[88vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedRecordDetail(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded-md bg-[#1b3828] text-[#c5a059] font-mono text-xs font-bold inline-block">
                Kode: {selectedRecordDetail.registrationCode}
              </span>
              <h3 className="text-xl font-bold text-[#1b3828]">
                {selectedRecordDetail.fullName}
              </h3>
              <p className="text-xs text-slate-500">Pendaftaran PPDB SMK Bhinneka Nusantara</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAFBF9] p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">NISN / NIK:</span>
                <strong className="text-slate-800 font-mono">{selectedRecordDetail.nikNisn}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Jenis Kelamin:</span>
                <strong className="text-slate-800">{selectedRecordDetail.gender}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">TTL:</span>
                <strong className="text-slate-800">{selectedRecordDetail.birthPlaceDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Asal Sekolah:</span>
                <strong className="text-slate-800">{selectedRecordDetail.originSchool}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">No. WA Siswa:</span>
                <strong className="text-slate-800 font-mono">{selectedRecordDetail.phoneWhatsapp}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Orang Tua / Wali:</span>
                <strong className="text-slate-800">{selectedRecordDetail.parentName} ({selectedRecordDetail.parentPhone})</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Pilihan Jurusan:</span>
                <strong className="text-[#2d5a3f] font-black">{selectedRecordDetail.firstChoiceMajor}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Tgl Daftar:</span>
                <strong className="text-slate-800">{selectedRecordDetail.registrationDate}</strong>
              </div>
            </div>

            {/* Uploaded Documents View for Super Admin */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <strong className="text-xs font-bold text-[#1b3828] block">Berkas Persyaratan Ter-upload:</strong>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="block font-semibold text-slate-600 mb-1">Ijazah / SKL</span>
                  {selectedRecordDetail.ijazahDocumentUrl ? (
                    <a
                      href={selectedRecordDetail.ijazahDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] inline-block hover:bg-emerald-700"
                    >
                      Lihat File
                    </a>
                  ) : (
                    <span className="text-slate-400 font-medium">Belum Ada</span>
                  )}
                </div>

                <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="block font-semibold text-slate-600 mb-1">Kartu Keluarga</span>
                  {selectedRecordDetail.kkDocumentUrl ? (
                    <a
                      href={selectedRecordDetail.kkDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] inline-block hover:bg-emerald-700"
                    >
                      Lihat File
                    </a>
                  ) : (
                    <span className="text-slate-400 font-medium">Belum Ada</span>
                  )}
                </div>

                <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="block font-semibold text-slate-600 mb-1">Pas Foto</span>
                  {selectedRecordDetail.photoDocumentUrl ? (
                    <a
                      href={selectedRecordDetail.photoDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] inline-block hover:bg-emerald-700"
                    >
                      Lihat Foto
                    </a>
                  ) : (
                    <span className="text-slate-400 font-medium">Belum Ada</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => generateRegistrationPDF(selectedRecordDetail)}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#1b3828] text-[#f7f2e7] font-bold text-xs hover:bg-[#2d5a3f] transition-colors flex items-center justify-center gap-2 border border-[#c5a059]/40 shadow-sm"
              >
                <Download size={16} className="text-[#c5a059]" />
                <span>Cetak / Download PDF</span>
              </button>

              {!isKepsek && (
                <button
                  onClick={() => {
                    const rec = selectedRecordDetail;
                    setSelectedRecordDetail(null);
                    handleInitiateDelete(rec);
                  }}
                  className="py-3.5 px-4 rounded-xl bg-red-50 text-red-700 font-bold text-xs hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-1.5 border border-red-200"
                  title="Hapus Record Pendaftaran Ini"
                >
                  <Trash2 size={16} />
                  <span>Hapus Data</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Super Admin Add Student Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-bold">
                <FilePlus2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1b3828]">
                  Tambah Data Pendaftar Baru (Super Admin)
                </h3>
                <p className="text-xs text-slate-500">Data akan tersimpan langsung di database backend Express & MySQL</p>
              </div>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rizky Febrian"
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK / NISN *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 327500123456789"
                    value={newStudent.nikNisn}
                    onChange={(e) => setNewStudent({...newStudent, nikNisn: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat & Tanggal Lahir</label>
                  <input
                    type="text"
                    placeholder="Jakarta, 12 Agustus 2009"
                    value={newStudent.birthPlaceDate}
                    onChange={(e) => setNewStudent({...newStudent, birthPlaceDate: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({...newStudent, gender: e.target.value as any})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asal Sekolah (SMP/MTs)</label>
                  <input
                    type="text"
                    placeholder="SMP Negeri 1 Kota Sejahtera"
                    value={newStudent.originSchool}
                    onChange={(e) => setNewStudent({...newStudent, originSchool: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Siswa</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={newStudent.phoneWhatsapp}
                    onChange={(e) => setNewStudent({...newStudent, phoneWhatsapp: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Bpk. Budi Santoso"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP Orang Tua</label>
                  <input
                    type="text"
                    placeholder="08129876543"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilihan Jurusan Utam</label>
                  <select
                    value={newStudent.firstChoiceMajor}
                    onChange={(e) => setNewStudent({...newStudent, firstChoiceMajor: e.target.value as any})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f] font-bold text-[#2d5a3f]"
                  >
                    <option value="RPL">RPL - Rekayasa Perangkat Lunak</option>
                    <option value="AKL">AKL - Akuntansi & Keuangan Lembaga</option>
                    <option value="TSM">TSM - Teknik Sepeda Motor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Awal Data</label>
                  <select
                    value={newStudent.status}
                    onChange={(e) => setNewStudent({...newStudent, status: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2d5a3f] font-bold text-emerald-800 bg-emerald-50"
                  >
                    <option value="Terverifikasi & Diterima">Terverifikasi & Diterima</option>
                    <option value="Terverifikasi Berkas">Terverifikasi Berkas</option>
                    <option value="Tergrafis (Pending Verification)">Pending Verifikasi</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingStudent}
                  className="px-5 py-2.5 rounded-xl bg-[#1b3828] text-white font-extrabold hover:bg-[#2d5a3f] transition-colors flex items-center gap-2 border border-[#c5a059]/40 shadow-md disabled:opacity-50"
                >
                  {isCreatingStudent ? (
                    <span>Menyimpan ke Backend...</span>
                  ) : (
                    <>
                      <CheckCircle size={16} className="text-[#c5a059]" />
                      <span>Simpan Pendaftar Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Modal Confirmation Hapus Record PPDB */}
      <AnimatePresence>
        {recordToDelete && (
          <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto font-bold">
                <Trash2 size={24} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  Konfirmasi Hapus Data Pendaftar
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data siswa <strong className="text-slate-900">{recordToDelete.fullName}</strong> (NISN: {recordToDelete.nikNisn || '-'} / Kode: {recordToDelete.registrationCode || '-'})?
                </p>
                <p className="text-[11px] text-red-700 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200 mt-2">
                  ⚠️ Data pendaftaran ini akan dihapus secara permanen dari server database dan penyimpanan lokal.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-xs flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Trash2 size={16} />
                  <span>Ya, Hapus Permanen</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Alert Otorisasi Read-Only Kepala Sekolah */}
      <AnimatePresence>
        {showKepsekReadOnlyAlert && (
          <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold">
                <Lock size={24} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">
                  Otorisasi Read-Only (Kepala Sekolah)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Akun <strong>Kepala Sekolah</strong> memegang kewenangan Pengawasan Eksekutif (Read-Only). 
                </p>
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left">
                  💡 Untuk melakukan hapus data pendaftaran atau pengubahan status penerimaan siswa, silakan beralih ke akun <strong>Super Admin</strong> (Username: <code>admin</code>) atau <strong>Panitia PPDB</strong> (Username: <code>panitia</code>).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowKepsekReadOnlyAlert(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#1b3828] text-white font-bold text-xs hover:bg-[#2d5a3f] transition-colors min-h-[44px]"
              >
                Mengerti & Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};


