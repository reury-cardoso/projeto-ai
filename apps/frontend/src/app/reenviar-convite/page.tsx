import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { AuthCard } from '@/components/auth-card';
import { ResendInviteForm } from './resend-invite-form';

export const metadata: Metadata = {
  title: 'Receber link de acesso — PdA Perfis',
};

export default function ReenviarConvitePage() {
  return (
    <AuthCard
      eyebrow="Primeiro acesso"
      title="Receber link de acesso"
      lead="Informe o e-mail cadastrado pela equipe da PdA e enviaremos o link para você definir sua senha."
      footer={
        <>
          Já tem senha?{' '}
          <Link href="/entrar" className="font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80">
            Entrar
          </Link>
        </>
      }
    >
      <ResendInviteForm />
    </AuthCard>
  );
}
