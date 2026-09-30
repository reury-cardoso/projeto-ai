'use client';

import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { ActivityGrid } from '@/components/ui/activity-grid';
import { LanguageBar } from '@/components/ui/language-bar';
import { MarkedLink } from '@/components/ui/marked-link';
import { STATUS_LABEL, type Student } from '@/lib/mock-data';
import { cn } from '@/lib/cn';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AMARELO_VARS: CSSProperties = {
  ['--card-bg' as string]: 'var(--color-amarelo-claro)',
  ['--card-fg' as string]: 'var(--color-amarelo-profundo)',
  ['--card-muted' as string]: 'color-mix(in srgb, var(--color-amarelo-profundo) 72%, transparent)',
  ['--card-layer-a' as string]: 'var(--color-roxo-medio)',
  ['--card-layer-b' as string]: 'var(--color-amarelo)',
  ['--card-shadow' as string]:
    'inset 0 1px 0 rgba(255,255,255,.5), 0 2px 4px rgba(39,12,39,.1), 0 22px 44px -16px rgba(39,12,39,.3)',
};

/** O componente de marca: nome em Dela Gothic ancorado embaixo de um painel "crédito de pôster",
 * com duas camadas empilhadas atrás. Ver docs/design-plan.md §5. */
export function StudentCard({
  student,
  variant = 'auto',
  className,
}: {
  student: Student;
  variant?: 'auto' | 'amarelo';
  className?: string;
}) {
  const isAmarelo = variant === 'amarelo';
  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe(() => {
    gsap.to('.card-inner', { 
      rotationX: 1.5, 
      rotationY: -2, 
      y: -6, 
      duration: 0.6, 
      ease: 'power3.out',
      overwrite: 'auto'
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to('.card-inner', { 
      rotationX: 0, 
      rotationY: 0, 
      y: 0, 
      duration: 0.6, 
      ease: 'power3.out',
      overwrite: 'auto'
    });
  });

  return (
    <div 
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn('h-full [perspective:1600px]', className)} 
      style={isAmarelo ? AMARELO_VARS : undefined}
    >
      <div className="relative h-full">
        <div
          aria-hidden
          className="card-clip absolute inset-0"
          style={{ transform: 'translate(18px,18px) rotate(3deg)', background: 'var(--card-layer-a)' }}
        />
        <div
          aria-hidden
          className="card-clip absolute inset-0"
          style={{ transform: 'translate(9px,9px) rotate(1.5deg)', background: 'var(--card-layer-b)' }}
        />
        <div
          className="card-inner card-clip relative flex h-full flex-col bg-card p-7 text-card-foreground [transform-style:preserve-3d]"
          style={{ boxShadow: 'var(--card-shadow)' }}
        >
          <h3 className="mb-4.5 font-display text-[22px] leading-none tracking-[-0.022em] uppercase">
            {student.name}
          </h3>

          <div className="mb-4.5 flex gap-4">
            <span className="label" style={{ color: isAmarelo ? 'var(--card-fg)' : 'var(--color-amarelo-claro)' }}>
              Turma {student.cohort}
            </span>
            <span className="label" style={{ color: 'var(--card-muted)' }}>
              {STATUS_LABEL[student.status]}
            </span>
          </div>

          <div className="label mb-2.5" style={{ color: 'var(--card-muted)' }}>
            Atividade no GitHub
          </div>
          <div className="mb-5">
            <ActivityGrid activity={student.github.activity} color={isAmarelo ? 'var(--card-fg)' : 'var(--color-amarelo)'} />
          </div>

          <div className="label mb-2.5" style={{ color: 'var(--card-muted)' }}>
            Linguagens
          </div>
          <div className="mb-5.5" style={{ color: 'var(--card-muted)' }}>
            <LanguageBar languages={student.github.languages} />
          </div>

          <div className="mt-auto flex flex-col gap-2.5 text-[13.5px] font-medium tracking-[-0.008em]">
            <MarkedLink href={`/alunos/${student.slug}`} block>
              GitHub — {student.github.featuredRepos[0]?.description ?? student.github.bio}
            </MarkedLink>
            {student.linkedin && (
              <MarkedLink href={`/alunos/${student.slug}`} block>
                LinkedIn — {student.linkedin.headline}
              </MarkedLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
