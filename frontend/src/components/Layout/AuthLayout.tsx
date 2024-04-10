import * as React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-8">
      <h1 className="text-primary text-8xl">Notes</h1>
      {children}
    </div>
  );
};
