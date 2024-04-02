import { Navigate } from 'react-router-dom';

import { lazyImport } from '@/utils/lazyImport';

import { App } from './App';

const { NotesRoutes } = lazyImport(
  () => import('@/features/notes'),
  'NotesRoutes'
);
const { Profile } = lazyImport(() => import('@/features/users'), 'Profile');

export const protectedRoutes = [
  {
    path: '/users/me',
    element: <App />,
    children: [
      { path: '/notes/*', element: <NotesRoutes /> },
      { path: '/', element: <Profile /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
