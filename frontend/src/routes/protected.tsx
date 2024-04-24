import { Outlet, Navigate } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';
import { NotesRoutes } from '@/features/notes';
import { Profile } from '@/features/users';

// eslint-disable-next-line react-refresh/only-export-components
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
      { index: true, element: <Profile /> },
      { path: 'notes/*', element: <NotesRoutes /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
