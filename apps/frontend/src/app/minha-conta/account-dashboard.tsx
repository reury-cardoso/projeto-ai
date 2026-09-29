'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextInput } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { StudentCard } from '@/components/student-card';
import type { Student } from '@/lib/mock-data';

export function AccountDashboard({ student }: { student: Student }) {
  const [visible, setVisible] = useState(student.visible);
  const [linkedin, setLinkedin] = useState(
    student.linkedin ?? { headline: '', currentPosition: '', education: '', profileUrl: '' },
  );
  const [saved, setSaved] = useState(false);

  return (
    <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <StudentCard student={{ ...student, visible, linkedin }} />
      </div>

      <div className="flex flex-col gap-8">
        <section className="glass flex items-center justify-between gap-4 rounded-lg p-6">
          <div>
            <h2 className="font-heading text-[16px] font-semibold tracking-[-0.014em]">Visibilidade na vitrine</h2>
            <p className="mt-1 text-[13px] text-muted">
              {visible ? 'Seu perfil está visível publicamente em /alunos.' : 'Seu perfil está oculto — você continua editando tudo normalmente.'}
            </p>
          </div>
          <Switch checked={visible} onChange={setVisible} label="Visibilidade do perfil na vitrine" />
        </section>

        <section className="glass rounded-lg p-6">
          <h2 className="font-heading text-[16px] font-semibold tracking-[-0.014em]">Dados do LinkedIn</h2>
          <p className="mt-1 mb-5 text-[13px] text-muted">
            Publica na hora — não passa por aprovação do admin.
          </p>
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
        </section>
      </div>
    </div>
  );
}
