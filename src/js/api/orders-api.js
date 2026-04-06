import { request } from './http.js';

export function createOrder(payload) {
  return request('/orders', {
    data: payload,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
