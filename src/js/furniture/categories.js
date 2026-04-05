import { getCategories, getProductsByCategory } from '../api/furniture-api';
import { renderProductsByCategory } from './furniture-list';

const categoryList = document.querySelector('.category-list-furniture');

export let currentCategory = 'all';

export function renderCategories(array) {
  let i = '0';

  array.unshift({ name: 'Всі товари', _id: 'all' });
  const markup = array
    .map((category) => {
      return `
        <li class="item item-category">
            <button type="button" class="category-btn" data-category-button data-categoryId="${category._id}">${category.name}</button>
        </li>`;
    })
    .join('');
  categoryList.innerHTML = markup;

  const categories = document.querySelectorAll('.item-category');
  categories.forEach((category) => {
    category.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("./img/categories/${category.children[0].dataset.categoryid}.jpg")`;
  });
}

export async function initCategories() {
  const categories = await getCategories();
  renderCategories(categories);
  const categoriesList = document.querySelector('.category-list-furniture');
  categoriesList.addEventListener('click', handlerSelectCategory);
  categoriesList.children[0].classList.add('selected-category');
}

export async function removeCategories() {
  const categories = document.querySelectorAll('.item-category');
  categories.forEach((category) => category.classList.remove('selected-category'));
}

export async function handlerSelectCategory(e) {
  removeCategories();
  e.target.closest('li').classList.add('selected-category');
  currentCategory = e.target.dataset.categoryid;

  const products = await getProductsByCategory(currentCategory, 1);
  renderProductsByCategory(products);
}
