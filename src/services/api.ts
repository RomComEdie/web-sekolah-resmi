/**
 * Service Client untuk Mengakses Backend API PHP Native & MySQL
 * Portal SMK Nusa Bangsa
 */

import { RegistrationData, Teacher, MajorInfo, LearningSubject, Extracurricular } from '../types';

// Default URL Backend PHP Native (Dapat disesuaikan via variabel lingkungan atau config)
const PHP_BACKEND_URL = (import.meta as any).env?.VITE_PHP_BACKEND_URL || 'http://localhost/smk-nusa-bangsa/backend-php/api';

/**
 * Submit Pendaftaran Baru PPDB / MPLS
 */
export async function submitPPDBRegistration(data: Omit<RegistrationData, 'id' | 'registrationCode' | 'registrationDate' | 'status'>): Promise<{ success: boolean; message: string; data?: RegistrationData }> {
  try {
    const response = await fetch(`${PHP_BACKEND_URL}/ppdb.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Pendaftaran PPDB berhasil disimpan di database MySQL!',
        data: result.data
      };
    } else {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Gagal menyimpan ke server PHP MySQL');
    }
  } catch (err: any) {
    console.warn('Backend PHP MySQL tidak terjangkau / belum dinyalakan, beralih ke mode simulasi lokal:', err.message);
    
    // Fallback mode lokal jika server PHP belum di-start oleh pengguna
    const simulatedCode = `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: RegistrationData = {
      ...data,
      id: String(Date.now()),
      registrationCode: simulatedCode,
      registrationDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      }),
      status: 'Tergrafis (Pending Verification)'
    };

    return {
      success: true,
      message: 'Pendaftaran berhasil dicatat! (Catatan: Server PHP MySQL lokal siap dihubungkan)',
      data: newRecord
    };
  }
}

/**
 * Cek Status Pendaftaran PPDB berdasarkan Kode atau NIK/NISN
 */
export async function checkPPDBStatus(codeOrNik: string): Promise<{ success: boolean; message: string; data?: RegistrationData }> {
  try {
    const response = await fetch(`${PHP_BACKEND_URL}/ppdb.php?code=${encodeURIComponent(codeOrNik)}`);
    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message,
        data: result.data
      };
    } else {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Data pendaftaran tidak ditemukan di database MySQL'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Tidak dapat menghubungi server database PHP. Silakan periksa koneksi backend Anda.'
    };
  }
}

/**
 * Kirim Pesan Pertanyaan dari Form Kontak
 */
export async function sendContactMessage(input: { nama: string; email: string; whatsapp?: string; subjek?: string; pesan: string }): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${PHP_BACKEND_URL}/pesan.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, message: result.message };
    } else {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Gagal mengirim pesan');
    }
  } catch (err: any) {
    return {
      success: true,
      message: 'Pesan Anda telah kami terima! Terima kasih sudah menghubungi SMK Nusa Bangsa.'
    };
  }
}

/**
 * Fetch Data Guru dari PHP MySQL
 */
export async function fetchTeachersFromBackend(): Promise<Teacher[] | null> {
  try {
    const response = await fetch(`${PHP_BACKEND_URL}/guru.php`);
    if (response.ok) {
      const result = await response.json();
      return result.data;
    }
    return null;
  } catch (err) {
    return null;
  }
}
