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
        'relative h-6 w-11 shrink-0 rounded-pill transition-[background-color,transform] duration-300 ease-glide hover:scale-105 active:scale-95',
        checked ? 'bg-amarelo' : 'bg-white/15',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-pill bg-roxo-profundo transition-transform duration-300 ease-glide',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
        style={{ background: checked ? 'var(--color-roxo-profundo)' : 'var(--fg)' }}
      />
    </button>
  );
}
