'use client';

import { useRef, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme !== 'light' : true;

  const onEnter = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1.05, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onLeave = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onDown = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 0.94, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
  });

  const onUp = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1.05, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      aria-label={isDark ? 'Ver versão clara' : 'Ver versão escura'}
      className={cn(
        'glass-control relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-pill border border-border text-muted transition-colors duration-300 hover:border-border-strong hover:text-foreground',
        className,
      )}
    >
      <Sun
        size={15}
        strokeWidth={1.7}
        className={cn(
          'absolute transition-all duration-300 ease-glide',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0',
        )}
      />
      <Moon
        size={15}
        strokeWidth={1.7}
        className={cn(
          'absolute transition-all duration-300 ease-glide',
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
    </button>
  );
}
