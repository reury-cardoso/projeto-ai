'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextInput } from '@/components/ui/field';
import { DEMO_ADMIN_LOGIN, DEMO_STUDENT_LOGIN } from '@/lib/mock-data';

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitted' | 'invalid'>('idle');

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        if (form.get('email') === DEMO_ADMIN_LOGIN.email && form.get('password') === DEMO_ADMIN_LOGIN.password) {
          router.push('/admin');
          return;
        }
        if (form.get('email') === DEMO_STUDENT_LOGIN.email && form.get('password') === DEMO_STUDENT_LOGIN.password) {
          router.push('/minha-conta');
          return;
        }
        setStatus('invalid');
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
      {status === 'invalid' && (
        <p className="text-center text-[12.5px] text-faint">
          E-mail ou senha incorretos. Protótipo de interface — o backend de autenticação ainda não está conectado (ver docs/backend-plan.md).
        </p>
      )}
    </form>
  );
}
