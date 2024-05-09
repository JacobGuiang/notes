import { axios } from '@/lib/axios';

export const deleteNote = (id: number) =>
  axios.delete(`/users/me/notes/${id}`).then((response) => response.data);
