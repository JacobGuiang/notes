import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteNote } from '../api/deleteNote';

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
};
