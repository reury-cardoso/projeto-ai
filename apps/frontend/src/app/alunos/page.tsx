import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { VitrineGrid } from '@/components/vitrine-grid';

export const metadata: Metadata = {
  title: 'Talentos — PdA Talentos',
  description: 'Encontre desenvolvedores formados pela Programadores do Amanhã.',
};

export default function AlunosPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-14">
      <SectionHeading
        index="—"
        eyebrow="Talentos"
        title="Encontre o talento certo para o seu time"
        lead="Projetos, tecnologias e trajetória profissional de cada talento em um só lugar, para você decidir com mais segurança."
        className="mb-10"
      />
      <VitrineGrid />
    </div>
  );
}
