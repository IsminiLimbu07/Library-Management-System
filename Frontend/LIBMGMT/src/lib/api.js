// Centralized API utility to handle backend URL
// In development, we prefer using Vite's proxy by default (relative /api path)
// Set VITE_API_URL to override and use an absolute backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://library-management-system-jdgu.onrender.com';

export function apiFetch(path, options = {}) {
  // Ensure path always starts with a slash
  // const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // const url = path.startsWith('http') ? path : `${API_BASE_URL}${normalizedPath}`;

  const url = API_BASE_URL ;
  
  
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
    // Always include credentials for cookies/session
    credentials: options.credentials || 'include',
    ...options,
    headers,
  }).then(async (res) => {
    // Optionally, throw for non-2xx responses to catch errors in UI
    if (!res.ok) {
      let errorMsg = 'Network error';
      try {
        const data = await res.json();
        errorMsg = data.message || errorMsg;
      } catch (e) {
        // fallback to text if not JSON
        try {
          errorMsg = await res.text();
        } catch {}
      }
      throw new Error(errorMsg);
    }
    return res;
  });
}

export { API_BASE_URL };