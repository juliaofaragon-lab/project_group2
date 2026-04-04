import { refs } from '../helpers/refs.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';

function openMobileMenu() {
  if (!refs.mobileMenu) return;
  refs.mobileMenu.classList.add('active');
  document.querySelector('.header').classList.add('is-open');
  refs.mobileMenu.hidden = false;
  lockScroll();
}

function closeMobileMenu() {
  if (!refs.mobileMenu || refs.mobileMenu.hidden) return;

  refs.mobileMenu.classList.remove('active');
  document.querySelector('.header').classList.remove('is-open');

  setTimeout(() => {
    if (!refs.mobileMenu.classList.contains('active')) {
      refs.mobileMenu.hidden = true;
    }
  }, 400);
  unlockScroll();
}

export function initHeader() {
  const openButton = document.querySelector('[data-open-mobile-menu]');
  const closeButton = document.querySelector('[data-close-mobile-menu]');
  const menuLinks = document.querySelectorAll('[data-link-mobile-menu]');
  const logo = document.querySelector('.logo');

  if (!refs.mobileMenu || !openButton) return;

  if (logo) {
    logo.addEventListener('click', closeMobileMenu);
  }

  openButton.addEventListener('click', (e) => {
    e.stopPropagation();

    openMobileMenu();
  });

  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  document.addEventListener('click', (event) => {
    const isClickInsideMenu = refs.mobileMenu.contains(event.target);
    const isClickOnBurger = openButton.contains(event.target);

    if (!isClickInsideMenu && !isClickOnBurger) {
      closeMobileMenu();
    }
  });
}
