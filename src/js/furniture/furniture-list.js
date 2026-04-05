import { getProductsByCategory } from '../api/furniture-api';
import { currentCategory } from './categories';

const productsList = document.querySelector('.products-list-furniture');
const loader = document.querySelector('.products-loader');

let currentPage = 1;

export function renderProductsByCategory(array) {
  let i = '0';
  showLoader();

  const markup = array
    .map((product) => {
      let colorsMarkup = '';
      for (let color of product.color) {
        colorsMarkup += `<li class="product-color-item" style="fill:${color}"></li>`;
      }
      return `
        <li class="item product-item" data-productID='${product._id}'>
        <img src="${product.images[0]}" alt="${product.name}" class="product-img" />
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <ul class="product-colors-list">
                ${colorsMarkup}
            </ul>
            <p class="product-price">${product.price} грн</p>
        </div>
        <button class="product-btn-readmore">Детальніше</button>
        </li>`;
    })
    .join('');
  productsList.innerHTML = markup;
  hideLoader();
}

export async function initProducts() {
  const categories = await getProductsByCategory(currentCategory, currentPage);
  renderProductsByCategory(categories);
}

export function showLoader() {
  loader.classList.remove('visually-hidden');
}

export function hideLoader() {
  loader.classList.add('visually-hidden');
}
