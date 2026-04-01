import iziToast from 'izitoast';
import { createOrder } from '../api/orders-api.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';
import { refs } from '../helpers/refs.js';

function openOrderModal() {
  if (!refs.orderModal) {
    return;
  }

  refs.orderModal.hidden = false;
  lockScroll();
}

function closeOrderModal() {
  if (!refs.orderModal) {
    return;
  }

  refs.orderModal.hidden = true;
  unlockScroll();
}

export function notifyOrderSuccess(message = 'Заявку успішно відправлено.') {
  iziToast.success({
    title: 'OK',
    message,
    position: 'topRight',
  });
}

export function notifyOrderError(message = 'Не вдалося надіслати заявку.') {
  iziToast.error({
    title: 'Error',
    message,
    position: 'topRight',
  });
}

async function handleOrderSubmit(event) {
  event.preventDefault();

  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

  try {
    await createOrder(payload);
    notifyOrderSuccess();
    event.currentTarget.reset();
    closeOrderModal();
  } catch (error) {
    notifyOrderError(error.message);
  }
}

export function initOrderModal() {
  if (!refs.orderModal) {
    return;
  }

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-order-modal]');
    const closeButton = event.target.closest('[data-close-order-modal]');

    if (openButton) {
      openOrderModal();
    }

    if (closeButton || event.target === refs.orderModal) {
      closeOrderModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !refs.orderModal.hidden) {
      closeOrderModal();
    }
  });

  refs.orderForm?.addEventListener('submit', handleOrderSubmit);
}
