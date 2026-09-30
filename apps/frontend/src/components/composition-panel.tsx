import { Avatar } from '@/components/ui/avatar';
import { GlassPanel } from '@/components/ui/glass-panel';
import { PLATFORM_STATS } from '@/lib/mock-data';

const R = 54;
const CIRC = 2 * Math.PI * R;
const GAP = 6; // folga entre arcos, em px de circunferência

function arcs() {
  let offset = 0;
  return PLATFORM_STATS.pool.map((slice) => {
    const len = (slice.pct / 100) * CIRC - GAP;
    const dashoffset = -offset;
    offset += (slice.pct / 100) * CIRC;
    return { ...slice, len, dashoffset };
  });
}

export function CompositionPanel({ className }: { className?: string }) {
  const segments = arcs();

  return (
    <GlassPanel className={`flex flex-col p-6 ${className ?? ''}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="label text-faint">Nossa rede</span>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <svg
          viewBox="0 0 140 140"
          role="img"
          aria-label={`Distribuição dos talentos: ${PLATFORM_STATS.pool.map((p) => `${p.pct}% ${p.name.toLowerCase()}`).join(', ')}`}
          className="h-[140px] w-[140px] shrink-0 text-foreground"
        >
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--edge)" strokeWidth="15" />
          <g transform="rotate(-90 70 70)">
            {segments.map((s) => (
              <circle
                key={s.name}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="15"
                strokeDasharray={`${s.len} ${CIRC - s.len}`}
                strokeDashoffset={s.dashoffset}
              />
            ))}
          </g>
          <text x="70" y="68" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="27" letterSpacing="-1" fill="currentColor">
            {PLATFORM_STATS.totalStudents}
          </text>
          <text
            x="70"
            y="84"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontWeight={600}
            fontSize="9.5"
            letterSpacing="1.6"
            fill="currentColor"
            opacity={0.55}
          >
            TALENTOS
          </text>
        </svg>

        <div className="flex min-w-[150px] flex-1 flex-col gap-2.5">
          {PLATFORM_STATS.pool.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-pill" style={{ background: s.color }} />
              <span className="flex-1 text-[12.5px] tracking-[-0.008em] text-muted">{s.name}</span>
              <span className="font-mono text-[12.5px] tabular-nums">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5.5 pt-6">
        <span className="label text-faint">Atividade recente</span>
        <div className="mt-2">
          {PLATFORM_STATS.feed.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 border-t border-edge py-2.5">
              <Avatar initials={f.initials} bg={f.bg} size={26} />
              <span className="flex-1 truncate text-[12.5px] tracking-[-0.008em] text-muted">{f.text}</span>
              <span className="shrink-0 font-mono text-[10.5px] text-faint">{f.time}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
