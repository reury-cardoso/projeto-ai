'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { clearDemoSession, type DemoSession } from '@/lib/demo-session';
import { cn } from '@/lib/cn';

/** Menu do usuário logado (no lugar do "Entrar"): atalho pra própria área e sair. */
export function UserMenu({ session }: { session: DemoSession }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isAdmin = session.role === 'admin';
  const item =
    'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] font-medium text-muted transition-colors duration-300 ease-soft hover:bg-raise hover:text-foreground';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="glass-control inline-flex h-9 items-center gap-2 rounded-pill border border-border py-1 pr-2.5 pl-1 transition-colors duration-300 ease-soft hover:border-border-strong"
      >
        <Avatar initials={session.initials} bg="var(--color-amarelo)" size={28} />
        <span className="hidden max-w-[120px] truncate text-[13px] font-medium sm:block">{session.name.split(' ')[0]}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className={cn('text-faint transition-transform duration-300 ease-glide', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[220px] rounded-lg border border-edge-hi bg-background p-1.5 shadow-[var(--depth-hi)]"
        >
          <div className="px-3 pt-2 pb-2.5">
            <div className="truncate text-[13px] font-semibold">{session.name}</div>
            <div className="label mt-0.5 text-faint">{isAdmin ? 'Administrador' : 'Aluno'}</div>
          </div>
          <div className="border-t border-edge pt-1.5">
            <Link
              role="menuitem"
              href={isAdmin ? '/admin' : '/minha-conta'}
              onClick={() => setOpen(false)}
              className={item}
            >
              {isAdmin ? <LayoutDashboard size={15} strokeWidth={1.7} /> : <UserRound size={15} strokeWidth={1.7} />}
              {isAdmin ? 'Painel do admin' : 'Minha conta'}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                clearDemoSession();
                setOpen(false);
                router.push('/');
              }}
              className={item}
            >
              <LogOut size={15} strokeWidth={1.7} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
