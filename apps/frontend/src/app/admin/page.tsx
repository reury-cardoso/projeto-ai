import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { AdminPanel } from './admin-panel';

export const metadata: Metadata = {
  title: 'Admin — PdA Perfis',
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-14">
      <SectionHeading
        index="—"
        eyebrow="Painel administrativo"
        title="Gerenciar alunos"
        lead="Cadastre alunos, importe planilhas, acompanhe status e controle a visibilidade de cada perfil."
        className="mb-10"
      />
      <AdminPanel />
    </div>
  );
}
