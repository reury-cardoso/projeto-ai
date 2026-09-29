import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { STUDENTS } from '@/lib/mock-data';
import { AccountDashboard } from './account-dashboard';

export const metadata: Metadata = {
  title: 'Minha conta — PdA Perfis',
};

export default function MinhaContaPage() {
  // Sem autenticação real ainda (ver docs/backend-plan.md) — usa o primeiro aluno
  // de exemplo como "sessão" pra demonstrar a tela.
  const student = STUDENTS[0];

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-14">
      <SectionHeading
        index="—"
        eyebrow="Minha conta"
        title={`Olá, ${student.name.split(' ')[0]}`}
        lead="Edite seus dados do LinkedIn e controle a visibilidade do seu perfil na vitrine pública."
        className="mb-10"
      />
      <AccountDashboard student={student} />
    </div>
  );
}
