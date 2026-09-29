import type { ReactNode } from 'react';

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  className,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-6 flex items-center gap-3.5">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-kbd font-mono text-[10.5px] text-faint">
          {index}
        </span>
        <span className="h-px flex-1 bg-border" />
        <span className="label text-accent-text">{eyebrow}</span>
      </div>
      <h2 className="font-heading text-[clamp(30px,4vw,50px)] leading-[1.02] font-bold tracking-[-0.032em] text-balance">
        {title}
      </h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}
