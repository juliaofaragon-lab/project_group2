import iziToast from 'izitoast';

import { createOrder } from '../api/orders-api.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';

const state = {
  color: '',
  colorLabel: '',
  lastTrigger: null,
  modelId: '',
  modelName: '',
};

let isInitialized = false;

function getElements() {
  const modal = document.querySelector('.js-order-modal');

  if (!modal) {
    return {};
  }

  return {
    form: modal.querySelector('.js-order-form'),
    loader: modal.querySelector('.js-order-modal-loader'),
    loaderText: modal.querySelector('.js-order-modal-loader-text'),
    modal,
    nameInput: modal.querySelector('input[name="name"]'),
    phoneInput: modal.querySelector('input[name="phone"]'),
    commentInput: modal.querySelector('textarea[name="comment"]'),
    stateText: modal.querySelector('.js-order-modal-state'),
    submitButton: modal.querySelector('.order-modal__submit'),
    summary: modal.querySelector('.js-order-modal-summary'),
  };
}

function renderLoader(isVisible, message = 'Надсилаємо заявку...') {
  const { loader, loaderText, form } = getElements();

  if (!loader) {
    return;
  }

  loader.hidden = !isVisible;

  if (loaderText) {
    loaderText.textContent = message;
  }

  if (form) {
    form.setAttribute('aria-busy', String(isVisible));
  }
}

function renderStateMessage(message = '', type = 'info') {
  const { stateText } = getElements();

  if (!stateText) {
    return;
  }

  if (!message) {
    stateText.hidden = true;
    stateText.textContent = '';
    delete stateText.dataset.state;
    return;
  }

  stateText.hidden = false;
  stateText.textContent = message;
  stateText.dataset.state = type;
}

function renderSummary() {
  const { summary } = getElements();

  if (!summary) {
    return;
  }

  const parts = [state.modelName];

  if (state.colorLabel) {
    parts.push(`Колір: ${state.colorLabel}`);
  }

  const text = parts.filter(Boolean).join(' · ');

  summary.hidden = !text;
  summary.textContent = text;
}

function setSubmitState(isBusy) {
  const { submitButton } = getElements();

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isBusy;
  submitButton.textContent = 'Надіслати заявку';
}

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function validateOrderPayload(payload) {
  if (!payload.name || payload.name.length < 2 || payload.name.length > 64) {
    return "Ім'я має містити від 2 до 64 символів.";
  }

  if (!/^\d{12}$/.test(payload.phone)) {
    return 'Телефон має містити 12 цифр без пробілів і символів.';
  }

  if (payload.comment && (payload.comment.length < 5 || payload.comment.length > 256)) {
    return 'Коментар має містити від 5 до 256 символів.';
  }

  if (!payload.modelId) {
    return 'Не вдалося визначити модель меблів для замовлення.';
  }

  if (!payload.color) {
    return 'Не вдалося визначити колір меблів для замовлення.';
  }

  return '';
}

export function openOrderModal(options = {}) {
  const { modal, form, nameInput } = getElements();

  if (!modal || !form) {
    return;
  }

  form.reset();

  state.color = options.color ?? '';
  state.colorLabel = options.colorLabel ?? '';
  state.lastTrigger = options.returnFocusTo ?? null;
  state.modelId = options.modelId ?? '';
  state.modelName = options.modelName ?? '';

  renderSummary();
  renderLoader(false);
  renderStateMessage();
  setSubmitState(false);

  modal.hidden = false;
  lockScroll();

  requestAnimationFrame(() => {
    const modalWindow = modal.querySelector('.order-modal');

    if (modalWindow) {
      modalWindow.scrollTop = 0;
    }

    nameInput?.focus();
  });
}

export function closeOrderModal(options = {}) {
  const { modal, form } = getElements();

  if (!modal || !form) {
    return;
  }

  const { restoreFocus = true } = options;

  modal.hidden = true;
  form.reset();
  renderLoader(false);
  renderStateMessage();
  setSubmitState(false);
  unlockScroll();

  if (restoreFocus && state.lastTrigger instanceof HTMLElement) {
    state.lastTrigger.focus();
  }
}

async function handleOrderSubmit(event) {
  event.preventDefault();

  const { form } = getElements();

  if (!form?.reportValidity()) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const comment = String(formData.get('comment') ?? '').trim();
  const payload = {
    color: state.color,
    modelId: state.modelId,
    name: String(formData.get('name') ?? '').trim(),
    phone: normalizePhone(formData.get('phone')),
  };

  if (comment) {
    payload.comment = comment;
  }

  const validationMessage = validateOrderPayload(payload);

  if (validationMessage) {
    renderStateMessage(validationMessage, 'error');
    iziToast.error({
      message: validationMessage,
      position: 'bottomRight',
    });
    return;
  }

  setSubmitState(true);
  renderLoader(true);
  renderStateMessage();

  try {
    const order = await createOrder(payload);
    const orderNumber = order?.orderNum ? ` Номер замовлення: ${order.orderNum}.` : '';

    iziToast.success({
      message: `Заявку на ${state.modelName || 'меблі'} успішно надіслано.${orderNumber}`,
      position: 'bottomRight',
    });

    closeOrderModal();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не вдалося надіслати заявку.';

    renderStateMessage(message, 'error');
    iziToast.error({
      message,
      position: 'bottomRight',
    });
  } finally {
    renderLoader(false);
    setSubmitState(false);
  }
}

export function initOrderModal() {
  const { form, modal, phoneInput, commentInput } = getElements();

  if (!modal || !form || isInitialized) {
    return;
  }

  isInitialized = true;

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = normalizePhone(phoneInput.value).slice(0, 12);
  });

  commentInput?.addEventListener('input', () => {
    if (commentInput.value.length > 256) {
      commentInput.value = commentInput.value.slice(0, 256);
    }
  });

  form.addEventListener('submit', handleOrderSubmit);

  document.addEventListener('click', (event) => {
    const closeButton = event.target.closest('[data-close-order-modal]');
    const openButton = event.target.closest('[data-open-order-modal]');

    if (openButton) {
      openOrderModal({
        color: openButton.dataset.orderColor ?? '',
        colorLabel: openButton.dataset.orderColorLabel ?? '',
        modelId: openButton.dataset.orderModelId ?? '',
        modelName: openButton.dataset.orderModelName ?? '',
        returnFocusTo: openButton,
      });
      return;
    }

    if (closeButton || event.target === modal) {
      closeOrderModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeOrderModal();
    }
  });
}
