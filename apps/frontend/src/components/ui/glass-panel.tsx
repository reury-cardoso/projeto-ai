'use client';

import type { ElementType, ReactNode } from 'react';
import { useRef } from 'react';
import { cn } from '@/lib/cn';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function GlassPanel({
  as: Component = 'div',
  children,
  className,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<any>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe(() => {
    gsap.to(containerRef.current, { 
      backgroundColor: 'var(--glass-hi)', 
      borderColor: 'var(--edge-hi)', 
      boxShadow: 'inset 0 1px 0 var(--spec), var(--depth-hi)', 
      duration: 0.4, 
      ease: 'power3.out', 
      overwrite: 'auto' 
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(containerRef.current, { 
      backgroundColor: 'var(--glass)', 
      borderColor: 'var(--edge)', 
      boxShadow: 'inset 0 1px 0 var(--spec), var(--depth)', 
      duration: 0.4, 
      ease: 'power3.out', 
      overwrite: 'auto' 
    });
  });

  return (
    <Component 
      ref={containerRef} 
      onMouseEnter={onEnter} 
      onMouseLeave={onLeave} 
      className={cn('glass rounded-lg', className)}
    >
      {children}
    </Component>
  );
}
