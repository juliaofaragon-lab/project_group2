import { refs } from '../helpers/refs.js';

export function toggleLoadMoreButton(shouldShow = false) {
  if (!refs.loadMoreButton) {
    return;
  }

  refs.loadMoreButton.hidden = !shouldShow;
}

export function initLoadMoreButton(callback = () => {}) {
  if (!refs.loadMoreButton) {
    return;
  }

  refs.loadMoreButton.addEventListener('click', callback);
}
