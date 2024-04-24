import { useQuery } from '@tanstack/react-query';

import { getNotes } from '../api/getNotes';

export const useGetNotes = () => {
  return useQuery({ queryKey: ['notes'], queryFn: getNotes });
};
