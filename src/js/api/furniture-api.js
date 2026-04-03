import { request } from './http.js';

export function getFurnitureById(id) {
  return request(`/furnitures/${id}`);
}
