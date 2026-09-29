import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Sobre — PdA Perfis',
  description: 'Programadores do Amanhã: formação em tecnologia para jovens negros e indígenas.',
};

const PILLARS = [
  {
    title: 'Excelência técnica',
    text: 'Nossos alunos constroem uma base sólida em desenvolvimento de software desde o primeiro dia, aplicando o conhecimento em projetos reais com impacto social.',
  },
  {
    title: 'Ponte com o mercado',
    text: 'Criamos este portal exclusivo para reduzir o atrito no recrutamento, entregando contexto técnico e profissional com clareza para quem contrata.',
  },
  {
    title: 'High Agency',
    text: 'Acreditamos que formar talentos vai muito além do código. Nossa metodologia fomenta autonomia, resolução de problemas e uma postura protagonista.',
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-14">
      <SectionHeading
        index="—"
        eyebrow="Nossa missão"
        title="Transformando o mercado de tecnologia"
        lead="A Programadores do Amanhã é dedicada a capacitar jovens negros e indígenas para o setor tech. Esta plataforma é a ponte entre o alto potencial da nossa rede e as melhores oportunidades no mercado de trabalho."
        className="mb-14 max-w-[900px]"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="glass rounded-lg p-6">
            <h3 className="font-heading text-[18px] font-semibold tracking-[-0.018em]">{p.title}</h3>
            <p className="prose-body mt-2.5 text-muted">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 glass flex flex-col items-start justify-between gap-6 rounded-lg p-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-[24px] font-bold tracking-[-0.03em]">Faça parte dessa transformação</h2>
          <p className="prose-body mt-2 max-w-[48ch] text-muted">
            Explore nossa rede de talentos. Analise os repositórios, descubra trajetórias inspiradoras e conecte-se com profissionais excepcionais.
          </p>
        </div>
        <Button href="/alunos" icon={<ArrowRight size={16} strokeWidth={2} />}>
          Conhecer talentos
        </Button>
      </div>
    </div>
  );
}
