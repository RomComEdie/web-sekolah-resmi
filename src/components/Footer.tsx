import React from 'react';
import { GraduationCap, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-[#dce6e0] border-t border-white/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: About School */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 neu-circle flex items-center justify-center text-[#386652] font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-800 block">
                  {SCHOOL_INFO.nama}
                </span>
                <span className="text-xs text-[#b8860b] font-bold">
                  NPSN: {SCHOOL_INFO.npsn} | Akreditasi {SCHOOL_INFO.akreditasi}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md font-medium">
              {SCHOOL_INFO.slogan}. Berkomitmen melahirkan tenaga kerja terampil, profesional, dan siap menghadapi era revolusi industri 4.0.
            </p>
          </div>

          {/* Col 2: Nav Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              Jurusan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#kejuruan" className="hover:text-[#386652] transition-colors font-medium block">
                  • Software (RPL)
                </a>
              </li>
              <li>
                <a href="#kejuruan" className="hover:text-[#386652] transition-colors font-medium block">
                  • Akuntansi (AKL)
                </a>
              </li>
              <li>
                <a href="#kejuruan" className="hover:text-[#386652] transition-colors font-medium block">
                  • Otomotif (TSM)
                </a>
              </li>
              <li>
                <a href="#ringkasan" className="hover:text-[#386652] transition-colors font-medium block">
                  • Visi & Misi
                </a>
              </li>
              <li>
                <a href="#guru" className="hover:text-[#386652] transition-colors font-medium block">
                  • Profil Pengajar
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#386652]"></span>
              Kontak PPDB
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#386652] shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.alamat}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#386652] shrink-0" />
                <span>{SCHOOL_INFO.telepon} / WA: {SCHOOL_INFO.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#386652] shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#386652] shrink-0" />
                <span>{SCHOOL_INFO.website}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Google Maps Embed */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#386652]" />
              Peta Lokasi Sekolah
            </h4>
            <div className="neu-card p-1.5 overflow-hidden rounded-xl h-40 border border-white/60">
              <iframe
                title="Peta Lokasi SMK Prestasi Nusantara"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8576402263884!2d106.8228183!3d-6.2824641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f23730e23e25%3A0x633d14f4948a28e8!2sJakarta%20Selatan%2C%20DKI%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg filter contrast-100"
              />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-800">{SCHOOL_INFO.nama}</strong>. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#386652] font-semibold">Sage Green & Gold Neumorphism</span>
            <span>•</span>
            <span className="text-[#b8860b] font-semibold">Sistem PPDB Online Official</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

