import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckSquare,
  Square,
  Bell,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  Megaphone,
  X,
  Save,
  Printer,
  ShieldAlert,
  UserCheck,
  Building2,
  Check,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { RegistrationData } from '../../types';

interface TeacherPortalViewProps {
  adminUser: any;
  registrations: RegistrationData[];
  onAddStudent: (student: any) => void;
  onUpdateStudent: (id: string, updated: Partial<RegistrationData>) => void;
  onDeleteStudent: (id: string) => void;
  onLogout: () => void;
  onBackToAdmin?: () => void;
}

type SidebarMenu = 
  | 'HOME'
  | 'STUDENTS'
  | 'STUDENT_DETAILS'
  | 'TEACHERS'
  | 'CLASS'
  | 'SUBJECT'
  | 'ROUTINE'
  | 'ATTENDANCE'
  | 'EXAM'
  | 'NOTICE';

// List of 5 Wali Kelas & Guru Pengajar accounts
const ALL_TEACHERS = [
  {
    id: 'guru_rpl1',
    name: 'Dra. Endang Rahayu, S.Pd.',
    role: 'Guru Pengajar & Wali Kelas X RPL 1',
    assignedClass: 'X RPL 1',
    majorCode: 'RPL',
    subject: 'Pemrograman Web & Mobile',
    nip: '19780512 200501 2 004',
    nuptk: '8435756658200023',
    email: 'endang.rahayu@smk.sch.id',
    phone: '0812-9876-5432',
    avatar: 'ER',
    room: 'Lab Komputer 2 (Gedung B)',
    scheduleToday: 'Senin, 07:30 - 11:30 WIB'
  },
  {
    id: 'guru_rpl2',
    name: 'Drs. H. Ahmad Fauzi, M.Pd.',
    role: 'Guru Pengajar & Wali Kelas X RPL 2',
    assignedClass: 'X RPL 2',
    majorCode: 'RPL',
    subject: 'Basis Data & Algoritma Pemrograman',
    nip: '19740315 199903 1 002',
    nuptk: '5142752654100012',
    email: 'ahmad.fauzi@smk.sch.id',
    phone: '0813-8877-6655',
    avatar: 'AF',
    room: 'Lab Komputer 1 (Gedung B)',
    scheduleToday: 'Selasa, 08:00 - 11:00 WIB'
  },
  {
    id: 'guru_akl1',
    name: 'Hj. Siti Nurhaliza, S.E., M.Ak.',
    role: 'Guru Pengajar & Wali Kelas X AKL 1',
    assignedClass: 'X AKL 1',
    majorCode: 'AKL',
    subject: 'Akuntansi Keuangan & Perbankan',
    nip: '19820920 200802 2 006',
    nuptk: '9241760661200034',
    email: 'siti.nurhaliza@smk.sch.id',
    phone: '0815-4433-2211',
    avatar: 'SN',
    room: 'Ruang Teori 104 (Gedung C)',
    scheduleToday: 'Rabu, 07:30 - 10:30 WIB'
  },
  {
    id: 'guru_akl2',
    name: 'Budi Santoso, S.Pd., M.M.',
    role: 'Guru Pengajar & Wali Kelas X AKL 2',
    assignedClass: 'X AKL 2',
    majorCode: 'AKL',
    subject: 'Praktikum Akuntansi Perusahaan',
    nip: '19850110 201001 1 012',
    nuptk: '3145763665100045',
    email: 'budi.santoso@smk.sch.id',
    phone: '0817-6655-4433',
    avatar: 'BS',
    room: 'Ruang Teori 105 (Gedung C)',
    scheduleToday: 'Kamis, 09:30 - 12:00 WIB'
  },
  {
    id: 'guru_tsm1',
    name: 'Ir. Bambang Hermawan, S.T.',
    role: 'Guru Pengajar & Wali Kelas X TSM 1',
    assignedClass: 'X TSM 1',
    majorCode: 'TSM',
    subject: 'Teknik Mesin & Kelistrikan Otomotif',
    nip: '19791104 200604 1 008',
    nuptk: '7139757659100056',
    email: 'bambang.hermawan@smk.sch.id',
    phone: '0818-1122-3344',
    avatar: 'BH',
    room: 'Bengkel Otomotif Utama (Gedung D)',
    scheduleToday: 'Jumat, 08:00 - 11:00 WIB'
  }
];

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  adminUser,
  registrations,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onLogout,
  onBackToAdmin
}) => {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<SidebarMenu>('HOME');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active Teacher Profile State - Bound strictly to logged-in user account
  const matchedTeacher = ALL_TEACHERS.find(
    t => t.id === adminUser?.username ||
         t.assignedClass === adminUser?.assignedClass ||
         t.name.toLowerCase().includes((adminUser?.name || '').toLowerCase())
  ) || ALL_TEACHERS[0];

  const [currentTeacher, setCurrentTeacher] = useState(matchedTeacher);

  // Sync currentTeacher if adminUser changes
  React.useEffect(() => {
    if (adminUser) {
      const match = ALL_TEACHERS.find(
        t => t.id === adminUser.username ||
             t.assignedClass === adminUser.assignedClass ||
             t.name.toLowerCase().includes((adminUser.name || '').toLowerCase())
      );
      if (match) {
        setCurrentTeacher(match);
      }
    }
  }, [adminUser]);

  // Dynamic Teacher Profiles per Account (persisted in localStorage)
  const [teacherProfiles, setTeacherProfiles] = useState<Record<string, typeof ALL_TEACHERS[0]>>(() => {
    const saved = localStorage.getItem('smk_teacher_profiles_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const map: Record<string, typeof ALL_TEACHERS[0]> = {};
    ALL_TEACHERS.forEach(t => { map[t.id] = { ...t }; });
    return map;
  });

  // Dynamic Schedules per Teacher Account
  const [teacherSchedules, setTeacherSchedules] = useState<Record<string, any[]>>(() => {
    const saved = localStorage.getItem('smk_teacher_schedules_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      guru_rpl1: [
        { id: 's1', day: 'Senin', time: '07:30 - 11:30 WIB', subject: 'Pemrograman Web & Mobile', classRoom: 'Lab Komputer 2 (Gedung B)', note: 'Praktikum HTML5, CSS3, & React JS' },
        { id: 's2', day: 'Selasa', time: '08:00 - 10:00 WIB', subject: 'Pemrograman Berorientasi Objek', classRoom: 'Lab Komputer 2 (Gedung B)', note: 'Pengenalan Class, Inheritance & OOP' },
        { id: 's3', day: 'Kamis', time: '10:00 - 12:00 WIB', subject: 'Kewirausahaan & Produk Kreatif', classRoom: 'Ruang Teori 102 (Gedung B)', note: 'Rancangan Startup & Software Business' },
        { id: 's4', day: 'Jumat', time: '07:30 - 09:30 WIB', subject: 'Bimbingan Wali Kelas X RPL 1', classRoom: 'Ruang Konseling & Bimbingan', note: 'Evaluasi Kehadiran & Pembinaan Karakter' }
      ],
      guru_rpl2: [
        { id: 's2_1', day: 'Selasa', time: '08:00 - 11:00 WIB', subject: 'Basis Data & Algoritma Pemrograman', classRoom: 'Lab Komputer 1 (Gedung B)', note: 'SQL DDL, DML & Database Schema' },
        { id: 's2_2', day: 'Rabu', time: '09:30 - 11:30 WIB', subject: 'Pemrograman C++ & Algoritma', classRoom: 'Lab Komputer 1 (Gedung B)', note: 'Struktur Data Stack & Queue' }
      ],
      guru_akl1: [
        { id: 's3_1', day: 'Rabu', time: '07:30 - 10:30 WIB', subject: 'Akuntansi Keuangan & Perbankan', classRoom: 'Ruang Teori 104 (Gedung C)', note: 'Jurnal Umum, Buku Besar & Neraca' }
      ],
      guru_akl2: [
        { id: 's4_1', day: 'Kamis', time: '09:30 - 12:00 WIB', subject: 'Praktikum Akuntansi Perusahaan', classRoom: 'Ruang Teori 105 (Gedung C)', note: 'Laporan Laba Rugi & Arus Kas' }
      ],
      guru_tsm1: [
        { id: 's5_1', day: 'Jumat', time: '08:00 - 11:00 WIB', subject: 'Teknik Mesin & Kelistrikan Otomotif', classRoom: 'Bengkel Otomotif Utama (Gedung D)', note: 'Sistem Injeksi PGM-FI & Kelistrikan' }
      ]
    };
  });

  // Dynamic Subjects per Teacher Account
  const [teacherSubjects, setTeacherSubjects] = useState<Record<string, any[]>>(() => {
    const saved = localStorage.getItem('smk_teacher_subjects_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      guru_rpl1: [
        { id: 'sub1', code: 'RPL-101', name: 'Pemrograman Web & Mobile', hours: 6, room: 'Lab Komputer 2', teacherName: 'Dra. Endang Rahayu, S.Pd.' },
        { id: 'sub2', code: 'RPL-102', name: 'Pemrograman Berorientasi Objek', hours: 4, room: 'Lab Komputer 2', teacherName: 'Dra. Endang Rahayu, S.Pd.' },
        { id: 'sub3', code: 'RPL-103', name: 'Basis Data & SQL', hours: 4, room: 'Lab Komputer 1', teacherName: 'Drs. H. Ahmad Fauzi' }
      ],
      guru_rpl2: [
        { id: 'sub4', code: 'RPL-201', name: 'Basis Data & Algoritma Pemrograman', hours: 6, room: 'Lab Komputer 1', teacherName: 'Drs. H. Ahmad Fauzi, M.Pd.' },
        { id: 'sub5', code: 'RPL-202', name: 'Pemrograman C++', hours: 4, room: 'Lab Komputer 1', teacherName: 'Drs. H. Ahmad Fauzi, M.Pd.' }
      ],
      guru_akl1: [
        { id: 'sub6', code: 'AKL-101', name: 'Akuntansi Keuangan & Perbankan', hours: 6, room: 'Ruang Teori 104', teacherName: 'Hj. Siti Nurhaliza, S.E., M.Ak.' }
      ],
      guru_akl2: [
        { id: 'sub7', code: 'AKL-201', name: 'Praktikum Akuntansi Perusahaan', hours: 6, room: 'Ruang Teori 105', teacherName: 'Budi Santoso, S.Pd., M.M.' }
      ],
      guru_tsm1: [
        { id: 'sub8', code: 'TSM-101', name: 'Teknik Mesin & Kelistrikan Otomotif', hours: 8, room: 'Bengkel Otomotif Utama', teacherName: 'Ir. Bambang Hermawan, S.T.' }
      ]
    };
  });

  // Dynamic Notices per Teacher Account
  const [teacherNotices, setTeacherNotices] = useState<Record<string, any[]>>(() => {
    const saved = localStorage.getItem('smk_teacher_notices_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      guru_rpl1: [
        { id: 'n1', title: 'Persiapan Praktikum Pemrograman Web & Laptop', date: '31 Juli 2026', category: 'Penting', content: 'Seluruh siswa kelas X RPL 1 wajib meng-install VS Code dan Git sebelum sesi praktikum hari Senin.', author: 'Dra. Endang Rahayu' },
        { id: 'n2', title: 'Kedisiplinan & Pakaian Seragam Resmi', date: '28 Juli 2026', category: 'Informasi', content: 'Siswa wajib mengenakan seragam rapi, atribut lengkap, dan hadir sebelum pukul 07:00 WIB.', author: 'Wali Kelas X RPL 1' }
      ],
      guru_rpl2: [
        { id: 'n3', title: 'Batas Pengumpulan Task Basis Data ERD', date: '30 Juli 2026', category: 'Penting', content: 'Tugas ERD Diagram wajib diunggah ke portal sebelum Jumat pukul 23:59 WIB.', author: 'Drs. H. Ahmad Fauzi' }
      ],
      guru_akl1: [
        { id: 'n4', title: 'Pemeriksaan Alat Praktikum Akuntansi', date: '29 Juli 2026', category: 'Informasi', content: 'Harap membawa kalkulator finansial dan penggaris akuntansi pada setiap sesi jam pelajaran.', author: 'Hj. Siti Nurhaliza' }
      ],
      guru_akl2: [
        { id: 'n5', title: 'Pendaftaran Kunjungan Industri Perbankan', date: '25 Juli 2026', category: 'Kegiatan', content: 'Pendaftaran kunjungan industri ke Bank Syariah Mandiri telah dibuka untuk kelas X AKL 2.', author: 'Budi Santoso' }
      ],
      guru_tsm1: [
        { id: 'n6', title: 'Kewajiban Penggunaan Baju Bengkel (Wearpack)', date: '30 Juli 2026', category: 'Penting', content: 'Siswa X TSM 1 dilarang masuk bengkel otomotif tanpa sepatu safety dan wearpack.', author: 'Ir. Bambang Hermawan' }
      ]
    };
  });

  // Dynamic Exams per Teacher Account
  const [teacherExams, setTeacherExams] = useState<Record<string, any[]>>(() => {
    const saved = localStorage.getItem('smk_teacher_exams_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      guru_rpl1: [
        { id: 'e1', title: 'Kuis 1: HTML5 & CSS Grid Layout', date: '05 Agustus 2026', subject: 'Pemrograman Web', maxScore: 100, status: 'Diterbitkan' },
        { id: 'e2', title: 'UTS Semester Ganjil Pemrograman Web', date: '20 September 2026', subject: 'Pemrograman Web & Mobile', maxScore: 100, status: 'Draft' }
      ],
      guru_rpl2: [
        { id: 'e3', title: 'Ujian SQL Query & Data Normalization', date: '10 Agustus 2026', subject: 'Basis Data', maxScore: 100, status: 'Diterbitkan' }
      ]
    };
  });

  // Dynamic Attendance per Teacher Account
  const [teacherAttendance, setTeacherAttendance] = useState<Record<string, Record<string, 'HADIR' | 'IZIN' | 'SAKIT' | 'ALFA'>>>(() => {
    const saved = localStorage.getItem('smk_teacher_attendance_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {};
  });

  // Auto-save effects to localStorage
  React.useEffect(() => {
    localStorage.setItem('smk_teacher_profiles_v3', JSON.stringify(teacherProfiles));
  }, [teacherProfiles]);

  React.useEffect(() => {
    localStorage.setItem('smk_teacher_schedules_v3', JSON.stringify(teacherSchedules));
  }, [teacherSchedules]);

  React.useEffect(() => {
    localStorage.setItem('smk_teacher_subjects_v3', JSON.stringify(teacherSubjects));
  }, [teacherSubjects]);

  React.useEffect(() => {
    localStorage.setItem('smk_teacher_notices_v3', JSON.stringify(teacherNotices));
  }, [teacherNotices]);

  React.useEffect(() => {
    localStorage.setItem('smk_teacher_exams_v3', JSON.stringify(teacherExams));
  }, [teacherExams]);

  React.useEffect(() => {
    localStorage.setItem('smk_teacher_attendance_v3', JSON.stringify(teacherAttendance));
  }, [teacherAttendance]);

  // Active getters for current teacher account
  const currentTeacherProfile = teacherProfiles[currentTeacher.id] || currentTeacher;
  const currentSchedules = teacherSchedules[currentTeacher.id] || [];
  const currentSubjects = teacherSubjects[currentTeacher.id] || [];
  const currentNotices = teacherNotices[currentTeacher.id] || [];
  const currentExams = teacherExams[currentTeacher.id] || [];
  const currentAttendance = teacherAttendance[currentTeacher.id] || {};

  // Modals & Forms State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    nip: '',
    nuptk: '',
    subject: '',
    email: '',
    phone: '',
    room: '',
    scheduleToday: '',
    role: ''
  });

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    day: 'Senin',
    time: '07:30 - 09:30 WIB',
    subject: '',
    classRoom: '',
    note: ''
  });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    hours: 4,
    room: '',
    teacherName: ''
  });

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'Penting',
    content: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);
  const [examForm, setExamForm] = useState({
    title: '',
    subject: '',
    date: '15 Agustus 2026',
    maxScore: 100,
    status: 'Diterbitkan'
  });

  // Handler Actions per Teacher
  const handleOpenEditProfile = () => {
    setProfileForm({
      name: currentTeacherProfile.name,
      nip: currentTeacherProfile.nip,
      nuptk: currentTeacherProfile.nuptk,
      subject: currentTeacherProfile.subject,
      email: currentTeacherProfile.email,
      phone: currentTeacherProfile.phone,
      room: currentTeacherProfile.room,
      scheduleToday: currentTeacherProfile.scheduleToday,
      role: currentTeacherProfile.role
    });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...currentTeacherProfile, ...profileForm };
    setTeacherProfiles(prev => ({ ...prev, [currentTeacher.id]: updated }));
    setCurrentTeacher(updated);
    setIsEditProfileOpen(false);
  };

  const handleOpenScheduleModal = (sch?: any) => {
    if (sch) {
      setEditingSchedule(sch);
      setScheduleForm({
        day: sch.day,
        time: sch.time,
        subject: sch.subject,
        classRoom: sch.classRoom,
        note: sch.note || ''
      });
    } else {
      setEditingSchedule(null);
      setScheduleForm({
        day: 'Senin',
        time: '07:30 - 09:30 WIB',
        subject: currentTeacherProfile.subject,
        classRoom: currentTeacherProfile.room,
        note: ''
      });
    }
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: editingSchedule ? editingSchedule.id : 'sch_' + Date.now(),
      day: scheduleForm.day,
      time: scheduleForm.time,
      subject: scheduleForm.subject || currentTeacherProfile.subject,
      classRoom: scheduleForm.classRoom || currentTeacherProfile.room,
      note: scheduleForm.note
    };
    setTeacherSchedules(prev => {
      const list = prev[currentTeacher.id] || [];
      if (editingSchedule) {
        return { ...prev, [currentTeacher.id]: list.map(s => s.id === item.id ? item : s) };
      } else {
        return { ...prev, [currentTeacher.id]: [item, ...list] };
      }
    });
    setIsScheduleModalOpen(false);
  };

  const handleDeleteSchedule = (id: string) => {
    setTeacherSchedules(prev => ({
      ...prev,
      [currentTeacher.id]: (prev[currentTeacher.id] || []).filter(s => s.id !== id)
    }));
  };

  const handleOpenSubjectModal = (sub?: any) => {
    if (sub) {
      setEditingSubject(sub);
      setSubjectForm({
        code: sub.code,
        name: sub.name,
        hours: sub.hours,
        room: sub.room,
        teacherName: sub.teacherName
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({
        code: `${currentTeacherProfile.majorCode}-${Math.floor(100 + Math.random() * 800)}`,
        name: '',
        hours: 4,
        room: currentTeacherProfile.room,
        teacherName: currentTeacherProfile.name
      });
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: editingSubject ? editingSubject.id : 'sub_' + Date.now(),
      code: subjectForm.code,
      name: subjectForm.name || currentTeacherProfile.subject,
      hours: Number(subjectForm.hours) || 4,
      room: subjectForm.room || currentTeacherProfile.room,
      teacherName: subjectForm.teacherName || currentTeacherProfile.name
    };
    setTeacherSubjects(prev => {
      const list = prev[currentTeacher.id] || [];
      if (editingSubject) {
        return { ...prev, [currentTeacher.id]: list.map(s => s.id === item.id ? item : s) };
      } else {
        return { ...prev, [currentTeacher.id]: [item, ...list] };
      }
    });
    setIsSubjectModalOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    setTeacherSubjects(prev => ({
      ...prev,
      [currentTeacher.id]: (prev[currentTeacher.id] || []).filter(s => s.id !== id)
    }));
  };

  const handleOpenNoticeModal = (not?: any) => {
    if (not) {
      setEditingNotice(not);
      setNoticeForm({
        title: not.title,
        category: not.category,
        content: not.content,
        date: not.date
      });
    } else {
      setEditingNotice(null);
      setNoticeForm({
        title: '',
        category: 'Penting',
        content: '',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      });
    }
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: editingNotice ? editingNotice.id : 'not_' + Date.now(),
      title: noticeForm.title || 'Pengumuman Baru',
      category: noticeForm.category || 'Penting',
      content: noticeForm.content,
      date: noticeForm.date,
      author: currentTeacherProfile.name
    };
    setTeacherNotices(prev => {
      const list = prev[currentTeacher.id] || [];
      if (editingNotice) {
        return { ...prev, [currentTeacher.id]: list.map(n => n.id === item.id ? item : n) };
      } else {
        return { ...prev, [currentTeacher.id]: [item, ...list] };
      }
    });
    setIsNoticeModalOpen(false);
  };

  const handleDeleteNotice = (id: string) => {
    setTeacherNotices(prev => ({
      ...prev,
      [currentTeacher.id]: (prev[currentTeacher.id] || []).filter(n => n.id !== id)
    }));
  };

  const handleOpenExamModal = (ex?: any) => {
    if (ex) {
      setEditingExam(ex);
      setExamForm({
        title: ex.title,
        subject: ex.subject,
        date: ex.date,
        maxScore: ex.maxScore,
        status: ex.status
      });
    } else {
      setEditingExam(null);
      setExamForm({
        title: '',
        subject: currentTeacherProfile.subject,
        date: '15 Agustus 2026',
        maxScore: 100,
        status: 'Diterbitkan'
      });
    }
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: editingExam ? editingExam.id : 'ex_' + Date.now(),
      title: examForm.title || 'Evaluasi Pembelajaran',
      subject: examForm.subject || currentTeacherProfile.subject,
      date: examForm.date,
      maxScore: Number(examForm.maxScore) || 100,
      status: examForm.status
    };
    setTeacherExams(prev => {
      const list = prev[currentTeacher.id] || [];
      if (editingExam) {
        return { ...prev, [currentTeacher.id]: list.map(x => x.id === item.id ? item : x) };
      } else {
        return { ...prev, [currentTeacher.id]: [item, ...list] };
      }
    });
    setIsExamModalOpen(false);
  };

  const handleDeleteExam = (id: string) => {
    setTeacherExams(prev => ({
      ...prev,
      [currentTeacher.id]: (prev[currentTeacher.id] || []).filter(x => x.id !== id)
    }));
  };

  // Filters & Search
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<'ALL' | 'RPL' | 'AKL' | 'TSM'>('ALL');

  // Checkbox Selections
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<RegistrationData | null>(null);
  const [viewingStudent, setViewingStudent] = useState<RegistrationData | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Attendance local state (Student ID -> Status)
  const [attendanceState, setAttendanceState] = useState<Record<string, 'HADIR' | 'IZIN' | 'SAKIT' | 'ALFA'>>({});

  // New Student Form State
  const [newStudentData, setNewStudentData] = useState({
    fullName: '',
    nikNisn: '',
    birthPlaceDate: 'Tangerang, 12 Mei 2008',
    gender: 'Laki-laki',
    originSchool: 'SMP Negeri 1 Sepatan',
    phoneWhatsapp: '081234567890',
    parentName: 'Bapak / Ibu Wali',
    parentPhone: '081298765432',
    address: 'Jl. Raya Sepatan No. 45, Tangerang',
    firstChoiceMajor: (currentTeacher.majorCode as 'RPL' | 'AKL' | 'TSM') || 'RPL',
    status: 'Terverifikasi & Diterima'
  });

  // Students belonging specifically to THIS teacher's class / major
  const myClassStudents = registrations.filter(
    s => s.firstChoiceMajor === currentTeacher.majorCode
  );

  // Filtered Students List for General Table
  const filteredStudents = registrations.filter((student) => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes((tableSearch || globalSearch).toLowerCase()) ||
      student.nikNisn.includes(tableSearch || globalSearch) ||
      (student.address || '').toLowerCase().includes((tableSearch || globalSearch).toLowerCase()) ||
      student.originSchool.toLowerCase().includes((tableSearch || globalSearch).toLowerCase());

    const matchesClass = 
      selectedClassFilter === 'ALL' || student.firstChoiceMajor === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map(s => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Submit New Student
  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.fullName || !newStudentData.nikNisn) return;
    
    onAddStudent(newStudentData);
    setIsAddModalOpen(false);
    setNewStudentData({
      fullName: '',
      nikNisn: '',
      birthPlaceDate: 'Tangerang, 12 Mei 2008',
      gender: 'Laki-laki',
      originSchool: 'SMP Negeri 1 Sepatan',
      phoneWhatsapp: '081234567890',
      parentName: 'Bapak / Ibu Wali',
      parentPhone: '081298765432',
      address: 'Jl. Raya Sepatan No. 45, Tangerang',
      firstChoiceMajor: 'RPL',
      status: 'Terverifikasi & Diterima'
    });
  };

  // Save Edit Student
  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    onUpdateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingStudentId) {
      onDeleteStudent(deletingStudentId);
      setDeletingStudentId(null);
    }
  };

  // Helper avatar colors
  const getAvatarBg = (index: number) => {
    const colors = [
      'bg-emerald-700 text-white',
      'bg-[#1b3828] text-[#c5a059]',
      'bg-blue-700 text-white',
      'bg-amber-600 text-white',
      'bg-purple-700 text-white',
      'bg-teal-700 text-white'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-slate-800 flex flex-col font-sans selection:bg-[#c5a059] selection:text-[#1b3828]">
      
      {/* OUTER WRAPPER */}
      <div className="flex flex-1 overflow-hidden">

        {/* ================= 1. SIDEBAR NAVIGATION ================= */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 260 : 80 }}
          className="bg-[#1b3828] text-white border-r border-[#2d5a3f] flex flex-col shrink-0 z-20 shadow-xl transition-all duration-300"
        >
          {/* Sidebar Header Brand */}
          <div className="p-5 border-b border-[#2d5a3f] flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-[#2d5a3f] border border-[#c5a059]/40 flex items-center justify-center font-black text-[#c5a059] shadow-inner shrink-0">
                <School size={22} />
              </div>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  <h1 className="font-black text-sm text-white tracking-wide truncate">
                    SMK BHINNEKA NUSANTARA
                  </h1>
                  <p className="text-[10px] text-[#c5a059] font-extrabold uppercase tracking-widest truncate">
                    School Management
                  </p>
                </motion.div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl bg-[#2d5a3f]/60 hover:bg-[#2d5a3f] text-slate-200 transition-colors hidden md:flex items-center justify-center"
            >
              {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-emerald-800">
            {[
              { id: 'HOME', label: 'Home / Dashboard', icon: School },
              { id: 'STUDENTS', label: 'Students / Murid', icon: GraduationCap, badge: filteredStudents.length },
              { id: 'TEACHERS', label: 'Teachers / Guru', icon: Users },
              { id: 'CLASS', label: 'Class / Kelas', icon: Building2 },
              { id: 'SUBJECT', label: 'Subject / Mapel', icon: BookOpen },
              { id: 'ROUTINE', label: 'Routine / Jadwal', icon: Calendar },
              { id: 'ATTENDANCE', label: 'Attendance / Presensi', icon: ClipboardList },
              { id: 'EXAM', label: 'Exam / Nilai Ujian', icon: FileSpreadsheet },
              { id: 'NOTICE', label: 'Notice / Pengumuman', icon: Megaphone }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as SidebarMenu)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1b3828] shadow-lg shadow-[#c5a059]/20 font-black'
                      : 'text-slate-300 hover:bg-[#2d5a3f]/50 hover:text-white'
                  }`}
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

          {/* Sidebar User Info & Back Button */}
          <div className="p-4 border-t border-[#2d5a3f] space-y-2 bg-[#142b1f]/50">
            {onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-[11px] font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Building2 size={14} />
                {isSidebarOpen && <span>Kembali ke Super Admin</span>}
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b3828] to-[#2d5a3f] text-[#c5a059] font-black text-xs flex items-center justify-center shrink-0 border border-[#c5a059]/50">
                {currentTeacher.avatar}
              </div>
              {isSidebarOpen && (
                <div className="truncate flex-1">
                  <strong className="text-xs text-white block truncate">{currentTeacher.name}</strong>
                  <span className="text-[10px] text-[#c5a059] font-medium block truncate">Wali Kelas {currentTeacher.assignedClass}</span>
                </div>
              )}
            </div>
          </div>
        </motion.aside>


        {/* ================= 2. MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* TOP NAVBAR */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
            {/* Top Search Bar */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="What do you want to find? (Search student, class, address)..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#1b3828] focus:bg-white transition-all"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white" />
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-30 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <strong className="text-xs font-extrabold text-[#1b3828]">Notifikasi Kelas {currentTeacher.assignedClass}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">Baru</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <strong className="block text-[11px] font-bold">{myClassStudents.length} Siswa Terdaftar di Kelas {currentTeacher.assignedClass}</strong>
                          <span className="text-[10px] text-emerald-700">Berkas siswa telah terverifikasi oleh Panitia.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
                          <strong className="block text-[11px] font-bold">Jadwal Mengajar Hari Ini</strong>
                          <span className="text-[10px] text-blue-700">{currentTeacher.scheduleToday}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Message Link */}
              <a
                href="#messages"
                onClick={() => setActiveMenu('NOTICE')}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative"
              >
                <MessageSquare size={18} />
              </a>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center justify-center border border-[#c5a059]/50">
                    {currentTeacher.avatar}
                  </div>
                  <div className="text-left hidden sm:block">
                    <strong className="text-xs font-bold text-slate-800 block leading-tight">{currentTeacher.name}</strong>
                    <span className="text-[10px] text-slate-500 font-medium block">Wali Kelas {currentTeacher.assignedClass}</span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 mr-1" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 space-y-1"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <strong className="text-xs font-bold text-[#1b3828] block">{currentTeacher.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono block">NIP. {currentTeacher.nip}</span>
                        <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Wali Kelas {currentTeacher.assignedClass}</span>
                      </div>
                      
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Status Portal Kelas:</span>
                        <p className="text-[11px] font-black text-emerald-900 mt-0.5 flex items-center gap-1">
                          <CheckCircle size={13} className="text-emerald-600" />
                          <span>Akses Terisolasi — Wali Kelas {currentTeacher.assignedClass}</span>
                        </p>
                      </div>

                      <button
                        onClick={onLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Keluar Sistem</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>


          {/* PAGE BODY CONTENT */}
          <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

            {/* BREADCRUMB & HEADER ACTION BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#1b3828] tracking-tight">
                  {activeMenu === 'HOME' && `Home Dashboard - Portal Kelas ${currentTeacher.assignedClass}`}
                  {activeMenu === 'STUDENTS' && `Siswa Bimbingan - Kelas ${currentTeacher.assignedClass}`}
                  {activeMenu !== 'HOME' && activeMenu !== 'STUDENTS' && `Menu ${activeMenu} - Portal Kelas ${currentTeacher.assignedClass}`}
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-[#1b3828] font-bold">{activeMenu}</span>
                  <span>/</span>
                  <span className="text-[#c5a059] font-extrabold uppercase">Wali Kelas {currentTeacher.name}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b3828] via-[#2d5a3f] to-[#1b3828] text-[#c5a059] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#1b3828]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#c5a059]/40"
              >
                <Plus size={18} className="text-[#c5a059]" />
                <span>+ Tambah Murid Baru</span>
              </button>
            </div>


            {/* ================= 2.5 HOME DASHBOARD VIEW (HOME) ================= */}
            {activeMenu === 'HOME' && (
              <motion.div
                key="HOME_DASHBOARD"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* 1. TEACHER ISOLATED ACCOUNT BANNER */}
                <div className="bg-emerald-900 text-white border border-[#c5a059]/40 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059] text-[#1b3828] flex items-center justify-center font-black shrink-0 shadow-inner">
                      <School size={20} />
                    </div>
                    <div>
                      <strong className="text-xs font-black text-[#c5a059] block uppercase tracking-wide">
                        Portal Mandiri Kelas {currentTeacherProfile.assignedClass} — {currentTeacherProfile.name}
                      </strong>
                      <p className="text-[11px] text-emerald-100 font-medium mt-0.5">
                        Sistem terisolasi khusus akun Wali Kelas. Seluruh jadwal, mapel, pengumuman, ujian, dan presensi tersimpan mandiri di akun Anda.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-emerald-200 border border-white/20 text-xs font-bold font-mono">
                      Akun ID: {currentTeacher.id}
                    </span>
                  </div>
                </div>

                {/* 2. HERO PROFILE CARD */}
                <div className="relative bg-gradient-to-br from-[#1b3828] via-[#244834] to-[#12281c] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-[#c5a059]/40 overflow-hidden">
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Teacher Photo & Personal Info */}
                    <div className="flex items-start sm:items-center gap-5">
                      {/* Avatar Circle */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#c5a059] to-[#f3e5ab] text-[#1b3828] font-black text-2xl sm:text-3xl flex items-center justify-center border-4 border-white/20 shadow-xl shrink-0">
                        {currentTeacherProfile.avatar}
                      </div>

                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#c5a059] text-[10px] font-black uppercase tracking-wider">
                          <UserCheck size={12} />
                          <span>Wali Kelas Active • {currentTeacherProfile.assignedClass}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                          <span>{currentTeacherProfile.name}</span>
                          <button
                            onClick={handleOpenEditProfile}
                            className="p-1.5 rounded-lg bg-[#c5a059]/20 hover:bg-[#c5a059] text-[#c5a059] hover:text-[#1b3828] transition-all text-xs"
                            title="Ubah Profile Guru"
                          >
                            <Edit size={14} />
                          </button>
                        </h3>
                        <p className="text-xs text-emerald-200 font-medium">
                          NIP. {currentTeacherProfile.nip} • NUPTK. {currentTeacherProfile.nuptk}
                        </p>
                        <p className="text-xs text-slate-300">
                          <strong className="text-[#c5a059]">Mata Pelajaran:</strong> {currentTeacherProfile.subject}
                        </p>
                      </div>
                    </div>

                    {/* Class Details Badge Card & Action */}
                    <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Kelas Bimbingan:</span>
                        <span className="font-extrabold text-[#c5a059]">{currentTeacherProfile.assignedClass}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Ruang Pembelajaran:</span>
                        <span className="font-bold text-white">{currentTeacherProfile.room}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Email Resmi:</span>
                        <span className="font-mono text-emerald-200 text-[11px]">{currentTeacherProfile.email}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Kontak Whatsapp:</span>
                        <span className="font-bold text-white">{currentTeacherProfile.phone}</span>
                      </div>
                      <button
                        onClick={handleOpenEditProfile}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-[#c5a059] text-[#1b3828] font-black text-xs hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
                      >
                        <Edit size={14} />
                        <span>Edit Profil Saya</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. CORE METRICS GRID (4 CARDS FOR THIS TEACHER'S CLASS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Total Murid */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Murid Kelas</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Users size={18} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-3xl font-black text-[#1b3828]">{myClassStudents.length}</strong>
                      <span className="text-xs text-slate-500 font-semibold">Siswa</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <Check size={14} />
                      <span>Terdaftar di Kelas {currentTeacherProfile.assignedClass}</span>
                    </p>
                  </div>

                  {/* Card 2: Schedule & Routine Items Count */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal Mengajar</span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Calendar size={18} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-3xl font-black text-blue-900">{currentSchedules.length}</strong>
                      <span className="text-xs text-slate-500 font-semibold">Sesi</span>
                    </div>
                    <button
                      onClick={() => handleOpenScheduleModal()}
                      className="text-[11px] text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>+ Tambah Jadwal Baru</span>
                    </button>
                  </div>

                  {/* Card 3: Subjects Count */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        <BookOpen size={18} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-3xl font-black text-amber-900">{currentSubjects.length}</strong>
                      <span className="text-xs text-slate-500 font-semibold">Mapel</span>
                    </div>
                    <button
                      onClick={() => handleOpenSubjectModal()}
                      className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>+ Tambah Mapel Baru</span>
                    </button>
                  </div>

                  {/* Card 4: Notices Count */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengumuman Kelas</span>
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        <Megaphone size={18} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-3xl font-black text-purple-900">{currentNotices.length}</strong>
                      <span className="text-xs text-slate-500 font-semibold">Catatan</span>
                    </div>
                    <button
                      onClick={() => handleOpenNoticeModal()}
                      className="text-[11px] text-purple-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>+ Buat Pengumuman</span>
                    </button>
                  </div>
                </div>

                {/* 4. CLASS ROSTER TABLE PREVIEW */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1b3828] flex items-center gap-2">
                        <Users size={18} className="text-[#c5a059]" />
                        Daftar Murid Kelas {currentTeacherProfile.assignedClass} ({myClassStudents.length} Siswa)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Data murid terdaftar khusus di bawah bimbingan Wali Kelas {currentTeacherProfile.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs hover:bg-[#2d5a3f] transition-colors flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        <span>+ Tambah Murid</span>
                      </button>
                      <button
                        onClick={() => setActiveMenu('STUDENTS')}
                        className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-700 font-black text-xs hover:bg-slate-300 transition-colors flex items-center gap-1"
                      >
                        <span>Kelola Roster</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/60 text-slate-600 font-extrabold border-b border-slate-200">
                          <th className="p-4 w-12">No</th>
                          <th className="p-4">Nama Murid</th>
                          <th className="p-4">NIK / NISN</th>
                          <th className="p-4">Gender</th>
                          <th className="p-4">Sekolah Asal</th>
                          <th className="p-4">Kontak Ortu</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myClassStudents.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                              Belum ada data murid terdaftar untuk jurusan {currentTeacherProfile.majorCode} di kelas ini.
                            </td>
                          </tr>
                        ) : (
                          myClassStudents.map((student, idx) => (
                            <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4 font-bold text-slate-400">{idx + 1}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${getAvatarBg(idx)}`}>
                                    {student.fullName.charAt(0)}
                                  </div>
                                  <div>
                                    <strong className="text-slate-800 font-extrabold block">{student.fullName}</strong>
                                    <span className="text-[10px] text-slate-400 font-mono">{student.birthPlaceDate}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-mono text-slate-600 font-semibold">{student.nikNisn}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  student.gender === 'Laki-laki' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                                }`}>
                                  {student.gender}
                                </span>
                              </td>
                              <td className="p-4 text-slate-600">{student.originSchool}</td>
                              <td className="p-4 text-slate-600">
                                <strong className="block text-[11px] text-slate-800">{student.parentName || 'Orang Tua'}</strong>
                                <span className="text-[10px] text-emerald-700 font-mono">{student.parentPhone || student.phoneWhatsapp}</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  {student.status || 'Diterima'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setViewingStudent(student)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#1b3828] hover:text-[#c5a059] text-slate-600 transition-colors"
                                    title="Lihat Detail Murid"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  <button
                                    onClick={() => setEditingStudent(student)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors"
                                    title="Edit Data Murid"
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <button
                                    onClick={() => setDeletingStudentId(student.id)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 transition-colors"
                                    title="Hapus Data Murid"
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

                {/* 5. DYNAMIC SCHEDULE & ANNOUNCEMENT CARDS WITH EDIT/DELETE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card Schedule */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="font-extrabold text-sm text-[#1b3828] flex items-center gap-2">
                        <Calendar size={18} className="text-[#c5a059]" />
                        Jadwal Mengajar & Aktivitas Wali Kelas ({currentSchedules.length})
                      </h4>
                      <button
                        onClick={() => handleOpenScheduleModal()}
                        className="text-xs font-bold text-[#1b3828] bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} />
                        <span>Tambah Jadwal</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {currentSchedules.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">Belum ada jadwal mengajar. Klik "+ Tambah Jadwal" di atas.</p>
                      ) : (
                        currentSchedules.map((sch) => (
                          <div key={sch.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#1b3828] text-[#c5a059] text-[10px] font-black">{sch.day}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-600">{sch.time}</span>
                                <button
                                  onClick={() => handleOpenScheduleModal(sch)}
                                  className="p-1 rounded bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors"
                                  title="Edit Jadwal"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSchedule(sch.id)}
                                  className="p-1 rounded bg-slate-200 hover:bg-red-600 hover:text-white text-slate-600 transition-colors"
                                  title="Hapus Jadwal"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <strong className="text-xs font-black text-[#1b3828] block">{sch.subject}</strong>
                            <p className="text-xs text-slate-600">
                              Ruang: <strong className="text-slate-800">{sch.classRoom}</strong>
                            </p>
                            {sch.note && <p className="text-[11px] text-slate-500 italic">{sch.note}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card Wali Kelas Notices */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="font-extrabold text-sm text-[#1b3828] flex items-center gap-2">
                        <Megaphone size={18} className="text-[#c5a059]" />
                        Catatan & Pengumuman Wali Kelas ({currentNotices.length})
                      </h4>
                      <button
                        onClick={() => handleOpenNoticeModal()}
                        className="text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} />
                        <span>Buat Pengumuman</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {currentNotices.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">Belum ada pengumuman kelas. Klik "+ Buat Pengumuman" di atas.</p>
                      ) : (
                        currentNotices.map((not) => (
                          <div key={not.id} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2 relative">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[10px] uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                                {not.category} • {not.date}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenNoticeModal(not)}
                                  className="p-1 rounded bg-emerald-200 hover:bg-blue-600 hover:text-white text-emerald-900 transition-colors"
                                  title="Edit Pengumuman"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteNotice(not.id)}
                                  className="p-1 rounded bg-emerald-200 hover:bg-red-600 hover:text-white text-emerald-900 transition-colors"
                                  title="Hapus Pengumuman"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <p className="font-black text-xs text-emerald-900">📌 {not.title}</p>
                            <p className="text-[11px] leading-relaxed text-emerald-800">{not.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}


            {/* ================= 3. STUDENTS INFORMATION CARD ================= */}
            {activeMenu === 'STUDENTS' && (
              <motion.div
                key="STUDENTS"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-0"
              >
                {/* Card Toolbar */}
                <div className="p-5 md:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1b3828] flex items-center gap-2">
                      <GraduationCap size={20} className="text-[#c5a059]" />
                      Students Information (Kelas {currentTeacherProfile.assignedClass})
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Data lengkap siswa terdaftar di bawah bimbingan Wali Kelas {currentTeacherProfile.name}
                    </p>
                  </div>

                  {/* Filter Toolbar Controls & Add Button */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#2d5a3f]"
                    >
                      <Plus size={16} />
                      <span>+ Tambah Murid Baru</span>
                    </button>

                    {/* Table Specific Search */}
                    <div className="relative w-full sm:w-56">
                      <input
                        type="text"
                        placeholder="Search by name or roll..."
                        value={tableSearch}
                        onChange={(e) => {
                          setTableSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828] bg-white"
                      />
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/90 text-slate-600 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-4 px-4 w-10 text-center">
                          <button
                            onClick={handleSelectAll}
                            className="text-slate-500 hover:text-[#1b3828] transition-colors"
                          >
                            {selectedIds.length > 0 && selectedIds.length === paginatedStudents.length ? (
                              <CheckSquare size={16} className="text-[#1b3828]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </th>
                        <th className="py-4 px-4">STUDENTS NAME</th>
                        <th className="py-4 px-4">ROLL / NISN</th>
                        <th className="py-4 px-4">ADDRESS</th>
                        <th className="py-4 px-4">CLASS</th>
                        <th className="py-4 px-4">DATE OF BIRTH</th>
                        <th className="py-4 px-4">PHONE (ORANG TUA)</th>
                        <th className="py-4 px-4 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {paginatedStudents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                            Belum ada data murid yang sesuai pencarian atau filter kelas.
                          </td>
                        </tr>
                      ) : (
                        paginatedStudents.map((student, idx) => {
                          const isSelected = selectedIds.includes(student.id);
                          const rollNumber = `#${(startIndex + idx + 1).toString().padStart(2, '0')}`;
                          const initials = student.fullName
                            .split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase();

                          return (
                            <tr
                              key={student.id}
                              className={`transition-colors hover:bg-slate-50/80 ${
                                isSelected ? 'bg-amber-50/60' : ''
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => handleToggleSelect(student.id)}
                                  className="text-slate-400 hover:text-[#1b3828]"
                                >
                                  {isSelected ? (
                                    <CheckSquare size={16} className="text-[#1b3828]" />
                                  ) : (
                                    <Square size={16} />
                                  )}
                                </button>
                              </td>

                              {/* Student Name */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 border border-black/10 ${getAvatarBg(idx)}`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <strong className="text-slate-900 font-bold block text-xs">
                                      {student.fullName}
                                    </strong>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {student.gender || 'Siswa'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Roll / NISN */}
                              <td className="py-3.5 px-4">
                                <span className="font-mono text-slate-700 font-bold block">
                                  {rollNumber}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  NISN: {student.nikNisn}
                                </span>
                              </td>

                              {/* Address */}
                              <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                                {student.address || 'Kec. Sepatan, Kab. Tangerang'}
                              </td>

                              {/* Class */}
                              <td className="py-3.5 px-4">
                                <span className="px-2.5 py-1 rounded-lg bg-[#1b3828] text-[#c5a059] font-black text-[11px] border border-[#2d5a3f]">
                                  X {student.firstChoiceMajor}-1
                                </span>
                              </td>

                              {/* Date of birth */}
                              <td className="py-3.5 px-4 text-slate-600">
                                {student.birthPlaceDate || 'Tangerang, 15 Jan 2008'}
                              </td>

                              {/* Phone */}
                              <td className="py-3.5 px-4">
                                <a
                                  href={`https://wa.me/${(student.parentPhone || student.phoneWhatsapp).replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline font-mono text-xs font-bold flex items-center gap-1"
                                >
                                  <MessageSquare size={13} className="text-emerald-600" />
                                  <span>{student.parentPhone || student.phoneWhatsapp}</span>
                                </a>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => setViewingStudent(student)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#1b3828] hover:text-[#c5a059] text-slate-600 transition-colors"
                                    title="Lihat Detail Profil"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  <button
                                    onClick={() => setEditingStudent(student)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors"
                                    title="Edit Data Murid"
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <button
                                    onClick={() => setDeletingStudentId(student.id)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 transition-colors"
                                    title="Hapus Data Murid"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION FOOTER */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Menampilkan <strong>{paginatedStudents.length}</strong> dari <strong>{filteredStudents.length}</strong> Murid</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="p-2 rounded-xl border border-slate-300 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-xl font-black transition-all ${
                          currentPage === page
                            ? 'bg-[#1b3828] text-[#c5a059] shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="p-2 rounded-xl border border-slate-300 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>

                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="ml-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:outline-none"
                    >
                      <option value={5}>5 / page</option>
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                  </div>
                </div>

              </motion.div>
            )}


            {/* ================= TEACHERS DIRECTORY VIEW ================= */}
            {activeMenu === 'TEACHERS' && (
              <motion.div
                key="TEACHERS"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Users size={22} className="text-[#c5a059]" />
                      Direktori Rekan Wali Kelas & Guru Pengajar
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Daftar profil dan kontak rekan Guru & Wali Kelas SMK Bhinneka Nusantara.
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    Total 5 Guru Terdaftar
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALL_TEACHERS.map((t) => {
                    const prof = teacherProfiles[t.id] || t;
                    const isCurrent = t.id === currentTeacher.id;
                    return (
                      <div
                        key={t.id}
                        className={`p-6 rounded-3xl border transition-all space-y-4 bg-white relative overflow-hidden ${
                          isCurrent ? 'border-2 border-[#1b3828] shadow-lg ring-2 ring-[#c5a059]/30' : 'border-slate-200 shadow-xs hover:border-slate-300'
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 right-0 bg-[#c5a059] text-[#1b3828] px-3 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                            Profil Saya (Aktif)
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xl flex items-center justify-center border border-[#c5a059]/40 shrink-0 shadow-sm">
                            {prof.avatar}
                          </div>
                          <div>
                            <strong className="text-sm font-extrabold text-[#1b3828] block">{prof.name}</strong>
                            <span className="text-xs font-bold text-[#c5a059] block">Wali Kelas {prof.assignedClass}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">NIP. {prof.nip}</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600 font-medium">
                          <div><strong className="text-slate-800">Mapel Utama:</strong> {prof.subject}</div>
                          <div><strong className="text-slate-800">Ruangan:</strong> {prof.room}</div>
                          <div><strong className="text-slate-800">Email:</strong> {prof.email}</div>
                          <div><strong className="text-slate-800">Kontak:</strong> {prof.phone}</div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          {isCurrent ? (
                            <button
                              onClick={handleOpenEditProfile}
                              className="w-full py-2.5 px-3 rounded-xl bg-[#1b3828] text-[#c5a059] hover:bg-[#2d5a3f] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Edit size={14} />
                              <span>Edit Profil Saya</span>
                            </button>
                          ) : (
                            <a
                              href={`https://wa.me/${prof.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                            >
                              <MessageSquare size={14} />
                              <span>Hubungi Rekan</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}


            {/* ================= CLASS PORTAL VIEW ================= */}
            {activeMenu === 'CLASS' && (
              <motion.div
                key="CLASS"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Building2 size={22} className="text-[#c5a059]" />
                      Portal Manajemen Kelas {currentTeacherProfile.assignedClass}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kelola informasi kelas, ruang belajar, jadwal, dan daftar siswa bimbingan Anda.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenEditProfile}
                    className="px-4 py-2.5 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center gap-1.5 hover:bg-[#2d5a3f]"
                  >
                    <Edit size={16} />
                    <span>Ubah Profil Wali Kelas</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Class Info Box */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800">
                    <span className="px-3 py-1 rounded-full bg-[#c5a059] text-[#1b3828] text-[10px] font-black uppercase tracking-wider">
                      INFORMASI KELAS
                    </span>
                    <h4 className="text-2xl font-black text-white">{currentTeacherProfile.assignedClass}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Ruang Belajar: <strong className="text-amber-300">{currentTeacherProfile.room}</strong>
                    </p>
                    <p className="text-xs text-slate-300">
                      Wali Kelas: <strong className="text-white">{currentTeacherProfile.name}</strong>
                    </p>
                    <div className="p-3 bg-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between"><span>Jumlah Murid:</span> <strong className="text-[#c5a059]">{myClassStudents.length} Siswa</strong></div>
                      <div className="flex justify-between"><span>Mata Pelajaran:</span> <strong className="text-emerald-400">{currentSubjects.length} Mapel</strong></div>
                      <div className="flex justify-between"><span>Sesi Mengajar:</span> <strong className="text-blue-400">{currentSchedules.length} Sesi</strong></div>
                    </div>
                  </div>

                  {/* Class Schedules Box */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <strong className="text-sm font-extrabold text-[#1b3828]">Jadwal Kelas & Kegiatan ({currentSchedules.length})</strong>
                      <button
                        onClick={() => handleOpenScheduleModal()}
                        className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-xs hover:bg-emerald-200 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Tambah Jadwal</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSchedules.map(sch => (
                        <div key={sch.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-[#1b3828]">{sch.day}</span>
                            <span className="font-mono font-bold text-[#c5a059]">{sch.time}</span>
                          </div>
                          <strong className="block font-bold text-slate-900">{sch.subject}</strong>
                          <span className="text-[11px] text-slate-500 block">Ruang: {sch.classRoom}</span>
                          <div className="flex justify-end gap-1 pt-1">
                            <button onClick={() => handleOpenScheduleModal(sch)} className="p-1 rounded bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-700">
                              <Edit size={12} />
                            </button>
                            <button onClick={() => handleDeleteSchedule(sch.id)} className="p-1 rounded bg-slate-200 hover:bg-red-600 hover:text-white text-slate-700">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}


            {/* ================= SUBJECT MANAGEMENT VIEW ================= */}
            {activeMenu === 'SUBJECT' && (
              <motion.div
                key="SUBJECT"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <BookOpen size={22} className="text-[#c5a059]" />
                      Kelola Mata Pelajaran Kelas {currentTeacherProfile.assignedClass}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Tambah, ubah, atau hapus daftar mata pelajaran yang diajarkan pada akun portal Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenSubjectModal()}
                    className="px-5 py-2.5 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-[#2d5a3f] transition-all"
                  >
                    <Plus size={16} />
                    <span>+ Tambah Mata Pelajaran</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSubjects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      Belum ada mata pelajaran. Klik tombol "+ Tambah Mata Pelajaran" di atas.
                    </div>
                  ) : (
                    currentSubjects.map((sub) => (
                      <div key={sub.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-[#1b3828] text-[#c5a059] font-mono text-[10px] font-black">
                            {sub.code}
                          </span>
                          <span className="text-xs font-bold text-slate-500 font-mono">
                            {sub.hours} Jam Pelajaran (JP)
                          </span>
                        </div>

                        <div>
                          <strong className="text-sm font-black text-slate-900 block">{sub.name}</strong>
                          <p className="text-xs text-slate-600 mt-1">
                            Pengajar: <strong className="text-[#1b3828]">{sub.teacherName}</strong>
                          </p>
                          <p className="text-xs text-slate-500">
                            Ruang: <strong className="text-emerald-800">{sub.room}</strong>
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleOpenSubjectModal(sub)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(sub.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}


            {/* ================= ROUTINE / SCHEDULE MANAGEMENT VIEW ================= */}
            {activeMenu === 'ROUTINE' && (
              <motion.div
                key="ROUTINE"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Calendar size={22} className="text-[#c5a059]" />
                      Kelola Jadwal Mengajar & Routine Kelas {currentTeacherProfile.assignedClass}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Atur jadwal tatap muka harian, waktu pembelajaran, dan lokasi ruangan khusus akun Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenScheduleModal()}
                    className="px-5 py-2.5 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-[#2d5a3f] transition-all"
                  >
                    <Plus size={16} />
                    <span>+ Tambah Jadwal Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSchedules.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      Belum ada jadwal mengajar. Klik tombol "+ Tambah Jadwal Baru" di atas.
                    </div>
                  ) : (
                    currentSchedules.map((sch) => (
                      <div key={sch.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-md bg-[#1b3828] text-[#c5a059] text-xs font-black">
                            {sch.day}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            {sch.time}
                          </span>
                        </div>

                        <div>
                          <strong className="text-sm font-black text-slate-900 block">{sch.subject}</strong>
                          <p className="text-xs text-slate-600 mt-1">
                            Ruang Pembelajaran: <strong className="text-emerald-800">{sch.classRoom}</strong>
                          </p>
                          {sch.note && (
                            <p className="text-[11px] text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-200">
                              📝 {sch.note}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleOpenScheduleModal(sch)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(sch.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}


            {/* ================= NOTICE / PENGUMUMAN MANAGEMENT VIEW ================= */}
            {activeMenu === 'NOTICE' && (
              <motion.div
                key="NOTICE"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <Megaphone size={22} className="text-[#c5a059]" />
                      Pengumuman & Info Wali Kelas {currentTeacherProfile.assignedClass}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Buat pengumuman penting untuk siswa & orang tua murid di kelas bimbingan Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenNoticeModal()}
                    className="px-5 py-2.5 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-[#2d5a3f] transition-all"
                  >
                    <Plus size={16} />
                    <span>+ Buat Pengumuman Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentNotices.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      Belum ada pengumuman kelas. Klik "+ Buat Pengumuman Baru" di atas.
                    </div>
                  ) : (
                    currentNotices.map((not) => (
                      <div key={not.id} className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#1b3828] text-[#c5a059] text-[10px] font-black uppercase">
                              {not.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-800">
                              {not.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenNoticeModal(not)}
                              className="px-3 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(not.id)}
                              className="px-3 py-1.5 rounded-xl bg-white text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors"
                            >
                              <Trash2 size={14} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <strong className="text-base font-black text-emerald-950 block">📌 {not.title}</strong>
                          <p className="text-xs leading-relaxed text-emerald-900 mt-1 font-medium">{not.content}</p>
                        </div>

                        <div className="text-[11px] text-emerald-700 font-bold border-t border-emerald-200/60 pt-2 flex items-center justify-between">
                          <span>Diterbitkan oleh: {not.author}</span>
                          <span>Wali Kelas {currentTeacherProfile.assignedClass}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}


            {/* ================= EXAM / EVALUATION MANAGEMENT VIEW ================= */}
            {activeMenu === 'EXAM' && (
              <motion.div
                key="EXAM"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <FileSpreadsheet size={22} className="text-[#c5a059]" />
                      Jadwal Evaluasi & Nilai Ujian Siswa ({currentTeacherProfile.assignedClass})
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Atur kuis, UTS, UAS, dan praktikum evaluasi kelas bimbingan Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenExamModal()}
                    className="px-5 py-2.5 rounded-2xl bg-[#1b3828] text-[#c5a059] font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-[#2d5a3f] transition-all"
                  >
                    <Plus size={16} />
                    <span>+ Buat Evaluasi / Ujian</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentExams.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      Belum ada agenda ujian. Klik tombol "+ Buat Evaluasi / Ujian" di atas.
                    </div>
                  ) : (
                    currentExams.map((ex) => (
                      <div key={ex.id} className="p-5 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            ex.status === 'Diterbitkan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ex.status}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">{ex.date}</span>
                        </div>

                        <div>
                          <strong className="text-sm font-black text-slate-900 block">{ex.title}</strong>
                          <p className="text-xs text-slate-600 mt-1">Mata Pelajaran: <strong className="text-[#1b3828]">{ex.subject}</strong></p>
                          <p className="text-xs text-slate-500">Skor Maksimal: <strong className="text-slate-800">{ex.maxScore} Poin</strong></p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleOpenExamModal(ex)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteExam(ex.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}


            {/* ================= 4. ATTENDANCE & PRESENSI VIEW ================= */}
            {activeMenu === 'ATTENDANCE' && (
              <motion.div
                key="ATTENDANCE"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#1b3828] flex items-center gap-2">
                      <ClipboardList size={22} className="text-[#c5a059]" />
                      Presensi & Kehadiran Kelas Wali ({currentTeacherProfile.assignedClass})
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Catat & simpan kehadiran harian murid kelas bimbingan Anda.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`Presensi kelas ${currentTeacherProfile.assignedClass} telah berhasil disimpan!`)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Save size={16} />
                      <span>Simpan Presensi Hari Ini</span>
                    </button>
                    <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl border border-emerald-200 text-xs font-bold font-mono">
                      {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myClassStudents.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      Belum ada siswa terdaftar di kelas {currentTeacherProfile.assignedClass}.
                    </div>
                  ) : (
                    myClassStudents.map(student => {
                      const currentStatus = attendanceState[student.id] || 'HADIR';
                      return (
                        <div key={student.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-slate-900 block truncate">{student.fullName}</strong>
                            <span className="text-[10px] font-mono text-slate-500">NISN: {student.nikNisn}</span>
                          </div>

                          <div className="grid grid-cols-4 gap-1">
                            {(['HADIR', 'IZIN', 'SAKIT', 'ALFA'] as const).map(st => (
                              <button
                                key={st}
                                onClick={() => setAttendanceState({ ...attendanceState, [student.id]: st })}
                                className={`py-1.5 px-2 rounded-lg text-[10px] font-black transition-all ${
                                  currentStatus === st
                                    ? st === 'HADIR'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'IZIN'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : st === 'SAKIT'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-red-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

          </main>
        </div>
      </div>


      {/* ================= MODALS & OVERLAYS ================= */}

      {/* A. ADD STUDENT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1b3828]">Tambah Murid Baru (+ Add Student)</h3>
                  <p className="text-xs text-slate-500">Input data siswa langsung ke daftar kelas bimbingan</p>
                </div>
              </div>

              <form onSubmit={handleCreateStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap Murid *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Eleanor Pena"
                      value={newStudentData.fullName}
                      onChange={e => setNewStudentData({ ...newStudentData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">NISN / NIK *</label>
                    <input
                      type="text"
                      required
                      placeholder="10 digit NISN"
                      value={newStudentData.nikNisn}
                      onChange={e => setNewStudentData({ ...newStudentData, nikNisn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Jurusan / Kelas</label>
                    <select
                      value={newStudentData.firstChoiceMajor}
                      onChange={e => setNewStudentData({ ...newStudentData, firstChoiceMajor: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828] font-bold"
                    >
                      <option value="RPL">X RPL (Rekayasa Perangkat Lunak)</option>
                      <option value="AKL">X AKL (Akuntansi & Keuangan)</option>
                      <option value="TSM">X TSM (Teknik Sepeda Motor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tempat, Tanggal Lahir</label>
                    <input
                      type="text"
                      value={newStudentData.birthPlaceDate}
                      onChange={e => setNewStudentData({ ...newStudentData, birthPlaceDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">No. WA Orang Tua / Wali</label>
                    <input
                      type="text"
                      placeholder="0812xxxxxxxx"
                      value={newStudentData.parentPhone}
                      onChange={e => setNewStudentData({ ...newStudentData, parentPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Asal Sekolah SMP</label>
                    <input
                      type="text"
                      value={newStudentData.originSchool}
                      onChange={e => setNewStudentData({ ...newStudentData, originSchool: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Rumah Lengkap</label>
                  <textarea
                    rows={2}
                    value={newStudentData.address}
                    onChange={e => setNewStudentData({ ...newStudentData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1b3828] text-[#c5a059] font-black text-xs uppercase tracking-wider hover:bg-[#2d5a3f] transition-all flex items-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>Simpan Murid</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* B. EDIT STUDENT MODAL */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setEditingStudent(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <Edit size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1b3828]">Edit Data Murid</h3>
                  <p className="text-xs text-slate-500">Perbarui data profil & kontak orang tua murid</p>
                </div>
              </div>

              <form onSubmit={handleSaveEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editingStudent.fullName}
                      onChange={e => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">NISN / NIK</label>
                    <input
                      type="text"
                      value={editingStudent.nikNisn}
                      onChange={e => setEditingStudent({ ...editingStudent, nikNisn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1b3828] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Jurusan Kelas</label>
                    <select
                      value={editingStudent.firstChoiceMajor}
                      onChange={e => setEditingStudent({ ...editingStudent, firstChoiceMajor: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none"
                    >
                      <option value="RPL">X RPL (Rekayasa Perangkat Lunak)</option>
                      <option value="AKL">X AKL (Akuntansi)</option>
                      <option value="TSM">X TSM (Otomotif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">No. WA Orang Tua</label>
                    <input
                      type="text"
                      value={editingStudent.parentPhone || editingStudent.phoneWhatsapp}
                      onChange={e => setEditingStudent({ ...editingStudent, parentPhone: e.target.value, phoneWhatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                  <textarea
                    rows={2}
                    value={editingStudent.address || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-1.5"
                  >
                    <Save size={16} />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* C. VIEW STUDENT DETAIL MODAL */}
      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setViewingStudent(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black text-base border border-[#c5a059]/40">
                  {viewingStudent.fullName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1b3828]">{viewingStudent.fullName}</h3>
                  <p className="text-xs text-slate-500 font-mono">NISN: {viewingStudent.nikNisn} • Kelas X {viewingStudent.firstChoiceMajor}-1</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Asal Sekolah SMP</span>
                  <strong className="text-slate-800 font-bold block">{viewingStudent.originSchool}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tempat / Tanggal Lahir</span>
                  <strong className="text-slate-800 font-bold block">{viewingStudent.birthPlaceDate || 'Tangerang, 12 Mei 2008'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Nama Orang Tua / Wali</span>
                  <strong className="text-slate-800 font-bold block">{viewingStudent.parentName || 'Bapak / Ibu Wali'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">No. WA Orang Tua</span>
                  <strong className="text-emerald-700 font-mono font-bold block">{viewingStudent.parentPhone || viewingStudent.phoneWhatsapp}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Alamat Tempat Tinggal</span>
                <p className="text-slate-700">{viewingStudent.address || 'Jl. Raya Sepatan, Kab. Tangerang, Banten'}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <a
                  href={`https://wa.me/${(viewingStudent.parentPhone || viewingStudent.phoneWhatsapp).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Hubungi Wali via WA</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                >
                  <Printer size={14} />
                  <span>Cetak Formulir</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* D. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingStudentId && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Hapus Data Murid?</h4>
                <p className="text-xs text-slate-500 mt-1">Data murid ini akan dihapus dari daftar kelas bimbingan secara permanen.</p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeletingStudentId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. EDIT TEACHER PROFILE MODAL */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 border border-slate-200 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1b3828]">Ubah Profil Wali Kelas</h3>
                  <p className="text-xs text-slate-500">Perbarui identitas & kontak akun portal Anda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP</label>
                  <input
                    type="text"
                    value={profileForm.nip || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, nip: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={profileForm.nuptk || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, nuptk: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran Utama</label>
                  <input
                    type="text"
                    value={profileForm.subject || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ruang Kelas / Lab</label>
                  <input
                    type="text"
                    value={profileForm.room || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, room: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. Whatsapp</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] text-xs font-black hover:bg-[#2d5a3f]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* F. SCHEDULE MODAL */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                  <Calendar size={18} />
                </div>
                <h3 className="text-sm font-black text-[#1b3828]">
                  {editingSchedule ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar Baru'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hari</label>
                  <select
                    value={scheduleForm.day || 'Senin'}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Waktu / Jam Sesi</label>
                  <input
                    type="text"
                    placeholder="Contoh: 07.30 - 09.30"
                    value={scheduleForm.time || ''}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    placeholder="Nama mapel"
                    value={scheduleForm.subject || ''}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ruangan</label>
                  <input
                    type="text"
                    placeholder="Ruang / Lab"
                    value={scheduleForm.classRoom || ''}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, classRoom: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Modul, materi, dll"
                    value={scheduleForm.note || ''}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, note: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] text-xs font-black hover:bg-[#2d5a3f]"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* G. SUBJECT MODAL */}
      <AnimatePresence>
        {isSubjectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                  <BookOpen size={18} />
                </div>
                <h3 className="text-sm font-black text-[#1b3828]">
                  {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Mapel</label>
                  <input
                    type="text"
                    placeholder="Contoh: MP-WEB01"
                    value={subjectForm.code || ''}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap mata pelajaran"
                    value={subjectForm.name || ''}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Beban Jam (JP)</label>
                  <input
                    type="number"
                    placeholder="4"
                    value={subjectForm.hours || 2}
                    onChange={(e) => setSubjectForm({ ...subjectForm, hours: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ruangan Pembelajaran</label>
                  <input
                    type="text"
                    placeholder="Lab Komputer / Teori"
                    value={subjectForm.room || ''}
                    onChange={(e) => setSubjectForm({ ...subjectForm, room: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Guru Pengajar</label>
                  <input
                    type="text"
                    placeholder="Nama pengajar"
                    value={subjectForm.teacherName || ''}
                    onChange={(e) => setSubjectForm({ ...subjectForm, teacherName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveSubject}
                  className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] text-xs font-black hover:bg-[#2d5a3f]"
                >
                  Simpan Mapel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* H. NOTICE MODAL */}
      <AnimatePresence>
        {isNoticeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                  <Megaphone size={18} />
                </div>
                <h3 className="text-sm font-black text-[#1b3828]">
                  {editingNotice ? 'Edit Pengumuman Kelas' : 'Buat Pengumuman Baru'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Judul Pengumuman</label>
                  <input
                    type="text"
                    placeholder="Judul pengumuman singkat"
                    value={noticeForm.title || ''}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-extrabold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori / Label</label>
                  <select
                    value={noticeForm.category || 'Info Kelas'}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="Info Kelas">Info Kelas</option>
                    <option value="Penting">Penting</option>
                    <option value="PPDB">PPDB & Verifikasi</option>
                    <option value="Kegiatan">Kegiatan Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Isi Pengumuman Lengkap</label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan pengumuman lengkap untuk siswa..."
                    value={noticeForm.content || ''}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveNotice}
                  className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] text-xs font-black hover:bg-[#2d5a3f]"
                >
                  Terbitkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* I. EXAM MODAL */}
      <AnimatePresence>
        {isExamModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1b3828] text-[#c5a059] flex items-center justify-center font-black">
                  <FileSpreadsheet size={18} />
                </div>
                <h3 className="text-sm font-black text-[#1b3828]">
                  {editingExam ? 'Edit Agenda Evaluasi' : 'Buat Agenda Ujian / Evaluasi'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Ujian / Kuis</label>
                  <input
                    type="text"
                    placeholder="Contoh: UTS Pemrograman Web"
                    value={examForm.title || ''}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    placeholder="Nama mapel"
                    value={examForm.subject || ''}
                    onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    placeholder="15 Ags 2025"
                    value={examForm.date || ''}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Skor Maksimal</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={examForm.maxScore || 100}
                    onChange={(e) => setExamForm({ ...examForm, maxScore: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveExam}
                  className="px-5 py-2 rounded-xl bg-[#1b3828] text-[#c5a059] text-xs font-black hover:bg-[#2d5a3f]"
                >
                  Simpan Agenda
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
