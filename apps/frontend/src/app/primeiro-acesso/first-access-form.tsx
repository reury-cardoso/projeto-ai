'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckboxRow, Field, TextInput } from '@/components/ui/field';

export function FirstAccessForm() {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus('submitted');
      }}
    >
      <Field label="Senha" htmlFor="fa-password" hint="Mínimo de 8 caracteres.">
        <TextInput id="fa-password" name="password" type="password" required minLength={8} placeholder="••••••••" />
      </Field>
      <Field label="Confirmar senha" htmlFor="fa-password-confirm">
        <TextInput id="fa-password-confirm" name="passwordConfirm" type="password" required minLength={8} placeholder="••••••••" />
      </Field>

      <CheckboxRow name="consent" required checked={consent} onChange={(e) => setConsent(e.target.checked)}>
        Autorizo a exibição pública dos meus dados de GitHub e LinkedIn no portal da Programadores do Amanhã.
      </CheckboxRow>

      <Button type="submit" disabled={!consent} className="mt-1 w-full justify-center pr-6 disabled:opacity-50">
        Ativar minha conta
      </Button>
      {status === 'submitted' && (
        <p className="text-center text-[12.5px] text-faint">
          Protótipo de interface — chama <code className="font-mono">POST /api/auth/first-access</code> quando o backend existir.
        </p>
      )}
    </form>
  );
}
