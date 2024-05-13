import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CredentialsDTO, login } from '@/features/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: CredentialsDTO) => login(credentials),
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
