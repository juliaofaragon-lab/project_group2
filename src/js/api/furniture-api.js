import { request } from './http.js';
import iziToast from 'izitoast';

export async function getFurnitureById(id) {
  try {
    return await request(`/furnitures/${id}`);
  } catch (error) {
    iziToast.error({
      message: error instanceof Error ? error.message : 'Не вдалося завантажити дані про товар.',
      position: 'bottomRight',
    });

    throw error;
  }
}

export function getCategories() {
  return request('/categories');
}

export function getProductsByCategory(category, page) {
  const params = {
    limit: 8,
    page,
  };

  if (category !== 'all') {
    params.category = category;
  }

  return request('/furnitures', { params });
}
