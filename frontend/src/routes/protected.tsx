import { Outlet, Navigate } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';
import { lazyImport } from '@/utils/lazyImport';

const { NotesRoutes } = lazyImport(
  () => import('@/features/notes'),
  'NotesRoutes'
);
const { Profile } = lazyImport(() => import('@/features/users'), 'Profile');

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: '/users/me/',
    element: <App />,
    children: [
      { path: 'notes/*', element: <NotesRoutes /> },
      { path: '', element: <Profile /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
