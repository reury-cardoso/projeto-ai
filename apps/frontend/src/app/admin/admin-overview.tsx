'use client';

import { ArrowUp, Eye, EyeOff, Inbox, Briefcase, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { ACTIVITY_LOG, VIEWS_30D, VIEWS_BY_STUDENT } from '@/lib/admin-mock';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  type Student,
  type StudentStatus,
} from '@/lib/mock-data';

export type AdminTab = 'overview' | 'cohorts' | 'students' | 'requests';

function Panel({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass rounded-lg p-6 ${className ?? ''}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="label text-faint">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: ReactNode;
}) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="label text-faint">{label}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-tint text-accent-text">
          {icon}
        </span>
      </div>
      <div className="mt-3 font-mono text-[34px] leading-none tracking-[-0.04em]">
        {value}
      </div>
      {hint && <div className="mt-2.5 text-[12px] text-muted">{hint}</div>}
    </div>
  );
}

function ViewsChart() {
  const max = Math.max(...VIEWS_30D);
  const total = VIEWS_30D.reduce((a, b) => a + b, 0);
  return (
    <Panel
      title="Visualizações de perfil · 30 dias"
      aside={
        <span className="font-mono text-[12px] text-muted">
          {total} no total
        </span>
      }
      className="lg:col-span-2"
    >
      <div
        className="flex h-44 items-end gap-[3px]"
        role="img"
        aria-label={`Visualizações por dia, ${total} no total em 30 dias`}
      >
        {VIEWS_30D.map((v, i) => (
          <div
            key={i}
            className="group relative flex h-full flex-1 items-end"
            title={`${v} visualizações`}
          >
            <div
              className="w-full rounded-t-[3px] bg-spark opacity-60 transition-opacity duration-300 ease-soft group-hover:opacity-100"
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10.5px] text-faint">
        <span>há 30 dias</span>
        <span>hoje</span>
      </div>
    </Panel>
  );
}

function StatusBreakdown({ students }: { students: Student[] }) {
  const keys = Object.keys(STATUS_LABEL) as StudentStatus[];
  const counts = keys.map((k) => ({
    key: k,
    n: students.filter((s) => s.status === k).length,
  }));
  const total = students.length || 1;
  return (
    <Panel title="Alunos por status">
      <div className="flex h-3 overflow-hidden rounded-pill bg-kbd">
        {counts.map((c) => (
          <div
            key={c.key}
            style={{
              width: `${(c.n / total) * 100}%`,
              background: STATUS_COLOR[c.key],
            }}
          />
        ))}
      </div>
      <ul className="mt-5 flex flex-col gap-3">
        {counts.map((c) => (
          <li
            key={c.key}
            className="flex items-center justify-between gap-3 text-[13px]"
          >
            <span className="flex items-center gap-2 text-muted">
              <span
                aria-hidden
                className="h-2 w-2 rounded-pill"
                style={{ background: STATUS_COLOR[c.key] }}
              />
              {STATUS_LABEL[c.key]}
            </span>
            <span className="font-mono text-foreground">
              {c.n}{' '}
              <span className="text-faint">
                · {Math.round((c.n / total) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function BarList({
  rows,
}: {
  rows: { label: string; value: number; color?: string }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <li
          key={r.label}
          className="grid grid-cols-[92px_1fr_auto] items-center gap-3 text-[12.5px]"
        >
          <span className="truncate font-mono text-muted">{r.label}</span>
          <span className="h-2 overflow-hidden rounded-pill bg-kbd">
            <span
              className="block h-full rounded-pill"
              style={{
                width: `${(r.value / max) * 100}%`,
                background: r.color ?? 'var(--color-amarelo)',
              }}
            />
          </span>
          <span className="font-mono text-foreground">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function AdminOverview({
  students,
  pending,
  onNavigate,
  scoped = false,
}: {
  students: Student[];
  pending: { contacts: number; status: number; deletions: number };
  onNavigate: (tab: AdminTab) => void;
  /** Visão de uma turma só: esconde o ranking de turmas. */
  scoped?: boolean;
}) {
  const visible = students.filter((s) => s.visible).length;
  const withLinkedin = students.filter((s) => s.linkedin).length;
  const pendingTotal = pending.contacts + pending.status + pending.deletions;
  const views30 = VIEWS_30D.reduce((a, b) => a + b, 0);

  const cohorts = [...new Set(students.map((s) => s.cohort))]
    .sort()
    .reverse()
    .map((c) => ({
      label: `turma ${c}`,
      value: students.filter((s) => s.cohort === c).length,
    }));

  const stackMap = new Map<string, { value: number; color: string }>();
  for (const s of students) {
    for (const l of s.github.languages) {
      stackMap.set(l.name, {
        value: (stackMap.get(l.name)?.value ?? 0) + 1,
        color: l.color,
      });
    }
    for (const c of s.customStacks ?? []) {
      stackMap.set(c.name, {
        value: (stackMap.get(c.name)?.value ?? 0) + 1,
        color: c.color,
      });
    }
  }
  const topStacks = [...stackMap.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topViewed = [...students]
    .map((s) => ({ s, views: VIEWS_BY_STUDENT[s.id] ?? 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          icon={<Users size={14} />}
          label="Alunos"
          value={String(students.length)}
        />
        <Kpi
          icon={<Eye size={14} />}
          label="Na vitrine"
          value={String(visible)}
          hint={`${Math.round((visible / (students.length || 1)) * 100)}% dos perfis`}
        />
        <Kpi
          icon={<EyeOff size={14} />}
          label="Ocultos"
          value={String(students.length - visible)}
        />
        <Kpi
          icon={<Briefcase size={14} />}
          label="Com LinkedIn"
          value={`${withLinkedin}/${students.length}`}
        />
        <Kpi
          icon={<Inbox size={14} />}
          label="Pendências"
          value={String(pendingTotal)}
          hint="contatos, status e exclusões"
        />
        <Kpi
          icon={<ArrowUp size={14} />}
          label="Visualizações"
          value={String(views30)}
          hint="nos últimos 30 dias"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ViewsChart />
        <StatusBreakdown students={students} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {!scoped && (
          <Panel title="Alunos por turma">
            <BarList rows={cohorts} />
          </Panel>
        )}
        <Panel title="Tecnologias mais usadas">
          <BarList rows={topStacks} />
        </Panel>
        <Panel title="Perfis mais vistos">
          <ul className="flex flex-col gap-3">
            {topViewed.map(({ s, views }) => (
              <li key={s.id} className="flex items-center gap-3">
                <Avatar initials={s.initials} bg={s.avatarBg} size={28} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                  {s.name}
                </span>
                <span className="font-mono text-[12px] text-muted">
                  {views}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Precisa da sua atenção">
          <ul className="flex flex-col gap-2.5">
            {[
              { label: 'Mensagens de empresas', n: pending.contacts },
              { label: 'Sugestões de status', n: pending.status },
              { label: 'Exclusões de conta', n: pending.deletions },
            ].map((r) => (
              <li
                key={r.label}
                className="flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="text-muted">{r.label}</span>
                <span
                  className={`font-mono ${r.n > 0 ? 'text-accent-text' : 'text-faint'}`}
                >
                  {r.n}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onNavigate('requests')}
            className="mt-5 text-[13px] font-semibold text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80"
          >
            Ver solicitações →
          </button>
        </Panel>
        <Panel title="Atividade recente" className="lg:col-span-2">
          <ul className="flex flex-col">
            {ACTIVITY_LOG.map((a) => (
              <li
                key={a.text}
                className="flex items-baseline justify-between gap-4 border-b border-edge py-2.5 text-[13px] last:border-b-0"
              >
                <span className="text-muted">{a.text}</span>
                <span className="shrink-0 font-mono text-[11px] text-faint">
                  {a.time}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
