import iziToast from 'izitoast';
import Raty from 'raty-js';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import emptyStarIcon from '../../img/feedbacks/emptystar.svg';
import fullStarIcon from '../../img/feedbacks/fullstar.svg';
import halfStarIcon from '../../img/feedbacks/halfstar.svg';
import { getFeedbacks } from '../api/feedback-api.js';
import { createFeedbackMarkup } from './feedback-functions.js';

let feedbackSwiper = null;

function getElements() {
  return {
    footer: document.querySelector('.feedback__footer'),
    list: document.querySelector('.js-feedback-list'),
    loader: document.querySelector('.js-feedback-loader'),
    nextButton: document.querySelector('.js-feedback-next'),
    pagination: document.querySelector('.js-feedback-pagination'),
    prevButton: document.querySelector('.js-feedback-prev'),
    section: document.querySelector('.feedback'),
    slider: document.querySelector('.js-feedback-swiper'),
    state: document.querySelector('.js-feedback-state'),
  };
}

function showLoader() {
  const { loader } = getElements();
  loader?.classList.remove('visually-hidden');
}

function hideLoader() {
  const { loader } = getElements();
  loader?.classList.add('visually-hidden');
}

function setFooterVisible(isVisible) {
  const { footer } = getElements();
<<<<<<< my-branch
  if (footer) footer.hidden = !isVisible;
=======

  if (!footer) {
    return;
  }

  footer.hidden = !isVisible;
>>>>>>> main
}

function renderState(message = '') {
  const { state } = getElements();
  if (!state) return;

  if (!message) {
    state.textContent = '';
    state.classList.add('visually-hidden');
    return;
  }

  state.textContent = message;
  state.classList.remove('visually-hidden');
}

function initRatings() {
  document.querySelectorAll('.js-feedback-rating').forEach((element) => {
    const score = Number(element.dataset.feedbackRate ?? 0);
    const rating = new Raty(element, {
      half: true,
      halfShow: true,
      number: 5,
      path: '',
      readOnly: true,
      score,
      space: false,
      starHalf: halfStarIcon,
      starOff: emptyStarIcon,
      starOn: fullStarIcon,
      starType: 'img',
    });
    rating.init();
  });
}

function initSlider() {
  const { nextButton, pagination, prevButton, slider } = getElements();

  if (!slider || !nextButton || !prevButton || !pagination) return;

  if (feedbackSwiper) {
    feedbackSwiper.destroy(true, true);
  }

  feedbackSwiper = new Swiper(slider, {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    pagination: {
      el: pagination,
      type: 'bullets',
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
  });
}

export async function initFeedback() {
  const { list, section, pagination } = getElements();

  if (!section || !list) return;

  if (pagination) pagination.innerHTML = '';

  setFooterVisible(false);
  showLoader();
  renderState();

  try {
    const feedbacks = await getFeedbacks();

    if (!feedbacks || feedbacks.length === 0) {
      setFooterVisible(false);
      renderState('Відгуків поки немає.');
      return;
    }

    list.innerHTML = createFeedbackMarkup(feedbacks);
    initRatings();
    initSlider();
<<<<<<< my-branch
    setFooterVisible(true);
=======
    setFooterVisible(feedbacks.length > 0);
>>>>>>> main
  } catch (error) {
    setFooterVisible(false);
    const message = error instanceof Error ? error.message : 'Не вдалося завантажити відгуки.';
    renderState(message);
    iziToast.error({
      message,
      position: 'bottomRight',
    });
  } finally {
    hideLoader();
  }
}
