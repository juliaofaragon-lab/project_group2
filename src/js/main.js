import './faq/faq.js';
import '../css/styles.css';

import { initCategories } from './furniture/categories.js';
import { initProducts } from './furniture/furniture-list.js';
import { initFurnitureModal } from './modals/furniture-modal.js';
import { initOrderModal } from './modals/order-modal.js';

import { initAbout } from './about/about.js';
// Імпортуємо обидві функції з одного файлу header.js
import { initHeader, initSmoothScroll } from './header/header.js';

async function initApp() {
  if (typeof initHeader === 'function') {
    initHeader();
    await initCategories();
    await initProducts();
    initFurnitureModal();
    initOrderModal();
  }

  if (typeof initSmoothScroll === 'function') {
    initSmoothScroll();
  }
}

const aboutElement = document.querySelector('.js-about');

if (aboutElement) {
  aboutElement.innerHTML = initAbout();
}
void initApp();
