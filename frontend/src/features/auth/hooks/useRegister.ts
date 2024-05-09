import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CredentialsDTO, login, register } from '@/features/auth';

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: CredentialsDTO) => register(credentials),
    onSuccess: async (_user, credentials) => {
      await login(credentials);
      queryClient.invalidateQueries();
    },
  });
};
