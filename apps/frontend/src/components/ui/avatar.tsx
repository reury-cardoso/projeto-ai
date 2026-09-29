import { cn } from '@/lib/cn';

export function Avatar({
  initials,
  bg,
  fg = 'var(--color-roxo-profundo)',
  size = 40,
  className,
}: {
  initials: string;
  bg: string;
  fg?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center rounded-pill font-bold', className)}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: Math.round(size * 0.32),
        letterSpacing: '.02em',
      }}
    >
      {initials}
    </div>
  );
}
