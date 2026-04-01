const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';

async function request(path, params = {}) {
  if (!BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL in your local .env file.');
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  const response = await fetch(`${BASE_URL}${path}${query ? `?${query}` : ''}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json();
}

export function getCategories() {
  return request('/categories');
}

export function getFurniture({ page = 1, limit = 8, category = '' } = {}) {
  return request('/furniture', { page, limit, category });
}

export function getFurnitureById(id) {
  return request(`/furniture/${id}`);
}

export function getFeedbacks() {
  return request('/feedbacks');
}
