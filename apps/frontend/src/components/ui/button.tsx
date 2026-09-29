'use client';

import { Link } from 'next-view-transitions';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';
import { cn } from '@/lib/cn';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type Variant = 'primary' | 'ghost';

interface CommonProps {
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: undefined;
}

interface ButtonAsLink extends CommonProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const TICKS: { style: CSSProperties; delayMs: number }[] = [
  { style: { top: -4, left: -4, borderTop: '1.5px solid', borderLeft: '1.5px solid' }, delayMs: 0 },
  { style: { top: -4, right: -4, borderTop: '1.5px solid', borderRight: '1.5px solid' }, delayMs: 30 },
  { style: { bottom: -4, left: -4, borderBottom: '1.5px solid', borderLeft: '1.5px solid' }, delayMs: 60 },
  { style: { bottom: -4, right: -4, borderBottom: '1.5px solid', borderRight: '1.5px solid' }, delayMs: 90 },
];

export function Button({ variant = 'primary', icon, className, children, ...props }: ButtonProps) {
  const containerRef = useRef<any>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1.015, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    if (variant === 'primary') {
      gsap.to('.tick-mark', { opacity: 1, duration: 0.2, stagger: 0.03, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(containerRef.current, { boxShadow: '0 14px 30px -12px rgba(237,220,17,.55)', duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    }
    gsap.to('.btn-icon', { x: 3, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onLeave = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    if (variant === 'primary') {
      gsap.to('.tick-mark', { opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      gsap.to(containerRef.current, { boxShadow: '0 0px 0px 0px rgba(237,220,17,0)', duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    }
    gsap.to('.btn-icon', { x: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onDown = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 0.97, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
  });

  const onUp = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1.015, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const base = cn(
    'group relative inline-flex h-[52px] shrink-0 items-center gap-3 rounded-pill pl-6 pr-2 text-[14.5px] font-semibold tracking-[-0.01em] transition-colors duration-300',
    variant === 'primary' &&
      'bg-amarelo text-roxo-profundo hover:bg-amarelo-claro',
    variant === 'ghost' && 'glass-control border border-border pr-6 text-foreground hover:border-border-strong',
    className,
  );

  const content = (
    <>
      {variant === 'primary' &&
        TICKS.map((t, i) => (
          <span
            key={i}
            aria-hidden
            className="tick-mark pointer-events-none absolute h-[7px] w-[7px] border-roxo-profundo opacity-0"
            style={{ ...t.style }}
          />
        ))}
      {children}
      {icon && (
        <span
          className={cn(
            'btn-icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill',
            variant === 'primary' ? 'bg-roxo-profundo text-amarelo' : 'bg-raise text-muted',
          )}
        >
          {icon}
        </span>
      )}
    </>
  );

  const eventProps = {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
    onMouseUp: onUp,
    onFocus: onEnter,
    onBlur: onLeave,
  };

  if ('href' in props && props.href) {
    return (
      <Link ref={containerRef} href={props.href} className={base} {...eventProps} style={{ boxShadow: variant === 'primary' ? '0 0px 0px 0px rgba(237,220,17,0)' : undefined }}>
        {content}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton;
  return (
    <button ref={containerRef} type="button" className={base} {...buttonProps} {...eventProps} style={{ boxShadow: variant === 'primary' ? '0 0px 0px 0px rgba(237,220,17,0)' : undefined }}>
      {content}
    </button>
  );
}
