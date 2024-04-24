import { axios } from '@/lib/axios';

import { Note } from '../types';

export const getNote = (id: number): Promise<Note> =>
  axios.get(`/users/me/notes/${id}`).then((response) => response.data);
