import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function GlassPanel({
  as: Component = 'div',
  children,
  className,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return <Component className={cn('glass glass-hover rounded-lg', className)}>{children}</Component>;
}
