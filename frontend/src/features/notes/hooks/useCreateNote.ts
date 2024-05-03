import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '../api/createNote';

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    // onSuccess: (data) => queryClient.setQueryData(['notes', data.id], data),
    onSuccess: ({ id }) =>
      // invalidateQueries instead of setQueryData to force new notes to reset editor content
      queryClient.invalidateQueries({ queryKey: ['notes', id] }),
  });
};
