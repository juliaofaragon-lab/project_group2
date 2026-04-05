import '../css/styles.css';
import { initCategories } from './furniture/categories.js';
import { initSmoothScroll } from './helpers/smooth-scroll.js';

function initApp() {
  initSmoothScroll();
  initCategories();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
