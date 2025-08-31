// Centralized API utility to handle backend URL
// In development, we prefer using Vite's proxy by default (relative /api path)
// Set VITE_API_URL to override and use an absolute backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://library-management-system-jdgu.onrender.com';

// Helper function to get token from localStorage
function getAuthToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function apiFetch(path, options = {}) {
  // Ensure path always starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${normalizedPath}`;
  
  // Add default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Get token and add Authorization header if token exists
  const token = getAuthToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

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
        errorMsg = data.message || data.error || errorMsg;
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

// Helper function to set token after login
export function setAuthToken(token) {
  localStorage.setItem('token', token);
}

// Helper function to remove token on logout
export function removeAuthToken() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export { API_BASE_URL };