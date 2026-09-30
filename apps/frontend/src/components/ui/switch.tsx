'use client';

import { cn } from '@/lib/cn';

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-pill transition-[background-color,scale] duration-300 ease-glide active:scale-95',
        checked ? 'bg-amarelo' : 'bg-border-strong',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-0.5 left-0 h-5 w-5 rounded-pill shadow-sm transition-[translate,background-color] duration-300 ease-glide',
          checked ? 'translate-x-[22px] bg-roxo-profundo' : 'translate-x-0.5 bg-foreground',
        )}
      />
    </button>
  );
}
