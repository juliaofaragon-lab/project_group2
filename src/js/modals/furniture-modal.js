import placeholderImage from '../../img/placeholder/furniture-placeholder.svg';
import demoMainImage from '../../img/furniture-modal/sofa-oslo-main.webp';
import demoThumbOne from '../../img/furniture-modal/sofa-oslo-thumb-1.webp';
import demoThumbTwo from '../../img/furniture-modal/sofa-oslo-thumb-2.webp';
import { getFurnitureById } from '../api/furniture-api.js';
import { lockScroll, unlockScroll } from '../helpers/scroll-lock.js';
import { refs } from '../helpers/refs.js';

const state = {
  activeImageIndex: 0,
  activeColorIndex: 0,
  item: null,
  lastTrigger: null,
};

const COLOR_MAP = {
  beige: '#c7b8a3',
  black: '#1f1919',
  brown: '#7c5631',
  cream: '#ece7dd',
  gray: '#9096a2',
  grey: '#9096a2',
  white: '#f8fafc',
  бежевий: '#d3cdc3',
  білий: '#ffffff',
  графітовий: '#2d2526',
  коричневий: '#7c5631',
  сірий: '#8e8a84',
  чорний: '#1f1919',
};

const DEMO_MODAL_ITEM = {
  _id: 'demo-oslo',
  category: 'Дивани',
  colors: ['Бежевий', 'Білий', 'Чорний'],
  description:
    "Класичний диван з м'якими подушками та високою спинкою, ідеальний для сімейного відпочинку. Оббивка з якісної зносостійкої тканини.",
  images: [demoMainImage, demoThumbOne, demoThumbTwo],
  name: 'Софа Oslo',
  price: 9999,
  rate: 4,
  sizes: '280x180x85',
};

function getModalElements() {
  if (!refs.furnitureModal) {
    return {};
  }

  return {
    actionButton: refs.furnitureModal.querySelector('.js-furniture-modal-order-button'),
    category: refs.furnitureModal.querySelector('.js-furniture-modal-category'),
    closeButton: refs.furnitureModal.querySelector('[data-close-furniture-modal]'),
    colors: refs.furnitureModal.querySelector('.js-furniture-modal-colors'),
    description: refs.furnitureModal.querySelector('.js-furniture-modal-description'),
    mainImage: refs.furnitureModal.querySelector('.js-furniture-modal-main-image'),
    price: refs.furnitureModal.querySelector('.js-furniture-modal-price'),
    ratingValue: refs.furnitureModal.querySelector('.js-furniture-modal-rating-value'),
    sizes: refs.furnitureModal.querySelector('.js-furniture-modal-sizes'),
    stars: refs.furnitureModal.querySelector('.js-furniture-modal-stars'),
    stateText: refs.furnitureModal.querySelector('.js-furniture-modal-state'),
    thumbs: refs.furnitureModal.querySelector('.js-furniture-modal-thumbs'),
    title: refs.furnitureModal.querySelector('#furniture-modal-title'),
    window: refs.furnitureModal.querySelector('.furniture-modal'),
  };
}

function normalizeText(value, fallback = '') {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return fallback;
}

function normalizeCategory(category) {
  if (typeof category === 'object' && category !== null) {
    return normalizeText(category.name ?? category.title, 'Категорія не вказана');
  }

  return normalizeText(category, 'Категорія не вказана');
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (Number.isFinite(numericPrice)) {
    return `${new Intl.NumberFormat('uk-UA').format(numericPrice)} грн`;
  }

  return normalizeText(price, 'Ціна уточнюється');
}

function normalizeRating(rawRating) {
  const rating = Number(rawRating);

  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.max(0, Math.min(5, rating));
}

function formatDimensions(value) {
  if (typeof value === 'string' && value.trim()) {
    return `Розміри: ${value.trim()}`;
  }

  if (Array.isArray(value) && value.length) {
    return `Розміри: ${value.join('x')}`;
  }

  if (typeof value === 'object' && value !== null) {
    const parts = [value.width, value.depth ?? value.length, value.height].filter(Boolean);

    if (parts.length) {
      return `Розміри: ${parts.join('x')}`;
    }
  }

  return 'Розміри уточнюються';
}

function normalizeImage(image, itemName) {
  if (typeof image === 'string' && image.trim()) {
    return {
      alt: itemName,
      src: image.trim(),
    };
  }

  if (typeof image === 'object' && image !== null) {
    const src = image.url ?? image.src ?? image.image ?? image.webp ?? image.jpg;

    if (typeof src === 'string' && src.trim()) {
      return {
        alt: normalizeText(image.alt, itemName),
        src: src.trim(),
      };
    }
  }

  return null;
}

function normalizeImages(item, itemName) {
  const rawImages = [
    ...(Array.isArray(item.images) ? item.images : []),
    ...(Array.isArray(item.gallery) ? item.gallery : []),
    item.image,
    item.img,
    item.photo,
  ].filter(Boolean);

  const images = rawImages.map((image) => normalizeImage(image, itemName)).filter(Boolean);

  if (images.length) {
    return images;
  }

  return [
    { alt: itemName, src: placeholderImage },
    { alt: itemName, src: placeholderImage },
    { alt: itemName, src: placeholderImage },
  ];
}

