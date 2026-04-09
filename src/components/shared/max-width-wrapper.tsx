import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
}

export function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
  return (
    <div className={cn('mx-auto w-full max-w-screen-xl px-4 md:px-20', className)}>
      {children}
    </div>
  );
}
