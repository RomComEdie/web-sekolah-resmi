import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'Kapan pendaftaran PPDB SMK Bhinneka Nusantara dibuka?',
      answer: 'Gelombang 1 dibuka mulai 1 Juli hingga 31 Agustus 2026. Pendaftaran dapat dilakukan secara online melalui website ini atau langsung datang ke Sekretariat PPDB di Kampus Utama.',
      category: 'PPDB'
    },
    {
      id: 'faq-2',
      question: 'Apa saja syarat berkas pendaftaran yang harus disiapkan?',
      answer: 'Berkas utama yang diperlukan: (1) Fotokopi Kartu Keluarga, (2) Fotokopi Akta Kelahiran, (3) Pas foto 3x4 (3 lembar), (4) Surat Keterangan Lulus / Ijazah SMP/MTs, dan (5) Fotokopi KTP Orang Tua.',
      category: 'Berkas'
    },
    {
      id: 'faq-3',
      question: 'Apakah ada program Beasiswa Potongan Biaya SPP?',
      answer: 'Ya, kami menyediakan Beasiswa Jalur Prestasi Akademik (Peringkat 1-3 SMP), Beasiswa Tahfizh Al-Qur\'an, dan Beasiswa KIP/Keluarga Prasejahtera dengan potongan SPP hingga 50%.',
      category: 'Beasiswa'
    },
    {
      id: 'faq-4',
      question: 'Apakah lulusan SMK Bhinneka Nusantara disalurkan kerja?',
      answer: 'Ya, sekolah memiliki Bursa Kerja Khusus (BKK) tersertifikasi yang bekerjasama dengan lebih dari 45 perusahaan mitra industri IT, otomotif, keuangan, dan manufaktur untuk penyaluran kerja langsung sebelum lulus.',
      category: 'Karir'
    },
    {
      id: 'faq-5',
      question: 'Bagaimana cara mengecek status hasil seleksi pendaftaran saya?',
      answer: 'Anda dapat mengecek secara mandiri melalui tombol "Cek Status PPDB" pada menu navigasi website ini dengan memasukkan NIK atau Nomor Pendaftaran yang didapat setelah mengisi formulir.',
      category: 'PPDB'
    }
  ];

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-[#f4f7f4] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b3828] text-[#c5a059] text-xs font-mono font-bold">
            <HelpCircle size={14} />
            <span>PERTANYAAN UMUM (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1b3828] tracking-tight">
            Informasi & Jawaban Lengkap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Temukan jawaban cepat untuk pertanyaan seputar sistem pendaftaran, kurikulum, dan fasilitas sekolah.
          </p>
        </div>

        {/* Faq Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-extrabold text-[#1b3828] text-sm sm:text-base hover:text-[#2d5a3f] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1b3828] text-white' : 'text-slate-600'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAFBF9]/50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support CTA Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1b3828] to-[#2d5a3f] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-[#c5a059]/30">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-sm sm:text-base">Punya Pertanyaan Lain?</h4>
            <p className="text-xs text-slate-300">Tim Panitia PPDB kami siap melayani konseling pendaftaran via WhatsApp.</p>
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20SMK%20Bhinneka%20Nusantara,%20saya%20ingin%20bertanya"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b08c46] text-[#1b3828] font-black text-xs transition-all flex items-center gap-2 shadow-md active:scale-95 shrink-0"
          >
            <MessageCircle size={16} />
            <span>Chat Panitia via WA</span>
          </a>
        </div>

      </div>
    </section>
  );
};
