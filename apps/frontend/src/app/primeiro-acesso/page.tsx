import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { AuthCard } from '@/components/auth-card';
import { FirstAccessForm } from './first-access-form';

export const metadata: Metadata = {
  title: 'Primeiro acesso — PdA Perfis',
};

export default function PrimeiroAcessoPage() {
  return (
    <AuthCard
      eyebrow="Primeiro acesso"
      title="Defina sua senha"
      lead="Você chegou pelo link enviado ao seu e-mail. Defina sua senha e aceite o termo abaixo pra ativar sua conta."
      footer={
        <>
          Link expirado?{' '}
          <Link href="/reenviar-convite" className="font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80">
            Receber um novo por e-mail
          </Link>
        </>
      }
    >
      <FirstAccessForm />
    </AuthCard>
  );
}
