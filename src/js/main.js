import 'accordion-js/dist/accordion.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/styles.css';
import { initAbout } from './about/about.js';
import { initFaq } from './faq/faq.js';
import { initFeedback } from './feedback/feedback.js';
import { initCategories } from './furniture/categories.js';
import { initFurnitureList } from './furniture/furniture-list.js';
import { initLoadMoreButton } from './furniture/load-more.js';
import { initHeader } from './header/header.js';
import { initSmoothScroll } from './helpers/smooth-scroll.js';
import { initHero } from './hero/hero.js';
import { initFurnitureModal } from './modals/furniture-modal.js';

function initApp() {
  initHeader();
  initHero();
  initFurnitureList();
  initCategories();
  initLoadMoreButton();
  initAbout();
  initFaq();
  initFeedback();
  initFurnitureModal();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
