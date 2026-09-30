'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'next-view-transitions';
import { ArrowRight } from 'lucide-react';
import { STUDENTS } from '@/lib/mock-data';

const CELLS = 24;
const VISIBLE_ROWS = 6;
const ROW_HEIGHT = 44;
const LEVELS = [0.4, 0.62, 0.82, 1];

/** Stacks ordenadas pela quantidade de perfis que as usam: a maior vem primeiro. */
function rankStacks() {
  const map = new Map<string, { count: number; color: string }>();
  for (const s of STUDENTS) {
    if (!s.visible) continue;
    for (const l of s.github.languages) {
      const cur = map.get(l.name);
      map.set(l.name, { count: (cur?.count ?? 0) + 1, color: cur?.color ?? l.color });
    }
  }
  return [...map.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const STACKS = rankStacks();
const MAX = STACKS[0]?.count ?? 1;

export function StackGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const clamped = STACKS.length > VISIBLE_ROWS;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="glass rounded-lg p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="label text-faint">Tecnologias mais dominadas</span>
        <span className="hidden items-center gap-1.5 font-mono text-[10.5px] text-faint sm:flex">
          menos
          {LEVELS.map((l) => (
            <span key={l} aria-hidden className="h-2.5 w-2.5 rounded-[3px] bg-spark" style={{ opacity: l }} />
          ))}
          mais
        </span>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: clamped ? VISIBLE_ROWS * ROW_HEIGHT : undefined,
          maskImage: clamped ? 'linear-gradient(to bottom, #000 62%, transparent)' : undefined,
          WebkitMaskImage: clamped ? 'linear-gradient(to bottom, #000 62%, transparent)' : undefined,
        }}
      >
        {STACKS.map((stack, row) => {
          const filled = Math.max(1, Math.round((stack.count / MAX) * CELLS));
          return (
            <div
              key={stack.name}
              className="group flex items-center gap-4 rounded-md px-2 transition-colors duration-500 ease-soft hover:bg-raise"
              style={{ height: ROW_HEIGHT }}
              title={`${stack.name}: ${stack.count} ${stack.count === 1 ? 'perfil' : 'perfis'}`}
            >
              <span className="w-[92px] shrink-0 truncate font-mono text-[12.5px] text-muted transition-colors duration-500 ease-soft group-hover:text-foreground">
                {stack.name}
              </span>
              <div className="grid flex-1 gap-[3px]" style={{ gridTemplateColumns: `repeat(${CELLS}, minmax(0, 1fr))` }} aria-hidden>
                {Array.from({ length: CELLS }, (_, i) => {
                  const on = i < filled;
                  const level = LEVELS[(i * 5 + row * 3) % LEVELS.length];
                  return (
                    <span
                      key={i}
                      className="aspect-square rounded-[3px] transition-[opacity,transform] duration-700 ease-glide"
                      style={{
                        background: on ? stack.color : 'var(--kbd)',
                        opacity: inView ? (on ? level : 1) : 0,
                        transform: inView ? 'scale(1)' : 'scale(0.4)',
                        transitionDelay: inView ? `${row * 70 + i * 22}ms` : '0ms',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {clamped && (
        <Link
          href="/alunos"
          className="group mt-3 inline-flex items-center gap-1 font-mono text-[11.5px] text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80"
        >
          ver mais
          <ArrowRight size={12} className="transition-transform duration-300 ease-glide group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
