'use client';

import { useRef } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompositionPanel } from '@/components/composition-panel';
import { HeroGrid } from '@/components/hero-grid';
import { MetricsRow } from '@/components/metrics-row';
import { StackGrid } from '@/components/stack-grid';
import { ValidationSteps } from '@/components/validation-steps';
import { ContactForm } from '@/components/contact-form';
import { HiringFaq } from '@/components/hiring-faq';
import { SectionHeading } from '@/components/ui/section-heading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-rise',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* ░ HERO ░ */}
      <div className="relative overflow-hidden">
        <HeroGrid />

        <div className="relative mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 lg:px-14 lg:pt-[76px]">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1.06fr_.94fr] lg:gap-14">
            <div className="flex flex-col justify-center">
              <div className="gsap-rise mb-7 inline-flex h-[30px] w-fit items-center gap-2 rounded-pill border border-border bg-tint px-3 text-muted">
                <span aria-hidden className="animate-breathe h-[5px] w-[5px] rounded-pill bg-azul-ceu" />
                <span className="font-mono text-[10.5px] tracking-[.12em] text-muted uppercase">
                  banco de talentos · acesso público
                </span>
              </div>

              <h1 className="font-display text-[clamp(34px,4.4vw,62px)] leading-[.87] tracking-[-0.038em] uppercase">
                <span className="gsap-rise block text-nowrap">Conheça os</span>
                <span className="gsap-rise block text-nowrap ml-[clamp(10px,2.4vw,32px)]">
                  talentos da
                </span>
                <span className="gsap-rise block text-nowrap ml-[clamp(4px,1vw,13px)]">
                  <span className="text-accent-text">nossa rede</span>
                </span>
              </h1>

              <p className="gsap-rise lead mt-6 ml-[clamp(4px,1vw,13px)] max-w-[44ch]">
                Desenvolvedores formados pela Programadores do Amanhã, com projetos reais e código que você pode avaliar antes mesmo da entrevista.
              </p>

              <div className="gsap-rise mt-7 ml-[clamp(4px,1vw,13px)] flex flex-wrap gap-3">
                <Button href="/alunos" icon={<ArrowRight size={16} strokeWidth={2} />}>
                  Conhecer talentos
                </Button>
                <Button href="/sobre" variant="ghost" icon={<ExternalLink size={14} strokeWidth={1.8} />}>
                  Nossa missão
                </Button>
              </div>
            </div>

            <div className="gsap-rise">
              <CompositionPanel />
            </div>
          </div>

          <div className="mt-16 lg:mt-[84px]">
            <MetricsRow />
          </div>

          <div className="h-20 lg:h-[104px]" />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-14">
        <div className="py-12" id="encontre-pela-vaga">
          <SectionHeading
            index="01"
            eyebrow="Tecnologias"
            title="As tecnologias que nossos talentos dominam"
            lead="Das mais fortes às emergentes: veja de cara em quais stacks a nossa rede está pronta para somar ao seu time."
          />
          <div className="mt-10">
            <StackGrid />
          </div>
        </div>

        <div className="py-12" id="como-validamos">
          <SectionHeading
            index="02"
            eyebrow="Por que contratar"
            title="Talento com prova de trabalho"
            lead="Cada talento chega com formação sólida, projetos entregues em equipe e código aberto para você conferir."
          />
          <div className="mt-10">
            <ValidationSteps />
          </div>
        </div>

        <div className="py-12" id="perguntas">
          <SectionHeading index="03" eyebrow="Para empresas" title="Tire suas dúvidas com a gente" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-8">
            <HiringFaq />
            <ContactForm />
          </div>
        </div>

        <div className="border-t border-border py-16">
          <div className="glass flex flex-col items-start justify-between gap-6 rounded-lg p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-[26px] font-bold tracking-[-0.03em]">
                Sua próxima contratação está aqui
              </h2>
              <p className="prose-body mt-2 max-w-[48ch] text-muted">
                Filtre por tecnologia ou turma e encontre o profissional certo para o seu time.
              </p>
            </div>
            <Button href="/alunos" icon={<ArrowRight size={16} strokeWidth={2} />}>
              Conhecer talentos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
