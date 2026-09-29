'use client';

import { Plus, Search, Upload } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextInput } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  STUDENTS,
  type Student,
  type StudentStatus,
} from '@/lib/mock-data';

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const AVATAR_COLORS = ['var(--color-amarelo)', 'var(--color-azul-ceu)', 'var(--color-orquidea)', 'var(--color-roxo-medio)'];

export function AdminPanel() {
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [cohort, setCohort] = useState('2025.2');
  const [lastInvite, setLastInvite] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => `${s.name} ${s.cohort} ${s.github.username}`.toLowerCase().includes(q));
  }, [students, query]);

  function toggleVisibility(id: string) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  }

  function setStatus(id: string, status: StudentStatus) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  function createStudent(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !github.trim()) return;
    const id = String(Date.now());
    const newStudent: Student = {
      id,
      slug: slugify(name),
      name,
      initials: name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join(''),
      cohort,
      status: 'in_training',
      visible: true,
      avatarBg: AVATAR_COLORS[students.length % AVATAR_COLORS.length],
      github: {
        username: github,
        bio: 'Aluno recém-cadastrado — dados do GitHub ainda não sincronizados.',
        publicRepos: 0,
        followers: 0,
        profileUrl: `https://github.com/${github}`,
        languages: [],
        featuredRepos: [],
        activity: Array.from({ length: 70 }, () => 0.12),
      },
      linkedin: null,
    };
    setStudents((prev) => [newStudent, ...prev]);
    setLastInvite(email);
    setName('');
    setEmail('');
    setGithub('');
    setShowForm(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-11 items-center gap-2.5 rounded-md border border-border bg-raise px-3.5 sm:w-[280px]">
          <Search size={15} strokeWidth={1.7} className="shrink-0 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aluno…"
            aria-label="Buscar aluno"
            className="w-full bg-transparent text-[13.5px] tracking-[-0.006em] text-foreground outline-none placeholder:text-faint"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <label className="glass-control inline-flex h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-4 text-[13px] font-medium text-muted transition-[border-color,color,transform] duration-300 ease-glide hover:scale-[1.02] hover:border-border-strong hover:text-foreground active:scale-[.97]">
            <Upload size={14} strokeWidth={1.8} />
            Importar planilha
            <input type="file" accept=".csv" className="hidden" onChange={() => setLastInvite('import-mock')} />
          </label>
          <Button onClick={() => setShowForm((v) => !v)} icon={<Plus size={16} strokeWidth={2} />}>
            Cadastrar aluno
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={createStudent} className="glass mb-8 grid gap-4 rounded-lg p-6 sm:grid-cols-2">
          <Field label="Nome completo" htmlFor="new-name">
            <TextInput id="new-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do aluno" />
          </Field>
          <Field label="E-mail" htmlFor="new-email">
            <TextInput id="new-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aluno@email.com" />
          </Field>
          <Field label="Usuário do GitHub" htmlFor="new-github">
            <TextInput id="new-github" required value={github} onChange={(e) => setGithub(e.target.value)} placeholder="usuario" />
          </Field>
          <Field label="Turma" htmlFor="new-cohort">
            <TextInput id="new-cohort" required value={cohort} onChange={(e) => setCohort(e.target.value)} placeholder="2025.2" />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit">Cadastrar e enviar convite</Button>
          </div>
        </form>
      )}

      {lastInvite && (
        <p className="mb-6 font-mono text-[12px] text-accent-text">
          {lastInvite === 'import-mock'
            ? 'Protótipo — importação de planilha chamaria POST /api/students/import.'
            : `Protótipo — e-mail de primeiro acesso seria enviado para ${lastInvite}.`}
        </p>
      )}

      <div className="mb-3 font-mono text-[11px] text-faint">
        {filtered.length} {filtered.length === 1 ? 'aluno' : 'alunos'}
      </div>

      <div className="glass overflow-hidden rounded-lg">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-edge px-5 py-3">
          <span className="label text-faint">Aluno</span>
          <span className="label hidden text-faint sm:block">Status</span>
          <span className="label hidden text-faint sm:block">Visível</span>
          <span className="label text-faint">GitHub</span>
        </div>
        {filtered.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-edge px-5 py-3.5 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar initials={s.initials} bg={s.avatarBg} size={32} />
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold tracking-[-0.012em]">{s.name}</div>
                <div className="font-mono text-[10.5px] text-faint">turma {s.cohort}</div>
              </div>
            </div>

            <select
              value={s.status}
              onChange={(e) => setStatus(s.id, e.target.value as StudentStatus)}
              aria-label={`Status de ${s.name}`}
              className="hidden h-7 rounded-pill border-none bg-transparent text-[11px] font-semibold outline-none sm:block"
              style={{ color: STATUS_COLOR[s.status] }}
            >
              {(Object.keys(STATUS_LABEL) as StudentStatus[]).map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABEL[st]}
                </option>
              ))}
            </select>

            <div className="hidden sm:block">
              <Switch checked={s.visible} onChange={() => toggleVisibility(s.id)} label={`Visibilidade de ${s.name}`} />
            </div>

            <a
              href={s.github.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[12px] text-muted transition-colors duration-300 ease-soft hover:text-accent-text"
            >
              @{s.github.username}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
