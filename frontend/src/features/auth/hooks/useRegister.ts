import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CredentialsDTO, login, register } from '@/features/auth';

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
