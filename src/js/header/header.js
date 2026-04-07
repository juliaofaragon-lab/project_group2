import { refs } from '../helpers/refs.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';

const DESKTOP_BREAKPOINT = 1440;
const header = document.querySelector('.header');

function isDesktopViewport() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function openMobileMenu() {
  if (!refs.mobileMenu || isDesktopViewport()) {
    return;
  }

  refs.mobileMenu.classList.add('active');
  header?.classList.add('is-open');
  lockScroll();
}

function closeMobileMenu() {
  if (!refs.mobileMenu) {
    return;
  }

  refs.mobileMenu.classList.remove('active');
  header?.classList.remove('is-open');
  unlockScroll();
}

export function initHeader() {
  const openButton = document.querySelector('[data-open-mobile-menu]');
  const closeButton = document.querySelector('[data-close-mobile-menu]');

  if (!refs.mobileMenu || !openButton) {
    return;
  }

  openButton.addEventListener('click', (event) => {
    event.stopPropagation();
    openMobileMenu();
  });

  closeButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    closeMobileMenu();
  });

  refs.mobileMenu.addEventListener('click', (event) => {
    if (event.target.closest('[data-link-mobile-menu]')) {
      closeMobileMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!refs.mobileMenu.classList.contains('active')) {
      return;
    }

    if (!refs.mobileMenu.contains(event.target) && !openButton.contains(event.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && refs.mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (isDesktopViewport()) {
      closeMobileMenu();
    }
  });
}

export function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');

      if (!hash || hash === '#' || hash === '#!') {
        return;
      }

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
