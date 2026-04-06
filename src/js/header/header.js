import { refs } from '../helpers/refs.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';

const header = document.querySelector('.header');

function openMobileMenu() {
  if (!refs.mobileMenu) return;
  refs.mobileMenu.classList.add('active');
  header?.classList.add('is-open');
  refs.mobileMenu.hidden = false;
  lockScroll();
}

function closeMobileMenu() {
  if (!refs.mobileMenu) return;
  refs.mobileMenu.classList.remove('active');
  header?.classList.remove('is-open');

  setTimeout(() => {
    if (!refs.mobileMenu.classList.contains('active')) {
      refs.mobileMenu.hidden = true;
    }
  }, 400);

  unlockScroll();
}

// --- ЕКСПОРТ 1: Ініціалізація меню ---
export function initHeader() {
  const openButton = document.querySelector('[data-open-mobile-menu]');
  const closeButton = document.querySelector('[data-close-mobile-menu]');

  if (!refs.mobileMenu || !openButton) return;

  openButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openMobileMenu();
  });

  closeButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMobileMenu();
  });

  refs.mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('[data-link-mobile-menu]')) {
      closeMobileMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!refs.mobileMenu.contains(e.target) && !openButton.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

// --- ЕКСПОРТ 2: Плавний скрол (додайте це слово export!) ---
export function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#' || hash === '#!') return;

      const targetElement = document.querySelector(hash);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}
