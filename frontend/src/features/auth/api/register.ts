import { axios } from '@/lib/axios';

import { AuthUser, CredentialsDTO } from '../types';

export const register = (data: CredentialsDTO): Promise<AuthUser> => {
  return axios.post('/auth/register', data);
};
