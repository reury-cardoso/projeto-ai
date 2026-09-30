'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

const ITEMS = [
  { q: 'Como faço para contratar um talento?', a: 'Encontre o perfil que combina com a sua vaga e envie uma mensagem pela própria página. Nossa equipe faz a ponte e acompanha todo o processo.' },
  { q: 'Que tipo de vaga combina com esses talentos?', a: 'Vagas em desenvolvimento, dados e áreas próximas, em times que valorizam aprendizado e diversidade.' },
  { q: 'Posso avaliar o trabalho antes de conversar?', a: 'Sim. Cada perfil mostra projetos, repositórios e atividade no GitHub, para você chegar à conversa já conhecendo o trabalho.' },
  { q: 'Que nível técnico devo esperar?', a: 'Profissionais com base sólida, projetos reais entregues e prontos para somar e crescer dentro do seu time.' },
];

export function HiringFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-lg">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn('flex flex-1 flex-col', i > 0 && 'border-t border-edge')}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full flex-1 items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300 ease-soft hover:bg-raise"
            >
              <span className="text-[15px] font-semibold tracking-[-0.012em]">{item.q}</span>
              <Plus
                size={16}
                strokeWidth={1.8}
                className={cn('shrink-0 text-faint transition-transform duration-500 ease-glide', isOpen && 'rotate-45 text-accent-text')}
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-500 ease-glide',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="prose-body max-w-[60ch] px-6 pb-5 text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
