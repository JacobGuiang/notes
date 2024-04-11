export const API_URL =
  import.meta.env.MODE === 'production'
    ? (import.meta.env.VITE_REACT_APP_API_URL as string)
    : '/api';
