export const API_URL = (
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_REACT_APP_API_URL
    : import.meta.env.VITE_REACT_APP_API_TEST_URL
) as string;
