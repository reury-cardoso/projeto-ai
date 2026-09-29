import { Link } from 'next-view-transitions';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Link com "marcador de texto": uma faixa de amarelo translúcido varre por baixo no hover. */
export function MarkedLink({
  href,
  children,
  className,
  block = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  block?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate',
        block && 'block',
        'before:absolute before:bottom-[-2px] before:left-0 before:-z-10 before:h-[8px] before:w-full before:origin-left before:scale-x-0 before:bg-amarelo/40 before:transition-transform before:duration-300 before:ease-[cubic-bezier(.32,.72,0,1)] hover:before:scale-x-100',
        className,
      )}
    >
      {children}
    </Link>
  );
}
