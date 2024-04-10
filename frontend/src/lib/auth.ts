import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: CredentialsDTO) => login(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      queryClient.setQueryData(['user'], data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.setQueryData(['user'], undefined);
      window.location.assign(`${window.location.origin}/notes-app/`);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: CredentialsDTO) => register(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      queryClient.setQueryData(['user'], data);
    },
  });
};
