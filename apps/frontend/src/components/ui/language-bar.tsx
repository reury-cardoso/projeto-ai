import type { LanguageShare } from '@/lib/mock-data';
import { cn } from '@/lib/cn';

export function LanguageBar({
  languages,
  labelClassName,
}: {
  languages: LanguageShare[];
  labelClassName?: string;
}) {
  return (
    <div>
      <div className="mb-2.5 flex h-[7px] w-full overflow-hidden rounded-pill">
        {languages.map((l) => (
          <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {languages.map((l) => (
          <div key={l.name} className={cn('flex items-center gap-1.5 text-[11.5px] tracking-[-0.004em]', labelClassName)}>
            <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-pill" style={{ background: l.color }} />
            <span>
              {l.name} <span className="font-mono tabular-nums">{l.pct}</span>%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
