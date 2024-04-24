import { axios } from '@/lib/axios';

export const logout = (): Promise<Record<string, never>> =>
  axios.post('/auth/logout').then((response) => response.data);
