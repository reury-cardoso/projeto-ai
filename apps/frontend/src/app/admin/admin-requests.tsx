'use client';

import { ArrowUpRight, Check, Mail, Trash2, X } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useState, type ReactNode } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type {
  ContactRequestItem,
  DeletionItem,
  StatusChangeItem,
} from '@/lib/admin-mock';
import { STATUS_COLOR, STATUS_LABEL, type Student } from '@/lib/mock-data';

function Group({
  title,
  count,
  empty,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  children: ReactNode;
}) {
  return (
    <section className="glass rounded-lg">
      <div className="flex items-center gap-3 border-b border-edge px-6 py-4">
        <h2 className="label text-faint">{title}</h2>
        <span className="rounded-pill bg-tint px-2 font-mono text-[11px] text-accent-text">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="px-6 py-6 text-[13px] text-faint">{empty}</p>
      ) : (
        <ul>{children}</ul>
      )}
    </section>
  );
}

function ActionButton({
  onClick,
  children,
  tone = 'default',
}: {
  onClick: () => void;
  children: ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-pill border border-border px-3 text-[12px] font-semibold transition-[border-color,background-color] duration-300 ease-soft hover:border-border-strong hover:bg-raise ${
        tone === 'danger' ? 'text-orquidea' : 'text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

export function AdminRequests({
  students,
  contacts,
  statusChanges,
  deletions,
  onHandleContact,
  onResolveStatus,
  onConfirmDeletion,
}: {
  students: Student[];
  contacts: ContactRequestItem[];
  statusChanges: StatusChangeItem[];
  deletions: DeletionItem[];
  onHandleContact: (id: string) => void;
  onResolveStatus: (id: string, approve: boolean) => void;
  onConfirmDeletion: (id: string) => void;
}) {
  const [toDelete, setToDelete] = useState<DeletionItem | null>(null);
  const byId = (id: string) => students.find((s) => s.id === id);
  const pendingContacts = contacts.filter((c) => !c.handled);
  const pendingStatus = statusChanges.filter((s) => s.state === 'pending');
  const target = toDelete ? byId(toDelete.studentId) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Group
        title="Mensagens de empresas"
        count={pendingContacts.length}
        empty="Nenhuma mensagem pendente."
      >
        {pendingContacts.map((c) => {
          const s = byId(c.studentId);
          return (
            <li
              key={c.id}
              className="flex flex-col gap-3 border-b border-edge px-6 py-5 last:border-b-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[13.5px]">
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-muted">
                    {' '}
                    · {c.company || 'sem empresa'} ·{' '}
                  </span>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-accent-text hover:opacity-80"
                  >
                    {c.email}
                  </a>
                </div>
                <span className="font-mono text-[11px] text-faint">
                  {c.when}
                </span>
              </div>
              <p className="prose-body text-muted">{c.message}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {s ? (
                  <Link
                    href={`/alunos/${s.slug}`}
                    title={`Abrir o perfil de ${s.name}`}
                    className="group inline-flex h-9 items-center gap-2.5 rounded-pill border border-border py-1 pr-3.5 pl-1 text-[12.5px] font-semibold transition-[border-color,background-color] duration-300 ease-soft hover:border-border-strong hover:bg-raise"
                  >
                    <Avatar initials={s.initials} bg={s.avatarBg} size={26} />
                    <span>
                      <span className="font-normal text-muted">
                        Ver perfil de{' '}
                      </span>
                      {s.name}
                    </span>
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="text-faint transition-transform duration-300 ease-glide group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-text"
                    />
                  </Link>
                ) : (
                  <span className="font-mono text-[11.5px] text-faint">
                    aluno removido
                  </span>
                )}
                <ActionButton onClick={() => onHandleContact(c.id)}>
                  <Mail size={13} /> Marcar como atendido
                </ActionButton>
              </div>
            </li>
          );
        })}
      </Group>

      <Group
        title="Sugestões de status"
        count={pendingStatus.length}
        empty="Nenhuma sugestão pendente."
      >
        {pendingStatus.map((r) => {
          const s = byId(r.studentId);
          if (!s) return null;
          return (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-edge px-6 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Avatar initials={s.initials} bg={s.avatarBg} size={32} />
                <div className="text-[13.5px]">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-[12px] text-muted">
                    {STATUS_LABEL[s.status]} →{' '}
                    <span style={{ color: STATUS_COLOR[r.requested] }}>
                      {STATUS_LABEL[r.requested]}
                    </span>
                    <span className="font-mono text-faint"> · {r.when}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <ActionButton onClick={() => onResolveStatus(r.id, true)}>
                  <Check size={13} /> Aprovar
                </ActionButton>
                <ActionButton onClick={() => onResolveStatus(r.id, false)}>
                  <X size={13} /> Recusar
                </ActionButton>
              </div>
            </li>
          );
        })}
      </Group>

      <Group
        title="Exclusões de conta"
        count={deletions.length}
        empty="Nenhuma exclusão solicitada."
      >
        {deletions.map((d) => {
          const s = byId(d.studentId);
          if (!s) return null;
          return (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-edge px-6 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Avatar initials={s.initials} bg={s.avatarBg} size={32} />
                <div className="text-[13.5px]">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-[12px] text-muted">
                    Perfil já oculto da vitrine{' '}
                    <span className="font-mono text-faint">
                      · solicitado {d.when}
                    </span>
                  </div>
                </div>
              </div>
              <ActionButton tone="danger" onClick={() => setToDelete(d)}>
                <Trash2 size={13} /> Excluir definitivamente
              </ActionButton>
            </li>
          );
        })}
      </Group>

      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="Excluir definitivamente?"
      >
        <p className="prose-body text-muted">
          Isso apaga todos os dados de {target?.name ?? 'este aluno'} (perfil,
          LinkedIn, cache do GitHub, projetos e contatos). Não dá para desfazer.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              if (toDelete) onConfirmDeletion(toDelete.id);
              setToDelete(null);
            }}
            className="h-11 pl-5 text-[13.5px]"
          >
            Sim, excluir
          </Button>
          <Button
            variant="ghost"
            onClick={() => setToDelete(null)}
            className="h-11 text-[13.5px]"
          >
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
