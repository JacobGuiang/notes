import 'dotenv/config';

export const API_URL = (
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_TEST_URL
) as string;
