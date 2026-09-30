import { BadgeCheck, GitBranch, GraduationCap, Handshake } from 'lucide-react';

const STEPS = [
  { icon: GraduationCap, title: 'Formação completa', text: 'Currículo prático de desenvolvimento, do fundamento ao deploy, com acompanhamento próximo.' },
  { icon: GitBranch, title: 'Código à vista', text: 'Repositórios e atividade reais no GitHub. Você avalia o trabalho antes da primeira conversa.' },
  { icon: BadgeCheck, title: 'Postura protagonista', text: 'Autonomia, resolução de problemas e vontade de aprender, desenvolvidas desde o primeiro dia.' },
  { icon: Handshake, title: 'Contratação apoiada', text: 'Nossa equipe acompanha o contato e a chegada do talento ao seu time.' },
];

export function ValidationSteps() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map(({ icon: Icon, title, text }, i) => (
        <li key={title} className="glass glass-hover rounded-lg p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-tint text-accent-text">
              <Icon size={18} strokeWidth={1.7} />
            </span>
            <span className="font-mono text-[11px] text-faint">0{i + 1}</span>
          </div>
          <h3 className="font-heading text-[18px] font-bold tracking-[-0.02em]">{title}</h3>
          <p className="prose-body mt-2 text-[14px] text-muted">{text}</p>
        </li>
      ))}
    </ol>
  );
}
