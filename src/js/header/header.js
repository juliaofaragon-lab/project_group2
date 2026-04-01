import { refs } from '../helpers/refs.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';

function openMobileMenu() {
  if (!refs.mobileMenu) {
    return;
  }

  refs.mobileMenu.hidden = false;
  lockScroll();
}

function closeMobileMenu() {
  if (!refs.mobileMenu) {
    return;
  }

  refs.mobileMenu.hidden = true;
  unlockScroll();
}

export function initHeader() {
  const openButton = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  const menuLinks = document.querySelectorAll('[data-menu-link]');

  if (!refs.mobileMenu || !openButton || !closeButton) {
    return;
  }

  openButton.addEventListener('click', openMobileMenu);
  closeButton.addEventListener('click', closeMobileMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !refs.mobileMenu.hidden) {
      closeMobileMenu();
    }
  });
}
