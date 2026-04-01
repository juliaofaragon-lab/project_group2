import { refs } from '../helpers/refs.js';
import { createFurnitureCard } from '../helpers/render-functions.js';

export function renderFurnitureList(items = []) {
  if (!refs.furnitureList) {
    return;
  }

  refs.furnitureList.innerHTML = items.map((item) => createFurnitureCard(item)).join('');
}

export function initFurnitureList() {
  if (!refs.furnitureList) {
    return;
  }

  refs.furnitureList.innerHTML = '';
}
