import { Navigate, useRoutes } from 'react-router-dom';

import { useGetUser } from '@/features/auth';
import { Landing } from '@/features/misc';
import { Loader } from '@/components/ui/Loader';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  const user = useGetUser({ throwOnUnauthorized: false });

  const commonRoutes = [
    { path: '/', element: <Landing /> },
    { path: '*', element: <Navigate to="." /> },
  ];

  const routes = user.isSuccess ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  if (user.isPending) {
    return <Loader />;
  }

  return <>{element}</>;
};