function normalizeColor(color, index) {
  if (typeof color === 'string') {
    const label = color.trim();
    const normalizedName = label.toLowerCase();

    return {
      id: `${normalizedName}-${index}`,
      label,
      value: label.startsWith('#') ? label : (COLOR_MAP[normalizedName] ?? '#d6d3ce'),
    };
  }

  if (typeof color === 'object' && color !== null) {
    const label = normalizeText(color.name ?? color.label ?? color.title, `Колір ${index + 1}`);
    const normalizedName = label.toLowerCase();

    return {
      id: normalizeText(color.id, `${normalizedName}-${index}`),
      label,
      value:
        normalizeText(color.hex ?? color.value ?? color.code, '') ||
        COLOR_MAP[normalizedName] ||
        '#d6d3ce',
    };
  }

  return {
    id: `default-${index}`,
    label: `Колір ${index + 1}`,
    value: '#d6d3ce',
  };
}

function normalizeColors(item) {
  const rawColors = Array.isArray(item.colors)
    ? item.colors
    : Array.isArray(item.colorOptions)
      ? item.colorOptions
      : Array.isArray(item.color)
        ? item.color
        : item.color
        ? [item.color]
        : [];

  if (!rawColors.length) {
    return [];
  }

  return rawColors.map((color, index) => normalizeColor(color, index));
}

function normalizeFurnitureItem(item = {}) {
  const name = normalizeText(item.name ?? item.title ?? item.model, 'Модель меблів');

  return {
    category: normalizeCategory(item.category),
    colors: normalizeColors(item),
    description: normalizeText(
      item.description ?? item.descr ?? item.desc,
      'Опис товару буде додано після інтеграції бекенду.'
    ),
    id: item._id ?? item.id ?? '',
    images: normalizeImages(item, name),
    name,
    price: formatPrice(item.price),
    rating: normalizeRating(item.rate ?? item.rating ?? item.stars),
    sizes: formatDimensions(item.sizes ?? item.size ?? item.dimensions),
  };
}

function syncOrderActionButton() {
  const { actionButton } = getModalElements();

  if (!actionButton || !state.item) {
    return;
  }

  delete actionButton.dataset.orderModelId;
  delete actionButton.dataset.orderModelName;
  delete actionButton.dataset.orderColor;
  actionButton.disabled = true;
}

function renderStars(rating) {
  const filledStars = Math.floor(rating);

  return Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < filledStars;

    return `<span class="furniture-modal__star ${isFilled ? '' : 'is-empty'}" aria-hidden="true">${isFilled ? '★' : '☆'}</span>`;
  }).join('');
}

function renderThumbs() {
  const { thumbs } = getModalElements();

  if (!thumbs || !state.item) {
    return;
  }

  thumbs.innerHTML = state.item.images
    .slice(1)
    .map(
      (image, index) => `
        <li class="furniture-modal__thumb-item">
          <button
            class="furniture-modal__thumb ${index + 1 === state.activeImageIndex ? 'is-active' : ''}"
            type="button"
            data-modal-thumb="${index + 1}"
            aria-label="Показати зображення ${index + 2}"
          >
            <img src="${image.src}" alt="${image.alt}" />
          </button>
        </li>
      `
    )
    .join('');
}

function renderMainImage() {
  const { mainImage } = getModalElements();

  if (!mainImage || !state.item) {
    return;
  }

  const activeImage = state.item.images[state.activeImageIndex] ?? state.item.images[0];

  mainImage.src = activeImage?.src ?? placeholderImage;
  mainImage.alt = activeImage?.alt ?? state.item.name;
}

function renderColors() {
  const { colors } = getModalElements();

  if (!colors || !state.item) {
    return;
  }

  colors.innerHTML = state.item.colors
    .map(
      (color, index) => `
        <li class="furniture-modal__color-item">
          <label
            class="furniture-modal__color-option ${index === state.activeColorIndex ? 'is-active' : ''}"
            aria-label="Обрати колір ${color.label}"
          >
            <input
              class="visually-hidden furniture-modal__color-input"
              type="radio"
              name="furniture-modal-color"
              data-modal-color="${index}"
              ${index === state.activeColorIndex ? 'checked' : ''}
            />
            <span
              class="furniture-modal__color-swatch ${isLightSwatch(color.value) ? 'is-light' : ''}"
              style="--swatch-color: ${color.value}"
              aria-hidden="true"
            ></span>
          </label>
        </li>
      `
    )
    .join('');

  syncOrderActionButton();
}

function isLightSwatch(value = '') {
  const normalizedValue = String(value).trim().toLowerCase();

  return normalizedValue === '#fff' || normalizedValue === '#ffffff';
}

