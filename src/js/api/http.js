import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

function getErrorMessage(error) {
  const response = typeof error === 'object' && error !== null ? error.response : undefined;
  const data = response?.data;

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }

  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (response?.status) {
    return `Request failed with status ${response.status}.`;
  }

  return 'Network request failed.';
}

function normalizeParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
}

export async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL in your local .env file.');
  }

  const { params = {}, ...axiosOptions } = options;

  try {
    const response = await axios({
      baseURL: BASE_URL,
      params: normalizeParams(params),
      url: path,
      ...axiosOptions,
    });

    if (response.status === 204) {
      return null;
    }

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
}
