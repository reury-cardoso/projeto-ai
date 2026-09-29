'use client';

import { useRef } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import { CompositionPanel } from '@/components/composition-panel';
import { HeroGrid } from '@/components/hero-grid';
import { MetricsRow } from '@/components/metrics-row';
import { MechanismDiagram } from '@/components/mechanism-diagram';
import { SectionHeading } from '@/components/ui/section-heading';
import { StudentTile } from '@/components/student-tile';
import { Avatar } from '@/components/ui/avatar';
import { STUDENTS } from '@/lib/mock-data';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HomePage() {
  const preview = STUDENTS.slice(0, 3);
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
                Nossa plataforma centraliza a trajetória, os projetos e o perfil de cada aluno da Programadores do Amanhã, facilitando a conexão entre a sua empresa e os melhores profissionais em início de carreira.
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

          <div className="mt-12">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex pl-2">
                  {STUDENTS.slice(0, 4).map((s) => (
                    <Avatar
                      key={s.id}
                      initials={s.initials}
                      bg={s.avatarBg}
                      size={30}
                      className="-ml-2 border-2 border-background"
                    />
                  ))}
                </div>
                <span className="label text-faint">Destaques da nossa rede</span>
              </div>
              <Link href="/alunos" className="group inline-flex items-center gap-1 font-mono text-[11.5px] text-muted transition-colors duration-300 ease-soft hover:text-foreground">
                ver todos os profissionais
                <ArrowRight size={12} className="transition-transform duration-300 ease-glide group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((s) => (
                <StudentTile key={s.id} student={s} />
              ))}
            </div>
          </div>

          <div className="h-20 lg:h-[104px]" />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-14">
        <div className="border-t border-border pt-16 pb-24" id="como-funciona">
          <SectionHeading
            index="01"
            eyebrow="Nosso método"
            title="Mais contexto, melhores contratações"
            lead="Unimos a vivência profissional dos nossos alunos à prática real de código. O histórico do GitHub é integrado de forma transparente, enquanto os dados profissionais são adicionados com o consentimento de cada talento."
          />
          <div className="mt-10">
            <MechanismDiagram />
          </div>
        </div>

        <div className="border-t border-border py-16">
          <div className="glass flex flex-col items-start justify-between gap-6 rounded-lg p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-[26px] font-bold tracking-[-0.03em]">
                Sua próxima contratação está aqui
              </h2>
              <p className="prose-body mt-2 max-w-[48ch] text-muted">
                Utilize nossos filtros avançados por tecnologia, turma ou disponibilidade e encontre exatamente o profissional que a sua equipe precisa.
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
