import { axios } from '@/lib/axios';

import { AuthUser } from '../types';

export const getUser = (): Promise<AuthUser> =>
  axios
    .get('/users/me', { withCredentials: true })
    .then((response) => response.data);
