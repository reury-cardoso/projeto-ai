'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextArea, TextInput } from '@/components/ui/field';
import { cn } from '@/lib/cn';

/** Espelha POST /api/contact-requests (docs/flow-plan.md §8): a mensagem vai pra
 * equipe da PdA, nunca direto pro e-mail do aluno. Sem backend ainda, só simula o envio.
 * `wide`: usa a largura toda (texto à esquerda, campos à direita) — perfil do aluno. */
export function ContactForm({
  studentName,
  wide = false,
  className,
}: {
  studentName?: string;
  wide?: boolean;
  className?: string;
}) {
  const [sent, setSent] = useState(false);
  const firstName = studentName?.split(' ')[0];

  if (sent) {
    return (
      <div className={cn('glass rounded-lg p-8 text-center', className)}>
        <p className="prose-body text-foreground font-medium">Mensagem enviada com sucesso</p>
        <p className="mt-1 text-[13px] text-muted">
          {firstName
            ? `Nossa equipe entrará em contato em breve para dar andamento à conversa com ${firstName}.`
            : 'Nossa equipe do PdA vai responder a sua dúvida em breve.'}
        </p>
      </div>
    );
  }

  return (
    <form
      className={cn(
        'glass rounded-lg p-6',
        wide ? 'grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-14 lg:p-8' : 'flex flex-col gap-4',
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <span className="label text-accent-text">{firstName ? 'Contato' : 'Fale com a gente'}</span>
        {wide && firstName ? (
          <>
            <h2 className="font-heading mt-3 text-[clamp(24px,2.6vw,32px)] leading-[1.1] font-bold tracking-[-0.03em] text-balance">
              Gostou do trabalho de {firstName}?
            </h2>
            <p className="prose-body mt-3 max-w-[38ch] text-muted">
              Envie uma mensagem e a nossa equipe faz a ponte entre a sua empresa e {firstName}.
            </p>
          </>
        ) : (
          <p className="prose-body mt-2 text-muted">
            {firstName
              ? `Interessado(a) no perfil de ${firstName}? Envie uma mensagem e a nossa equipe faz a ponte com você.`
              : 'Ficou com alguma dúvida sobre os talentos, uma vaga ou o processo de contratação? Pergunte para a equipe do PdA.'}
          </p>
        )}
        {wide && (
          <div className="mt-6 hidden lg:block">
            <Image
              src="/aprovacao.svg"
              alt=""
              width={400}
              height={400}
              aria-hidden
              className="art-dark h-auto w-full max-w-[280px]"
            />
            <Image
              src="/aprovacao-light.svg"
              alt=""
              width={400}
              height={400}
              aria-hidden
              className="art-light h-auto w-full max-w-[280px]"
            />
          </div>
        )}
      </div>

      <div className={cn('flex flex-col gap-4', wide && 'sm:grid sm:grid-cols-2')}>
        <Field label="Seu nome" htmlFor="contact-name">
          <TextInput id="contact-name" name="name" required placeholder="Nome completo" />
        </Field>
        <Field label="Seu e-mail" htmlFor="contact-email">
          <TextInput id="contact-email" name="email" type="email" required placeholder="voce@empresa.com" />
        </Field>
        <div className={cn(wide && 'sm:col-span-2')}>
          <Field label="Empresa (opcional)" htmlFor="contact-company">
            <TextInput id="contact-company" name="company" placeholder="Nome da empresa" />
          </Field>
        </div>
        <div className={cn(wide && 'sm:col-span-2')}>
          <Field label="Mensagem" htmlFor="contact-message">
            <TextArea
              id="contact-message"
              name="message"
              required
              rows={firstName ? 4 : 3}
              placeholder={firstName ? 'Sobre qual vaga ou oportunidade?' : 'Como podemos ajudar?'}
            />
          </Field>
        </div>
        <Button type="submit" className={cn('self-start', wide && 'sm:col-span-2')}>
          Enviar mensagem
        </Button>
      </div>
    </form>
  );
}
