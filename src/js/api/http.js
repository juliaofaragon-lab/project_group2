const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

async function getErrorMessage(response) {
  try {
    const data = await response.json();

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }
  } catch {
    // Ignore JSON parsing errors and fall back to the status message.
  }

  return `Request failed with status ${response.status}.`;
}

function buildUrl(path, params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();

  return `${BASE_URL}${path}${query ? `?${query}` : ''}`;
}

export async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL in your local .env file.');
  }

  const { params = {}, ...fetchOptions } = options;
  const response = await fetch(buildUrl(path, params), fetchOptions);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
