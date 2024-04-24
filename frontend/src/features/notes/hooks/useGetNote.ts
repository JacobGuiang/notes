import { useQuery } from '@tanstack/react-query';

import { getNote } from '../api/getNote';
import { isAxiosError } from 'axios';

export const useGetNote = (id: number) => {
  return useQuery({
    queryKey: ['notes', { id }],
    queryFn: () => getNote(id),
    throwOnError: (error) => {
      if (isAxiosError(error) && error.response?.status == 404) {
        return false;
      }
      return true;
    },
  });
};
