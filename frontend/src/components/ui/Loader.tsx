import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/cn';

interface LoaderProps {
  className?: string;
}

export const Loader = ({ className }: LoaderProps) => {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 flex items-center justify-center h-screen w-screen',
        className
      )}
    >
      <Loader2 className="h-1/6 w-1/6 animate-spin" />
    </div>
  );
};
