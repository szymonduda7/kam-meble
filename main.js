lucide.createIcons();

// header background after scroll
const header = document.getElementById('site-header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// mobile menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// reveal on scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

// gallery: show more + lightbox
const items = Array.from(document.querySelectorAll('.gallery-item'));
const moreBtn = document.getElementById('gallery-more');
if (moreBtn) {
  moreBtn.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('is-hidden'));
    moreBtn.remove();
  });
}
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  let current = 0;
  let lastFocus = null;
  const visibleItems = () => items.filter(i => !i.classList.contains('is-hidden'));
  const openAt = index => {
    const list = visibleItems();
    current = (index + list.length) % list.length;
    const item = list[current];
    lbImg.src = item.dataset.full;
    lbImg.alt = item.dataset.caption;
    lbCap.textContent = item.dataset.caption;
  };
  items.forEach(item => item.addEventListener('click', () => {
    lastFocus = item;
    openAt(visibleItems().indexOf(item));
    lightbox.classList.add('is-open');
    document.getElementById('lb-close').focus();
  }));
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    if (lastFocus) lastFocus.focus();
  };
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => openAt(current - 1));
  document.getElementById('lb-next').addEventListener('click', () => openAt(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openAt(current - 1);
    if (e.key === 'ArrowRight') openAt(current + 1);
  });
}

// highlight today's opening hours
const today = new Date().getDay();
document.querySelectorAll('.hours-row').forEach(row => {
  row.classList.toggle('is-today', Number(row.dataset.day) === today);
});

// gallery filters (galeria.html)
const filters = document.querySelectorAll('.gallery-filter');
filters.forEach(btn => btn.addEventListener('click', () => {
  const cat = btn.dataset.filter;
  filters.forEach(b => {
    const on = b === btn;
    b.classList.toggle('btn-dark', on);
    b.classList.toggle('btn-outline', !on);
    b.setAttribute('aria-pressed', String(on));
  });
  items.forEach(i => i.classList.toggle('is-hidden', cat !== 'wszystkie' && i.dataset.cat !== cat));
}));

// reviews: horizontal carousel on mobile with arrows and dots
const reviewsTrack = document.getElementById('reviews-track');
if (reviewsTrack) {
  const cards = Array.from(reviewsTrack.querySelectorAll('.review'));
  const dotsWrap = document.getElementById('reviews-dots');
  const step = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : reviewsTrack.clientWidth;
  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'review-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Opinia ${i + 1} z ${cards.length}`);
    dot.addEventListener('click', () => reviewsTrack.scrollTo({ left: i * step(), behavior: 'smooth' }));
    dotsWrap.appendChild(dot);
    return dot;
  });
  let ticking = false;
  reviewsTrack.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const active = Math.min(cards.length - 1, Math.round(reviewsTrack.scrollLeft / step()));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
      ticking = false;
    });
  }, { passive: true });
  document.querySelector('.reviews-prev').addEventListener('click', () => reviewsTrack.scrollBy({ left: -step(), behavior: 'smooth' }));
  document.querySelector('.reviews-next').addEventListener('click', () => reviewsTrack.scrollBy({ left: step(), behavior: 'smooth' }));
}
