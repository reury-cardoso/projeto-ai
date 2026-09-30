'use client';

import type { ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Card "sanfona": cabeçalho clicável que abre/fecha o conteúdo. Controlado por quem usa,
 * pra permitir um grupo com só um item aberto. `action` fica ao lado, fora do botão de abrir. */
export function AccordionCard({
  title,
  description,
  open,
  onOpenChange,
  action,
  progress,
  children,
}: {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: ReactNode;
  /** Campos obrigatórios preenchidos: completo mostra um check, senão "feitos/total". */
  progress?: { done: number; total: number };
  children: ReactNode;
}) {
  return (
    <section className="glass rounded-lg">
      <div className="flex items-center gap-3 pr-6">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
          className="flex min-w-0 flex-1 items-center justify-between gap-4 rounded-lg p-6 text-left"
        >
          <span className="min-w-0">
            <span className="font-heading block text-[16px] font-semibold tracking-[-0.014em]">
              {title}
            </span>
            {description && (
              <span className="mt-1 block text-[13px] font-normal text-muted">
                {description}
              </span>
            )}
          </span>
          <span className="flex shrink-0 items-center gap-3">
            {progress && <ProgressBadge {...progress} />}
            <ChevronDown
              size={18}
              strokeWidth={1.8}
              className={cn(
                'text-faint transition-transform duration-500 ease-glide',
                open && 'rotate-180 text-accent-text',
              )}
            />
          </span>
        </button>
        {action}
      </div>
      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-glide',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ProgressBadge({ done, total }: { done: number; total: number }) {
  if (done >= total) {
    return (
      <span
        role="img"
        aria-label="Campos obrigatórios preenchidos"
        className="flex h-6 w-6 items-center justify-center rounded-pill bg-tint text-accent-text"
      >
        <Check size={13} strokeWidth={2.4} />
      </span>
    );
  }
  return (
    <span
      aria-label={`${done} de ${total} campos obrigatórios preenchidos`}
      className="inline-flex h-6 items-center rounded-pill bg-kbd px-2.5 font-mono text-[11px] text-faint"
    >
      {done}/{total}
    </span>
  );
}
