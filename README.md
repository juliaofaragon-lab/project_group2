# Project Group 2

Стартовий репозиторій для командного проєкту на `Vite` + `Vanilla JS`.

## Що вже підготовлено

- структура папок під усі секції з окремими `html / css / js` файлами;
- підключення HTML partials через `vite-plugin-html-inject`;
- базові бібліотеки під вимоги ТЗ:
  - `accordion-js` для FAQ;
  - `swiper` для слайдерів;
  - `izitoast` для push-повідомлень;
  - `modern-normalize` для базового ресету;
- налаштовані `ESLint` і `Prettier`;
- готові скрипти для локальної розробки, білду й форматування.

## Технології

- `Vite`
- `HTML partials`
- `CSS`
- `Vanilla JavaScript (ES modules)`
- `accordion-js`
- `swiper`
- `izitoast`
- `ESLint`
- `Prettier`

## Швидкий старт

```bash
npm install
npm run dev
```

## Корисні команди

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Структура проєкту

```text
public/
src/
  img/
  js/
    api/
    helpers/
    header/
    hero/
    furniture/
    about/
    faq/
    feedback/
    modals/
  partials/
  css/
    base/
    layouts/
```

## Робота в команді

- `main` тримай як стабільну гілку.
- Під кожну секцію зручно створювати окрему гілку:
  - `feature/header`
  - `feature/hero`
  - `feature/furniture`
  - `feature/about`
  - `feature/faq`
  - `feature/feedback`
  - `feature/modals`
  - `feature/footer`
- Кожен учасник працює переважно у своєму наборі файлів:
  - `src/partials/<section>.html`
  - `src/css/layouts/<section>.css`
  - `src/js/<section>/<section>.js`

## API

У репозиторії вже є заготовки для роботи з API:

- `GET /categories`
- `GET /furnitures`
- `GET /furnitures/:id`
- `GET /feedbacks`
- `POST /orders`

Для базової URL-адреси API використовуй змінну середовища:

```env
VITE_API_BASE_URL=https://furniture-store-v2.b.goit.study/api
```
