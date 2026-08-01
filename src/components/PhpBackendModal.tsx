import React, { useState, useEffect } from 'react';
import { FileCode, Download, Copy, Check, X, Database, Server, Terminal, ExternalLink } from 'lucide-react';

interface PhpFileItem {
  filename: string;
  content: string;
  language: string;
}

interface PhpBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpBackendModal: React.FC<PhpBackendModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<PhpFileItem[]>([]);
  const [activeFilename, setActiveFilename] = useState<string>('config.php');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/export/php-files')
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data)) {
            setFiles(resData.data);
            if (resData.data.length > 0) {
              setActiveFilename(resData.data[0].filename);
            }
          }
        })
        .catch((err) => console.error('Gagal mengambil file PHP:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentFile = files.find((f) => f.filename === activeFilename) || files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="neu-card bg-[#e5ece8] w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/60">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-300/50 flex items-center justify-between bg-[#dce6e0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-circle flex items-center justify-center text-[#386652] font-bold shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <span>Backend PHP Native & Database MySQL</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#386652] text-white font-bold">
                  Ready XAMPP / phpMyAdmin
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                File konfigurasi, koneksi PDO, API handler, dan skrip SQL lengkap.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-2 text-slate-600 hover:text-red-600 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* File Selector Sidebar */}
          <div className="md:col-span-4 bg-[#dae3dd] p-3 sm:p-4 border-r border-slate-300/50 flex flex-col gap-2 overflow-y-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2">
              Daftar Berkas PHP & SQL:
            </span>

            {loading ? (
              <div className="p-4 text-xs text-slate-500 animate-pulse">Memuat berkas PHP...</div>
            ) : (
              files.map((f) => (
                <button
                  key={f.filename}
                  onClick={() => setActiveFilename(f.filename)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    activeFilename === f.filename
                      ? 'neu-pressed text-[#386652] bg-[#e5ece8]'
                      : 'neu-btn text-slate-700 hover:text-[#386652]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {f.filename.endsWith('.sql') ? (
                      <Database className="w-4 h-4 text-[#b8860b] shrink-0" />
                    ) : f.filename.endsWith('.md') ? (
                      <Terminal className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <FileCode className="w-4 h-4 text-[#386652] shrink-0" />
                    )}
                    <span className="truncate">{f.filename}</span>
                  </div>

                  <span className="text-[10px] opacity-60 uppercase font-mono">
                    {f.language}
                  </span>
                </button>
              ))
            )}

            <div className="mt-auto pt-4 border-t border-slate-300/40 space-y-2">
              <a
                href="/api/export/sql"
                download="database_smk.sql"
                className="neu-btn-primary w-full py-2.5 px-3 text-xs font-bold text-center flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#fef08a]" />
                <span>Unduh database.sql</span>
              </a>
            </div>
          </div>

          {/* Code Viewer Area */}
          <div className="md:col-span-8 flex flex-col bg-[#1e293b] text-slate-200 overflow-hidden">
            {/* Viewer Bar */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-emerald-400 font-semibold">
                <span>{currentFile?.filename || 'Loading...'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>

                {currentFile && (
                  <button
                    onClick={() => handleDownloadFile(currentFile.filename, currentFile.content)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Scroll Box */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed selection:bg-emerald-900 selection:text-white">
              <pre className="whitespace-pre-wrap break-all">
                {currentFile?.content || '// Tidak ada konten'}
              </pre>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="p-3 sm:p-4 border-t border-slate-300/50 bg-[#dce6e0] flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Koneksi PHP Native PDO (MySQL / MariaDB) Siap Diimpor ke phpMyAdmin</span>
          </div>

          <button
            onClick={onClose}
            className="neu-btn px-4 py-1.5 text-xs font-bold text-slate-700"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
