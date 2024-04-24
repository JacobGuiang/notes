import { axios } from '@/lib/axios';

import { Note } from '../types';

export const getNotes = (): Promise<Note[]> =>
  axios.get('/users/me/notes').then((response) => response.data);
