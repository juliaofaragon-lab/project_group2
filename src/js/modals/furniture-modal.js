import { getFurnitureById } from '../api/furniture-api.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';
import { refs } from '../helpers/refs.js';

function openFurnitureModal() {
  if (!refs.furnitureModal) {
    return;
  }

  refs.furnitureModal.hidden = false;
  lockScroll();
}

function closeFurnitureModal() {
  if (!refs.furnitureModal) {
    return;
  }

  refs.furnitureModal.hidden = true;
  unlockScroll();
}

async function fillFurnitureModal(id) {
  const modalContent = refs.furnitureModal?.querySelector('.furniture-modal__content');

  if (!modalContent || !id) {
    return;
  }

  try {
    const item = await getFurnitureById(id);

    if (!item) {
      return;
    }

    modalContent.innerHTML = `
      <h2 class="section-title">${item.name ?? ''}</h2>
      <p class="section-text">${item.category ?? ''}</p>
      <p class="section-text">${item.price ?? ''}</p>
    `;
  } catch (error) {
    modalContent.innerHTML = `<p class="section-text">${error.message}</p>`;
  }
}

export function initFurnitureModal() {
  if (!refs.furnitureModal) {
    return;
  }

  document.addEventListener('click', async (event) => {
    const openButton = event.target.closest('[data-open-furniture-modal]');
    const closeButton = event.target.closest('[data-close-furniture-modal]');
    const orderButton = event.target.closest('[data-open-order-modal]');

    if (openButton) {
      await fillFurnitureModal(openButton.dataset.openFurnitureModal);
      openFurnitureModal();
    }

    if (orderButton && !refs.furnitureModal.hidden) {
      closeFurnitureModal();
    }

    if (closeButton || event.target === refs.furnitureModal) {
      closeFurnitureModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !refs.furnitureModal.hidden) {
      closeFurnitureModal();
    }
  });
}
