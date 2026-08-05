import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Compass, 
  ExternalLink,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { SCHOOL_INFO } from '../../data/schoolData';
import { sendContactMessage } from '../../services/api';
import { checkToxicWords, checkRateLimit, recordActionTimestamp } from '../../utils/security';

export const MapAndContactSection: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [toxicWarning, setToxicWarning] = useState<string | null>(null);
  const [rateLimitWarning, setRateLimitWarning] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setToxicWarning(null);
    setRateLimitWarning(null);

    if (!senderName || !senderMessage) return;

    // 1. Rate Limiter check (20 seconds cooldown per message)
    const rateCheck = checkRateLimit('contact_message', 20);
    if (!rateCheck.allowed) {
      setRateLimitWarning(`⏳ Pengiriman pesan terlalu cepat. Silakan tunggu ${rateCheck.waitSeconds} detik lagi.`);
      return;
    }

    // 2. Toxic Words / Moderation Check
    const combinedContent = `${senderName} ${senderMessage}`;
    const toxicCheck = checkToxicWords(combinedContent);
    if (toxicCheck.isToxic) {
      setToxicWarning(`⚠️ Pesan tidak dapat dikirim karena terdeteksi kata tidak pantas / toxic. Mohon gunakan bahasa yang sopan dan santun.`);
      return;
    }

    const res = await sendContactMessage({
      nama: senderName.trim(),
      email: senderContact.includes('@') ? senderContact.trim() : `${senderName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      whatsapp: !senderContact.includes('@') ? senderContact.trim() : '',
      pesan: senderMessage.trim()
    });

    if (res && !res.success) {
      setToxicWarning(res.message || 'Gagal mengirim pesan.');
      return;
    }

    recordActionTimestamp('contact_message');
    setMessageSent(true);
    setTimeout(() => {
      setSenderName('');
      setSenderContact('');
      setSenderMessage('');
      setMessageSent(false);
    }, 5000);
  };

  return (
    <section id="kontak" className="py-20 bg-[#fafbf9] relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0eb] text-[#2d5a3f] text-xs font-bold uppercase tracking-wider border border-[#2d5a3f]/20">
            <MapPin size={14} className="text-[#c5a059]" />
            <span>Lokasi Peta & Kontak Official</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3828] tracking-tight">
            Hubungi Kami & Temukan Lokasi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Kampus terpadu SMK Bhinneka Nusantara berlokasi strategis di pusat pendidikan Kota Sejahtera dengan akses transportasi umum yang mudah.
          </p>
        </div>

        {/* Grid Layout: Map Embed + Contact Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Embed Google Map */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 shadow-md flex flex-col justify-between">
            <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200">
              <iframe 
                title="Peta Lokasi SMK Bhinneka Nusantara"
                src={SCHOOL_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-2xl"
              />
              <div className="absolute top-3 left-3 bg-[#1b3828]/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-[#c5a059]/40 flex items-center gap-2">
                <MapPin size={14} className="text-[#c5a059]" />
                <span>Kampus SMK Bhinneka Nusantara</span>
              </div>
            </div>

            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 mt-2">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-[#2d5a3f]" />
                <span>{SCHOOL_INFO.address}</span>
              </div>
              <a 
                href="https://maps.app.goo.gl/iwnYLSt5F6L7tiqx8" 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-[#2d5a3f] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Buka Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Cards & Message Form */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Contact Details Card */}
            <div className="bg-[#1b3828] text-white p-6 sm:p-8 rounded-3xl border border-[#c5a059]/30 shadow-md space-y-4">
              <h3 className="text-xl font-extrabold text-[#f7f2e7]">
                Informasi Kontak Layanan
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#2d5a3f] text-[#c5a059] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Telepon Kantor</span>
                    <strong className="text-[#f7f2e7]">{SCHOOL_INFO.phone}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#2d5a3f] text-[#c5a059] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">WhatsApp PPDB & Email</span>
                    <a href={`https://wa.me/${SCHOOL_INFO.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-[#c5a059] font-bold hover:underline block">
                      WA: {SCHOOL_INFO.whatsapp}
                    </a>
                    <span className="text-slate-300">{SCHOOL_INFO.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#2d5a3f] text-[#c5a059] shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Jam Operasional Sekretariat</span>
                    <strong className="text-[#f7f2e7]">{SCHOOL_INFO.operationalHours}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Question / Message Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-[#1b3828]">
                Kirim Pesan / Pertanyaan
              </h4>

              {toxicWarning && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-pulse">
                  <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                  <span>{toxicWarning}</span>
                </div>
              )}

              {rateLimitWarning && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2.5">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <span>{rateLimitWarning}</span>
                </div>
              )}

              {messageSent ? (
                <div className="p-4 rounded-xl bg-[#e8f0eb] border border-[#2d5a3f]/30 text-[#2d5a3f] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Pesan Anda telah terkirim ke panitia sekolah!</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <input 
                    type="text"
                    required
                    placeholder="Nama Lengkap..."
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-slate-300 text-xs focus:outline-none focus:border-[#2d5a3f]"
                  />
                  <input 
                    type="text"
                    placeholder="No. WhatsApp / Email..."
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-slate-300 text-xs focus:outline-none focus:border-[#2d5a3f]"
                  />
                  <textarea 
                    rows={2}
                    required
                    placeholder="Tuliskan pertanyaan seputar PPDB / Sekolah..."
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-slate-300 text-xs focus:outline-none focus:border-[#2d5a3f]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#1b3828] text-[#f7f2e7] text-xs font-bold hover:bg-[#2d5a3f] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} className="text-[#c5a059]" />
                    <span>Kirim Pesan</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
