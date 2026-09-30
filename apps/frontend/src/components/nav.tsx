'use client';

import { useRef } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LINKS = [
  { href: '/alunos', label: 'Talentos' },
  { href: '/sobre', label: 'Nossa missão' },
];

export function Nav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnterLink = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1.02, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });
  const onLeaveLink = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });
  const onDownLink = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 0.97, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
  });
  const onUpLink = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1.02, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onEnterSearch = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1.02, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });
  const onLeaveSearch = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });
  const onDownSearch = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 0.97, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
  });
  const onUpSearch = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1.02, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  const onEnterBtn = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1.02, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });
  const onLeaveBtn = contextSafe((e: React.MouseEvent | React.FocusEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  });

  return (
    <div ref={containerRef} className="sticky top-0 z-50 border-b border-border bg-nav backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-14">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="TalentPDA — página inicial" className="flex items-center transition-opacity duration-300 ease-soft hover:opacity-80">
            <Logo className="h-[18px]" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={onEnterLink}
                  onMouseLeave={onLeaveLink}
                  onMouseDown={onDownLink}
                  onMouseUp={onUpLink}
                  className={cn(
                    'rounded-pill px-3 py-1.5 text-[13px] font-medium tracking-[-0.006em] text-muted transition-colors duration-300 hover:bg-raise hover:text-foreground',
                    active && 'bg-raise text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/alunos"
            onMouseEnter={onEnterSearch}
            onMouseLeave={onLeaveSearch}
            onMouseDown={onDownSearch}
            onMouseUp={onUpSearch}
            className="glass-control hidden h-9 min-w-[190px] items-center gap-2.5 rounded-pill border border-border pr-2 pl-3.5 text-muted transition-colors duration-300 hover:border-border-strong hover:text-foreground sm:inline-flex"
          >
            <Search size={15} strokeWidth={1.7} />
            <span className="flex-1 text-left text-[13px] tracking-[-0.006em]">Buscar talentos</span>
          </Link>
          <ThemeToggle />
          <Link
            href="/entrar"
            onMouseEnter={onEnterBtn}
            onMouseLeave={onLeaveBtn}
            onMouseDown={onDownLink}
            onMouseUp={onUpLink}
            className="hidden h-9 items-center rounded-pill bg-amarelo px-4 text-[13px] font-semibold text-roxo-profundo transition-colors duration-300 hover:bg-amarelo-claro sm:inline-flex"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
