import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router } from 'react-router-dom';

import { queryClient } from '@/lib/reactQuery';
import { Button } from '@/components/ui/button';
import { LoaderFallback } from '@/components/ui/LoaderFallback';

const ErrorFallback: React.ComponentType<FallbackProps> = ({
  resetErrorBoundary,
}) => {
  return (
    <div
      className="text-primary w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <div className="text-lg font-semibold">Something went wrong</div>
      <Button className="mt-4" onClick={resetErrorBoundary}>
        Refresh
      </Button>
    </div>
  );
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <React.Suspense
              fallback={<LoaderFallback className="w-screen h-screen" />}
            >
              {/* <Notifications /> */}
              <Router basename="/">{children}</Router>
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-left"
              />
            </React.Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
};
