import type { ReactNode } from 'react';

export function AuthCard({
  eyebrow,
  title,
  lead,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1280px] items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-[420px]">
        <span className="label text-accent-text">{eyebrow}</span>
        <h1 className="font-heading mt-2 text-[28px] font-bold tracking-[-0.028em]">{title}</h1>
        {lead && <p className="prose-body mt-2 text-muted">{lead}</p>}

        <div className="glass mt-8 rounded-lg p-6">{children}</div>

        {footer && <div className="mt-5 text-center text-[13px] text-muted">{footer}</div>}
      </div>
    </div>
  );
}
