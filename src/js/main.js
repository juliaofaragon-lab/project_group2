import '../css/styles.css';
import { initCategories } from './furniture/categories.js';
import { initProducts } from './furniture/furniture-list.js';
import { initSmoothScroll } from './helpers/smooth-scroll.js';

function initApp() {
  initSmoothScroll();
  initCategories();
  initProducts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