function renderStateMessage(message = '', type = 'info') {
  const { stateText } = getModalElements();

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

function renderFurnitureInfo() {
  const { actionButton, category, colors, description, price, ratingValue, sizes, stars, title } =
    getModalElements();

  if (
    !state.item ||
    !actionButton ||
    !category ||
    !description ||
    !price ||
    !ratingValue ||
    !sizes ||
    !stars ||
    !title
  ) {
    return;
  }

  title.textContent = state.item.name;
  category.textContent = state.item.category;
  price.textContent = state.item.price;
  stars.innerHTML = renderStars(state.item.rating);
  ratingValue.textContent = '';
  ratingValue.hidden = true;
  description.textContent = state.item.description;
  sizes.textContent = state.item.sizes;
  actionButton.disabled = true;

  renderMainImage();
  renderThumbs();

  if (colors) {
    colors.hidden = state.item.colors.length === 0;
  }

  renderColors();
  renderStateMessage();
}

function resetFurnitureModal() {
  const {
    actionButton,
    category,
    colors,
    description,
    mainImage,
    price,
    ratingValue,
    sizes,
    stars,
    thumbs,
    title,
  } = getModalElements();

  state.item = null;
  state.activeColorIndex = 0;
  state.activeImageIndex = 0;

  if (title) {
    title.textContent = 'Завантаження...';
  }

  if (category) {
    category.textContent = 'Категорія не вказана';
  }

  if (price) {
    price.textContent = 'Ціна уточнюється';
  }

  if (stars) {
    stars.innerHTML = renderStars(0);
  }

  if (ratingValue) {
    ratingValue.textContent = '';
    ratingValue.hidden = true;
  }

  if (description) {
    description.textContent = 'Завантажуємо інформацію про товар.';
  }

  if (sizes) {
    sizes.textContent = 'Розміри уточнюються';
  }

  if (mainImage) {
    mainImage.src = placeholderImage;
    mainImage.alt = 'Фото товару';
  }

  if (thumbs) {
    thumbs.innerHTML = '';
  }

  if (colors) {
    colors.innerHTML = '';
    colors.hidden = false;
  }

  if (actionButton) {
    delete actionButton.dataset.orderColor;
    delete actionButton.dataset.orderModelId;
    delete actionButton.dataset.orderModelName;
    actionButton.disabled = true;
  }
}

function openFurnitureModal(trigger = null) {
  if (!refs.furnitureModal) {
    return;
  }

  state.lastTrigger = trigger;
  refs.furnitureModal.hidden = false;
  lockScroll();

  requestAnimationFrame(() => {
    const { closeButton, window } = getModalElements();

    if (window) {
      window.scrollTop = 0;
    }

    closeButton?.focus();
  });
}

function closeFurnitureModal() {
  if (!refs.furnitureModal) {
    return;
  }

  refs.furnitureModal.hidden = true;
  unlockScroll();

  if (state.lastTrigger instanceof HTMLElement) {
    state.lastTrigger.focus();
  }
}

async function fillFurnitureModal(id) {
  resetFurnitureModal();
  renderStateMessage('Завантажуємо інформацію про товар...', 'loading');

  try {
    const item = await getFurnitureById(id);

    state.item = normalizeFurnitureItem(item);
    renderFurnitureInfo();
  } catch (error) {
    renderStateMessage(
      error instanceof Error ? error.message : 'Не вдалося завантажити дані про товар.',
      'error'
    );
  }
}

function openPreviewModal() {
  state.item = normalizeFurnitureItem(DEMO_MODAL_ITEM);
  openFurnitureModal();
  renderFurnitureInfo();
}

export function initFurnitureModal() {
  if (!refs.furnitureModal) {
    return;
  }

  resetFurnitureModal();

  const previewMode = new URLSearchParams(window.location.search).get('preview');
  const isPreviewMode = import.meta.env.DEV && previewMode === 'furniture-modal';

  if (isPreviewMode) {
    openPreviewModal();
  }

  document.addEventListener('click', async (event) => {
    const openButton = event.target.closest('[data-open-furniture-modal]');
    const closeButton = event.target.closest('[data-close-furniture-modal]');
    const thumbButton = event.target.closest('[data-modal-thumb]');

    if (openButton) {
      openFurnitureModal(openButton);
      await fillFurnitureModal(openButton.dataset.openFurnitureModal);
      return;
    }

    if (closeButton || event.target === refs.furnitureModal) {
      closeFurnitureModal();
      return;
    }

    if (thumbButton && refs.furnitureModal.contains(thumbButton)) {
      state.activeImageIndex = Number(thumbButton.dataset.modalThumb);
      renderMainImage();
      renderThumbs();
      return;
    }
  });

  document.addEventListener('change', (event) => {
    const colorInput = event.target.closest('[data-modal-color]');

    if (!colorInput || !refs.furnitureModal.contains(colorInput)) {
      return;
    }

    state.activeColorIndex = Number(colorInput.dataset.modalColor);
    renderColors();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !refs.furnitureModal.hidden) {
      closeFurnitureModal();
    }
  });
}
