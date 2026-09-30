import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { AuthCard } from '@/components/auth-card';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Entrar — PdA Perfis',
};

export default function EntrarPage() {
  return (
    <AuthCard
      eyebrow="Acesso"
      title="Entrar"
      lead="Área do aluno e do admin. Se você é aluno e recebeu um convite, peça o link de primeiro acesso por e-mail."
      footer={
        <>
          Primeiro acesso?{' '}
          <Link href="/reenviar-convite" className="font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80">
            Receber link por e-mail
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
