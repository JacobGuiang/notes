import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '../api/logout';

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
