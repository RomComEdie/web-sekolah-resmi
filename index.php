<?php 
require_once 'config/koneksi.php';
require_once 'config/koneksi.php'; 

$msg_ppdb = '';
$file_pdf_path = 'assets/pdf/wedding-dress-mari-v0-otfqzrgv8c9b1.pdf'; // Pastikan nama file PDF di folder assets sesuai!

$get_status = mysqli_query($koneksi, "SELECT nilai FROM pengaturans WHERE nama_pengaturan = 'status_ppdb'");
$res_status = mysqli_fetch_assoc($get_status);
$is_ppdb_open = ($res_status['nilai'] ?? '1') == '1';

// 1. PROSES FORM PENDAFTARAN UTAMA
if (isset($_POST['submit_ppdb'])) {
    $nama         = trim($_POST['nama_lengkap']);
    $nisn         = trim($_POST['nisn']);
    $asal_sekolah = trim($_POST['asal_sekolah']);
    $no_wa        = trim($_POST['no_wa']);
    $email        = trim($_POST['email']);

    // Cek apakah NISN sudah terdaftar
    $cek = mysqli_query($koneksi, "SELECT id FROM pendaftaran WHERE nisn = '$nisn'");
    
    if (mysqli_num_rows($cek) == 0) {
        // Jika NISN BELUM ADA -> Simpan Baru
        $stmt = mysqli_prepare($koneksi, "INSERT INTO pendaftaran (nisn, nama_lengkap, asal_sekolah, no_wa, email) VALUES (?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "sssss", $nisn, $nama, $asal_sekolah, $no_wa, $email);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
    // Langsung Redirect ke File PDF untuk di-download (Baik pendaftar baru / NISN sudah ada)
    if (file_exists($file_pdf_path)) {
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="Formulir_Pendaftaran_PPDB.pdf"');
        readfile($file_pdf_path);
        echo "duplikat jir";
        exit();
    } else {
        $msg_ppdb = 'Data berhasil diperbarui, namun file PDF formulir belum diunggah di server.';
    }
}

// 2. PROSES CEK STATUS / DOWNLOAD ULANG
if (isset($_POST['cek_ppdb'])) {
    $keyword = trim($_POST['keyword_cek']);
    $cek = mysqli_query($koneksi, "SELECT id FROM pendaftaran WHERE nisn = '$keyword' OR no_wa = '$keyword'");

    if (mysqli_num_rows($cek) > 0) {
        if (file_exists($file_pdf_path)) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="Formulir_Pendaftaran_PPDB.pdf"');
            readfile($file_pdf_path);
            exit();
        } else {
            $msg_ppdb = 'Data ditemukan, namun file PDF formulir belum tersedia di server.';
        }
    } else {
        $msg_ppdb = 'Data pendaftaran tidak ditemukan! Silakan isi formulir di sebelah kiri.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SMK Bhinneka Nusantara — Kejuruan Unggulan Vokasi</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="css/ppdb.css">
</head>
<body>

<div class="topbar">
  <div class="wrap">
    <div class="topbar-left">
      <span>&#9742; (022) 7890-4321</span>
      <span>&#9993; WA: 0812-3456-7890</span>
      <span>&#128205; Kota Sejahtera, Jawa Barat</span>
    </div>
    <div class="badge-akreditasi">&#127963; Akreditasi A (Unggul)</div>
  </div>
</div>

<header class="site-nav">
  <div class="nav-inner wrap" style="padding-left:0;padding-right:0;">
      <a href="#beranda" class="logo">
        <!-- Ganti div logo-mark dengan tag img -->
        <img src="assets/images/logo.png" alt="Logo SMK Bhinneka Nusantara" class="logo-img">
        <div class="logo-text">
          <div class="name">SMK BHINNEKA NUSANTARA</div>
          <div class="tag">Kejuruan Unggulan Vokasi</div>
        </div>
      </a>

    <nav class="main-links">
      <a href="#beranda" class="active">Beranda</a>
      <a href="#profil">Profil</a>
      <div class="dropdown">
        <a href="#jurusan">Jurusan <span class="count-pill">3 MAJOR</span></a>
        <div class="dropdown-panel">
          <a href="#jurusan"><strong>Rekayasa Perangkat Lunak</strong>Software &amp; Web App</a>
          <a href="#jurusan"><strong>Akuntansi Keuangan Lembaga</strong>Financial &amp; Banking</a>
          <a href="#jurusan"><strong>Teknik Sepeda Motor</strong>Injeksi &amp; Diagnostic</a>
          
        </div>
      </div>
      <a href="#berita">Berita</a>
      <a href="#ekskul">Ekskul</a>
      <a href="#faq">FAQ</a>
      <a href="#kontak">Kontak</a>
      <a href="#ppdb">PPDB</a>
    </nav>

    <div class="nav-cta">
      <a href="#kontak" class="btn btn-dark" style="display:none" id="dummy"></a>
      <!-- <a href="tel:+62227890432" class="btn btn-dark">&#9742; Hubungi Kami</a> -->
      <button class="burger" id="burgerBtn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <nav id="mobileMenu" style="display:none;flex-direction:column;padding:8px 20px 20px;gap:2px;border-top:1px solid rgba(18,36,28,0.08);">
    <a href="#beranda" style="padding:12px 6px;font-weight:600;">Beranda</a>
    <a href="#profil" style="padding:12px 6px;font-weight:600;">Profil</a>
    <a href="#jurusan" style="padding:12px 6px;font-weight:600;">Jurusan</a>
    <a href="#berita" style="padding:12px 6px;font-weight:600;">Berita</a>
    <a href="#ekskul" style="padding:12px 6px;font-weight:600;">Ekskul</a>
    <a href="#faq" style="padding:12px 6px;font-weight:600;">FAQ</a>
    <a href="#kontak" style="padding:12px 6px;font-weight:600;">Kontak</a>
    <a href="#ppdb" style="padding:12px 6px;font-weight:600;">PPDB</a>
  </nav>
</header>

<!-- ===== HERO ===== -->
<section id="beranda" class="hero" style="padding-top:64px;">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <h1>Mencetak Generasi <em>Unggul</em>, Terampil &amp; Siap Kerja</h1>
        <br>
        
        <p class="hero-desc" style="padding-top:10px;">
          Selamat datang di Website <b>SMK Bhinneka Nusantara</b>. Fasilitas pembelajaran modern berbasis industri dengan 3 program keahlian favorit: <span class="hl">Rekayasa Perangkat Lunak (RPL)</span>, <span class="hl">Akuntansi Keuangan Lembaga (AKL)</span>, dan <span class="hl">Teknik Sepeda Motor (TSM)</span>.
        </p>
        <br>
        <div class="hero-badge">
          <span class="dot"></span> Sekolah Kejuruan Terakreditasi A (Unggul)
          <span style="opacity:.5">&bull;</span> Tahun Ajaran 2026/2027
          <!-- <span class="pill-tutup">PPDB DIBUKA</span> -->
        </div>
        <ul class="hero-checks">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 96.4% Lulusan Kerja/Kuliah</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Lab Industry Standard</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 10+ Mitra Kerja DUDI</li>
        </ul>
        <div class="hero-actions">
          <a href="#profil" class="btn btn-gold">Lihat Profil Sekolah &nbsp;&rarr;</a>
          <a href="#jurusan" class="btn btn-outline">&#128214; Lihat Jurusan</a>
          <!-- <a href="#kontak" class="link-more">Daftar Kurikulum &amp; Jadwal &rarr;</a> -->
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-photo">
          <img src="assets/images/img.jpeg" alt="Suasana belajar siswa SMK Bhinneka Nusantara">
          <div class="caption">
            <div class="eyebrow">Lingkungan Belajar Asri &amp; Modern</div>
            <strong>SMK Bhinneka Nusantara Kota Sejahtera</strong>
          </div>
        </div>
        <div class="float-card fc-1">
          <div class="icon">&lt;/&gt;</div>
          <div><strong>Rekayasa perangkat lunak (RPL)</strong><span>Software &amp; Web App</span></div>
        </div>
        <div class="float-card fc-2">
          <div class="icon">&#127974;</div>
          <div><strong>Akutansi (AKL)</strong><span>Akutansi &amp; Keuangan</span></div>
        </div>
        <div class="float-card fc-3">
          <div class="icon">&#128295;</div>
          <div><strong>Teknik Sepeda Motor (TSM)</strong><span>Karbu &amp; Diagnostic</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== STATS ===== -->
<div class="stats">
  <div class="wrap">
    <div class="stat-item"><div class="num">100+</div><div class="label">Siswa Aktif</div></div>
    <div class="stat-item"><div class="num">10+</div><div class="label">Guru &amp; Staf Pengajar</div></div>
    <div class="stat-item"><div class="num">8+</div><div class="label">Mitra Industri DUDI</div></div>
    <div class="stat-item"><div class="num">96.4%</div><div class="label">Tingkat &amp; Kelulusan</div></div>
  </div>
</div>


<!-- ===== PROFIL ===== -->
<section id="profil">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Tentang Kami</span>
      <h2>Profil SMK Bhinneka Nusantara</h2>
      <p>Berdiri sejak 2017, kami berkomitmen menghadirkan pendidikan vokasi yang relevan dengan kebutuhan dunia usaha dan dunia industri (DUDI), dibimbing oleh tenaga pengajar bersertifikasi dan fasilitas laboratorium setara standar industri.</p>
    </div>
    <div class="profil-grid">
      <div class="profil-img">
        <img src="assets/images/smk.jpeg" alt="Gedung dan siswa SMK Bhinneka Nusantara">
      </div>
      <div class="vm-cards">
        <div class="vm-card">
          <div class="num">01</div>
          <div>
            <h4>Visi Sekolah</h4>
            <p>Terwujudnya lulusan yang cerdas,kompeten, terampil</p>
          </div>
        </div>
        <div class="vm-card">
          <div class="num">02</div>
          <div>
            <!-- kerjaan ipul kicau -->
            <h4>Misi Sekolah</h4>
            <p>Menyiapkan siswa menjadi tenaga kerja yang terampil dan kompeten di dunia industri.</p>
            <!-- <p>2.menyiapkan siswa untuk tenaga kerja sendiri dan dan berjiwa kewirausahaan.</p>
            <p>3.membina dan mencerdaskan siswa yang menuju.</p> -->
          </div>
        </div>
        <div class="vm-card">
          <div class="num">03</div>
          <div>
            <h4>Fasilitas Unggulan</h4>
            <p>Laboratorium komputer &amp; jaringan, Bank Mini praktik perbankan, bengkel sepeda motor injeksi, perpustakaan digital, serta ruang praktik simulasi kerja industri.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Stuktur Organisasi Sekolah -->
 <section class="struktur" id="">
  <div class="wrap">
    <div class="head-profil"></div>
  </div>
 </section>

<!-- ===== JURUSAN ===== -->
<section id="jurusan" class="jurusan-section">
  <div class="wrap">
    <div class="section-head on-dark">
      <span class="eyebrow">Program Keahlian</span>
      <h2>3 Jurusan &amp; Utama</h2>
      <p>Beragam program keahlian dirancang untuk membekali siswa dengan keterampilan sesuai bidang yang diminati dan kebutuhan dunia kerja.</p>
    </div>
    <div class="jurusan-grid">
      <div class="jur-card">
        <div class="jur-icon">&lt;/&gt;</div>
        <div>
          <div class="jur-sub">RPL</div>
          <h3>Rekayasa Perangkat Lunak</h3>
        </div>
        <p>Membekali siswa dengan kemampuan pemrograman web, mobile, dan basis data melalui praktik proyek nyata bersama startup mitra.</p>
        <div class="jur-tags"><span>Web Dev</span><span>Mobile App</span><span>Database</span><span>UI/UX</span></div>
        <a href="#kontak" class="jur-link">Info Kegiatan &rarr;</a>
      </div>
      <div class="jur-card">
        <div class="jur-icon">&#127974;</div>
        <div>
          <div class="jur-sub">AKL</div>
          <h3>Akuntansi Keuangan Lembaga</h3>
        </div>
        <p>Praktik langsung di Bank Mini sekolah, membekali siswa dengan kompetensi akuntansi, perpajakan, dan layanan perbankan dasar.</p>
        <div class="jur-tags"><span>Akuntansi</span><span>Perbankan</span><span>Perpajakan</span><span>Bank Mini</span></div>
        <a href="#kontak" class="jur-link">Info Kegiatan &rarr;</a>
      </div>
      <div class="jur-card">
        <div class="jur-icon">&#128295;</div>
        <div>
          <div class="jur-sub">TSM</div>
          <h3>Teknik Sepeda Motor</h3>
        </div>
        <p>Praktik perawatan &amp; perbaikan sepeda motor konvensional hingga sistem injeksi modern di bengkel berstandar industri.</p>
        <div class="jur-tags"><span>Injeksi</span><span>Diagnostic</span><span>Chasis</span><span>Kelistrikan</span></div>
        <a href="#kontak" class="jur-link">Info Kegiatan &rarr;</a>
      </div>
    </div>
  </div>
</section>

<!-- ===== BERITA ===== -->
<section id="berita">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Kabar Sekolah</span>
      <h2>Berita &amp; Kegiatan Terbaru</h2>
      <p>Informasi terkini seputar prestasi siswa, kegiatan sekolah.</p>
    </div>

    <div class="berita-grid">
      <?php
      // 1. Ambil maksimal 6 berita terbaru (diurutkan dari yang paling baru)
      $berita_db = mysqli_query($koneksi, "SELECT * FROM berita ORDER BY id DESC LIMIT 6");

      // 2. Cek apakah ada berita di database
      if (mysqli_num_rows($berita_db) > 0) :
        while ($b = mysqli_fetch_assoc($berita_db)) :
          // Format tanggal MySQL (YYYY-MM-DD) ke bentuk readable (ex: 12 Jul 2026)
          $tgl = date('d M Y', strtotime($b['tanggal']));
      ?>
          <div class="berita-card">
            <div class="berita-thumb">
              <img src="<?= htmlspecialchars($b['gambar']) ?>" alt="<?= htmlspecialchars($b['judul']) ?>">
            </div>
            <div class="berita-body">
              <span class="berita-tag"><?= htmlspecialchars($b['kategori']) ?></span>
              <h4><?= htmlspecialchars($b['judul']) ?></h4>
              <p><?= htmlspecialchars($b['deskripsi']) ?></p>
              <div class="berita-meta"><?= $tgl ?> &middot; <?= htmlspecialchars($b['penulis']) ?></div>
            </div>
          </div>
      <?php 
        endwhile;
      else :
      ?>
        <!-- Tampilan opsional jika tidak ada berita di database -->
        <p style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px 0;">
          Belum ada berita atau kegiatan terbaru.
        </p>
      <?php endif; ?>
    </div>
  </div>
</section>


<!-- ===== EKSKUL ===== -->
<section id="ekskul">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Pengembangan Diri</span>
      <h2>Ekstrakurikuler Pilihan</h2>
      <p>Ruang bagi siswa untuk mengembangkan minat, bakat, dan karakter di luar jam pelajaran.</p>
    </div>
    
    <div class="ekskul-grid">
      <?php
      // 1. Ambil data ekskul dari database MySQL
      $ekskul_db = mysqli_query($koneksi, "SELECT * FROM ekskul ORDER BY id DESC");
      
      // 2. Jika ada datanya, cetak elemen .eks-card secara berulang
      if (mysqli_num_rows($ekskul_db) > 0) :
        while ($e = mysqli_fetch_assoc($ekskul_db)) :
      ?>
          <div class="eks-card">
            <!-- PERBAIKAN DI SINI -->
            <div class="eks-icon">
                <i class="fa-solid <?= htmlspecialchars($e['ikon']) ?>"></i>
            </div>
            <h4><?= htmlspecialchars($e['nama']) ?></h4>
            <p><?= htmlspecialchars($e['deskripsi']) ?></p>
          </div>
      <?php 
        endwhile;
      else :
      ?>
        <!-- Tampilan opsional jika database ekskul masih kosong -->
        <p style="grid-column: 1/-1; text-align: center; color: #666;">
          Belum ada data ekstrakurikuler yang ditambahkan.
        </p>
      <?php endif; ?>
    </div>
  </div>
</section>


<!-- ===== FAQ ===== -->
<section id="faq">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Pertanyaan Umum</span>
      <h2>Frequently Asked Questions</h2>
    </div>
    <div class="faq-wrap">
      <div class="faq-item open">
        <button class="faq-q">Bagaimana alur pendaftaran siswa baru? <span class="plus">+</span></button>
        <div class="faq-a"><p>Pendaftaran dilakukan secara daring melalui portal PPDB sekolah, dilanjutkan dengan verifikasi berkas, tes minat &amp; bakat, serta wawancara orang tua/wali sebelum pengumuman kelulusan.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Apa saja jurusan yang tersedia? <span class="plus">+</span></button>
        <div class="faq-a"><p>Saat ini tersedia 3 program keahlian: Rekayasa Perangkat Lunak (RPL), Akuntansi Keuangan Lembaga (AKL), dan Teknik Sepeda Motor (TSM), masing-masing dengan fasilitas praktik industri.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Apakah sekolah membantu penyaluran kerja? <span class="plus">+</span></button>
        <div class="faq-a"><p>Ya, kami memiliki Bursa Kerja Khusus (BKK) yang bekerja sama dengan 48+ mitra industri untuk penyaluran magang dan kerja bagi lulusan.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Bagaimana cara menghubungi bagian kesiswaan? <span class="plus">+</span></button>
        <div class="faq-a"><p>Anda dapat menghubungi kami melalui telepon, WhatsApp, atau datang langsung ke sekolah pada jam kerja yang tertera pada bagian kontak.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ===== SECTION PPDB FORM ===== -->
 
<!-- ===== SECTION PPDB ===== -->
<section id="ppdb" class="ppdb-section">
  <div class="wrap">
    
    <?php
    // 1. Cek Status PPDB dari Database (1 = Buka, 0 = Tutup)
    // Silakan sesuaikan variabel $koneksi dengan nama koneksi database-mu
    $q_status = mysqli_query($koneksi, "SELECT nilai FROM pengaturans WHERE nama_pengaturan = 'status_ppdb'");
    $d_status = mysqli_fetch_assoc($q_status);
    $is_ppdb_open = ($d_status['nilai'] ?? '1') == '1'; 
    ?>

    <?php if ($is_ppdb_open) : ?>
      <!-- 🟢 JIKA PPDB DIBUKA (TAMPILKAN FORM LENGKAP) -->

      <?php if(!empty($msg_ppdb)): ?>
        <div class="ppdb-alert">
          <?= htmlspecialchars($msg_ppdb) ?>
        </div>
      <?php endif; ?>

      <div class="ppdb-grid">
        
        <!-- FORM KIRI: Pendaftaran Utama -->
        <div class="ppdb-card-main">
          <h3>
            <i class="fa-solid fa-user-plus"></i> FORMULIR PENDAFTARAN SISWA BARU
          </h3>

          <form method="POST">
            <div class="ppdb-form-group">
              <label>Nama Lengkap Calon Siswa <span style="color:red">*</span></label>
              <input type="text" name="nama_lengkap" placeholder="Contoh: Muhammad Rizky Pratama" required>
            </div>

            <div class="ppdb-form-row">
              <div>
                <label>NISN Siswa <span style="color:red">*</span></label>
                <input type="number" name="nisn" placeholder="10 digit NISN (Contoh: 0001234567)" required>
              </div>
              <div>
                <label>Asal Sekolah (SMP / MTs) <span style="color:red">*</span></label>
                <input type="text" name="asal_sekolah" placeholder="Contoh: SMP Negeri 1 Kota Sejahtera" required>
              </div>
            </div>

            <div class="ppdb-form-row">
              <div>
                <label>Nomor WhatsApp / HP Aktif <span style="color:red">*</span></label>
                <input type="text" name="no_wa" placeholder="Contoh: 081234567890" required>
              </div>
              <div>
                <label>Alamat Email Aktif <span style="color:gray">(Opsional)</span></label>
                <input type="email" name="email" placeholder="Contoh: siswa@gmail.com">
              </div>
            </div>

            <button type="submit" name="submit_ppdb" class="ppdb-btn-submit">
              <i class="fa-solid fa-file-arrow-down"></i> Kirim Pendaftaran PPDB &amp; Unduh Formulir
            </button>
          </form>
        </div>

        <!-- KANAN: Foto, Cek Status & Alur -->
        <div class="ppdb-sidebar">
          
          
          <!-- Box Cek Status -->
          <div class="ppdb-card-cek">
            <span class="ppdb-badge-sub">
              <i class="fa-solid fa-magnifying-glass"></i> Cek Status Pendaftaran
            </span>
            <h4>Sudah Pernah Mendaftar?</h4>
            <p>
              Masukkan NISN atau Nomor WA pendaftar untuk mengunduh ulang formulir pendaftaran.
            </p>
            <form method="POST">
              <input type="text" name="keyword_cek" placeholder="NISN / No. WA..." required class="ppdb-input-dark">
              <button type="submit" name="cek_ppdb" class="ppdb-btn-cek">
                Cari Data Pendaftaran
              </button>
            </form>
          </div>

          <!-- Box Informatif Alur -->
          <div class="ppdb-card-info">
            <!-- Box Foto Gedung -->
            <div class="ppdb-card-gedung">
              <div class="ppdb-gedung-thumb">
                <img src="assets/images/smk.jpeg" alt="Gedung Pendaftaran PPDB">
                <span class="ppdb-gedung-badge">
                  Gedung Pendaftaran PPDB
                </span>
              </div>
            </div>
            <h5>
              <i class="fa-solid fa-circle-info" style="color: #b87333;"></i> ALUR SETELAH MENDAFTAR
            </h5>
            <ol class="ppdb-list-alur">
              <li>Unduh &amp; Cetak <b>Formulir Pendaftaran PDF</b>.</li>
              <li>Siapkan berkas FC Ijazah/SKL, Kartu Keluarga, dan Pas Foto 3x4.</li>
              <li>Datang ke sekretariat PPDB SMK Bhinneka Nusantara untuk verifikasi fisik &amp; pengambilan seragam.</li>
            </ol>
          </div>

        </div>

      </div>

    <?php else : ?>
      <!-- 🔴 JIKA PPDB DITUTUP OLEH ADMIN (TAMPILKAN BANNER PEMBERITAHUAN) -->
      <div style="text-align: center; background: #ffffff; padding: 60px 20px; border-radius: 24px; border: 1px solid rgba(14,56,43,0.1); max-width: 700px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="font-size: 50px; color: #b87333; margin-bottom: 15px;">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h2 style="color: #0e382b; margin-bottom: 12px; font-family: 'Fraunces', serif;">Pendaftaran PPDB Ditutup</h2>
        <p style="color: #4a5d52; font-size: 15px; line-height: 1.6; max-width: 520px; margin: 0 auto 24px;">
          Saat ini pendaftaran Peserta Didik Baru SMK Bhinneka Nusantara belum dibuka atau telah berakhir. Silakan pantau informasi resmi atau hubungi panitia kami.
        </p>
        <a href="#kontak" class="ppdb-btn-submit" style="display: inline-flex; width: auto; text-decoration: none; padding: 12px 24px;">
          <i class="fa-solid fa-phone"></i> Hubungi Panitia PPDB
        </a>
      </div>
    <?php endif; ?>

  </div>
</section>

<!-- ===== KONTAK ===== -->
<section id="kontak" class="kontak-section">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Hubungi Kami</span>
      <h2>Kunjungi &amp; Hubungi Sekolah Kami</h2>
      <p>Cari lokasi sekolah langsung di peta di bawah — ketik alamat lain untuk mengarahkan peta sesuai kebutuhan Anda.</p>
    </div>

    <div class="kontak-grid">
      <div class="kontak-info">
        <h3>SMK Bhinneka Nusantara</h3>
        <p>Kami siap membantu menjawab pertanyaan seputar pendaftaran, kurikulum, maupun kunjungan sekolah.</p>
        <ul class="kontak-list">
          <li>
            <div class="ic">&#128205;</div>
            <div><strong>Alamat</strong><span>Jl. Kemang Pulo No.63, RT.005/RW.009, Jatibening Baru, Kec. Pd. Gede, Kota Bks, Jawa Barat 17421, RT.005/RW.009, Jatibening Baru, Kec. Pd. Gede, Kota Bks, Jawa Barat 17512</span></div>
          </li>
          <li>
            <div class="ic">&#9742;</div>
            <div><strong>Telepon</strong><span>(022) 7890-4321</span></div>
          </li>
          <li>
            <div class="ic">&#128172;</div>
            <div><strong>WhatsApp</strong><span>0812-3456-7890</span></div>
          </li>
          <li>
            <div class="ic">&#9993;</div>
            <div><strong>Email</strong><span>info@smkbhinnekanusantara.sch.id</span></div>
          </li>
          <li>
            <div class="ic">&#128337;</div>
            <div><strong>Jam Layanan</strong><span>Senin — Jumat, 07.00 — 15.30 WIB</span></div>
          </li>
        </ul>
        <div class="kontak-social">
          <a href="#"> <i class="fab fa-facebook"></i> </a>
          <a href="#"> <i class="fab fa-instagram"></i> </a>
          <a href="#"> <i class="fab fa-github"></i> </a>
        </div>
      </div>

      <div class="kontak-map">
        <div class="map-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input id="mapAddressInput" type="text" placeholder="Ketik alamat sekolah, cth: Jl. Pendidikan Raya No. 45, Kota Sejahtera">
          <button id="mapUpdateBtn">Arahkan Peta</button>
        </div>
        <iframe id="schoolMap" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.960325119178!2d106.93139840874544!3d-6.268948393693554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d701018c34d%3A0x25cf57d09e074361!2sSMK%20BINUS!5e0!3m2!1sid!2sid!4v1786431031223!5m2!1sid!2sid">
        </iframe>
        <div class="map-hint">&#128205; Ketik alamat lalu klik "Arahkan Peta" untuk memperbarui lokasi</div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">
          <div class="logo-mark">B</div>
          <div class="logo-text">
            <div class="name" style="color:var(--cream);">SMK BHINNEKA NUSANTARA</div>
          </div>
        </div>
        <p>Sekolah kejuruan terakreditasi A (Unggul) yang mencetak generasi kompeten, terampil, dan siap kerja sejak 1998.</p>
      </div>
      <div class="footer-col">
        <h5>Navigasi</h5>
        <ul>
          <li><a href="#beranda">Beranda</a></li>
          <li><a href="#profil">Profil</a></li>
          <li><a href="#jurusan">Jurusan</a></li>
          <li><a href="#berita">Berita</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Program</h5>
        <ul>
          <li><a href="#jurusan">Rekayasa Perangkat Lunak</a></li>
          <li><a href="#jurusan">Akuntansi Keuangan Lembaga</a></li>
          <li><a href="#jurusan">Teknik Sepeda Motor</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Kontak</h5>
        <ul>
          <li><a href="tel:+62227890432">(022) 7890-4321</a></li>
          <li><a href="#">WA: 0812-3456-7890</a></li>
          <li><a href="#kontak">Lihat Peta Lokasi</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 SMK Bhinneka Nusantara. Seluruh hak cipta dilindungi.</span>
      <span>Kota Sejahtera, Jawa Barat, Indonesia</span>
    </div>
  </div>
</footer>

<script src="script.js"></script>

</body>
</html>
