import { axios } from '@/lib/axios';

import { Note } from '../types';

export const createNote = (): Promise<Note> =>
  axios
    .post('/users/me/notes', { content: '' })
    .then((response) => response.data);
