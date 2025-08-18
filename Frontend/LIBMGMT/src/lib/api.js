// Centralized API utility to handle backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  return fetch(url, {
    credentials: 'include',
    ...options,
  });
}

export { API_BASE_URL };
