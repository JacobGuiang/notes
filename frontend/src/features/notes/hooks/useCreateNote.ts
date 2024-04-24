import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '../api/createNote';

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      queryClient.setQueryData(['notes', { id: data.id }], data);
    },
  });
};
