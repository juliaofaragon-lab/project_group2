# Mebleriia

Mebleriia is a responsive landing page for a furniture store. The project helps users browse furniture categories, view product cards, open a detailed furniture modal, and send an order request through a feedback form modal.

## Tech Stack

- HTML partials
- CSS
- JavaScript (ES modules)
- Vite
- Axios
- accordion-js
- iziToast
- Swiper
- ESLint
- Prettier

## Features

- fixed header with anchor navigation
- hero section with responsive background images
- furniture list loaded from backend
- category filtering and pagination by 8 items
- furniture details modal with gallery, colors, rating, description, and dimensions
- order modal with POST request to the backend
- FAQ accordion
- footer with anchor navigation and social links

## Project Structure

```text
public/
src/
  css/
    base/
    layouts/
  img/
  js/
    about/
    api/
    faq/
    furniture/
    header/
    helpers/
    modals/
  partials/
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local `.env` file in the project root and add:

```env
VITE_API_BASE_URL=https://furniture-store-v2.b.goit.study/api
```

3. Start the development server:

```bash
npm run dev
```

## Available Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Deployment

The production build is created with:

```bash
npm run build
```

The project uses Vite with the `--base=/project_group2/` build option for GitHub Pages deployment.

## API

The project uses the Furniture Store API for:

- `GET /categories`
- `GET /furnitures`
- `GET /furnitures/:id`
- `GET /feedbacks`
- `POST /orders`

## Notes

- Feedback section integration is still pending.
- Static content images use responsive sources where available.
