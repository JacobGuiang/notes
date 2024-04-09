import { lazyImport } from '@/utils/lazyImport';
import { Suspense } from 'react';

const { AuthRoutes } = lazyImport(
  () => import('@/features/auth'),
  'AuthRoutes'
);

export const publicRoutes = [
  {
    path: '/auth/*',
    element: (
      <Suspense fallback={null}>
        <AuthRoutes />
      </Suspense>
    ),
  },
];
