'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export interface SegmentedOption {
  value: string;
  label: string;
  count?: number;
}

export function Segmented({
  options,
  value,
  onChange,
  tone = 'dark',
}: {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  tone?: 'dark' | 'neutral';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onLeave = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onDown = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
  });

  const onUp = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'inline-flex flex-wrap gap-0.5 rounded-pill p-1',
        tone === 'dark' ? 'bg-white/[0.07]' : 'bg-raise',
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseDown={onDown}
            onMouseUp={onUp}
            onFocus={onEnter}
            onBlur={onLeave}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-pill px-3.5 text-[12.5px] font-semibold tracking-[-0.006em] transition-colors duration-300',
              active
                ? 'bg-amarelo text-roxo-profundo'
                : tone === 'dark'
                  ? 'text-white/70 hover:text-white'
                  : 'text-muted hover:text-foreground',
            )}
          >
            {opt.label}
            {opt.count !== undefined && <span className="font-mono text-[10.5px] opacity-60">{opt.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
