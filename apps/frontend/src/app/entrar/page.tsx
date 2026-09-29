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
      lead="Área do aluno e do admin. Se você é aluno e recebeu um convite, use o link de primeiro acesso."
      footer={
        <>
          Primeiro acesso?{' '}
          <Link href="/primeiro-acesso" className="font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80">
            Definir senha
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
