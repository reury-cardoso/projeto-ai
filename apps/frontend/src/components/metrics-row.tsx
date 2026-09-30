import { ArrowUp } from 'lucide-react';
import { PLATFORM_STATS } from '@/lib/mock-data';

const STATS = [
  { label: 'Talentos na rede', value: String(PLATFORM_STATS.totalStudents), delta: '12', bars: [28, 34, 30, 42, 46, 44, 55, 62, 58, 72, 84, 100] },
  { label: 'Turmas ativas', value: String(PLATFORM_STATS.activeCohorts).padStart(2, '0'), delta: '1', bars: [34, 34, 50, 50, 50, 66, 66, 66, 82, 82, 100, 100] },
  { label: 'Tecnologias dominadas', value: String(PLATFORM_STATS.mappedLanguages), delta: null, bars: [52, 60, 48, 66, 58, 72, 64, 78, 70, 84, 76, 92] },
];

export function MetricsRow() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between gap-4">
        <span className="label text-faint">A rede em números</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="group glass glass-hover min-w-[200px] flex-1 rounded-lg p-5">
            <div className="flex items-center justify-between gap-2.5">
              <span className="label text-faint">{s.label}</span>
              {s.delta && (
                <span className="inline-flex h-[22px] items-center gap-1 rounded-pill bg-tint px-2.5 font-mono text-[10.5px] text-accent-text">
                  <ArrowUp size={8} strokeWidth={3} />
                  {s.delta}
                </span>
              )}
            </div>
            <div className="mt-3.5 font-mono text-[38px] leading-none font-normal tracking-[-0.045em]">{s.value}</div>
            <div className="mt-4 flex h-7 items-end gap-[3px]" aria-hidden>
              {s.bars.map((h, i) => (
                <div
                  key={i}
                  className="w-[5px] rounded-[3px] bg-spark opacity-50 transition-opacity duration-500 ease-soft group-hover:opacity-100"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
