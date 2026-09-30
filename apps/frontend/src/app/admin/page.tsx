import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { AdminDashboard } from './admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin — PdA Perfis',
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-14">
      <SectionHeading
        index="—"
        eyebrow="Painel administrativo"
        title="Painel do admin"
        lead="Acompanhe a rede, gerencie alunos e resolva as solicitações pendentes."
        className="mb-10"
      />
      <AdminDashboard />
    </div>
  );
}
