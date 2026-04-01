export function createCategoryButton(category = '') {
  return `
    <li class="furniture-categories__item">
      <button class="furniture-categories__button" type="button" data-category-button="${category}">
        ${category}
      </button>
    </li>
  `;
}

export function createFurnitureCard({
  _id = '',
  name = '',
  category = '',
  price = '',
  image = '',
} = {}) {
  return `
    <li class="furniture-card">
      <img class="furniture-card__image" src="${image}" alt="${name}" />
      <div class="furniture-card__content">
        <h3 class="furniture-card__title">${name}</h3>
        <p class="furniture-card__meta">${category}</p>
        <p class="furniture-card__price">${price}</p>
        <button class="button" type="button" data-open-furniture-modal="${_id}">
          Детальніше
        </button>
      </div>
    </li>
  `;
}

export function createFeedbackSlide({ name = '', descr = '', rate = '' } = {}) {
  return `
    <div class="swiper-slide">
      <article class="feedback-card">
        <h3 class="feedback-card__name">${name}</h3>
        <p class="feedback-card__rate">${rate}</p>
        <p class="feedback-card__text">${descr}</p>
      </article>
    </div>
  `;
}
