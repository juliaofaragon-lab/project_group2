// import '../css/styles.css';
// import { initSmoothScroll } from './helpers/smooth-scroll.js';

// function initApp() {
//   initSmoothScroll();
// }

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', initApp);
// } else {
//   initApp();
// }

import '../css/styles.css';

import { initCategories } from './furniture/categories.js';
import { initProducts } from './furniture/furniture-list.js';

import { initAbout } from './about/about.js';
// Імпортуємо обидві функції з одного файлу header.js
import { initHeader, initSmoothScroll } from './header/header.js';

function initApp() {
  if (typeof initHeader === 'function') {
    initHeader();
    initCategories();
    initProducts();
  }

  if (typeof initSmoothScroll === 'function') {
    initSmoothScroll();
  }
}

const aboutElement = document.querySelector('.js-about');

if (aboutElement) {
  aboutElement.innerHTML = initAbout();
}
initApp();
