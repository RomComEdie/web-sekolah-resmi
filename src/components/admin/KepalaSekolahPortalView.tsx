import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Building2,
  GraduationCap,
  Download,
  Search,
  Filter,
  ShieldCheck,
  LogOut,
  Plus,
  Send,
  MessageSquare,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  UserCheck,
  Check,
  X,
  Megaphone,
  Bell,
  Award,
  ChevronRight,
  Eye,
  Printer,
  Star,
  Activity,
  Edit3,
  Trash2,
  Bookmark,
  MapPin,
  Briefcase,
  UserPlus,
  Menu
} from 'lucide-react';
import { RegistrationData } from '../../types';
import { SCHOOL_INFO } from '../../data/schoolData';
import { generateHeadmasterExecutivePDF } from '../../utils/pdfGenerator';

interface TeacherPermit {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  assignedClass: string;
  permitType: 'Sakit' | 'Izin Dinas' | 'Cuti' | 'Izin Pribadi' | 'Pelatihan / Workshop';
  startDate: string;
  endDate: string;
  reason: string;
  substituteTeacher: string;
  status: 'Menunggu Disposisi' | 'Disetujui' | 'Ditolak';
  kepsekNote?: string;
  createdAt: string;
}

interface HeadmasterDirective {
  id: string;
  title: string;
  targetAudience: 'Semua Guru' | 'Wali Kelas' | 'Panitia PPDB' | 'Staf Tata Usaha';
  priority: 'Penting' | 'Biasa' | 'Mendesak';
  content: string;
  publishedAt: string;
  author: string;
  readCount?: number;
}

interface HeadmasterAgendaItem {
  id: string;
  time: string;
  date: string;
  title: string;
  location: string;
  category: 'Rapat / Briefing' | 'Supervisi KBM' | 'Dinas Luar' | 'Audience VVIP' | 'Evaluasi Staff';
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  notes?: string;
}

interface TeacherStaffMember {
  id: string;
  nip: string;
  name: string;
  role: 'Guru Pengajar' | 'Wali Kelas' | 'Kepala Program Ahli' | 'Staf Tata Usaha' | 'Guru Piket';
  subjectOrDept: string;
  status: 'Aktif Mengajar' | 'Izin Dinas' | 'Cuti' | 'Pelatihan';
  performanceRating: number; // 1 - 5
  phone: string;
  email: string;
  notes?: string;
}

interface KepalaSekolahPortalViewProps {
  adminUser: any;
  registrations: RegistrationData[];
  onLogout: () => void;
  onBackToAdmin?: () => void;
}

