/* ========================================
   YOU LAZER — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Theme Toggle ----------
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleDesktop = document.getElementById('themeToggleDesktop');
  const savedTheme = localStorage.getItem('youlaser-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('youlaser-theme', next);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);

  // ---------- Scroll Progress Bar (GPU-accelerated) ----------
  const progressBar = document.getElementById('navProgress');
  if (progressBar) {
    progressBar.style.width = '100%';
    progressBar.style.transform = 'scaleX(0)';

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      requestAnimationFrame(() => {
        progressBar.style.transform = 'scaleX(' + progress + ')';
      });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ---------- Scroll Reveal Animations ----------
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ---------- Navigation Scroll ----------
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---------- Mobile Menu ----------
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('is-open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.classList.add('is-open');
    navToggle.classList.add('is-active');
    document.body.classList.add('is-locked');
    // Force toggle bars to white when menu is open
    navToggle.querySelectorAll('span').forEach(s => s.style.background = 'white');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    document.body.classList.remove('is-locked');
    // Reset toggle bar colors
    navToggle.querySelectorAll('span').forEach(s => s.style.background = '');
  }

  navToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Gallery Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const galleryItems = document.querySelectorAll('.gallery__item');
  let currentImageIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    galleryImages.push(img.src);

    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox(img.src, img.alt);
    });
  });

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.classList.add('is-locked');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
  }

  document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox__prev').addEventListener('click', showPrevImage);
  document.querySelector('.lightbox__next').addEventListener('click', showNextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNextImage();
      else showPrevImage();
    }
  }, { passive: true });

  // ---------- Active Nav Link on Scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__cta)');

  function updateActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---------- Parallax effect for hero ----------
  const heroImg = document.querySelector('.hero__bg-img');

  function handleParallax() {
    if (window.innerWidth < 768) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(${1.05 + scrollY * 0.0001}) translateY(${scrollY * 0.15}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---------- Hide scroll indicator after scrolling ----------
  const heroScroll = document.querySelector('.hero__scroll');

  function handleScrollIndicator() {
    if (window.scrollY > 100) {
      heroScroll.style.opacity = '0';
      heroScroll.style.transform = 'translateX(-50%) translateY(10px)';
    } else {
      heroScroll.style.opacity = '1';
      heroScroll.style.transform = 'translateX(-50%) translateY(0)';
    }
  }

  if (heroScroll) {
    heroScroll.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    window.addEventListener('scroll', handleScrollIndicator, { passive: true });
  }

});
