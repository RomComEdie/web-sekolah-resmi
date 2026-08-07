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
