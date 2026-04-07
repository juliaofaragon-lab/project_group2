import iziToast from 'izitoast';

import { getProductsByCategory } from '../api/furniture-api.js';
import { currentCategory } from './categories.js';

const productsList = document.querySelector('.products-list-furniture');
const loader = document.querySelector('.products-loader');
const loadMoreBtn = document.querySelector('.btn-loadmore-furniture');

let currentPage = 1;

function buildProductMarkup(product) {
  const colorsMarkup = product.color
    .map((color) => `<li class="product-color-item" style="background:${color}"></li>`)
    .join('');

  return `
    <li class="item product-item" data-product-id="${product._id}">
      <img src="${product.images[0]}" alt="${product.name}" class="product-img" />
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <ul class="product-colors-list">
          ${colorsMarkup}
        </ul>
        <p class="product-price">${product.price} грн</p>
      </div>
      <button
        class="product-btn-readmore"
        type="button"
        data-open-furniture-modal="${product._id}"
      >
        Детальніше
      </button>
    </li>`;
}

function showErrorToast(message) {
  iziToast.error({
    message,
    position: 'bottomRight',
  });
}

export function renderProductsByCategory(data) {
  if (!productsList) {
    return;
  }

  currentPage = 1;
  showLoadMoreBtn();

  if (data.totalItems <= data.page * data.limit) {
    hideLoadMoreBtn();
  }

  productsList.innerHTML = data.furnitures.map(buildProductMarkup).join('');
}

export async function initProducts() {
  if (!loadMoreBtn || !productsList) {
    return;
  }

  currentPage = 1;
  showLoadMoreBtn();
  showLoader();

  try {
    const products = await getProductsByCategory(currentCategory, currentPage);

    if (products.totalItems <= products.page * products.limit) {
      hideLoadMoreBtn();
    }

    renderProductsByCategory(products);
  } catch (error) {
    hideLoadMoreBtn();
    showErrorToast(
      error instanceof Error ? error.message : 'Не вдалося завантажити список меблів.'
    );
  } finally {
    hideLoader();
  }

  if (!loadMoreBtn.dataset.listenerAttached) {
    loadMoreBtn.addEventListener('click', handlerLoadMoreBtn);
    loadMoreBtn.dataset.listenerAttached = 'true';
  }
}

export function showLoader() {
  loader?.classList.remove('visually-hidden');
}

export function hideLoader() {
  loader?.classList.add('visually-hidden');
}

export function showLoadMoreBtn() {
  loadMoreBtn?.classList.remove('visually-hidden');
}

export function hideLoadMoreBtn() {
  loadMoreBtn?.classList.add('visually-hidden');
}

export async function handlerLoadMoreBtn() {
  if (!productsList) {
    return;
  }

  currentPage += 1;
  showLoader();

  try {
    const data = await getProductsByCategory(currentCategory, currentPage);

    if (data.totalItems <= data.page * data.limit) {
      hideLoadMoreBtn();
    }

    productsList.insertAdjacentHTML('beforeend', data.furnitures.map(buildProductMarkup).join(''));
  } catch (error) {
    currentPage -= 1;
    showErrorToast(
      error instanceof Error
        ? error.message
        : 'Не вдалося завантажити наступну порцію меблів.'
    );
  } finally {
    hideLoader();
  }
}
