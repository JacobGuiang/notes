import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateNote } from '../api/updateNote';
import { NoteUpdate } from '../types';

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteUpdate: NoteUpdate) =>
      updateNote(noteUpdate.id, noteUpdate.content),
    onSuccess: (data) =>
      queryClient.setQueryData(['notes', { id: data.id }], data),
  });
};
