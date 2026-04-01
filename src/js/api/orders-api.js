const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';

export async function createOrder(payload) {
  if (!BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL in your local .env file.');
  }

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json();
}
