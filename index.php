<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'backend/koneksi.php';
// ... sisa kode lainnya

// Ambil 3 berita terbaru dari database
$stmt = $pdo->query("SELECT * FROM berita ORDER BY id DESC LIMIT 6");
$berita_terbaru = $stmt->fetchAll();
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont/tabler-icons.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css">

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
      <div class="logo-mark">B</div>
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
    </nav>

    <div class="nav-cta">
      <a href="#kontak" class="btn btn-dark" style="display:none" id="dummy"></a>
      <a href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT34JJYliOK2TxdiEQ-CjnIccWPqgQyoOrIr12G6Lle5F9Od70OXdtM_H1B&s=10" class="btn btn-dark">&#9742; Hubungi Kami</a>
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
  </nav>
</header>

<!-- ===== HERO ===== -->
<section id="beranda" class="hero" style="padding-top:64px;">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <div class="hero-badge">
          <span class="dot"></span> Sekolah Kejuruan Terakreditasi A (Unggul)
          <span style="opacity:.5">&bull;</span> Tahun Ajaran 2026/2027
          <span class="pill-tutup">PPDB DIBUKA</span>
        </div>
        <h1>Mencetak Generasi <em>Unggul</em>, Terampil &amp; Siap Kerja</h1>
        <p class="hero-desc">
          Selamat datang di portal resmi <b>SMK Bhinneka Nusantara</b>. Fasilitas pembelajaran modern berbasis industri dengan 3 program keahlian favorit: <span class="hl">Rekayasa Perangkat Lunak (RPL)</span>, <span class="hl">Akuntansi Keuangan Lembaga (AKL)</span>, dan <span class="hl">Teknik Sepeda Motor (TSM)</span>.
        </p>
        <ul class="hero-checks">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 96.4% Lulusan Kerja/Kuliah</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Lab Industry Standard</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 48+ Mitra Kerja DUDI</li>
        </ul>
        <div class="hero-actions">
          <a href="#profil" class="btn btn-gold">Lihat Profil Sekolah &nbsp;&rarr;</a>
          <a href="#jurusan" class="btn btn-outline">&#128214; Lihat Jurusan</a>
          <a href="#kontak" class="link-more">Daftar Kurikulum &amp; Jadwal &rarr;</a>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-photo">
          <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80" alt="Suasana belajar siswa SMK Bhinneka Nusantara">
          <div class="caption">
            <div class="eyebrow">Lingkungan Belajar Asri &amp; Modern</div>
            <strong>SMK Bhinneka Nusantara Kota Sejahtera</strong>
          </div>
        </div>
        <div class="float-card fc-1">
          <div class="icon">&lt;/&gt;</div>
          <div><strong>Jurusan RPL</strong><span>Software &amp; Web App</span></div>
        </div>
        <div class="float-card fc-2">
          <div class="icon">&#127974;</div>
          <div><strong>Bank Mini AKL</strong><span>Financial &amp; Banking</span></div>
        </div>
        <div class="float-card fc-3">
          <div class="icon">&#128295;</div>
          <div><strong>Bengkel TSM</strong><span>Injeksi &amp; Diagnostic</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== STATS ===== -->
<div class="stats">
  <div class="wrap">
    <div class="stat-item"><div class="num">1280+</div><div class="label">Siswa Aktif</div></div>
    <div class="stat-item"><div class="num">54+</div><div class="label">Guru &amp; Staf Pengajar</div></div>
    <div class="stat-item"><div class="num">48+</div><div class="label">Mitra Industri DUDI</div></div>
    <div class="stat-item"><div class="num">96.4%</div><div class="label">Terserap Kerja &amp; Kuliah</div></div>
  </div>
</div>

<!-- ===== PROFIL ===== -->
<section id="profil">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Tentang Kami</span>
      <h2>Profil SMK Bhinneka Nusantara</h2>
      <p>Berdiri sejak 1998, kami berkomitmen menghadirkan pendidikan vokasi yang relevan dengan kebutuhan dunia usaha dan dunia industri (DUDI), dibimbing oleh tenaga pengajar bersertifikasi dan fasilitas laboratorium setara standar industri.</p>
    </div>
    <div class="profil-grid">
      <div class="profil-img">
        <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80" alt="Gedung dan siswa SMK Bhinneka Nusantara">
      </div>
      <div class="vm-cards">
        <div class="vm-card">
          <div class="num">01</div>
          <div>
            <h4>Visi Sekolah</h4>
            <p>Menjadi lembaga pendidikan kejuruan unggulan yang menghasilkan lulusan kompeten, berkarakter, dan berdaya saing global pada tahun 2030.</p>
          </div>
        </div>
        <div class="vm-card">
          <div class="num">02</div>
          <div>
            <h4>Misi Sekolah</h4>
            <p>Menyelenggarakan pembelajaran berbasis industri, menjalin kemitraan aktif dengan DUDI, dan membekali siswa dengan sertifikasi kompetensi yang diakui secara nasional.</p>
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

