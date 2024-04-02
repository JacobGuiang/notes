import * as React from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <div>TODO: MainLayout</div>
      <main>{children}</main>
    </div>
  );
};
