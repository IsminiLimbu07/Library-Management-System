// Centralized API utility to handle backend URL
// In development, we prefer using Vite's proxy by default (relative /api path)
// Set VITE_API_URL to override and use an absolute backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  
  // Add default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  return fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });
}

export { API_BASE_URL };