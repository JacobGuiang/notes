import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '../api/logout';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      const promise = queryClient.invalidateQueries();
      window.location.assign(window.location.origin);
      return promise;
    },
  });
};