<!-- ===== JURUSAN ===== -->
<section id="jurusan" class="jurusan-section">
  <div class="wrap">
    <div class="section-head on-dark">
      <span class="eyebrow">Program Keahlian</span>
      <h2>3 Jurusan Favorit, Siap Kerja &amp; Kuliah</h2>
      <p>Kurikulum disusun bersama mitra industri agar setiap lulusan menguasai kompetensi yang benar-benar dibutuhkan di lapangan.</p>
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
        <a href="#kontak" class="jur-link">Info pendaftaran &rarr;</a>
      </div>
      <div class="jur-card">
        <div class="jur-icon">&#127974;</div>
        <div>
          <div class="jur-sub">AKL</div>
          <h3>Akuntansi Keuangan Lembaga</h3>
        </div>
        <p>Praktik langsung di Bank Mini sekolah, membekali siswa dengan kompetensi akuntansi, perpajakan, dan layanan perbankan dasar.</p>
        <div class="jur-tags"><span>Akuntansi</span><span>Perbankan</span><span>Perpajakan</span><span>Bank Mini</span></div>
        <a href="#kontak" class="jur-link">Info pendaftaran &rarr;</a>
      </div>
      <div class="jur-card">
        <div class="jur-icon">&#128295;</div>
        <div>
          <div class="jur-sub">TSM</div>
          <h3>Teknik Sepeda Motor</h3>
        </div>
        <p>Praktik perawatan &amp; perbaikan sepeda motor konvensional hingga sistem injeksi modern di bengkel berstandar industri.</p>
        <div class="jur-tags"><span>Injeksi</span><span>Diagnostic</span><span>Chasis</span><span>Kelistrikan</span></div>
        <a href="#kontak" class="jur-link">Info pendaftaran &rarr;</a>
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
      <p>Informasi terkini seputar prestasi siswa, kegiatan sekolah, dan kerja sama industri.</p>
    </div>
    <div class="berita-grid">
      <?php if (!empty($berita_terbaru)): ?>
        <?php foreach ($berita_terbaru as $b): ?>
          <div class="berita-card">
            <div class="berita-thumb">
              <img src="<?= htmlspecialchars($b['gambar']) ?>" alt="<?= htmlspecialchars($b['judul']) ?>">
            </div>
            <div class="berita-body">
              <span class="berita-tag"><?= htmlspecialchars($b['tag']) ?></span>
              <h4><?= htmlspecialchars($b['judul']) ?></h4>
              <p><?= htmlspecialchars($b['ringkasan']) ?></p>
              <div class="berita-meta">
                <?= date('d M Y', strtotime($b['tanggal'])) ?> &middot; <?= htmlspecialchars($b['penulis']) ?>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      <?php else: ?>
        <p>Belum ada berita terbaru.</p>
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
      <div class="eks-card"><div class="eks-icon">&#9917;</div><h4>Futsal &amp; Sepak Bola</h4><p>Latihan rutin dan kompetisi antar sekolah tingkat kabupaten.</p></div>
      <div class="eks-card"><div class="eks-icon">&#127911;</div><h4>Paduan Suara</h4><p>Wadah pengembangan bakat musik dan vokal siswa.</p></div>
      <div class="eks-card"><div class="eks-icon">&#128187;</div><h4>Robotik &amp; IT Club</h4><p>Eksplorasi pemrograman, robotika, dan kompetisi coding.</p></div>
      <div class="eks-card"><div class="eks-icon">&#129497;</div><h4>Pramuka</h4><p>Membangun kedisiplinan, kemandirian, dan jiwa kepemimpinan.</p></div>
      <div class="eks-card"><div class="eks-icon">&#129354;</div><h4>Pencak Silat</h4><p>Pelestarian seni bela diri tradisional Indonesia.</p></div>
      <div class="eks-card"><div class="eks-icon">&#128218;</div><h4>English Club</h4><p>Meningkatkan kemampuan bahasa Inggris untuk dunia kerja.</p></div>
      <div class="eks-card"><div class="eks-icon">&#127912;</div><h4>Seni &amp; Desain</h4><p>Wadah kreativitas visual, desain grafis, dan mural sekolah.</p></div>
      <div class="eks-card"><div class="eks-icon">&#128736;</div><h4>PMR</h4><p>Pelatihan pertolongan pertama dan kepedulian sosial.</p></div>
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
          <a href="#" aria-label="Instagram"> <i class="fab fa-instagram"></i> </a>
          <a href="#" aria-label="Facebook"> <i class="fab fa-facebook"></i> </a>
          <a href="#" aria-label="YouTube"> <i class="fab fa-youtube"></i> </a>

        </div>
      </div>

      <div class="kontak-map">
        <div class="map-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input id="mapAddressInput" type="text" placeholder="Ketik alamat sekolah, cth: Jl. Pendidikan Raya No. 45, Kota Sejahtera">
          <button id="mapUpdateBtn">Arahkan Peta</button>
        </div>
        <iframe id="schoolMap" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.9603656655654!2d106.93140377378073!3d-6.268943061367868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d701018c34d%3A0x25cf57d09e074361!2sSMK%20BINUS!5e0!3m2!1sid!2sid!4v1786072476816!5m2!1sid!2sid">
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
