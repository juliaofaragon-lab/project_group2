import '../css/styles.css';
import { initSmoothScroll } from './helpers/smooth-scroll.js';
import { initFurnitureModal } from './modals/furniture-modal.js';

function initApp() {
  initFurnitureModal();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
