// Simple utility functions for the Library Management System

// Combine CSS classes (simple version without external dependencies)
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Format date helper
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Capitalize first letter
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Debounce function for search inputs
export function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}
