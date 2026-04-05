import { getCategories } from '../api/furniture-api';

const categoryList = document.querySelector('.category-list-furniture');

let category = 'all';

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

export function handlerSelectCategory(e) {
  removeCategories();
  e.target.closest('li').classList.add('selected-category');
}
