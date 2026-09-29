'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Segmented } from '@/components/ui/segmented';
import { StudentTile } from '@/components/student-tile';
import { COHORTS, STATUS_LABEL, STUDENTS, type StudentStatus } from '@/lib/mock-data';

const STATUS_OPTIONS: { value: StudentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'in_training', label: STATUS_LABEL.in_training },
  { value: 'graduated', label: STATUS_LABEL.graduated },
  { value: 'employed', label: STATUS_LABEL.employed },
];

export function VitrineGrid() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StudentStatus | 'all'>('all');
  const [cohort, setCohort] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((s) => {
      if (!s.visible) return false;
      if (status !== 'all' && s.status !== status) return false;
      if (cohort !== 'all' && s.cohort !== cohort) return false;
      if (!q) return true;
      const haystack = [
        s.name,
        s.cohort,
        s.github.bio,
        ...s.github.languages.map((l) => l.name),
        s.linkedin?.headline ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, status, cohort]);

  return (
    <div>
      <div className="glass mb-8 flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-11 items-center gap-2.5 rounded-md border border-border bg-raise px-3.5 sm:w-[280px]">
          <Search size={15} strokeWidth={1.7} className="shrink-0 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="nome, stack, turma…"
            aria-label="Buscar por nome, stack ou turma"
            className="w-full bg-transparent text-[13.5px] tracking-[-0.006em] text-foreground outline-none placeholder:text-faint"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={STATUS_OPTIONS} value={status} onChange={(v) => setStatus(v as StudentStatus | 'all')} tone="neutral" />
          <select
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            aria-label="Filtrar por turma"
            className="h-8 rounded-pill border border-border bg-transparent px-3 text-[12.5px] font-semibold text-muted outline-none"
          >
            <option value="all">Todas as turmas</option>
            {COHORTS.map((c) => (
              <option key={c} value={c}>
                Turma {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 font-mono text-[11px] text-faint">
        {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-lg p-12 text-center text-muted">
          Nenhum aluno encontrado com esses filtros.
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StudentTile key={s.id} student={s} />
          ))}
        </div>
      )}
    </div>
  );
}
