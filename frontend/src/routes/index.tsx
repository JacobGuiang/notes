import { Navigate, useRoutes } from 'react-router-dom';

import { useGetUser } from '@/features/auth';
import { Landing } from '@/features/misc';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  const user = useGetUser({ throwOnUnauthorized: false });

  const commonRoutes = [
    { path: '/', element: <Landing /> },
    { path: '*', element: <Navigate to="." /> },
  ];

  const routes = user.data ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
