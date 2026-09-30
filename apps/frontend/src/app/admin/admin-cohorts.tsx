'use client';

import { ArrowLeft, ArrowUpRight, Eye, Users } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  VIEWS_BY_STUDENT,
  type ContactRequestItem,
  type DeletionItem,
  type StatusChangeItem,
} from '@/lib/admin-mock';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  type Student,
  type StudentStatus,
} from '@/lib/mock-data';
import { AdminOverview, type AdminTab } from './admin-overview';
import { AdminPanel } from './admin-panel';

const STATUSES = Object.keys(STATUS_LABEL) as StudentStatus[];

function CohortCard({
  cohort,
  students,
  onOpen,
}: {
  cohort: string;
  students: Student[];
  onOpen: () => void;
}) {
  const visible = students.filter((s) => s.visible).length;
  const views = students.reduce(
    (sum, s) => sum + (VIEWS_BY_STUDENT[s.id] ?? 0),
    0,
  );
  const total = students.length || 1;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group glass glass-hover flex flex-col gap-5 rounded-lg p-6 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="label text-faint">Turma</span>
          <div className="font-heading mt-1 text-[28px] leading-none font-bold tracking-[-0.03em]">
            {cohort}
          </div>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-tint text-accent-text transition-transform duration-300 ease-glide group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={15} strokeWidth={2} />
        </span>
      </div>

      <div
        className="flex h-2.5 overflow-hidden rounded-pill bg-kbd"
        aria-hidden
      >
        {STATUSES.map((st) => (
          <div
            key={st}
            style={{
              width: `${(students.filter((s) => s.status === st).length / total) * 100}%`,
              background: STATUS_COLOR[st],
            }}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {STATUSES.map((st) => {
          const n = students.filter((s) => s.status === st).length;
          if (!n) return null;
          return (
            <li
              key={st}
              className="flex items-center gap-1.5 text-[12px] text-muted"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-pill"
                style={{ background: STATUS_COLOR[st] }}
              />
              {n} {STATUS_LABEL[st].toLowerCase()}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-center gap-5 border-t border-edge pt-4 font-mono text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Users size={13} /> {students.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye size={13} /> {visible} na vitrine
        </span>
        <span className="ml-auto text-faint">{views} views</span>
      </div>
    </button>
  );
}

export function AdminCohorts({
  students,
  setStudents,
  contacts,
  statusChanges,
  deletions,
  onNavigate,
}: {
  students: Student[];
  setStudents: Dispatch<SetStateAction<Student[]>>;
  contacts: ContactRequestItem[];
  statusChanges: StatusChangeItem[];
  deletions: DeletionItem[];
  onNavigate: (tab: AdminTab) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const cohorts = [...new Set(students.map((s) => s.cohort))].sort().reverse();

  if (selected) {
    const inCohort = students.filter((s) => s.cohort === selected);
    const ids = new Set(inCohort.map((s) => s.id));
    const pending = {
      contacts: contacts.filter((c) => !c.handled && ids.has(c.studentId))
        .length,
      status: statusChanges.filter(
        (r) => r.state === 'pending' && ids.has(r.studentId),
      ).length,
      deletions: deletions.filter((d) => ids.has(d.studentId)).length,
    };

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="inline-flex h-9 items-center gap-2 rounded-pill border border-border px-3.5 text-[13px] font-semibold text-muted transition-[border-color,color] duration-300 ease-soft hover:border-border-strong hover:text-foreground"
          >
            <ArrowLeft size={14} strokeWidth={2} /> Todas as turmas
          </button>
          <h2 className="font-heading text-[22px] font-bold tracking-[-0.02em]">
            Turma {selected}
          </h2>
        </div>

        <AdminOverview
          students={inCohort}
          pending={pending}
          onNavigate={onNavigate}
          scoped
        />
        <AdminPanel
          students={inCohort}
          setStudents={setStudents}
          cohort={selected}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cohorts.map((c) => (
        <CohortCard
          key={c}
          cohort={c}
          students={students.filter((s) => s.cohort === c)}
          onOpen={() => setSelected(c)}
        />
      ))}
    </div>
  );
}
