'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextArea, TextInput } from '@/components/ui/field';

/** Espelha POST /api/contact-requests (docs/flow-plan.md §8): a mensagem vai pra
 * equipe da PdA, nunca direto pro e-mail do aluno. Sem backend ainda, só simula o envio. */
export function ContactForm({ studentName }: { studentName: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="glass rounded-lg p-6 text-center">
        <p className="prose-body text-foreground font-medium">Mensagem enviada com sucesso</p>
        <p className="mt-1 text-[13px] text-muted">
          Nossa equipe de parcerias entrará em contato em breve para dar andamento à sua conexão com {studentName.split(' ')[0]}.
        </p>
      </div>
    );
  }

  return (
    <form
      className="glass flex flex-col gap-4 rounded-lg p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <span className="label text-accent-text">Contato</span>
        <p className="prose-body mt-2 text-muted">
          Interessado(a) no perfil de {studentName.split(' ')[0]}? Envie uma mensagem para a nossa equipe e nós facilitaremos essa conexão profissional.
        </p>
      </div>
      <Field label="Seu nome" htmlFor="contact-name">
        <TextInput id="contact-name" name="name" required placeholder="Nome completo" />
      </Field>
      <Field label="Seu e-mail" htmlFor="contact-email">
        <TextInput id="contact-email" name="email" type="email" required placeholder="voce@empresa.com" />
      </Field>
      <Field label="Empresa (opcional)" htmlFor="contact-company">
        <TextInput id="contact-company" name="company" placeholder="Nome da empresa" />
      </Field>
      <Field label="Mensagem" htmlFor="contact-message">
        <TextArea id="contact-message" name="message" required rows={4} placeholder="Sobre qual vaga ou oportunidade?" />
      </Field>
      <Button type="submit" className="self-start">
        Enviar mensagem
      </Button>
    </form>
  );
}
