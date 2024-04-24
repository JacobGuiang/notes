import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/cn';

interface LoaderFallbackProps {
  className?: string;
}

export const LoaderFallback = ({ className }: LoaderFallbackProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-full h-full',
        className
      )}
    >
      <Loader2 className="h-1/6 w-1/6 animate-spin" />
    </div>
  );
};
