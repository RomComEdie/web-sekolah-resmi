<?php
require_once 'config/koneksi.php';

$msg_ppdb = '';
$msg_type = ''; 
$trigger_download = false; // Flag untuk otomatis download PDF
$file_pdf_path = 'assets/pdf/wedding-dress-mari-v0-otfqzrgv8c9b1.pdf'; 

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
  $stmt_cek = mysqli_prepare($koneksi, "SELECT id FROM pendaftaran WHERE nisn = ?");
  mysqli_stmt_bind_param($stmt_cek, "s", $nisn);
  mysqli_stmt_execute($stmt_cek);
  $res_cek = mysqli_stmt_get_result($stmt_cek);

  if (mysqli_num_rows($res_cek) == 0) {
    // Jika NISN BELUM ADA -> Simpan Data Baru
    $stmt = mysqli_prepare($koneksi, "INSERT INTO pendaftaran (nisn, nama_lengkap, asal_sekolah, no_wa, email) VALUES (?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "sssss", $nisn, $nama, $asal_sekolah, $no_wa, $email);
    
    if (mysqli_stmt_execute($stmt)) {
      $msg_ppdb = 'Data pendaftaran berhasil dikirim! Formulir PDF kamu sedang diunduh secara otomatis.';
      $msg_type = 'success';
      $trigger_download = true;
    } else {
      $msg_ppdb = 'Gagal menyimpan data! Silakan coba lagi.';
      $msg_type = 'danger';
    }
    mysqli_stmt_close($stmt);
  } else {
    // Jika NISN SUDAH ADA / DUPLIKAT
    $msg_ppdb = 'Data pendaftaran sudah ada! (NISN ' . htmlspecialchars($nisn) . ' telah terdaftar). Silakan unduh formulir di bawah.';
    $msg_type = 'warning';
    $trigger_download = true;
  }
  mysqli_stmt_close($stmt_cek);
}

