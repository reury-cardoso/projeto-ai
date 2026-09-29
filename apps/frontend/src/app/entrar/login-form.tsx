'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextInput } from '@/components/ui/field';

export function LoginForm() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus('submitted');
      }}
    >
      <Field label="E-mail" htmlFor="login-email">
        <TextInput id="login-email" name="email" type="email" required placeholder="voce@email.com" />
      </Field>
      <Field label="Senha" htmlFor="login-password">
        <TextInput id="login-password" name="password" type="password" required placeholder="••••••••" />
      </Field>
      <Button type="submit" className="mt-1 w-full justify-center pr-6">
        Entrar
      </Button>
      {status === 'submitted' && (
        <p className="text-center text-[12.5px] text-faint">
          Protótipo de interface — o backend de autenticação ainda não está conectado (ver docs/backend-plan.md).
        </p>
      )}
    </form>
  );
}
