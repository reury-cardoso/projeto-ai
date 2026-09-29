import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Pill({
  color,
  children,
  className,
}: {
  color: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold tracking-[-0.004em]',
        className,
      )}
      style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-pill" style={{ background: color }} />
      {children}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-pill bg-kbd px-2.5 font-mono text-[9.5px] font-medium tracking-[.14em] text-faint uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}
