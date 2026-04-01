import Swiper from 'swiper';
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { refs } from '../helpers/refs.js';

let feedbackSwiper = null;

export function initFeedback() {
  const hasSlides = refs.feedbackSlider?.querySelector('.swiper-slide');

  if (!refs.feedbackSlider || !hasSlides) {
    return feedbackSwiper;
  }

  feedbackSwiper = new Swiper(refs.feedbackSlider, {
    modules: [Navigation, Pagination, Keyboard, A11y],
    slidesPerView: 1,
    spaceBetween: 24,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: refs.feedbackNextButton,
      prevEl: refs.feedbackPrevButton,
    },
    pagination: {
      el: refs.feedbackPagination,
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1440: {
        slidesPerView: 3,
      },
    },
  });

  return feedbackSwiper;
}
