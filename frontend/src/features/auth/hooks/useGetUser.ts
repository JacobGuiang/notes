import { useQuery } from '@tanstack/react-query';

import { getUser } from '../api/getUser';
import { isAxiosError } from 'axios';

interface UseUserOptions {
  throwOnUnauthorized?: boolean;
}

const defaultUseUserOptions = {
  throwOnUnauthorized: true,
};

export const useGetUser = (options?: UseUserOptions) => {
  const optionsWithDefaultValues = { ...defaultUseUserOptions, ...options };

  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    throwOnError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      if (isAxiosError(error) && error.response?.status === 401) {
        return optionsWithDefaultValues.throwOnUnauthorized;
      }
      return true;
    },
  });
};
