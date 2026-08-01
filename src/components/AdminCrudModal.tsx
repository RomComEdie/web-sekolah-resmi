import React, { useState } from 'react';
import { X, Search, Plus, Edit2, Trash2, Download, Printer, ShieldCheck, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { RegistrationData } from '../types';
import { generateRegistrationPDF } from '../utils/pdfGenerator';

interface AdminCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: RegistrationData[];
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (data: RegistrationData) => Promise<void>;
  onCreate: (data: any) => Promise<void>;
}

export const AdminCrudModal: React.FC<AdminCrudModalProps> = ({
  isOpen,
  onClose,
  registrations,
  onRefresh,
  onDelete,
  onUpdate,
  onCreate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jurusanFilter, setJurusanFilter] = useState<'ALL' | 'RPL' | 'AKL' | 'TSM'>('ALL');
  
  // Edit State
  const [editingItem, setEditingItem] = useState<RegistrationData | null>(null);
  
  // New Item State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFormData, setNewFormData] = useState({
    nisn: '',
    namaLengkap: '',
    jenisKelamin: 'Laki-Laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2009-01-01',
    noHp: '081234567890',
    alamat: 'Jl. Merdeka No. 1',
    jurusan: 'RPL',
    asalSekolah: 'SMPN 1',
    tahunLulus: '2026',
    namaOrangTua: 'Orang Tua',
    noHpOrangTua: '08123456789',
    pekerjaanOrangTua: 'Wiraswasta'
  });

  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredData = registrations.filter(item => {
    const matchesSearch = item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nisn.includes(searchTerm) ||
                          item.asalSekolah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJurusan = jurusanFilter === 'ALL' || item.jurusan === jurusanFilter;
    return matchesSearch && matchesJurusan;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus data pendaftaran ${name} (${id})?`)) {
      setBusy(true);
      try {
        await onDelete(id);
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus data.');
      } finally {
        setBusy(false);
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setBusy(true);
    setModalError(null);
    try {
      await onUpdate(editingItem);
      setEditingItem(null);
    } catch (err: any) {
      setModalError(err.message || 'Gagal memperbarui data.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setModalError(null);
    try {
      await onCreate(newFormData);
      setIsAddingNew(false);
    } catch (err: any) {
      setModalError(err.message || 'Gagal menambah data.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="neu-card bg-[#e5ece8] w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-300/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-circle flex items-center justify-center text-[#386652]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Panel Database Admin (CRUD Pendaftaran PPDB)
              </h2>
              <p className="text-xs text-slate-500">
                Fitur Pengelolaan Database Real-time (Create, Read, Update, Delete)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="neu-btn p-2 text-slate-700 hover:text-[#386652]"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="neu-btn p-2 text-slate-700 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {modalError && (
            <div className="neu-pressed p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            <div className="flex items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari Nama, NISN, atau Sekolah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neu-input w-full pl-9 pr-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Jurusan Filter */}
              <select
                value={jurusanFilter}
                onChange={(e: any) => setJurusanFilter(e.target.value)}
                className="neu-input px-3 py-2 text-xs font-semibold text-slate-800 bg-[#e5ece8]"
              >
                <option value="ALL">Semua Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="AKL">AKL</option>
                <option value="TSM">TSM</option>
              </select>
            </div>

            {/* Add New Button */}
            <button
              onClick={() => setIsAddingNew(true)}
              className="neu-btn-primary px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Manual (Create)</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="neu-pressed rounded-2xl p-2 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300/60 text-slate-600 uppercase font-extrabold text-[11px] tracking-wider">
                  <th className="p-3">ID / Tgl</th>
                  <th className="p-3">NISN (Unik)</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Jurusan</th>
                  <th className="p-3">Asal Sekolah</th>
                  <th className="p-3">Orang Tua</th>
                  <th className="p-3 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/40 text-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                      Tidak ada data pendaftaran yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-200/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#386652]">
                        {item.id}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {item.nisn}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {item.namaLengkap}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {item.jenisKelamin}, {item.noHp}
                        </span>
                      </td>
                      <td className="p-3 font-bold">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold ${
                          item.jurusan === 'RPL' ? 'bg-[#386652]/15 text-[#386652]' :
                          item.jurusan === 'AKL' ? 'bg-[#d4af37]/20 text-[#b8860b]' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.jurusan}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{item.asalSekolah}</td>
                      <td className="p-3">
                        <span className="font-semibold block">{item.namaOrangTua}</span>
                        <span className="text-[10px] text-slate-500">{item.noHpOrangTua}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Cetak PDF */}
                          <button
                            onClick={() => generateRegistrationPDF(item)}
                            className="neu-btn p-1.5 text-[#386652] hover:text-[#2d5a46]"
                            title="Unduh PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingItem(item)}
                            className="neu-btn p-1.5 text-[#b8860b] hover:text-[#966d09]"
                            title="Edit Data (Update)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.id, item.namaLengkap)}
                            className="neu-btn p-1.5 text-red-600 hover:text-red-800"
                            title="Hapus Data (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Footer Summary */}
        <div className="p-4 border-t border-slate-300/50 flex items-center justify-between text-xs text-slate-500">
          <span>Total pendaftar terdaftar: <strong className="text-slate-800">{registrations.length} siswa</strong></span>
          <span className="text-[#386652] font-bold">Backend API MySQL / JSON Active</span>
        </div>

      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-card bg-[#e5ece8] p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Edit Data Pendaftar ({editingItem.id})</h3>
              <button onClick={() => setEditingItem(null)} className="neu-btn p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700">NISN (Unik):</label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={editingItem.nisn}
                  onChange={(e) => setEditingItem({ ...editingItem, nisn: e.target.value })}
                  className="neu-input w-full p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={editingItem.namaLengkap}
                  onChange={(e) => setEditingItem({ ...editingItem, namaLengkap: e.target.value })}
                  className="neu-input w-full p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700">Jurusan:</label>
                  <select
                    value={editingItem.jurusan}
                    onChange={(e: any) => setEditingItem({ ...editingItem, jurusan: e.target.value })}
                    className="neu-input w-full p-2 bg-[#e5ece8]"
                  >
                    <option value="RPL">RPL</option>
                    <option value="AKL">AKL</option>
                    <option value="TSM">TSM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Asal Sekolah:</label>
                  <input
                    type="text"
                    required
                    value={editingItem.asalSekolah}
                    onChange={(e) => setEditingItem({ ...editingItem, asalSekolah: e.target.value })}
                    className="neu-input w-full p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Nama Orang Tua:</label>
                <input
                  type="text"
                  required
                  value={editingItem.namaOrangTua}
                  onChange={(e) => setEditingItem({ ...editingItem, namaOrangTua: e.target.value })}
                  className="neu-input w-full p-2"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingItem(null)} className="neu-btn px-4 py-2">
                  Batal
                </button>
                <button type="submit" disabled={busy} className="neu-btn-primary px-4 py-2 font-bold">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW MODAL */}
      {isAddingNew && (
        <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-card bg-[#e5ece8] p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Tambah Pendaftar Baru (CRUD Create)</h3>
              <button onClick={() => setIsAddingNew(false)} className="neu-btn p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700">NISN (10 Digit Unik):</label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="0059988771"
                  value={newFormData.nisn}
                  onChange={(e) => setNewFormData({ ...newFormData, nisn: e.target.value })}
                  className="neu-input w-full p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Siswa"
                  value={newFormData.namaLengkap}
                  onChange={(e) => setNewFormData({ ...newFormData, namaLengkap: e.target.value })}
                  className="neu-input w-full p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700">Jurusan:</label>
                  <select
                    value={newFormData.jurusan}
                    onChange={(e: any) => setNewFormData({ ...newFormData, jurusan: e.target.value })}
                    className="neu-input w-full p-2 bg-[#e5ece8]"
                  >
                    <option value="RPL">RPL</option>
                    <option value="AKL">AKL</option>
                    <option value="TSM">TSM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Asal Sekolah:</label>
                  <input
                    type="text"
                    required
                    placeholder="SMPN ..."
                    value={newFormData.asalSekolah}
                    onChange={(e) => setNewFormData({ ...newFormData, asalSekolah: e.target.value })}
                    className="neu-input w-full p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Nama Orang Tua:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Orang Tua"
                  value={newFormData.namaOrangTua}
                  onChange={(e) => setNewFormData({ ...newFormData, namaOrangTua: e.target.value })}
                  className="neu-input w-full p-2"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsAddingNew(false)} className="neu-btn px-4 py-2">
                  Batal
                </button>
                <button type="submit" disabled={busy} className="neu-btn-primary px-4 py-2 font-bold">
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
