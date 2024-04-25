import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import {
  CredentialsDTO,
  getUser,
  login,
  logout,
  register,
} from '@/features/auth';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    throwOnError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        if (error.response.data.message === 'Token expired') {
          window.location.assign(window.location.origin);
        }
        // don't use error boundary if API reponse was 401
        return false;
      }
      return true;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: CredentialsDTO) => login(credentials),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.setQueryData(['user'], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.setQueryData(['user'], undefined);
      window.location.assign(`${window.location.origin}/notes-app/`);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: CredentialsDTO) => register(credentials),
    onSuccess: async (user, credentials) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      await login(credentials);
      queryClient.setQueryData(['user'], user);
    },
  });
};
