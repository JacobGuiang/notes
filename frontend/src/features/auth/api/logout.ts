import { axios } from '@/lib/axios';

export const logout = (): Promise<Record<string, never>> => {
  return axios.post('/auth/logout');
};
