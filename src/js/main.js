import './faq/faq.js';
import '../css/styles.css';
import { initAbout } from './about/about.js';
// Імпортуємо обидві функції з одного файлу header.js
import { initHeader, initSmoothScroll } from './header/header.js';

function initApp() {
  if (typeof initHeader === 'function') {
    initHeader();
  }

  if (typeof initSmoothScroll === 'function') {
    initSmoothScroll();
  }
}

const aboutElement = document.querySelector('.js-about'); 

if (aboutElement) {
  aboutElement.insertAdjacentHTML('beforeend', initAbout());
  
}
initApp();
