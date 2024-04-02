import { Outlet } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';

export const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
