'use client';

import { Pencil, Plus, Search, Upload } from 'lucide-react';
import {
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Field, TextInput } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import {
  STATUS_COLOR,
  STATUS_LABEL,
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

const AVATAR_COLORS = [
  'var(--color-amarelo)',
  'var(--color-azul-ceu)',
  'var(--color-orquidea)',
  'var(--color-roxo-medio)',
];

export function AdminPanel({
  students,
  setStudents,
  cohort: fixedCohort,
}: {
  students: Student[];
  setStudents: Dispatch<SetStateAction<Student[]>>;
  /** Fixa a turma (visão de turma): esconde o filtro e usa como padrão no cadastro. */
  cohort?: string;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | StudentStatus>(
    'all',
  );
  const [cohortFilter, setCohortFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [cohort, setCohort] = useState(fixedCohort ?? '2025.2');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [liStudentId, setLiStudentId] = useState<string | null>(null);
  const [liDraft, setLiDraft] = useState({
    headline: '',
    currentPosition: '',
    education: '',
    profileUrl: '',
  });
  const liStudent = students.find((s) => s.id === liStudentId);

  function openLinkedin(s: Student) {
    setLiDraft(
      s.linkedin ?? {
        headline: '',
        currentPosition: '',
        education: '',
        profileUrl: '',
      },
    );
    setLiStudentId(s.id);
  }

  function saveLinkedin(e: FormEvent) {
    e.preventDefault();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === liStudentId ? { ...s, linkedin: { ...liDraft } } : s,
      ),
    );
    setLiStudentId(null);
  }
  const [lastInvite, setLastInvite] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter(
      (s) =>
        (statusFilter === 'all' || s.status === statusFilter) &&
        (cohortFilter === 'all' || s.cohort === cohortFilter) &&
        (!q ||
          `${s.name} ${s.cohort} ${s.github.username}`
            .toLowerCase()
            .includes(q)),
    );
  }, [students, query, statusFilter, cohortFilter]);
  const cohorts = useMemo(
    () => [...new Set(students.map((s) => s.cohort))].sort().reverse(),
    [students],
  );
  const selectClass =
    'h-11 rounded-md border border-border bg-raise px-3 text-[13px] text-foreground outline-none transition-[border-color] duration-300 ease-soft hover:border-border-strong focus:border-azul-ceu';

  function toggleVisibility(id: string) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );
  }

  function setStatus(id: string, status: StudentStatus) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
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
      linkedin: linkedinUrl.trim()
        ? {
            headline: '',
            currentPosition: '',
            education: '',
            profileUrl: linkedinUrl.trim(),
          }
        : null,
    };
    setStudents((prev) => [newStudent, ...prev]);
    setLastInvite(email);
    setName('');
    setEmail('');
    setGithub('');
    setLinkedinUrl('');
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
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | StudentStatus)
            }
            aria-label="Filtrar por status"
            className={selectClass}
          >
            <option value="all">Todos os status</option>
            {(Object.keys(STATUS_LABEL) as StudentStatus[]).map((st) => (
              <option key={st} value={st}>
                {STATUS_LABEL[st]}
              </option>
            ))}
          </select>
          {!fixedCohort && (
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              aria-label="Filtrar por turma"
              className={selectClass}
            >
              <option value="all">Todas as turmas</option>
              {cohorts.map((c) => (
                <option key={c} value={c}>
                  Turma {c}
                </option>
              ))}
            </select>
          )}
          <label className="glass-control inline-flex h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-4 text-[13px] font-medium text-muted transition-[border-color,color,transform] duration-300 ease-glide hover:scale-[1.02] hover:border-border-strong hover:text-foreground active:scale-[.97]">
            <Upload size={14} strokeWidth={1.8} />
            Importar planilha
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={() => setLastInvite('import-mock')}
            />
          </label>
          <Button
            onClick={() => setShowForm((v) => !v)}
            icon={<Plus size={16} strokeWidth={2} />}
          >
            Cadastrar aluno
          </Button>
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Cadastrar aluno"
      >
        <form onSubmit={createStudent} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" htmlFor="new-name">
            <TextInput
              id="new-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do aluno"
            />
          </Field>
          <Field label="E-mail" htmlFor="new-email">
            <TextInput
              id="new-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aluno@email.com"
            />
          </Field>
          <Field label="Usuário do GitHub" htmlFor="new-github">
            <TextInput
              id="new-github"
              required
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="usuario"
            />
          </Field>
          <Field label="Turma" htmlFor="new-cohort">
            <TextInput
              id="new-cohort"
              required
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              placeholder="2025.2"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="URL do LinkedIn (opcional)" htmlFor="new-linkedin">
              <TextInput
                id="new-linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Cadastrar e enviar convite</Button>
          </div>
        </form>
      </Modal>

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
        <div>
          <div className="hidden grid-cols-[minmax(0,1fr)_140px_72px_150px_130px] items-center gap-4 border-b border-edge px-5 py-3 lg:grid">
            <span className="label text-faint">Aluno</span>
            <span className="label text-faint">Status</span>
            <span className="label text-faint">Visível</span>
            <span className="label text-faint">LinkedIn</span>
            <span className="label text-faint">GitHub</span>
          </div>
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-edge px-5 py-3.5 last:border-b-0 lg:grid lg:grid-cols-[minmax(0,1fr)_140px_72px_150px_130px] lg:gap-4"
            >
              <div className="flex w-full min-w-0 items-center gap-3 lg:w-auto">
                <Avatar initials={s.initials} bg={s.avatarBg} size={32} />
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-semibold tracking-[-0.012em]">
                    {s.name}
                  </div>
                  <div className="font-mono text-[10.5px] text-faint">
                    turma {s.cohort}
                  </div>
                </div>
              </div>

              <select
                value={s.status}
                onChange={(e) =>
                  setStatus(s.id, e.target.value as StudentStatus)
                }
                aria-label={`Status de ${s.name}`}
                className="h-7 w-fit rounded-pill border-none bg-transparent text-[11px] font-semibold outline-none"
                style={{ color: STATUS_COLOR[s.status] }}
              >
                {(Object.keys(STATUS_LABEL) as StudentStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {STATUS_LABEL[st]}
                  </option>
                ))}
              </select>

              <div>
                <Switch
                  checked={s.visible}
                  onChange={() => toggleVisibility(s.id)}
                  label={`Visibilidade de ${s.name}`}
                />
              </div>

              <div className="flex items-center gap-1.5">
                {s.linkedin ? (
                  <>
                    <a
                      href={s.linkedin.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12.5px] font-medium text-muted transition-colors duration-300 ease-soft hover:text-accent-text"
                    >
                      LinkedIn
                    </a>
                    <button
                      type="button"
                      onClick={() => openLinkedin(s)}
                      aria-label={`Editar LinkedIn de ${s.name}`}
                      className="flex h-6 w-6 items-center justify-center rounded-pill text-faint transition-colors duration-300 ease-soft hover:bg-raise hover:text-foreground"
                    >
                      <Pencil size={12} strokeWidth={1.8} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openLinkedin(s)}
                    className="inline-flex h-7 items-center gap-1 rounded-pill border border-border px-2.5 text-[11.5px] font-semibold text-accent-text transition-[border-color,background-color] duration-300 ease-soft hover:border-border-strong hover:bg-raise"
                  >
                    <Plus size={12} strokeWidth={2} />
                    Adicionar
                  </button>
                )}
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

      <Modal
        open={liStudent !== undefined}
        onClose={() => setLiStudentId(null)}
        title={`LinkedIn de ${liStudent?.name ?? ''}`}
      >
        <form onSubmit={saveLinkedin} className="flex flex-col gap-4">
          <Field label="URL do LinkedIn" htmlFor="li-admin-url">
            <TextInput
              id="li-admin-url"
              type="url"
              required
              value={liDraft.profileUrl}
              onChange={(e) =>
                setLiDraft((d) => ({ ...d, profileUrl: e.target.value }))
              }
              placeholder="https://linkedin.com/in/..."
            />
          </Field>
          <Field label="Headline" htmlFor="li-admin-headline">
            <TextInput
              id="li-admin-headline"
              value={liDraft.headline}
              onChange={(e) =>
                setLiDraft((d) => ({ ...d, headline: e.target.value }))
              }
              placeholder="Ex.: Desenvolvedora Full Stack"
            />
          </Field>
          <Field label="Cargo atual" htmlFor="li-admin-position">
            <TextInput
              id="li-admin-position"
              value={liDraft.currentPosition}
              onChange={(e) =>
                setLiDraft((d) => ({ ...d, currentPosition: e.target.value }))
              }
              placeholder="Ex.: Empresa X"
            />
          </Field>
          <Field label="Formação" htmlFor="li-admin-education">
            <TextInput
              id="li-admin-education"
              value={liDraft.education}
              onChange={(e) =>
                setLiDraft((d) => ({ ...d, education: e.target.value }))
              }
              placeholder="Ex.: Programadores do Amanhã — Turma 2025.2"
            />
          </Field>
          <p className="text-[12px] text-faint">
            Vale o último a salvar: se o aluno editar depois, a versão dele
            substitui esta.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="h-11 pl-5 text-[13.5px]">
              Salvar LinkedIn
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLiStudentId(null)}
              className="h-11 text-[13.5px]"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
