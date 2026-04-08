import iziToast from 'izitoast';

import { getCategories, getProductsByCategory } from '../api/furniture-api.js';
import {
  hideLoadMoreBtn,
  hideLoader,
  renderProductsByCategory,
  showLoadMoreBtn,
  showLoader,
} from './furniture-list.js';

const categoryList = document.querySelector('.category-list-furniture');

const categoryImageModules = import.meta.glob('../../img/categories/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const categoryImages = Object.entries(categoryImageModules).reduce((accumulator, [path, url]) => {
    const fileName = path.split('/').pop() ?? '';
    const isRetina = /@2x\.[^.]+$/i.test(fileName);
    const baseName = fileName.replace(/@2x(?=\.[^.]+$)/i, '').replace(/\.[^.]+$/, '');
    const existingImage = accumulator[baseName] ?? {};

    accumulator[baseName] = {
      regular: isRetina ? existingImage.regular : url,
      retina: isRetina ? url : existingImage.retina,
    };

    return accumulator;
  }, {});

export let currentCategory = 'all';

function getCategoryBackground(categoryId = 'all') {
  return categoryImages[categoryId] ?? categoryImages.all ?? { regular: '', retina: '' };
}

function getCategoryBackgroundUrl(images) {
  if (!images) {
    return '';
  }

  if (window.devicePixelRatio > 1) {
    return images.retina || images.regular || '';
  }

  return images.regular || images.retina || '';
}

function showErrorToast(message) {
  iziToast.error({
    message,
    position: 'bottomRight',
  });
}

export function renderCategories(array) {
  if (!categoryList) {
    return;
  }

  const categoriesData = [{ name: 'Всі товари', _id: 'all' }, ...array];
  const markup = categoriesData
    .map(
      (category) => `
        <li class="item item-category">
          <button
            type="button"
            class="category-btn"
            data-category-button
            data-category-id="${category._id}"
          >
            ${category.name}
          </button>
        </li>`
    )
    .join('');

  categoryList.innerHTML = markup;

  categoryList.querySelectorAll('.item-category').forEach((categoryItem) => {
    const categoryId =
      categoryItem.querySelector('[data-category-button]')?.dataset.categoryId ?? 'all';
    const backgroundUrl = getCategoryBackgroundUrl(getCategoryBackground(categoryId));

    if (!backgroundUrl) {
      categoryItem.style.backgroundImage = '';
      return;
    }

    categoryItem.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${backgroundUrl}")`;
  });
}

export async function initCategories() {
  if (!categoryList) {
    return;
  }

  showLoader();

  try {
    const categories = await getCategories();
    renderCategories(categories);
  } catch (error) {
    renderCategories([]);
    showErrorToast(error instanceof Error ? error.message : 'Не вдалося завантажити категорії.');
  } finally {
    hideLoader();
  }

  if (!categoryList.dataset.listenerAttached) {
    categoryList.addEventListener('click', handlerSelectCategory);
    categoryList.dataset.listenerAttached = 'true';
  }

  categoryList.children[0]?.classList.add('selected-category');
}

export function removeCategories() {
  document.querySelectorAll('.item-category').forEach((category) => {
    category.classList.remove('selected-category');
  });
}

export async function handlerSelectCategory(event) {
  const categoryItem = event.target.closest('.item-category');
  const categoryButton = event.target.closest('[data-category-button]');

  if (!categoryItem || !categoryButton) {
    return;
  }

  removeCategories();
  categoryItem.classList.add('selected-category');
  currentCategory = categoryButton.dataset.categoryId ?? 'all';

  const loadMoreButton = document.querySelector('.btn-loadmore-furniture');
  const wasLoadMoreVisible = Boolean(
    loadMoreButton && !loadMoreButton.classList.contains('visually-hidden')
  );

  hideLoadMoreBtn();
  showLoader();

  try {
    const products = await getProductsByCategory(currentCategory, 1);
    renderProductsByCategory(products);
  } catch (error) {
    if (wasLoadMoreVisible) {
      showLoadMoreBtn();
    }

    showErrorToast(
      error instanceof Error ? error.message : 'Не вдалося відфільтрувати меблі за категорією.'
    );
  } finally {
    hideLoader();
  }
}
