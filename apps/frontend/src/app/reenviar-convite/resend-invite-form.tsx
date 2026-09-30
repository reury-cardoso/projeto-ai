'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextInput } from '@/components/ui/field';

export function ResendInviteForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <div className="text-center">
        <p className="prose-body text-foreground font-medium">Confira seu e-mail</p>
        <p className="mt-1 text-[13px] text-muted">
          Se {sentTo} estiver cadastrado, você vai receber o link para definir sua senha em instantes.
        </p>
        <p className="mt-4 text-[12.5px] text-faint">
          Protótipo de interface — chama <code className="font-mono">POST /api/auth/resend-first-access</code> quando o backend existir.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSentTo(String(new FormData(e.currentTarget).get('email')));
      }}
    >
      <Field label="E-mail" htmlFor="resend-email">
        <TextInput id="resend-email" name="email" type="email" required placeholder="voce@email.com" />
      </Field>
      <Button type="submit" className="mt-1 w-full justify-center pr-6">
        Enviar link
      </Button>
    </form>
  );
}
