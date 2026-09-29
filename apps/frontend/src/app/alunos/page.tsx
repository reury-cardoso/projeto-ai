import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { VitrineGrid } from '@/components/vitrine-grid';

export const metadata: Metadata = {
  title: 'Vitrine de alunos — PdA Perfis',
  description: 'Explore os perfis públicos dos alunos da Programadores do Amanhã.',
};

export default function AlunosPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-14">
      <SectionHeading
        index="—"
        eyebrow="Talentos"
        title="Nossos profissionais"
        lead="Explore o portfólio completo da nossa rede. Acompanhe a evolução técnica e o histórico profissional de cada aluno em um único lugar para uma decisão de contratação muito mais assertiva."
        className="mb-10"
      />
      <VitrineGrid />
    </div>
  );
}
