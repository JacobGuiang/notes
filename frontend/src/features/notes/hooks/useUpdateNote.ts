import { useMutation } from '@tanstack/react-query';

import { updateNote } from '../api/updateNote';
import { NoteUpdate } from '../types';

export const useUpdateNote = () => {
  return useMutation({
    mutationFn: (noteUpdate: NoteUpdate) =>
      updateNote(noteUpdate.id, noteUpdate.content),
    // no cache invalidation to prevent update from restting note editor history
  });
};
