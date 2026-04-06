import { request } from './http.js';

import axios from 'axios';
axios.defaults.baseURL = 'https://furniture-store-v2.b.goit.study/api';

export function getFurnitureById(id) {
  return request(`/furnitures/${id}`);
}

export async function getCategories() {
  const { data } = await axios('/categories');

  return data;
}

export async function getProductsByCategory(category, page) {
  if (category === 'all') {
    const { data } = await axios(`/furnitures?limit=8&page=${page}`);
    return data;
  }
  const { data } = await axios(`/furnitures?category=${category}&limit=8&page=${page}`);
  return data;
}
