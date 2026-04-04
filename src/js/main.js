import '../css/styles.css';
import { initSmoothScroll } from './helpers/smooth-scroll.js';

function initApp() {
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
