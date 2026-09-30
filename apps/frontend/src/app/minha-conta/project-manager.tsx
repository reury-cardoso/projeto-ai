'use client';

import { useRef, useState } from 'react';
import { GitBranch, ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import { AccordionCard } from '@/components/ui/accordion-card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Field, TextArea, TextInput } from '@/components/ui/field';
import { getProjects, type Project, type ProjectLink, type Student } from '@/lib/mock-data';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface Draft {
  id: string | null;
  repoUrl: string;
  repoName: string;
  title: string;
  description: string;
  links: ProjectLink[];
  image?: string;
}

/** "https://github.com/user/repo(.git)" → "repo"; vazio se não for link de repositório. */
const repoNameFromUrl = (url: string) => url.trim().match(/github\.com\/[\w.-]+\/([\w.-]+?)(?:\.git)?\/?$/i)?.[1] ?? '';

const EMPTY_LINK: ProjectLink = { label: '', url: '' };

/** Feed "Projetos": o aluno conecta um repositório e personaliza o post. Sem backend ainda, o estado é local. */
export function ProjectManager({
  student,
  open,
  onOpenChange,
}: {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [projects, setProjects] = useState<Project[]>(() => getProjects(student.id));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [imageError, setImageError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const startNew = () => {
    setDraft({
      id: null,
      repoUrl: '',
      repoName: '',
      title: '',
      description: '',
      links: [{ ...EMPTY_LINK, label: 'Ver online' }],
    });
    setImageError('');
  };

  const startEdit = (p: Project) => {
    setDraft({
      id: p.id,
      repoUrl: p.repoUrl,
      repoName: p.repoName,
      title: p.title,
      description: p.description,
      links: p.links.length ? p.links.map((l) => ({ ...l })) : [{ ...EMPTY_LINK }],
      image: p.image,
    });
    setImageError('');
  };

  const changeRepoUrl = (url: string) => {
    const name = repoNameFromUrl(url);
    setDraft((d) =>
      d
        ? {
            ...d,
            repoUrl: url,
            repoName: name,
            // sugere o título a partir do link só enquanto o aluno não personalizou
            title: !d.title || d.title === d.repoName ? name : d.title,
          }
        : d,
    );
  };

  const updateLink = (i: number, patch: Partial<ProjectLink>) =>
    setDraft((d) => (d ? { ...d, links: d.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) } : d));

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setImageError('Escolha um arquivo de imagem.');
    if (file.size > MAX_IMAGE_BYTES) return setImageError('A imagem deve ter até 2 MB.');
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => (d ? { ...d, image: String(reader.result) } : d));
    reader.readAsDataURL(file);
  };

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const built: Project = {
      id: draft.id ?? `local-${Date.now()}`,
      repoName: draft.repoName,
      repoUrl: draft.repoUrl.trim(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      links: draft.links.filter((l) => l.url.trim()).map((l) => ({ label: l.label.trim() || 'Ver projeto', url: l.url.trim() })),
      image: draft.image,
      createdAt: projects.find((p) => p.id === draft.id)?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
    setProjects((cur) => (draft.id ? cur.map((p) => (p.id === draft.id ? built : p)) : [built, ...cur]));
    setDraft(null);
  };

  return (
    <AccordionCard
      title="Projetos"
      description="Conecte um repositório e apresente o projeto no seu perfil."
      open={open}
      onOpenChange={onOpenChange}
      progress={{ done: projects.length > 0 ? 1 : 0, total: 1 }}
      action={
        (
          <button
            type="button"
            onClick={() => {
              onOpenChange(true);
              startNew();
            }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill border border-border px-3.5 text-[13px] font-semibold text-foreground transition-[border-color,background-color] duration-300 ease-soft hover:border-border-strong hover:bg-raise"
          >
            <Plus size={14} strokeWidth={2} />
            Novo projeto
          </button>
        )
      }
    >
      <Modal open={draft !== null} onClose={() => setDraft(null)} title={draft?.id ? 'Editar projeto' : 'Novo projeto'}>
        {draft && (
        <form onSubmit={publish} className="flex flex-col gap-4">
          <Field
            label="Link do repositório"
            htmlFor="pj-repo"
            hint={draft.repoName ? `Repositório: ${draft.repoName}` : 'Cole o link do repositório no GitHub.'}
          >
            <TextInput
              id="pj-repo"
              type="url"
              required
              pattern="https?://(www\.)?github\.com/[\w.\-]+/[\w.\-]+/?(\.git)?"
              title="Link no formato https://github.com/usuario/repositorio"
              value={draft.repoUrl}
              onChange={(e) => changeRepoUrl(e.target.value)}
              placeholder="https://github.com/usuario/repositorio"
            />
          </Field>

          <Field label="Título" htmlFor="pj-title">
            <TextInput
              id="pj-title"
              required
              value={draft.title}
              onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
              placeholder="Como você quer apresentar o projeto"
            />
          </Field>

          <Field label="Descrição" htmlFor="pj-desc" hint="O que é, que problema resolve e o que você fez.">
            <TextArea
              id="pj-desc"
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft((d) => (d ? { ...d, description: e.target.value } : d))}
            />
          </Field>

          <div className="flex flex-col gap-2">
            <span className="label text-faint">Links (deploy, vídeo, documentação…)</span>
            {draft.links.map((l, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  aria-label={`Nome do link ${i + 1}`}
                  value={l.label}
                  onChange={(e) => updateLink(i, { label: e.target.value })}
                  placeholder="Nome"
                  className="w-[36%]"
                />
                <TextInput
                  aria-label={`Endereço do link ${i + 1}`}
                  type="url"
                  value={l.url}
                  onChange={(e) => updateLink(i, { url: e.target.value })}
                  placeholder="https://"
                />
                <button
                  type="button"
                  aria-label={`Remover link ${i + 1}`}
                  onClick={() => setDraft((d) => (d ? { ...d, links: d.links.filter((_, idx) => idx !== i) } : d))}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border text-muted transition-[border-color,color] duration-300 ease-soft hover:border-border-strong hover:text-foreground"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDraft((d) => (d ? { ...d, links: [...d.links, { ...EMPTY_LINK }] } : d))}
              className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80"
            >
              <Plus size={14} />
              Adicionar outro link
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="label text-faint">Imagem de demonstração</span>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => pickImage(e.target.files?.[0])} />
            {draft.image ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={draft.image} alt="Pré-visualização" className="h-16 w-28 rounded-md border border-border object-cover" />
                <button
                  type="button"
                  onClick={() => setDraft((d) => (d ? { ...d, image: undefined } : d))}
                  className="text-[13px] font-medium text-muted transition-colors duration-300 ease-soft hover:text-foreground"
                >
                  Remover imagem
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-24 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border-strong text-[13px] text-muted transition-[border-color,color,background-color] duration-300 ease-soft hover:bg-raise hover:text-foreground"
              >
                <ImagePlus size={16} />
                Enviar imagem (até 2 MB)
              </button>
            )}
            {imageError && <p className="text-[12.5px] text-orquidea">{imageError}</p>}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button type="submit" className="h-11 pl-5 text-[13.5px]">
              {draft.id ? 'Salvar projeto' : 'Publicar projeto'}
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)} className="h-11 text-[13.5px]">
              Cancelar
            </Button>
          </div>
        </form>
        )}
      </Modal>

      {projects.length > 0 && (
        <ul className="mt-5 flex flex-col border-t border-edge">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-3.5 border-b border-edge py-3 last:border-b-0">
              <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-raise text-faint">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <GitBranch size={15} strokeWidth={1.5} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">{p.title}</div>
                <div className="truncate font-mono text-[11px] text-faint">
                  {p.repoName} · {p.links.length} {p.links.length === 1 ? 'link' : 'links'}
                </div>
              </div>
              <button
                type="button"
                aria-label={`Editar ${p.title}`}
                onClick={() => startEdit(p)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-pill text-muted transition-colors duration-300 ease-soft hover:bg-raise hover:text-foreground"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                aria-label={`Remover ${p.title}`}
                onClick={() => setProjects((cur) => cur.filter((x) => x.id !== p.id))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-pill text-muted transition-colors duration-300 ease-soft hover:bg-raise hover:text-foreground"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </AccordionCard>
  );
}
