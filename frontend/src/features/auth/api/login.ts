import { axios } from '@/lib/axios';

import { AuthUser, CredentialsDTO } from '../types';

export const login = (data: CredentialsDTO): Promise<AuthUser> =>
  axios.post('/auth/login', data).then((response) => response.data);
