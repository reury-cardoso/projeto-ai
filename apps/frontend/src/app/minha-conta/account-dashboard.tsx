'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextArea, TextInput } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { StudentCard } from '@/components/student-card';
import { Modal } from '@/components/ui/modal';
import { AccordionCard } from '@/components/ui/accordion-card';
import { ProjectManager } from './project-manager';
import { STACK_COLORS, type CustomStack, type Student } from '@/lib/mock-data';

export function AccountDashboard({ student }: { student: Student }) {
  const [visible, setVisible] = useState(student.visible);
  const [linkedin, setLinkedin] = useState(
    student.linkedin ?? { headline: '', currentPosition: '', education: '', profileUrl: '' },
  );
  const [githubUrl, setGithubUrl] = useState(student.github.profileUrl);
  const [stacks, setStacks] = useState<CustomStack[]>(student.customStacks ?? []);
  const [stackInput, setStackInput] = useState('');
  const [bio, setBio] = useState(student.bio ?? '');
  const [bioSaved, setBioSaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const filled = (...v: string[]) => v.filter((x) => x.trim()).length;
  const progress = {
    bio: { done: filled(bio), total: 1 },
    github: { done: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/i.test(githubUrl.trim()) ? 1 : 0, total: 1 },
    stacks: { done: student.github.languages.length + stacks.length > 0 ? 1 : 0, total: 1 },
    linkedin: {
      done: filled(linkedin.headline, linkedin.currentPosition, linkedin.education, linkedin.profileUrl),
      total: 4,
    },
  };
  // sanfona: só uma seção aberta por vez
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => (open: boolean) => setOpenId(open ? id : null);
  const [githubSaved, setGithubSaved] = useState(false);
  const addStack = () => {
    const name = stackInput.trim();
    if (!name) return;
    const known = [...student.github.languages, ...stacks].some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (!known) {
      setStacks((cur) => [...cur, { name, color: STACK_COLORS[Math.floor(Math.random() * STACK_COLORS.length)] }]);
    }
    setStackInput('');
  };
  const githubUsername = githubUrl.match(/github\.com\/([\w-]+)/i)?.[1] ?? student.github.username;

  return (
    <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <StudentCard student={{ ...student, visible, bio, linkedin, customStacks: stacks, github: { ...student.github, profileUrl: githubUrl, username: githubUsername } }} />
      </div>

      <div className="flex flex-col gap-8">
        <AccordionCard
          title="Sobre você"
          description="Texto de apresentação que aparece no topo do seu perfil. Você escreve, não vem do GitHub."
          open={openId === 'bio'}
          onOpenChange={toggle('bio')}
          progress={progress.bio}
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setBioSaved(true);
            }}
          >
            <Field label="Sobre" htmlFor="bio-text" hint={`${bio.length}/280`}>
              <TextArea
                id="bio-text"
                rows={4}
                maxLength={280}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setBioSaved(false);
                }}
                placeholder="Ex.: Desenvolvedora Full Stack focada em produtos de impacto social."
              />
            </Field>
            <Button type="submit" className="mt-1 w-fit">
              Salvar
            </Button>
            {bioSaved && <p className="text-[12.5px] text-accent-text">Salvo — aparece no seu perfil.</p>}
          </form>
        </AccordionCard>

        <AccordionCard
          title="Seu GitHub"
          description="Repositórios, linguagens e atividade são lidos direto do GitHub a partir do link do seu perfil."
          open={openId === 'github'}
          onOpenChange={toggle('github')}
          progress={progress.github}
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setGithubSaved(true);
            }}
          >
            <Field label="URL do GitHub" htmlFor="gh-url" hint={`Usuário detectado: @${githubUsername}`}>
              <TextInput
                id="gh-url"
                type="url"
                required
                pattern="https?://(www\.)?github\.com/[\w\-]+/?"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  setGithubSaved(false);
                }}
                placeholder="https://github.com/seu-usuario"
              />
            </Field>
            <Button type="submit" className="mt-1 w-fit">
              Salvar GitHub
            </Button>
            {githubSaved && <p className="text-[12.5px] text-accent-text">Salvo — os dados do GitHub serão atualizados no seu perfil.</p>}
          </form>
        </AccordionCard>

        <AccordionCard
          title="Suas tecnologias"
          description="As linguagens do GitHub entram sozinhas. Adicione aqui o que você usa e não aparece lá, como Figma, Docker ou AWS."
          open={openId === 'stacks'}
          onOpenChange={toggle('stacks')}
          progress={progress.stacks}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {student.github.languages.map((l) => (
              <span key={l.name} title="Detectada no GitHub" className="inline-flex h-7 items-center gap-1.5 rounded-pill bg-kbd px-3 text-[12px] text-muted">
                <span aria-hidden className="h-1.5 w-1.5 rounded-pill" style={{ background: l.color }} />
                {l.name}
              </span>
            ))}
            {stacks.map((c) => (
              <span key={c.name} className="inline-flex h-7 items-center gap-1.5 rounded-pill bg-tint pr-1.5 pl-3 text-[12px] text-foreground">
                <span aria-hidden className="h-1.5 w-1.5 rounded-pill" style={{ background: c.color }} />
                {c.name}
                <button
                  type="button"
                  aria-label={`Remover ${c.name}`}
                  onClick={() => setStacks((cur) => cur.filter((s) => s.name !== c.name))}
                  className="flex h-4 w-4 items-center justify-center rounded-pill text-faint transition-colors duration-300 ease-soft hover:bg-raise hover:text-foreground"
                >
                  <X size={11} strokeWidth={2.2} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <TextInput
              aria-label="Nova tecnologia"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStack();
                }
              }}
              placeholder="Ex.: Figma"
              maxLength={24}
            />
            <Button type="button" onClick={addStack} className="shrink-0">
              Adicionar
            </Button>
          </div>
        </AccordionCard>

        <AccordionCard
          title="Dados do LinkedIn"
          description="Publica na hora — não passa por aprovação do admin."
          open={openId === 'linkedin'}
          onOpenChange={toggle('linkedin')}
          progress={progress.linkedin}
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <Field label="Headline" htmlFor="li-headline">
              <TextInput
                id="li-headline"
                value={linkedin.headline}
                onChange={(e) => setLinkedin((s) => ({ ...s, headline: e.target.value }))}
                placeholder="Ex.: Desenvolvedora Full Stack em formação"
              />
            </Field>
            <Field label="Cargo atual" htmlFor="li-position">
              <TextInput
                id="li-position"
                value={linkedin.currentPosition}
                onChange={(e) => setLinkedin((s) => ({ ...s, currentPosition: e.target.value }))}
                placeholder="Ex.: Estagiária — Empresa X"
              />
            </Field>
            <Field label="Formação" htmlFor="li-education">
              <TextInput
                id="li-education"
                value={linkedin.education}
                onChange={(e) => setLinkedin((s) => ({ ...s, education: e.target.value }))}
                placeholder="Ex.: Programadores do Amanhã — Turma 2025.2"
              />
            </Field>
            <Field label="URL do LinkedIn" htmlFor="li-url">
              <TextInput
                id="li-url"
                type="url"
                value={linkedin.profileUrl}
                onChange={(e) => setLinkedin((s) => ({ ...s, profileUrl: e.target.value }))}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
            <Button type="submit" className="mt-1 w-fit">
              Salvar alterações
            </Button>
            {saved && <p className="text-[12.5px] text-accent-text">Salvo — visível na vitrine agora.</p>}
          </form>
        </AccordionCard>

        <ProjectManager student={student} open={openId === 'projects'} onOpenChange={toggle('projects')} />

        <AccordionCard
          title="Configurações da conta"
          description="Visibilidade do perfil e exclusão da conta."
          open={openId === 'settings'}
          onOpenChange={toggle('settings')}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[14.5px] font-semibold tracking-[-0.012em]">Visibilidade na vitrine</h3>
                <p className="mt-1 text-[13px] text-muted">
                  {visible
                    ? 'Seu perfil está visível publicamente em /alunos.'
                    : 'Seu perfil está oculto — você continua editando tudo normalmente.'}
                </p>
              </div>
              <Switch checked={visible} onChange={setVisible} label="Visibilidade do perfil na vitrine" />
            </div>

            <div className="flex flex-col gap-3 border-t border-edge pt-6">
              <div>
                <h3 className="text-[14.5px] font-semibold tracking-[-0.012em]">Excluir conta</h3>
                <p className="mt-1 text-[13px] text-muted">
                  {deletionRequested
                    ? 'Exclusão solicitada. Seu perfil já saiu da vitrine e a equipe da PdA vai concluir a remoção dos seus dados.'
                    : 'Remove seu perfil e seus dados do portal. A equipe da PdA conclui a exclusão definitiva.'}
                </p>
              </div>
              {!deletionRequested && (
                <Button variant="ghost" onClick={() => setConfirmDelete(true)} className="w-fit text-orquidea">
                  Solicitar exclusão da conta
                </Button>
              )}
            </div>
          </div>
        </AccordionCard>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Excluir sua conta?">
        <p className="prose-body text-muted">
          Seu perfil sai da vitrine na hora e a equipe da PdA remove definitivamente seus dados — projetos, LinkedIn e
          contatos recebidos. Essa ação não pode ser desfeita depois da exclusão definitiva.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setDeletionRequested(true);
              setVisible(false);
              setConfirmDelete(false);
            }}
            className="h-11 pl-5 text-[13.5px]"
          >
            Sim, solicitar exclusão
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(false)} className="h-11 text-[13.5px]">
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
