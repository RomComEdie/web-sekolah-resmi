  // Mobile menu toggle
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.style.display = 'none'));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if(item.classList.contains('open')){ a.style.maxHeight = a.scrollHeight + 'px'; }
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Editable map: type an address and redirect the map there
  const mapFrame = document.getElementById('schoolMap');
  const mapInput = document.getElementById('mapAddressInput');
  const mapBtn = document.getElementById('mapUpdateBtn');

  function updateMap(){
    const query = mapInput.value.trim();
    if(!query) return;
    mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
  }
  mapBtn.addEventListener('click', updateMap);
  mapInput.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); updateMap(); } });

  // Force in-page smooth scroll for every internal anchor link
  // (prevents links from being intercepted by a parent frame / new navigation)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if(targetEl){
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({
          top: targetEl.getBoundingClientRect().top + window.scrollY - 110,
          behavior: 'smooth'
        });
        history.replaceState(null, '', '#' + targetId);
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav.main-links > a, nav.main-links .dropdown > a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if(window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if(link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Profil Slide

  // ===== SLIDER PROFIL =====
document.addEventListener('DOMContentLoaded', function () {
  const track = document.getElementById('psTrack');
  if (!track) return; // slider tidak ada di halaman ini, jangan lanjut

  const slides = document.querySelectorAll('#psTrack .ps-slide');
  const dots = document.querySelectorAll('#psProgress .ps-dot');
  const eyebrowEl = document.getElementById('psEyebrow');
  const titleEl = document.getElementById('psTitle');
  const descEl = document.getElementById('psDesc');
  const captionEl = document.querySelector('.ps-caption');

  const data = [
    { eyebrow: 'Fasilitas Sekolah', title: 'Gedung Sekolah Modern', desc: 'Lingkungan belajar yang asri, nyaman, dan mendukung proses pembelajaran siswa.' },
    { eyebrow: 'Kegiatan Belajar', title: 'Suasana Belajar Aktif', desc: 'Siswa dibimbing langsung oleh tenaga pengajar bersertifikasi di setiap program keahlian.' },
    { eyebrow: 'Fasilitas Praktik', title: 'Laboratorium & Bengkel', desc: 'Fasilitas praktik setara standar industri untuk mendukung kompetensi siswa.' }
  ];

  const total = slides.length;
  let current = 0;
  let timer;
  const DURATION = 4200;

  function render(index) {
    const prevIndex = current;
    current = (index + total) % total;
    if (current === prevIndex && slides[current].classList.contains('is-active')) return;

    slides.forEach((s, i) => {
      s.classList.remove('is-leaving');
      if (i === prevIndex && i !== current) {
        s.classList.add('is-leaving');
      }
      s.classList.toggle('is-active', i === current);
      // restart Ken Burns zoom pada gambar yang baru aktif
      if (i === current) {
        const img = s.querySelector('img');
        img.style.animation = 'none';
        void img.offsetWidth; // force reflow
        img.style.animation = '';
      }
    });

    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));

    const d = data[current];
    if (eyebrowEl) eyebrowEl.textContent = d.eyebrow;
    if (titleEl) titleEl.textContent = d.title;
    if (descEl) descEl.textContent = d.desc;

    // restart animasi fade-in caption
    if (captionEl) {
      captionEl.style.animation = 'none';
      void captionEl.offsetWidth;
      captionEl.style.animation = '';
    }
  }

  function next() { render(current + 1); }
  function prev() { render(current - 1); }

  function start() {
    clearInterval(timer);
    timer = setInterval(next, DURATION);
  }
  function reset() { start(); }

  const btnNext = document.getElementById('psNext');
  const btnPrev = document.getElementById('psPrev');
  if (btnNext) btnNext.addEventListener('click', () => { next(); reset(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); reset(); });

  dots.forEach((d, i) => {
    d.addEventListener('click', () => { render(i); reset(); });
  });

  render(0);
  start();
});