import iziToast from 'izitoast';

import { getCategories, getProductsByCategory } from '../api/furniture-api.js';
import { hideLoader, renderProductsByCategory, showLoader } from './furniture-list.js';

const categoryList = document.querySelector('.category-list-furniture');

const categoryImageModules = import.meta.glob('../../img/categories/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const categoryImages = Object.fromEntries(
  Object.entries(categoryImageModules).map(([path, url]) => {
    const fileName = path.split('/').pop() ?? '';
    const baseName = fileName.replace(/\.[^.]+$/, '');

    return [baseName, url];
  })
);

export let currentCategory = 'all';

function getCategoryBackground(categoryId = 'all') {
  return categoryImages[categoryId] ?? categoryImages.all ?? '';
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
    const imageUrl = getCategoryBackground(categoryId);

    categoryItem.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${imageUrl}")`;
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

  showLoader();

  try {
    const products = await getProductsByCategory(currentCategory, 1);
    renderProductsByCategory(products);
  } catch (error) {
    showErrorToast(
      error instanceof Error ? error.message : 'Не вдалося відфільтрувати меблі за категорією.'
    );
  } finally {
    hideLoader();
  }
}
