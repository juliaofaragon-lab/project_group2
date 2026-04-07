import { getProductsByCategory } from '../api/furniture-api';
import { currentCategory } from './categories';

const productsList = document.querySelector('.products-list-furniture');
const loader = document.querySelector('.products-loader');
const loadMoreBtn = document.querySelector('.btn-loadmore-furniture');

let currentPage = 1;

export function renderProductsByCategory(data) {
  let i = '0';
  showLoader();
  showLoadMoreBtn();
  currentPage = 1;
  if (data.totalItems <= data.page * data.limit) {
    hideLoadMoreBtn();
  }
  const markup = data.furnitures
    .map((product) => {
      let colorsMarkup = '';
      console.log(product.color[0]);

      for (let color of product.color) {
        colorsMarkup += `<li class="product-color-item" style="background:${color}"></li>`;
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
  showLoadMoreBtn();
  showLoader();
  currentPage = 1;
  const categories = await getProductsByCategory(currentCategory, currentPage);

  if (categories.totalItems <= categories.page * categories.limit) {
    hideLoadMoreBtn();
  }

  renderProductsByCategory(categories);
  hideLoader();
  loadMoreBtn.addEventListener('click', handlerLoadMoreBtn);
}

export function showLoader() {
  loader.classList.remove('visually-hidden');
}

export function hideLoader() {
  loader.classList.add('visually-hidden');
}

export function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('visually-hidden');
}

export function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('visually-hidden');
}

export async function handlerLoadMoreBtn() {
  currentPage += 1;
  showLoader();

  const data = await getProductsByCategory(currentCategory, currentPage);

  if (data.totalItems <= data.page * data.limit) {
    hideLoadMoreBtn();
  }

  const markup = data.furnitures
    .map((product) => {
      let colorsMarkup = '';
      for (let color of product.color) {
        colorsMarkup += `<li class="product-color-item" style="background:${color}"></li>`;
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
  productsList.insertAdjacentHTML('beforeend', markup);
  hideLoader();
}
