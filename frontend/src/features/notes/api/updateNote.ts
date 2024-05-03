import { axios } from '@/lib/axios';

import { Note } from '../types';

export const updateNote = (id: number, content: string): Promise<Note> =>
  axios
    .patch(`/users/me/notes/${id}`, { content })
    .then((response) => response.data);