export const KepalaSekolahPortalView: React.FC<KepalaSekolahPortalViewProps> = ({
  adminUser,
  registrations,
  onLogout,
  onBackToAdmin
}) => {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'AGENDA' | 'STAFF_MANAGEMENT' | 'PERMITS' | 'ATTENDANCE' | 'DIRECTIVES' | 'REPORTS'>('DASHBOARD');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [permitFilterStatus, setPermitFilterStatus] = useState<'ALL' | 'Menunggu Disposisi' | 'Disetujui' | 'Ditolak'>('ALL');
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('ALL');

  // ================= 1. HEADMASTER AGENDA STATE (PER-KEPSEK EDITABLE) =================
  const [agendas, setAgendas] = useState<HeadmasterAgendaItem[]>(() => {
    const saved = localStorage.getItem('smk_kepsek_agenda_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'AGD-101',
        time: '08:00 - 09:30 WIB',
        date: '31 Juli 2026',
        title: 'Briefing Pagi Dewan Guru & Staf Tata Usaha',
        location: 'Ruang Rapat Utama Lt. 2',
        category: 'Rapat / Briefing',
        status: 'Selesai',
        notes: 'Membahas persiapan UTS Genap, penegakan disiplin kehadiran, dan progres PPDB Gelombang 2.'
      },
      {
        id: 'AGD-102',
        time: '10:00 - 11:30 WIB',
        date: '31 Juli 2026',
        title: 'Supervisi KBM Praktikum Coding Lab RPL',
        location: 'Laboratorium Komputer 2',
        category: 'Supervisi KBM',
        status: 'Berlangsung',
        notes: 'Meninjau pelaksanaan Kurikulum Merdeka dan kesiapan perangkat komputer siswa.'
      },
      {
        id: 'AGD-103',
        time: '13:30 - 15:00 WIB',
        date: '31 Juli 2026',
        title: 'Rapat Pleno Verifikasi Beasiswa PPDB Gelombang II',
        location: 'Ruang Eksekutif Kepala Sekolah',
        category: 'Audience VVIP',
        status: 'Mendatang',
        notes: 'Penetapan nama-nama calon siswa penerima beasiswa prestasi dan alumni.'
      },
      {
        id: 'AGD-104',
        time: '09:00 - 12:00 WIB',
        date: '01 Agustus 2026',
        title: 'Kunjungan Kerja Dinas Pendidikan Provinsi Banten',
        location: 'Aula Gedung Utama SMK Bhinneka Nusantara',
        category: 'Dinas Luar',
        status: 'Mendatang',
        notes: 'Penyambutan Pengawas Pembina SMK dan Penandatanganan Mou Kemitraan Industri Honda & Telkom.'
      }
    ];
  });

  // Modal State: Agenda (Create / Edit)
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<HeadmasterAgendaItem | null>(null);
  const [agendaForm, setAgendaForm] = useState({
    time: '08:00 - 09:00 WIB',
    date: '31 Juli 2026',
    title: '',
    location: 'Ruang Kepala Sekolah',
    category: 'Rapat / Briefing' as HeadmasterAgendaItem['category'],
    status: 'Mendatang' as HeadmasterAgendaItem['status'],
    notes: ''
  });

  // Save Agenda to localStorage
  useEffect(() => {
    localStorage.setItem('smk_kepsek_agenda_v2', JSON.stringify(agendas));
  }, [agendas]);

  // Handle Save or Update Agenda
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaForm.title.trim()) {
      alert('Judul agenda wajib diisi!');
      return;
    }

    if (editingAgenda) {
      // Edit mode
      setAgendas(prev => prev.map(item => item.id === editingAgenda.id ? { ...item, ...agendaForm } : item));
      alert('Agenda Kepala Sekolah berhasil diperbarui!');
    } else {
      // Create mode
      const newItem: HeadmasterAgendaItem = {
        id: 'AGD-' + Date.now().toString().slice(-4),
        ...agendaForm
      };
      setAgendas(prev => [newItem, ...prev]);
      alert('Agenda baru berhasil ditambahkan ke jadwal Kepala Sekolah!');
    }

    setIsAgendaModalOpen(false);
    setEditingAgenda(null);
    setAgendaForm({
      time: '08:00 - 09:00 WIB',
      date: '31 Juli 2026',
      title: '',
      location: 'Ruang Kepala Sekolah',
      category: 'Rapat / Briefing',
      status: 'Mendatang',
      notes: ''
    });
  };

  const handleEditAgendaClick = (item: HeadmasterAgendaItem) => {
    setEditingAgenda(item);
    setAgendaForm({
      time: item.time,
      date: item.date,
      title: item.title,
      location: item.location,
      category: item.category,
      status: item.status,
      notes: item.notes || ''
    });
    setIsAgendaModalOpen(true);
  };

  const handleDeleteAgenda = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini dari jadwal Kepsek?')) {
      setAgendas(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleToggleAgendaStatus = (id: string) => {
    setAgendas(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Mendatang' ? 'Berlangsung' : item.status === 'Berlangsung' ? 'Selesai' : 'Mendatang';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };


  // ================= 2. TEACHER & STAFF MANAGEMENT STATE =================
  const [teachersStaff, setTeachersStaff] = useState<TeacherStaffMember[]>(() => {
    const saved = localStorage.getItem('smk_teachers_staff_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'STF-001',
        nip: '19780412 200501 2 003',
        name: 'Dra. Endang Rahayu, S.Pd.',
        role: 'Kepala Program Ahli',
        subjectOrDept: 'Rekayasa Perangkat Lunak (RPL)',
        status: 'Aktif Mengajar',
        performanceRating: 5,
        phone: '0812-9876-5432',
        email: 'endang.rahayu@smk.sch.id',
        notes: 'Berprestasi sebagai Pembimbing LKS Web Technologies Tingkat Banten.'
      },
      {
        id: 'STF-002',
        nip: '19820915 200803 1 007',
        name: 'Drs. H. Ahmad Fauzi, M.Pd.',
        role: 'Wali Kelas',
        subjectOrDept: 'X RPL 1 / Basis Data',
        status: 'Aktif Mengajar',
        performanceRating: 5,
        phone: '0813-8822-1100',
        email: 'ahmad.fauzi@smk.sch.id',
        notes: 'Kedisiplinan mengajar dan pengelolaan kelas sangat memuaskan.'
      },
      {
        id: 'STF-003',
        nip: '19881102 201202 2 011',
        name: 'Hj. Siti Nurhaliza, S.E., M.Ak.',
        role: 'Guru Pengajar',
        subjectOrDept: 'Akuntansi Keuangan (AKL)',
        status: 'Izin Dinas',
        performanceRating: 4,
        phone: '0815-7733-9911',
        email: 'siti.nurhaliza@smk.sch.id',
        notes: 'Sedang mengikuti bimtek penyusunan laporan keuangan SMK Negeri & Swasta.'
      },
      {
        id: 'STF-004',
        nip: '19900320 201504 1 002',
        name: 'Ir. Bambang Hermawan, S.T.',
        role: 'Kepala Program Ahli',
        subjectOrDept: 'Teknik Sepeda Motor (TSM)',
        status: 'Aktif Mengajar',
        performanceRating: 5,
        phone: '0819-4455-6677',
        email: 'bambang.hermawan@smk.sch.id',
        notes: 'Berhasil menginisiasi bengkel binaan Honda Motor di lingkungan SMK.'
      },
      {
        id: 'STF-005',
        nip: '19930708 201801 1 009',
        name: 'Budi Santoso, S.Pd., M.M.',
        role: 'Staf Tata Usaha',
        subjectOrDept: 'Administrasi Kepegawaian & TU',
        status: 'Aktif Mengajar',
        performanceRating: 4,
        phone: '0857-1122-3344',
        email: 'budi.tu@smk.sch.id',
        notes: 'Mengelola pelaporan Dapodik dan administrasi surat dinas sekolah.'
      },
      {
        id: 'STF-006',
        nip: '19950512 202002 2 004',
        name: 'Rina Kusuma, S.Kom.',
        role: 'Guru Pengajar',
        subjectOrDept: 'Pemrograman Berorientasi Objek',
        status: 'Aktif Mengajar',
        performanceRating: 5,
        phone: '0821-3344-5566',
        email: 'rina.kusuma@smk.sch.id',
        notes: 'Aktif mendampingi ekstrakurikuler Coding Club siswa.'
      }
    ];
  });

  // Staff Modal State
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<TeacherStaffMember | null>(null);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    nip: '',
    name: '',
    role: 'Guru Pengajar' as TeacherStaffMember['role'],
    subjectOrDept: '',
    status: 'Aktif Mengajar' as TeacherStaffMember['status'],
    performanceRating: 5,
    phone: '',
    email: '',
    notes: ''
  });

  // Save Teachers to localStorage
  useEffect(() => {
    localStorage.setItem('smk_teachers_staff_v1', JSON.stringify(teachersStaff));
  }, [teachersStaff]);

  const handleSaveStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.nip) {
      alert('Nama dan NIP wajib diisi!');
      return;
    }

    if (selectedStaffForEdit) {
      setTeachersStaff(prev => prev.map(s => s.id === selectedStaffForEdit.id ? { ...s, ...staffForm } : s));
      alert('Data Guru/Staf berhasil diperbarui!');
    } else {
      const newStaff: TeacherStaffMember = {
        id: 'STF-' + Date.now().toString().slice(-4),
        ...staffForm
      };
      setTeachersStaff(prev => [newStaff, ...prev]);
      alert('Guru/Staf baru berhasil ditambahkan ke direktori sekolah!');
    }

    setIsAddStaffModalOpen(false);
    setSelectedStaffForEdit(null);
    setStaffForm({
      nip: '',
      name: '',
      role: 'Guru Pengajar',
      subjectOrDept: '',
      status: 'Aktif Mengajar',
      performanceRating: 5,
      phone: '',
      email: '',
      notes: ''
    });
  };


  // ================= 3. TEACHER PERMITS STATE =================
  const [permits, setPermits] = useState<TeacherPermit[]>(() => {
    const saved = localStorage.getItem('smk_teacher_permits_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'PRM-2026-001',
        teacherId: 'guru_rpl1',
        teacherName: 'Dra. Endang Rahayu, S.Pd.',
        subject: 'Pemrograman Web & Mobile',
        assignedClass: 'X RPL 1',
        permitType: 'Izin Dinas',
        startDate: '31 Juli 2026',
        endDate: '01 Agustus 2026',
        reason: 'Mengikuti Workshop Penyusunan Kurikulum Merdeka & Vokasi Tingkat Provinsi Banten di Serang.',
        substituteTeacher: 'Drs. H. Ahmad Fauzi, M.Pd.',
        status: 'Menunggu Disposisi',
        createdAt: '30 Juli 2026'
      },
      {
        id: 'PRM-2026-002',
        teacherId: 'guru_akl1',
        teacherName: 'Hj. Siti Nurhaliza, S.E., M.Ak.',
        subject: 'Akuntansi Keuangan',
        assignedClass: 'X AKL 1',
        permitType: 'Sakit',
        startDate: '31 Juli 2026',
        endDate: '31 Juli 2026',
        reason: 'Demam tinggi dan memerlukan rawat jalan sesuai surat keterangan dokter RSUD Tangerang.',
        substituteTeacher: 'Budi Santoso, S.Pd., M.M.',
        status: 'Disetujui',
        kepsekNote: 'Disetujui. Harap guru pengganti memastikan jam ke-3 dan ke-4 tetap diisi modul latihan akuntansi.',
        createdAt: '31 Juli 2026'
      },
      {
        id: 'PRM-2026-003',
        teacherId: 'guru_tsm1',
        teacherName: 'Ir. Bambang Hermawan, S.T.',
        subject: 'Teknik Mesin Otomotif',
        assignedClass: 'X TSM 1',
        permitType: 'Pelatihan / Workshop',
        startDate: '03 Agustus 2026',
        endDate: '05 Agustus 2026',
        reason: 'Pelatihan Sertifikasi Instruktur Otomotif Honda Injeksi PGM-FI di Training Center.',
        substituteTeacher: 'Rudi Hartono, S.T.',
        status: 'Menunggu Disposisi',
        createdAt: '29 Juli 2026'
      }
    ];
  });

  // Modal State for Permit Action
  const [selectedPermitForAction, setSelectedPermitForAction] = useState<TeacherPermit | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [kepsekInputNote, setKepsekInputNote] = useState('');

  // Save Permits
  useEffect(() => {
    localStorage.setItem('smk_teacher_permits_v2', JSON.stringify(permits));
  }, [permits]);

  const handleConfirmPermitAction = () => {
    if (!selectedPermitForAction || !actionType) return;

    if (actionType === 'REJECT' && !kepsekInputNote.trim()) {
      alert('Harap masukkan alasan penolakan disposisi.');
      return;
    }

    setPermits(prev => prev.map(p => {
      if (p.id === selectedPermitForAction.id) {
        return {
          ...p,
          status: actionType === 'APPROVE' ? 'Disetujui' : 'Ditolak',
          kepsekNote: kepsekInputNote.trim() || p.kepsekNote
        };
      }
      return p;
    }));

    alert(`Disposisi Kepala Sekolah untuk "${selectedPermitForAction.teacherName}" berhasil diperbarui!`);
    setSelectedPermitForAction(null);
    setActionType(null);
    setKepsekInputNote('');
  };


  // ================= 4. DIRECTIVES / MEMOS STATE =================
  const [directives, setDirectives] = useState<HeadmasterDirective[]>(() => {
    const saved = localStorage.getItem('smk_kepsek_directives');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'DIR-01',
        title: 'Instruksi Kesiapan Pelaksanaan UTS & Penegakan Kedisiplinan Guru',
        targetAudience: 'Semua Guru',
        priority: 'Penting',
        content: 'Seluruh Wali Kelas dan Guru Pengajar wajib memastikan kelengkapan nilai harian dan jurnal mengajar kelas sebelum minggu evaluasi tengah semester.',
        publishedAt: '30 Juli 2026',
        author: 'Dr. Hj. Nurul Hidayah, M.Pd.',
        readCount: 42
      },
      {
        id: 'DIR-02',
        title: 'Penetapan Hasil Verifikasi PPDB Gelombang II Tahun Ajaran 2026/2027',
        targetAudience: 'Panitia PPDB',
        priority: 'Mendesak',
        content: 'Panitia PPDB diharapkan segera menyelesaikan rekapitulasi calon siswa yang telah melakukan daftar ulang dan verifikasi berkas.',
        publishedAt: '28 Juli 2026',
        author: 'Dr. Hj. Nurul Hidayah, M.Pd.',
        readCount: 15
      }
    ];
  });

  const [isNewDirectiveModalOpen, setIsNewDirectiveModalOpen] = useState(false);
  const [newDirectiveForm, setNewDirectiveForm] = useState({
    title: '',
    targetAudience: 'Semua Guru' as HeadmasterDirective['targetAudience'],
    priority: 'Penting' as HeadmasterDirective['priority'],
    content: ''
  });

  const handlePublishDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectiveForm.title || !newDirectiveForm.content) {
      alert('Judul dan Isi Instruksi wajib diisi!');
      return;
    }

    const created: HeadmasterDirective = {
      id: 'DIR-' + Date.now().toString().slice(-4),
      title: newDirectiveForm.title,
      targetAudience: newDirectiveForm.targetAudience,
      priority: newDirectiveForm.priority,
      content: newDirectiveForm.content,
      publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: adminUser?.name || 'Dr. Hj. Nurul Hidayah, M.Pd.',
      readCount: 0
    };

    setDirectives(prev => [created, ...prev]);
    setIsNewDirectiveModalOpen(false);
    setNewDirectiveForm({
      title: '',
      targetAudience: 'Semua Guru',
      priority: 'Penting',
      content: ''
    });
    alert('Disposisi / Memo resmi Kepala Sekolah berhasil diterbitkan!');
  };

  // Stats Counters
  const pendingPermitsCount = permits.filter(p => p.status === 'Menunggu Disposisi').length;
  const approvedPermitsCount = permits.filter(p => p.status === 'Disetujui').length;
  const totalTeachers = teachersStaff.length;
  const activeTeachersCount = teachersStaff.filter(t => t.status === 'Aktif Mengajar').length;
  const attendanceRate = Math.round((activeTeachersCount / totalTeachers) * 100);

  // Filtered Permits & Staff
  const filteredPermits = permits.filter(p => {
    const matchesStatus = permitFilterStatus === 'ALL' || p.status === permitFilterStatus;
    const matchesQuery = p.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.permitType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const filteredStaff = teachersStaff.filter(s => {
    const matchesRole = staffRoleFilter === 'ALL' || s.role === staffRoleFilter;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.subjectOrDept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#14261c] text-slate-100 flex flex-col font-sans selection:bg-[#c5a059] selection:text-[#14261c]">
      
      {/* ================= EXECUTIVE WRAPPER ================= */}
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
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-[#0d1a13] text-white z-50 flex flex-col border-r border-[#264432] shadow-2xl md:hidden overflow-y-auto"
              >
                {/* Drawer Header */}
                <div className="p-4 border-b border-[#264432] flex items-center justify-between bg-[#08120d]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white p-1 font-black flex items-center justify-center border-2 border-[#e8cb90] shadow-md overflow-hidden shrink-0">
                      <img src={SCHOOL_INFO.logoUrl} alt="Logo SMK" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white tracking-tight">SMK BHINNEKA</h3>
                      <span className="text-[10px] text-[#c5a059] font-bold block">Portal Kepala Sekolah</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 rounded-xl bg-[#1b3828] text-slate-200 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Drawer Menu Navigation */}
                <div className="flex-1 p-4 space-y-5 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-3">
                      Utama / Kepemimpinan
                    </span>
                    <nav className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('DASHBOARD');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'DASHBOARD'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <BarChart3 size={16} />
                          <span>Ikhtisar Dashboard</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('AGENDA');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'AGENDA'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar size={16} />
                          <span>Agenda Kepala Sekolah</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                          {agendas.length}
                        </span>
                      </button>
                    </nav>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-3">
                      SDM Guru & Ketenagakerjaan
                    </span>
                    <nav className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('STAFF_MANAGEMENT');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'STAFF_MANAGEMENT'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Users size={16} />
                          <span>Manajemen Guru & Staf</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          {totalTeachers}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('PERMITS');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'PERMITS'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock size={16} />
                          <span>Disposisi Izin Guru</span>
                        </div>
                        {pendingPermitsCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                            {pendingPermitsCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('ATTENDANCE');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'ATTENDANCE'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <UserCheck size={16} />
                          <span>Presensi Realtime</span>
                        </div>
                      </button>
                    </nav>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-3">
                      Kebijakan & Laporan
                    </span>
                    <nav className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('DIRECTIVES');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'DIRECTIVES'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Megaphone size={16} />
                          <span>Memo & Disposisi</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('REPORTS');
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold transition-all min-h-[44px] ${
                          activeTab === 'REPORTS'
                            ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                            : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileSpreadsheet size={16} />
                          <span>Laporan & Audit Log</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          generateHeadmasterExecutivePDF(registrations, permits);
                          setIsMobileSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-extrabold text-amber-200 bg-[#282113] hover:bg-[#3d3119] border border-amber-500/30 transition-all text-left min-h-[44px]"
                      >
                        <Download size={16} className="text-[#c5a059]" />
                        <span>Cetak Laporan Exec (PDF)</span>
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Mobile Drawer Profile Card */}
                <div className="p-4 border-t border-[#264432] bg-[#09120d]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 border border-amber-200">
                      KS
                    </div>
                    <div className="overflow-hidden">
                      <strong className="text-xs font-black text-white block truncate">Dr. Hj. Nurul Hidayah</strong>
                      <span className="text-[10px] text-slate-400 block truncate">Kepala Sekolah SMK</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {onBackToAdmin && (
                      <button
                        onClick={() => {
                          onBackToAdmin();
                          setIsMobileSidebarOpen(false);
                        }}
                        className="py-2.5 px-2 rounded-xl bg-[#1b3828] text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center min-h-[40px]"
                      >
                        <span>Admin Hub</span>
                      </button>
                    )}
                    <button
                      onClick={onLogout}
                      className={`py-2.5 px-2 rounded-xl bg-red-950/80 text-red-200 hover:bg-red-900 text-xs font-bold border border-red-800/50 flex items-center justify-center gap-1 min-h-[40px] ${!onBackToAdmin ? 'col-span-2' : ''}`}
                    >
                      <LogOut size={14} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ---------------- A. SIDEBAR KEPALA SEKOLAH ---------------- */}
        <aside className="w-64 bg-[#0d1a13] border-r border-[#264432] flex flex-col shrink-0 hidden md:flex">
          
          {/* Header Brand */}
          <div className="p-5 border-b border-[#264432] flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 font-black flex items-center justify-center shadow-lg border-2 border-[#e8cb90] shrink-0 overflow-hidden">
              <img src={SCHOOL_INFO.logoUrl} alt="Logo SMK" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight leading-tight">
                SMK BHINNEKA NUSANTARA
              </h1>
              <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} />
                <span>Portal Kepala Sekolah</span>
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
            
            {/* Group 1: Agenda & Dashboard Utama */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-3">
                Utama / Kepemimpinan
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('DASHBOARD')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'DASHBOARD'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 size={16} />
                    <span>Ikhtisar Dashboard</span>
                  </div>
                  <ChevronRight size={14} className={activeTab === 'DASHBOARD' ? 'opacity-100' : 'opacity-30'} />
                </button>

                <button
                  onClick={() => setActiveTab('AGENDA')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'AGENDA'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} />
                    <span>Agenda Kepala Sekolah</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    {agendas.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Group 2: Pengelolaan Guru & Staf */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-3">
                SDM Guru & Ketenagakerjaan
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('STAFF_MANAGEMENT')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'STAFF_MANAGEMENT'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users size={16} />
                    <span>Manajemen Guru & Staf</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    {totalTeachers}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('PERMITS')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'PERMITS'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} />
                    <span>Disposisi Izin Guru</span>
                  </div>
                  {pendingPermitsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                      {pendingPermitsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('ATTENDANCE')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'ATTENDANCE'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck size={16} />
                    <span>Presensi Realtime</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Group 3: Kebijakan & Laporan Exec */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 px-3">
                Kebijakan & Laporan
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('DIRECTIVES')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'DIRECTIVES'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Megaphone size={16} />
                    <span>Memo & Disposisi</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('REPORTS')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold transition-all ${
                    activeTab === 'REPORTS'
                      ? 'bg-[#1b3828] text-[#c5a059] border border-[#c5a059]/30 shadow-md'
                      : 'text-slate-300 hover:bg-[#162b1f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet size={16} />
                    <span>Laporan & Audit Log</span>
                  </div>
                </button>

                <button
                  onClick={() => generateHeadmasterExecutivePDF(registrations, permits)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-extrabold text-amber-200 bg-[#282113] hover:bg-[#3d3119] border border-amber-500/30 transition-all text-left"
                >
                  <Download size={16} className="text-[#c5a059]" />
                  <span>Cetak Laporan Exec (PDF)</span>
                </button>
              </nav>
            </div>

          </div>

          {/* Profile Card */}
          <div className="p-4 border-t border-[#264432] bg-[#09120d]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 border border-amber-200">
                KS
              </div>
              <div className="overflow-hidden">
                <strong className="text-xs font-black text-white block truncate">
                  Dr. Hj. Nurul Hidayah
                </strong>
                <span className="text-[10px] text-slate-400 block truncate">
                  Kepala Sekolah SMK
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {onBackToAdmin && (
                <button
                  onClick={onBackToAdmin}
                  className="py-2 px-2.5 rounded-xl bg-[#1b3828] text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 flex items-center justify-center gap-1"
                >
                  <span>Admin Hub</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className={`py-2 px-2.5 rounded-xl bg-red-950/80 text-red-200 hover:bg-red-900 text-[10px] font-bold border border-red-800/50 flex items-center justify-center gap-1 ${!onBackToAdmin ? 'col-span-2' : ''}`}
              >
                <LogOut size={12} />
                <span>Keluar</span>
              </button>
            </div>
          </div>

        </aside>


        {/* ---------------- B. MAIN CANVAS (WHITE & GREEN EXECUTIVE DESIGN) ---------------- */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f4f7f5] text-slate-800 overflow-y-auto">
          
          {/* Top Bar */}
          <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 sticky top-0 z-20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-[#0d1a13] text-[#c5a059] border border-[#264432] md:hidden shrink-0 shadow-xs"
                title="Buka Menu Kepala Sekolah"
              >
                <Menu size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Supervisi Sekolah</span>
                  <span>/</span>
                  <span className="text-[#1b3828] font-black">
                    {activeTab === 'DASHBOARD' && 'Ikhtisar Eksekutif'}
                    {activeTab === 'AGENDA' && 'Kelola Agenda Kepala Sekolah'}
                    {activeTab === 'STAFF_MANAGEMENT' && 'Manajemen Guru & Staf'}
                    {activeTab === 'PERMITS' && 'Disposisi Izin Guru'}
                    {activeTab === 'ATTENDANCE' && 'Presensi Guru & Staf'}
                    {activeTab === 'DIRECTIVES' && 'Memo & Instruksi'}
                    {activeTab === 'REPORTS' && 'Audit Log & Laporan'}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#1b3828] tracking-tight mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Selamat Datang, Ibu Kepala Sekolah</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Crown size={12} className="text-amber-600" />
                    <span>Dr. Hj. Nurul Hidayah, M.Pd.</span>
                  </span>
                </h2>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  placeholder="Cari agenda, guru, dinas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              <button
                onClick={() => {
                  setEditingAgenda(null);
                  setAgendaForm({
                    time: '08:00 - 09:00 WIB',
                    date: '31 Juli 2026',
                    title: '',
                    location: 'Ruang Kepala Sekolah',
                    category: 'Rapat / Briefing',
                    status: 'Mendatang',
                    notes: ''
                  });
                  setIsAgendaModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus size={15} />
                <span>+ Agenda Baru</span>
              </button>

              <button
                onClick={() => setIsNewDirectiveModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#c5a059] text-[#1b3828] font-black text-xs hover:bg-[#d8b368] flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Megaphone size={15} />
                <span>Memo Kepsek</span>
              </button>
            </div>
          </header>

          {/* Canvas Content */}
          <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full">

            {/* ================= TAB 1: DASHBOARD (HOME) ================= */}
            {activeTab === 'DASHBOARD' && (
              <div className="space-y-6">
                
                {/* Pending Permit Alert */}
                {pendingPermitsCount > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <strong className="text-xs font-black block">
                          Terdapat {pendingPermitsCount} Permohonan Izin Guru Memerlukan Disposisi Kepsek
                        </strong>
                        <p className="text-[11px] text-amber-800">
                          Harap periksa permohonan izin dinas & sakit guru untuk memastikan jadwal jam pelajaran pengganti.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('PERMITS')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-black text-xs shrink-0 shadow-xs flex items-center gap-1"
                    >
                      <span>Tinjau Disposisi</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* Top Executive Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Guru & Staf</span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black">
                        <Users size={20} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1b3828]">{totalTeachers}</span>
                      <span className="text-xs font-bold text-slate-500">Personel</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <TrendingUp size={13} />
                        <span>{activeTeachersCount} Aktif Bertugas</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agenda Kepala Sekolah</span>
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black">
                        <Calendar size={20} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-900">{agendas.length}</span>
                      <span className="text-xs font-bold text-slate-500">Jadwal Acara</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-amber-800 font-bold">
                        {agendas.filter(a => a.status === 'Berlangsung').length} Berlangsung • {agendas.filter(a => a.status === 'Mendatang').length} Mendatang
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kehadiran Hari Ini</span>
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-black">
                        <UserCheck size={20} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1b3828]">{attendanceRate}%</span>
                      <span className="text-xs font-bold text-slate-500">Tingkat Presensi</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-blue-700 font-extrabold">
                        {activeTeachersCount} Hadir • {totalTeachers - activeTeachersCount} Dinas/Izin
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supervisi PPDB Siswa</span>
                      <div className="w-10 h-10 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                        <GraduationCap size={20} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1b3828]">{registrations.length}</span>
                      <span className="text-xs font-bold text-slate-500">Total Pendaftar</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-extrabold">
                        Target Pendaftaran Terlampaui
                      </span>
                    </div>
                  </div>

                </div>

                {/* Dashboard Dual Grid: Agenda Headmaster + Staff Management Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Interactive Editable Agenda */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                            <Activity size={20} className="text-[#c5a059]" />
                            <span>Agenda & Jadwal Kegiatan Kepala Sekolah</span>
                          </h3>
                          <p className="text-xs text-slate-500">Daftar agenda resmi yang dapat Anda edit, atur statusnya, dan perbarui kapan saja.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingAgenda(null);
                            setAgendaForm({
                              time: '08:00 - 09:00 WIB',
                              date: '31 Juli 2026',
                              title: '',
                              location: 'Ruang Kepala Sekolah',
                              category: 'Rapat / Briefing',
                              status: 'Mendatang',
                              notes: ''
                            });
                            setIsAgendaModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] flex items-center gap-1 shadow-xs"
                        >
                          <Plus size={14} />
                          <span>Tambah Agenda</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {agendas.map(item => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                              item.status === 'Berlangsung'
                                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                                : item.status === 'Selesai'
                                ? 'bg-slate-50/80 border-slate-200 opacity-80'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-24 py-1.5 rounded-xl font-mono text-[10px] font-black text-center shrink-0 ${
                                item.status === 'Berlangsung'
                                  ? 'bg-amber-500 text-slate-950'
                                  : item.status === 'Selesai'
                                  ? 'bg-slate-300 text-slate-700'
                                  : 'bg-[#1b3828] text-[#c5a059]'
                              }`}>
                                {item.time}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                    item.category === 'Supervisi KBM'
                                      ? 'bg-blue-100 text-blue-900'
                                      : item.category === 'Audience VVIP'
                                      ? 'bg-purple-100 text-purple-900'
                                      : item.category === 'Dinas Luar'
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-emerald-100 text-emerald-900'
                                  }`}>
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <MapPin size={11} />
                                    <span>{item.location}</span>
                                  </span>
                                </div>
                                <strong className="text-slate-900 text-xs font-bold block">{item.title}</strong>
                                {item.notes && (
                                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.notes}</p>
                                )}
                              </div>
                            </div>

                            {/* Quick Agenda Action Controls */}
                            <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                              <button
                                onClick={() => handleToggleAgendaStatus(item.id)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                                  item.status === 'Selesai'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : item.status === 'Berlangsung'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                                title="Klik untuk mengubah status agenda"
                              >
                                {item.status}
                              </button>

                              <button
                                onClick={() => handleEditAgendaClick(item)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                                title="Edit Agenda"
                              >
                                <Edit3 size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteAgenda(item.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all"
                                title="Hapus Agenda"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff & Teacher Quick Performance Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                            <Users size={20} className="text-[#c5a059]" />
                            <span>Direktori & Status Kinerja Guru & Staf</span>
                          </h3>
                          <p className="text-xs text-slate-500">Monitoring cepat daftar dewan guru danstaf kependidikan.</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('STAFF_MANAGEMENT')}
                          className="text-xs font-bold text-[#1b3828] hover:underline flex items-center gap-0.5"
                        >
                          <span>Kelola Semua ({totalTeachers})</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {teachersStaff.slice(0, 4).map(staff => (
                          <div key={staff.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center justify-center shrink-0">
                              {staff.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="overflow-hidden flex-1">
                              <div className="flex items-center justify-between">
                                <strong className="text-xs font-bold text-slate-900 block truncate">{staff.name}</strong>
                                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  ★ {staff.performanceRating}.0
                                </span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-500 block truncate mt-0.5">{staff.role} • {staff.subjectOrDept}</span>
                              <span className="text-[10px] font-semibold text-emerald-700 block mt-1">● {staff.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right: Memo & Reports */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Memo Kepsek Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                          <Megaphone size={18} className="text-[#c5a059]" />
                          <span>Memo Disposisi Terbit</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('DIRECTIVES')}
                          className="text-xs font-bold text-[#1b3828] hover:underline flex items-center gap-0.5"
                        >
                          <span>Kelola</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {directives.map(dir => (
                          <div key={dir.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="px-2 py-0.5 rounded bg-[#1b3828] text-[#c5a059] font-black uppercase">
                                {dir.targetAudience}
                              </span>
                              <span className="text-slate-400 font-mono">{dir.publishedAt}</span>
                            </div>
                            <strong className="text-slate-900 block font-bold text-xs">{dir.title}</strong>
                            <p className="text-slate-500 text-[11px] line-clamp-2">{dir.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDF Export Banner */}
                    <div className="bg-[#0d1a13] text-white rounded-3xl p-6 border border-[#264432] space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                          <Printer size={20} />
                        </div>
                        <div>
                          <strong className="text-sm font-black block">Cetak Laporan Eksekutif</strong>
                          <p className="text-[10px] text-slate-300">Unduh PDF Rekapitulasi Supervisi Kepsek</p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateHeadmasterExecutivePDF(registrations, permits)}
                        className="w-full py-2.5 rounded-xl bg-[#c5a059] text-[#0d1a13] font-black text-xs hover:bg-[#e2bb75] transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Download size={15} />
                        <span>Download PDF Laporan Resmi</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* ================= TAB 2: AGENDA KEPALA SEKOLAH (FULL EDITABLE TAB) ================= */}
            {activeTab === 'AGENDA' && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Calendar size={22} className="text-[#c5a059]" />
                      <span>Kelola Agenda Resmi Kepala Sekolah</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Atur seluruh agenda rapat dinas, supervisi KBM, audiensi VVIP, dan kegiatan operasional sekolah.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAgenda(null);
                      setAgendaForm({
                        time: '08:00 - 09:00 WIB',
                        date: '31 Juli 2026',
                        title: '',
                        location: 'Ruang Kepala Sekolah',
                        category: 'Rapat / Briefing',
                        status: 'Mendatang',
                        notes: ''
                      });
                      setIsAgendaModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <Plus size={16} />
                    <span>Tambah Agenda Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {agendas.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1b3828] text-[#c5a059] font-mono text-[10px] font-black">
                            {item.time}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            item.status === 'Berlangsung'
                              ? 'bg-amber-100 text-amber-900'
                              : item.status === 'Selesai'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <strong className="text-sm font-black text-slate-900 block">{item.title}</strong>
                        
                        <div className="space-y-1 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#c5a059]" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bookmark size={13} className="text-[#1b3828]" />
                            <span>{item.category} • {item.date}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="p-3 rounded-2xl bg-slate-50 text-[11px] text-slate-600 border border-slate-200 mt-2">
                            {item.notes}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleAgendaStatus(item.id)}
                          className="text-[11px] font-extrabold text-[#1b3828] hover:underline"
                        >
                          Ubah Status
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditAgendaClick(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAgenda(item.id)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}


            {/* ================= TAB 3: MANAJEMEN GURU & STAF ================= */}
            {activeTab === 'STAFF_MANAGEMENT' && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Users size={22} className="text-[#c5a059]" />
                      <span>Manajemen Dewan Guru & Staf Kependidikan</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Kelola direktori pendidik, Wali Kelas, Kepala Program Ahli, evaluasi kinerja, dan penugasan staf.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStaffForEdit(null);
                      setStaffForm({
                        nip: '',
                        name: '',
                        role: 'Guru Pengajar',
                        subjectOrDept: '',
                        status: 'Aktif Mengajar',
                        performanceRating: 5,
                        phone: '',
                        email: '',
                        notes: ''
                      });
                      setIsAddStaffModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <UserPlus size={16} />
                    <span>Tambah Guru / Staf</span>
                  </button>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {['ALL', 'Guru Pengajar', 'Wali Kelas', 'Kepala Program Ahli', 'Staf Tata Usaha'].map(role => (
                      <button
                        key={role}
                        onClick={() => setStaffRoleFilter(role)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                          staffRoleFilter === role
                            ? 'bg-[#1b3828] text-[#c5a059] shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {role === 'ALL' ? 'Semua Staf' : role}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    Menampilkan <strong className="text-slate-900">{filteredStaff.length}</strong> Personel
                  </span>
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                        <th className="pb-3 px-3">NIP / Nama Guru</th>
                        <th className="pb-3 px-3">Jabatan / Peran</th>
                        <th className="pb-3 px-3">Mata Pelajaran / Dept</th>
                        <th className="pb-3 px-3">Status Tugas</th>
                        <th className="pb-3 px-3 text-center">Evaluasi Kinerja</th>
                        <th className="pb-3 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStaff.map(staff => (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="py-3.5 px-3">
                            <strong className="text-slate-900 font-bold block">{staff.name}</strong>
                            <span className="text-[10px] font-mono text-slate-400">{staff.nip}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[10px]">
                              {staff.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 font-semibold">{staff.subjectOrDept}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              staff.status === 'Aktif Mengajar'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-900'
                            }`}>
                              ● {staff.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center text-amber-500 font-bold text-xs gap-0.5">
                              {'★'.repeat(staff.performanceRating)}
                              <span className="text-slate-400 text-[10px] ml-1">({staff.performanceRating}.0)</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedStaffForEdit(staff);
                                setStaffForm({
                                  nip: staff.nip,
                                  name: staff.name,
                                  role: staff.role,
                                  subjectOrDept: staff.subjectOrDept,
                                  status: staff.status,
                                  performanceRating: staff.performanceRating,
                                  phone: staff.phone,
                                  email: staff.email,
                                  notes: staff.notes || ''
                                });
                                setIsAddStaffModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px]"
                            >
                              Edit / Catatan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}


            {/* ================= TAB 4: DISPOSISI IZIN GURU ================= */}
            {activeTab === 'PERMITS' && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Clock size={22} className="text-[#c5a059]" />
                      <span>Disposisi & Persetujuan Izin Guru</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Verifikasi dan beri disposisi resmi permohonan izin dinas, sakit, dan cuti dewan guru.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPermitFilterStatus('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        permitFilterStatus === 'ALL' ? 'bg-[#1b3828] text-[#c5a059]' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Semua ({permits.length})
                    </button>
                    <button
                      onClick={() => setPermitFilterStatus('Menunggu Disposisi')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        permitFilterStatus === 'Menunggu Disposisi' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-amber-50 text-amber-900'
                      }`}
                    >
                      Menunggu ({pendingPermitsCount})
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                        <th className="pb-3 px-3">ID / Tanggal</th>
                        <th className="pb-3 px-3">Nama Guru & Mapel</th>
                        <th className="pb-3 px-3">Jenis Izin</th>
                        <th className="pb-3 px-3">Guru Pengganti</th>
                        <th className="pb-3 px-3">Status Disposisi</th>
                        <th className="pb-3 px-3 text-right">Aksi Disposisi Kepsek</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPermits.map(permit => (
                        <tr key={permit.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="py-3.5 px-3">
                            <strong className="text-slate-900 font-bold block">{permit.id}</strong>
                            <span className="text-[10px] font-mono text-slate-400">{permit.startDate}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <strong className="text-slate-900 font-bold block">{permit.teacherName}</strong>
                            <span className="text-[10px] text-slate-500">{permit.subject} ({permit.assignedClass})</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-black text-[10px]">
                              {permit.permitType}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-700">{permit.substituteTeacher}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                              permit.status === 'Disetujui'
                                ? 'bg-emerald-100 text-emerald-900'
                                : permit.status === 'Ditolak'
                                ? 'bg-red-100 text-red-900'
                                : 'bg-amber-100 text-amber-900 animate-pulse'
                            }`}>
                              {permit.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedPermitForAction(permit);
                                setActionType('APPROVE');
                                setKepsekInputNote(permit.kepsekNote || 'Permohonan izin disetujui. Harap guru pengganti mengisi jam pelajaran.');
                              }}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px]"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPermitForAction(permit);
                                setActionType('REJECT');
                                setKepsekInputNote(permit.kepsekNote || '');
                              }}
                              className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px]"
                            >
                              Tolak
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}


            {/* ================= TAB 5: PRESENSI REALTIME ================= */}
            {activeTab === 'ATTENDANCE' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                  <UserCheck size={20} className="text-[#c5a059]" />
                  <span>Presensi & Kehadiran Guru Realtime</span>
                </h3>
                <p className="text-xs text-slate-500">Monitoring absensi mengajar jurnal harian kelas dewan guru SMK Bhinneka Nusantara.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800 uppercase block">Guru Hadir & Mengajar</span>
                    <span className="text-2xl font-black text-emerald-900">{activeTeachersCount} Orang</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 uppercase block">Guru Izin Dinas / Sakit</span>
                    <span className="text-2xl font-black text-amber-900">{totalTeachers - activeTeachersCount} Orang</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-xs font-bold text-blue-800 uppercase block">Tingkat Kedisiplinan Kehadiran</span>
                    <span className="text-2xl font-black text-blue-900">{attendanceRate}%</span>
                  </div>
                </div>
              </div>
            )}


            {/* ================= TAB 6: DIRECTIVES / MEMO KEPSEK ================= */}
            {activeTab === 'DIRECTIVES' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Megaphone size={22} className="text-[#c5a059]" />
                      <span>Terbitkan Disposisi & Memo Resmi Kepsek</span>
                    </h3>
                    <p className="text-xs text-slate-500">Kirim instruksi penting ke dewan guru, wali kelas, dan staf kependidikan.</p>
                  </div>
                  <button
                    onClick={() => setIsNewDirectiveModalOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-[#c5a059] text-[#1b3828] font-black text-xs hover:bg-[#d8b368]"
                  >
                    + Memo Baru
                  </button>
                </div>

                <div className="space-y-4">
                  {directives.map(dir => (
                    <div key={dir.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-3 py-1 rounded-full bg-[#1b3828] text-[#c5a059] font-black uppercase text-[10px]">
                          Sasaran: {dir.targetAudience}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{dir.publishedAt}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{dir.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{dir.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* ================= TAB 7: REPORTS & AUDIT LOG ================= */}
            {activeTab === 'REPORTS' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-[#c5a059]" />
                  <span>Audit Log & Laporan Supervisi Eksekutif</span>
                </h3>
                <p className="text-xs text-slate-500">Rekam jejak tindakan kepemimpinan dan ekspor PDF resmi.</p>
                
                <button
                  onClick={() => generateHeadmasterExecutivePDF(registrations, permits)}
                  className="px-5 py-3 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] flex items-center gap-2 shadow-md"
                >
                  <Download size={16} />
                  <span>Download Laporan PDF Resmi Kepala Sekolah</span>
                </button>
              </div>
            )}

          </div>

        </main>

      </div>


      {/* ================= MODAL: CREATE / EDIT AGENDA ================= */}
      <AnimatePresence>
        {isAgendaModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                  <Calendar size={20} className="text-[#c5a059]" />
                  <span>{editingAgenda ? 'Edit Agenda Kepala Sekolah' : 'Tambah Agenda Baru'}</span>
                </h3>
                <button
                  onClick={() => setIsAgendaModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAgenda} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Judul Agenda / Acara *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rapat Evaluasi Kurikulum Merdeka & P5"
                    value={agendaForm.title}
                    onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Waktu Pelaksanaan</label>
                    <input
                      type="text"
                      value={agendaForm.time}
                      onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tanggal</label>
                    <input
                      type="text"
                      value={agendaForm.date}
                      onChange={(e) => setAgendaForm({ ...agendaForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Lokasi Kegiatan</label>
                    <input
                      type="text"
                      value={agendaForm.location}
                      onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Kategori Agenda</label>
                    <select
                      value={agendaForm.category}
                      onChange={(e) => setAgendaForm({ ...agendaForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                    >
                      <option value="Rapat / Briefing">Rapat / Briefing</option>
                      <option value="Supervisi KBM">Supervisi KBM</option>
                      <option value="Dinas Luar">Dinas Luar</option>
                      <option value="Audience VVIP">Audience VVIP</option>
                      <option value="Evaluasi Staff">Evaluasi Staff</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status Agenda</label>
                  <select
                    value={agendaForm.status}
                    onChange={(e) => setAgendaForm({ ...agendaForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                  >
                    <option value="Mendatang">Mendatang</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Catatan Instruksi Tambahan</label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan ringkasan arahan atau perlengkapan yang perlu disiapkan..."
                    value={agendaForm.notes}
                    onChange={(e) => setAgendaForm({ ...agendaForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b3828]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAgendaModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] font-black hover:bg-[#2d5a3f]"
                  >
                    {editingAgenda ? 'Simpan Perubahan' : 'Tambah Agenda'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= MODAL: ADD / EDIT STAFF MEMBER ================= */}
      <AnimatePresence>
        {isAddStaffModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                  <Users size={20} className="text-[#c5a059]" />
                  <span>{selectedStaffForEdit ? 'Edit Data Guru / Staf' : 'Tambah Guru / Staf Baru'}</span>
                </h3>
                <button
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveStaffMember} className="space-y-3 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">NIP Guru / Staf *</label>
                    <input
                      type="text"
                      required
                      placeholder="19820915..."
                      value={staffForm.nip}
                      onChange={(e) => setStaffForm({ ...staffForm, nip: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dra. Endang Rahayu..."
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Peran / Jabatan</label>
                    <select
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    >
                      <option value="Guru Pengajar">Guru Pengajar</option>
                      <option value="Wali Kelas">Wali Kelas</option>
                      <option value="Kepala Program Ahli">Kepala Program Ahli</option>
                      <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mata Pelajaran / Dept</label>
                    <input
                      type="text"
                      placeholder="Rekayasa Perangkat Lunak"
                      value={staffForm.subjectOrDept}
                      onChange={(e) => setStaffForm({ ...staffForm, subjectOrDept: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Status Keaktifan</label>
                    <select
                      value={staffForm.status}
                      onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    >
                      <option value="Aktif Mengajar">Aktif Mengajar</option>
                      <option value="Izin Dinas">Izin Dinas</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Pelatihan">Pelatihan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Evaluasi Kinerja (1 - 5)</label>
                    <select
                      value={staffForm.performanceRating}
                      onChange={(e) => setStaffForm({ ...staffForm, performanceRating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    >
                      <option value={5}>★ 5.0 (Sangat Memuaskan)</option>
                      <option value={4}>★ 4.0 (Baik)</option>
                      <option value={3}>★ 3.0 (Cukup)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Catatan Khusus Kepala Sekolah</label>
                  <textarea
                    rows={2}
                    placeholder="Masukkan evaluasi atau prestasi khusus guru..."
                    value={staffForm.notes}
                    onChange={(e) => setStaffForm({ ...staffForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] font-black"
                  >
                    Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= MODAL: NEW DIRECTIVE MEMO ================= */}
      <AnimatePresence>
        {isNewDirectiveModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-[#1b3828] flex items-center gap-2">
                  <Megaphone size={20} className="text-[#c5a059]" />
                  <span>Terbitkan Memo Disposisi Kepsek</span>
                </h3>
                <button onClick={() => setIsNewDirectiveModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePublishDirective} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Judul Disposisi / Memo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul memo resmi..."
                    value={newDirectiveForm.title}
                    onChange={(e) => setNewDirectiveForm({ ...newDirectiveForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sasaran Memo</label>
                    <select
                      value={newDirectiveForm.targetAudience}
                      onChange={(e) => setNewDirectiveForm({ ...newDirectiveForm, targetAudience: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    >
                      <option value="Semua Guru">Semua Guru</option>
                      <option value="Wali Kelas">Wali Kelas</option>
                      <option value="Panitia PPDB">Panitia PPDB</option>
                      <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Prioritas</label>
                    <select
                      value={newDirectiveForm.priority}
                      onChange={(e) => setNewDirectiveForm({ ...newDirectiveForm, priority: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    >
                      <option value="Penting">Penting</option>
                      <option value="Mendesak">Mendesak</option>
                      <option value="Biasa">Biasa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Isi Instruksi Disposisi *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan poin-poin arahan..."
                    value={newDirectiveForm.content}
                    onChange={(e) => setNewDirectiveForm({ ...newDirectiveForm, content: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewDirectiveModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#c5a059] text-[#1b3828] font-black"
                  >
                    Terbitkan Disposisi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= MODAL: PERMIT ACTION CONFIRMATION ================= */}
      <AnimatePresence>
        {selectedPermitForAction && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-800 space-y-4"
            >
              <h3 className="text-base font-black text-[#1b3828]">
                Disposisi {actionType === 'APPROVE' ? 'Persetujuan' : 'Penolakan'} Izin
              </h3>
              <p className="text-xs text-slate-600">
                Pemohon: <strong>{selectedPermitForAction.teacherName}</strong> ({selectedPermitForAction.permitType})
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Disposisi Kepala Sekolah</label>
                <textarea
                  rows={3}
                  placeholder="Catatan arahan..."
                  value={kepsekInputNote}
                  onChange={(e) => setKepsekInputNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedPermitForAction(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmPermitAction}
                  className={`px-5 py-2 rounded-xl font-black text-xs text-white ${
                    actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  Konfirmasi Disposisi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
