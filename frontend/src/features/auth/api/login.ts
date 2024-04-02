import { axios } from '@/lib/axios';

import { AuthUser, CredentialsDTO } from '../types';

export const login = (data: CredentialsDTO): Promise<AuthUser> => {
  return axios.post('/auth/login', data);
};
