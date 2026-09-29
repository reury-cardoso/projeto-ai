import type { Metadata } from 'next';
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
      lead="Você recebeu um link de convite da equipe da PdA. Defina sua senha e aceite o termo abaixo pra ativar sua conta."
    >
      <FirstAccessForm />
    </AuthCard>
  );
}
