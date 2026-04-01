export function initCategories() {
  document.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('[data-category-button]');

    if (!clickedButton) {
      return;
    }

    const categoryButtons = document.querySelectorAll('[data-category-button]');

    categoryButtons.forEach((button) => {
      button.classList.remove('is-active');
    });

    clickedButton.classList.add('is-active');
  });
}
