import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Tag, ArrowRight, Bell, Sparkles, Trophy, Bookmark } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  author: string;
  isImportant?: boolean;
}

export const AnnouncementsSection: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          // Check if local storage overrides exist
          const localStored = localStorage.getItem('smk_announcements');
          if (localStored) {
            try {
              const parsed = JSON.parse(localStored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAnnouncements(parsed);
                return;
              }
            } catch (e) { /* ignore */ }
          }
          setAnnouncements(json.data);
          localStorage.setItem('smk_announcements', JSON.stringify(json.data));
          return;
        }
      }
      throw new Error('API offline');
    } catch (err) {
      const localStored = localStorage.getItem('smk_announcements');
      if (localStored) {
        try {
          const parsed = JSON.parse(localStored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
            return;
          }
        } catch (e) { /* ignore */ }
      }
      // Fallback static news if API offline
      const defaultNews = [
        {
          id: "ANN-001",
          title: "Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027",
          category: "PPDB",
          date: "2026-07-01",
          summary: "Pendaftaran Siswa Baru resmi dibuka online mulai 1 Juli hingga 31 Agustus 2026 dengan beasiswa SPP.",
          content: "SMK Bhinneka Nusantara resmi membuka Pendaftaran Peserta Didik Baru (PPDB) Gelombang 1. Bagi pendaftar 100 pertama mendapatkan bebas biaya pendaftaran & potongan SPP 20%.",
          author: "Panitia PPDB",
          isImportant: true
        },
        {
          id: "ANN-002",
          title: "Juara 1 LKS SMK Tingkat Provinsi Bidang Web Technologies",
          category: "Prestasi",
          date: "2026-07-20",
          summary: "Siswa jurusan RPL & TKJ kembali mengukir prestasi emas dalam Lomba Kompetensi Siswa SMK.",
          content: "Selamat kepada tim siswa RPL dan TKJ SMK Bhinneka Nusantara yang berhasil meraih Juara 1 LKS Tingkat Provinsi.",
          author: "Humas Sekolah",
          isImportant: false
        },
        {
          id: "ANN-003",
          title: "Jadwal Masa Pengenalan Lingkungan Sekolah (MPLS) 2026",
          category: "Kegiatan",
          date: "2026-07-15",
          summary: "Seluruh calon siswa baru diwajibkan mengikuti pembekalan MPLS pada tanggal 10-12 Juli 2026.",
          content: "Kegiatan MPLS dilaksanakan secara tatap muka di Kampus Utama SMK Bhinneka Nusantara dengan seragam sekolah asal.",
          author: "Kesiswaan",
          isImportant: false
        }
      ];
      setAnnouncements(defaultNews);
    }
  };

  useEffect(() => {
    loadAnnouncements();

    const handleUpdate = () => {
      loadAnnouncements();
    };

    window.addEventListener('smk_announcements_updated', handleUpdate);
    return () => window.removeEventListener('smk_announcements_updated', handleUpdate);
  }, []);

  const categories = ['Semua', 'PPDB', 'Prestasi', 'Kegiatan', 'Pengumuman'];

  const filtered = selectedCategory === 'Semua'
    ? announcements
    : announcements.filter(a => a.category === selectedCategory);

  return (
    <section id="berita" className="py-20 bg-[#f4f7f4] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d5a3f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b3828] text-[#c5a059] text-xs font-mono font-bold">
              <Megaphone size={14} />
              <span>INFORMASI TERKINI & AGENDA SEKOLAH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1b3828] tracking-tight">
              Berita & Pengumuman Resmi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Ikuti kabar terbaru, pengumuman akademis, prestasi siswa, dan agenda kegiatan SMK Bhinneka Nusantara.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#1b3828] text-white border-[#1b3828] shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#2d5a3f] hover:text-[#1b3828]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Announcement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    item.category === 'PPDB'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : item.category === 'Prestasi'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {item.category}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 font-mono">
                    <Calendar size={13} />
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#2d5a3f] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  Oleh: <strong className="text-slate-700">{item.author}</strong>
                </span>

                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className="font-bold text-[#1b3828] group-hover:text-[#2d5a3f] flex items-center gap-1 transition-all"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Reading Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-white/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-[#e8f0eb] text-[#2d5a3f] text-xs font-black uppercase">
                {selectedAnnouncement.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">{selectedAnnouncement.date}</span>
            </div>

            <h3 className="text-xl font-black text-[#1b3828] leading-tight">
              {selectedAnnouncement.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedAnnouncement.content}
            </p>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 bg-[#1b3828] text-white rounded-xl text-xs font-bold hover:bg-[#2d5a3f] transition-all"
              >
                Tutup Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