// 2. PROSES CEK STATUS / DOWNLOAD ULANG
if (isset($_POST['cek_ppdb'])) {
  $keyword = trim($_POST['keyword_cek']);
  
  $stmt_cek = mysqli_prepare($koneksi, "SELECT id FROM pendaftaran WHERE nisn = ? OR no_wa = ?");
  mysqli_stmt_bind_param($stmt_cek, "ss", $keyword, $keyword);
  mysqli_stmt_execute($stmt_cek);
  $res_cek = mysqli_stmt_get_result($stmt_cek);

  if (mysqli_num_rows($res_cek) > 0) {
    $msg_ppdb = 'Data pendaftaran ditemukan! PDF Formulir otomatis diunduh.';
    $msg_type = 'success';
    $trigger_download = true;
  } else {
    $msg_ppdb = 'Data pendaftaran tidak ditemukan! Silakan isi formulir di sebelah kiri.';
    $msg_type = 'danger';
  }
  mysqli_stmt_close($stmt_cek);
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
  <link rel="icon" type="image/x-icon" href="assets/images/fa-smk.png">
</head>

<body>

  <div class="topbar">
    <div class="wrap">
      <div class="topbar-left">
        <span>&#9742; (022) 7890-4321</span>
        <span>&#9993; WA: 0812-3456-7890</span>
        <span>&#128205; Kota Bekasi, Jawa Barat</span>
      </div>
      <div class="badge-akreditasi">&#127963; Akreditasi B (Baik Sekali)</div>
    </div>
  </div>

  <header class="site-nav">
    <div class="nav-inner wrap" style="padding-left:0;padding-right:0;">
      <a href="#beranda" class="logo">

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
            Selamat datang di Website <b>SMK Bhinneka Nusantara</b>. Fasilitas pembelajaran modern berbasis industri dengan 3 program keahlian utama: <span class="hl">Rekayasa Perangkat Lunak (RPL)</span>, <span class="hl">Akuntansi Keuangan Lembaga (AKL)</span>, dan <span class="hl">Teknik Sepeda Motor (TSM)</span>.
          </p>
          <br>
          <div class="hero-badge">
            <span class="dot"></span> Sekolah Kejuruan Terakreditasi B (Baik Sekali)
            <span style="opacity:.5">&bull;</span> Tahun Ajaran 2026/2027
            <!-- <span class="pill-tutup">PPDB DIBUKA</span> -->
          </div>
          <ul class="hero-checks">
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg> 96.4% Lulusan Kerja/Kuliah</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg> Lab Industry Standard</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg> 8+ Mitra Kerja</li>
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
              <strong>SMK Bhinneka Nusantara Kota Bekasi</strong>
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
      <div class="stat-item">
        <div class="num">100+</div>
        <div class="label">Siswa Aktif</div>
      </div>
      <div class="stat-item">
        <div class="num">10+</div>
        <div class="label">Guru &amp; Staf Pengajar</div>
      </div>
      <div class="stat-item">
        <div class="num">8+</div>
        <div class="label">Mitra Industri DUDI</div>
      </div>
      <div class="stat-item">
        <div class="num">96.4%</div>
        <div class="label">Tingkat &amp; Kelulusan</div>
      </div>
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
    <div class="profil-grid" id="profilGrid">
  <div class="vm-cards">
    <div class="vm-card">
      <div class="num">01</div>
      <div>
        <h4>Visi Sekolah</h4>
        <p>Terwujudnya lulusan yang cerdas,kompeten, terampil Dan Berakhlaq mulia </p>
      </div>
    </div>
    <div class="vm-card">
      <div class="num">02</div>
      <div>
        <h4>Misi Sekolah</h4>
        <p>Menyiapkan siswa menjadi tenaga kerja yang terampil dan kompeten di dunia industri.</p>
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

  <div class="profil-slider" id="profilSlider">
    <div class="ps-inner">
      <div class="ps-frame-corner tl"></div>
      <div class="ps-frame-corner br"></div>

      <div class="ps-track" id="psTrack">
        <div class="ps-slide is-active" data-pos="0">
          <img src="assets/images/smk.jpeg" alt="Gedung Sekolah">
        </div>
        <div class="ps-slide" data-pos="1">
          <img src="assets/images/c.jpg" alt="Suasana Belajar">
        </div>
        <div class="ps-slide" data-pos="2">
          <img src="assets/images/my.jpg" alt="Laboratorium Sekolah">
        </div>
      </div>

      <div class="ps-scrim"></div>

      <div class="ps-caption">
        <span class="ps-eyebrow" id="psEyebrow">Fasilitas Sekolah</span>
        <h4 id="psTitle">Gedung Sekolah Modern</h4>
        <p id="psDesc">Lingkungan belajar yang asri, nyaman, dan mendukung proses pembelajaran siswa.</p>
      </div>

      <button class="ps-arrow prev" id="psPrev" aria-label="Sebelumnya">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="ps-arrow next" id="psNext" aria-label="Berikutnya">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <div class="ps-dots" id="psProgress">
        <button class="ps-dot is-active" data-index="0" aria-label="Slide 1"></button>
        <button class="ps-dot" data-index="1" aria-label="Slide 2"></button>
        <button class="ps-dot" data-index="2" aria-label="Slide 3"></button>
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
        
        <h2>3 Jurusan yang tersedia</h2>
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
          <div class="faq-a">
            <p>Pendaftaran dilakukan secara daring melalui portal PPDB sekolah, dilanjutkan dengan verifikasi berkas, tes minat &amp; bakat, serta wawancara orang tua/wali sebelum pengumuman kelulusan.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-q">Apa saja jurusan yang tersedia? <span class="plus">+</span></button>
          <div class="faq-a">
            <p>Saat ini tersedia 3 program keahlian: Rekayasa Perangkat Lunak (RPL), Akuntansi Keuangan Lembaga (AKL), dan Teknik Sepeda Motor (TSM), masing-masing dengan fasilitas praktik industri.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-q">Apakah sekolah membantu penyaluran kerja? <span class="plus">+</span></button>
          <div class="faq-a">
            <p>Ya, kami memiliki Bursa Kerja Khusus (BKK) yang bekerja sama dengan 48+ mitra industri untuk penyaluran magang dan kerja bagi lulusan.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-q">Bagaimana cara menghubungi bagian kesiswaan? <span class="plus">+</span></button>
          <div class="faq-a">
            <p>Anda dapat menghubungi kami melalui telepon, WhatsApp, atau datang langsung ke sekolah pada jam kerja yang tertera pada bagian kontak.</p>
          </div>
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
      <?php if (!empty($msg_ppdb)): ?>
        <div class="ppdb-alert ppdb-alert-<?= $msg_type ?>">
          <i class="fa-solid <?= $msg_type == 'success' ? 'fa-circle-check' : ($msg_type == 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-xmark') ?>"></i>
          <div style="flex: 1;">
            <strong><?= htmlspecialchars($msg_ppdb) ?></strong>
            
            <!-- Tombol Manual Download (Sebagai Cadangan) -->
            <?php if (($msg_type == 'success' || $msg_type == 'warning') && file_exists($file_pdf_path)): ?>
              <div style="margin-top: 8px;">
                <a id="downloadLink" href="<?= $file_pdf_path ?>" download="Formulir_Pendaftaran_PPDB.pdf" class="ppdb-btn-download-alert">
                  <i class="fa-solid fa-file-arrow-down"></i> Klik Jika PDF Tidak Terunduh Otomatis
                </a>
              </div>
            <?php endif; ?>
          </div>
        </div>


      <?php endif; ?>

        <div class="ppdb-grid">

          <!-- FORM KIRI: Pendaftaran Utama -->
          <div class="ppdb-card-main">
            <h3>
              <i class="fa-solid fa-user-plus"></i> FORMULIR PENERIMAAN PESERTA DIDIK BARU
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
                <i class="fa-solid fa-file-arrow-down"></i> Kirim Pendaftaran PPDB
              </button>
            </form>
              <h5>
                <i class="fa-solid fa-circle-info" style="color: #b87333;"></i> ALUR SETELAH MENDAFTAR
              </h5>
              <ol class="ppdb-list-alur">
                <li>Unduh &amp; Cetak <b>Formulir Pendaftaran PDF</b>.</li>
                <li>Siapkan berkas FC Ijazah/SKL, Kartu Keluarga, dan Pas Foto 3x4.</li>
                <li>Datang ke sekretariat PPDB SMK Bhinneka Nusantara untuk verifikasi fisik &amp; pengambilan seragam.</li>
              </ol>
          </div>

          <!-- KANAN: Foto, Cek Status & Alur -->
          <div class="ppdb-sidebar">


            <!-- Box Cek Status -->
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

            </div>
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

  <!-- Alur setelah pendaftaran -->

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alur Setelah Pendaftaran PPDB</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  .ppdb-alur{
    --pa-cream:#f8f6ee;
    --pa-shadow-light:#ffffff;
    --pa-shadow-dark:#dcd6c2;
    --pa-ink:#3c3223;
    --pa-ink-soft:#8a7f6a;
    --pa-accent:#2f6f4f;
    --pa-accent-light:#4f9b73;
    --pa-accent-deep:#1f4d36;
    --pa-gold:#c99a3f;
    --pa-radius:26px;

    box-sizing:border-box;
    background:var(--pa-cream);
    padding:64px 24px 76px;
    border-radius:36px;
    font-family:'Inter', sans-serif;
    color:var(--pa-ink);
  }

  .ppdb-alur *, .ppdb-alur *::before, .ppdb-alur *::after{
    box-sizing:border-box;
  }

  .ppdb-alur .pa-wrap{
    max-width:1240px;
    margin:0 auto;
  }

  .ppdb-alur .pa-head{
    text-align:center;
    margin-bottom:56px;
  }

  .ppdb-alur .pa-eyebrow{
    font-family:'Plus Jakarta Sans', sans-serif;
    font-size:13px;
    font-weight:700;
    letter-spacing:0.18em;
    text-transform:uppercase;
    color:var(--pa-accent-deep);
    display:inline-flex;
    align-items:center;
    gap:10px;
    padding:8px 18px;
    border-radius:999px;
    background:var(--pa-cream);
    box-shadow: 6px 6px 14px var(--pa-shadow-dark), -6px -6px 14px var(--pa-shadow-light);
    margin-bottom:22px;
    opacity:0;
    animation: pa-dropIn .6s ease forwards;
  }

  .ppdb-alur .pa-eyebrow .pa-dot{
    width:7px;height:7px;border-radius:50%;
    background:var(--pa-gold);
    animation: pa-blink 1.8s infinite ease-in-out;
  }

  .ppdb-alur .pa-title{
    font-family:'Plus Jakarta Sans', sans-serif;
    font-weight:800;
    font-size:clamp(28px, 4vw, 42px);
    color:var(--pa-accent-deep);
    margin:0 0 14px;
    letter-spacing:-0.01em;
    opacity:0;
    animation: pa-dropIn .7s ease forwards .08s;
  }

  .ppdb-alur .pa-head p{
    font-size:16px;
    color:var(--pa-ink-soft);
    margin:0;
    opacity:0;
    animation: pa-dropIn .7s ease forwards .16s;
  }

  /* ===== Track ===== */
  .ppdb-alur .pa-track{
    position:relative;
    display:flex;
    align-items:stretch;
    gap:0;
  }

  .ppdb-alur .pa-step{
    flex:1;
    min-width:0;
    display:flex;
    flex-direction:column;
    opacity:0;
    transform:translateY(26px);
  }

  .ppdb-alur .pa-step.pa-in-view{
    animation: pa-riseIn .65s cubic-bezier(.2,.8,.2,1) forwards;
  }

  @keyframes pa-riseIn{
    to{ opacity:1; transform:translateY(0); }
  }
  @keyframes pa-dropIn{
    to{ opacity:1; transform:translateY(0); }
  }
  @keyframes pa-blink{
    0%,100%{ opacity:1; transform:scale(1); }
    50%{ opacity:.35; transform:scale(.8); }
  }

  .ppdb-alur .pa-connector{
    display:flex;
    align-items:center;
    justify-content:center;
    width:44px;
    flex-shrink:0;
    padding-top:110px;
  }

  .ppdb-alur .pa-connector svg{
    width:22px;height:22px;
    color:var(--pa-ink-soft);
    opacity:0;
  }

  .ppdb-alur .pa-connector.pa-in-view svg{
    animation: pa-arrowPulse 1.4s ease forwards;
  }

  @keyframes pa-arrowPulse{
    0%{ opacity:0; transform:translateX(-6px); }
    60%{ opacity:1; transform:translateX(3px); }
    100%{ opacity:1; transform:translateX(0); }
  }

  /* ===== Neumorphism card ===== */
  .ppdb-alur .pa-card{
    position:relative;
    background:var(--pa-cream);
    border-radius:var(--pa-radius);
    padding:34px 22px 32px;
    height:100%;
    text-align:center;
    box-shadow: 9px 9px 20px var(--pa-shadow-dark), -9px -9px 20px var(--pa-shadow-light);
    transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s cubic-bezier(.2,.8,.2,1);
  }

  .ppdb-alur .pa-card:hover{
    transform: translateY(-8px);
    box-shadow: 14px 14px 30px var(--pa-shadow-dark), -14px -14px 30px var(--pa-shadow-light);
  }

  .ppdb-alur .pa-card:hover .pa-icon-shell{
    transform: scale(1.08) rotate(-4deg);
    box-shadow: inset 3px 3px 7px var(--pa-shadow-dark), inset -3px -3px 7px var(--pa-shadow-light);
  }

  .ppdb-alur .pa-card:hover .pa-icon-shell svg{
    color:var(--pa-accent-light);
  }

  .ppdb-alur .pa-card:hover .pa-badge-num{
    transform: translateX(-50%) scale(1.12);
    box-shadow: 6px 6px 14px var(--pa-shadow-dark), -4px -4px 10px var(--pa-shadow-light);
  }

  .ppdb-alur .pa-card:hover .pa-card-title{
    color:var(--pa-accent-light);
  }

  .ppdb-alur .pa-badge-num{
    position:absolute;
    top:-16px;
    left:50%;
    transform:translateX(-50%);
    width:34px;height:34px;
    border-radius:50%;
    background:linear-gradient(145deg, var(--pa-accent-light), var(--pa-accent-deep));
    color:#f5fff8;
    font-family:'Plus Jakarta Sans', sans-serif;
    font-weight:700;
    font-size:14px;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow: 4px 4px 10px var(--pa-shadow-dark), -3px -3px 8px var(--pa-shadow-light);
    transition: transform .35s ease, box-shadow .35s ease;
  }

  .ppdb-alur .pa-icon-shell{
    width:78px;height:78px;
    margin:0 auto 20px;
    border-radius:50%;
    background:var(--pa-cream);
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow: inset 5px 5px 10px var(--pa-shadow-dark), inset -5px -5px 10px var(--pa-shadow-light);
    transition: transform .35s ease, box-shadow .35s ease;
  }

  .ppdb-alur .pa-icon-shell svg{
    width:32px;height:32px;
    stroke:var(--pa-accent);
    color:var(--pa-accent);
    transition: color .35s ease;
  }

  .ppdb-alur .pa-card-title{
    font-family:'Plus Jakarta Sans', sans-serif;
    font-size:16px;
    font-weight:700;
    color:var(--pa-accent-deep);
    margin:0 0 10px;
    transition: color .35s ease;
  }

  .ppdb-alur .pa-card p{
    font-size:13px;
    line-height:1.55;
    color:var(--pa-ink-soft);
    margin:0;
    min-height:66px;
  }

  @media (max-width: 980px){
    .ppdb-alur .pa-track{ flex-direction:column; gap:26px; }
    .ppdb-alur .pa-connector{ width:auto; padding-top:0; transform:rotate(90deg); height:22px; }
    .ppdb-alur .pa-card p{ min-height:0; }
  }
</style>
</head>
<body>

<section class="ppdb-alur">
<div class="pa-wrap">

  <div class="pa-head">
    <span class="pa-eyebrow"><span class="pa-dot"></span> Panduan Pendaftar</span>
    <h2 class="pa-title">Alur Setelah Pendaftaran PPDB</h2>
    <p>Ikuti setiap tahap setelah Anda melakukan pendaftaran PPDB di SMK Bhinus Nusantara.</p>
  </div>

  <div class="pa-track" id="pa-track">

    <!-- 1 -->
    <div class="pa-step">
      <div class="pa-card">
        <span class="pa-badge-num">1</span>
        <div class="pa-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>
        </div>
        <h3 class="pa-card-title">Pendaftaran</h3>
        <p>Isi formulir pendaftaran dan upload berkas yang dibutuhkan.</p>
      </div>
    </div>

    <div class="pa-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>

    <!-- 2 -->
    <div class="pa-step">
      <div class="pa-card">
        <span class="pa-badge-num">2</span>
        <div class="pa-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><path d="M9 12h6M9 16h6"/></svg>
        </div>
        <h3 class="pa-card-title">Bukti Pendaftaran</h3>
        <p>Pendaftaran berhasil! Simpan nomor pendaftaran Anda sebagai bukti.</p>
      </div>
    </div>

    <div class="pa-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>

    <!-- 3 -->
    <div class="pa-step">
      <div class="pa-card">
        <span class="pa-badge-num">3</span>
        <div class="pa-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3 class="pa-card-title">Verifikasi Berkas</h3>
        <p>Panitia akan memverifikasi berkas pendaftaran Anda. Pantau status secara berkala.</p>
      </div>
    </div>

    <div class="pa-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>

    <!-- 4 -->
    <div class="pa-step">
      <div class="pa-card">
        <span class="pa-badge-num">4</span>
        <div class="pa-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
        </div>
        <h3 class="pa-card-title">Hasil Seleksi</h3>
        <p>Pengumuman hasil seleksi dapat dilihat melalui menu cek status pendaftaran.</p>
      </div>
    </div>

    <div class="pa-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>

    <!-- 5 -->
    <div class="pa-step">
      <div class="pa-card">
        <span class="pa-badge-num">5</span>
        <div class="pa-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/><path d="m9 21 2 2 4-4"/></svg>
        </div>
        <h3 class="pa-card-title">Daftar Ulang</h3>
        <p>Bagi yang diterima, lakukan daftar ulang sesuai jadwal yang telah ditentukan.</p>
      </div>
    </div>

    <div class="pa-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>

    <!-- 6 -->
    <div class="pa-step">
      <div class="pa-card">
        <span class="pa-badge-num">6</span>
        <div class="pa-icon-shell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>
        </div>
        <h3 class="pa-card-title">Siswa Baru</h3>
        <p>Selamat! Anda resmi menjadi siswa SMK Bhinus Nusantara. Siap belajar dan berprestasi.</p>
      </div>
    </div>

  </div>
</div>
</section>

<script>
  (function(){
    var root = document.querySelector('.ppdb-alur');
    if(!root) return;

    var items = root.querySelectorAll('.pa-step, .pa-connector');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var el = entry.target;
          var order = Array.prototype.indexOf.call(items, el);
          el.style.animationDelay = (order * 90) + 'ms';
          el.classList.add('pa-in-view');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(function(el){ io.observe(el); });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll('.pa-step').forEach(function(s){ s.style.animation = 'none'; s.style.opacity = 1; s.style.transform = 'none'; });
      root.querySelectorAll('.pa-connector svg').forEach(function(s){ s.style.animation = 'none'; s.style.opacity = 1; });
    }
  })();
</script>

</body>
</html>

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
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
            <div class="logo-mark"> <img src="assets/images/logo.png" alt="Logo SMK Bhinneka Nusantara" class="logo-img">
            </div>
            <div class="logo-text">
              <div class="name" style="color:var(--cream);">SMK BHINNEKA NUSANTARA</div>
            </div>
          </div>
          <p>Sekolah kejuruan terakreditasi B (Baik Sekali) yang mencetak generasi kompeten, terampil</p>
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
