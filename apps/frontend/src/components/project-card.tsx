import { ArrowUpRight, GitBranch } from 'lucide-react';
import type { Project } from '@/lib/mock-data';

const ARROW =
  'transition-transform duration-300 ease-glide group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5';

export function ProjectCard({ project }: { project: Project }) {
  const [primary, ...others] = project.links;

  return (
    <article className="glass glass-hover flex flex-col overflow-hidden rounded-lg">
      <div className="relative aspect-[2/1] overflow-hidden border-b border-edge bg-raise">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={`Demonstração de ${project.title}`} className="h-full w-full object-cover" />
        ) : (
          <div aria-hidden className="flex h-full w-full items-center justify-center text-faint">
            <GitBranch size={22} strokeWidth={1.5} />
          </div>
        )}
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          title={`Repositório ${project.repoName} no GitHub`}
          className="absolute top-3 right-3 inline-flex h-7 items-center gap-1.5 rounded-pill border border-white/15 bg-roxo-profundo/70 px-2.5 font-mono text-[11px] text-white/85 shadow-[0_4px_14px_-4px_rgb(0_0_0/50%)] backdrop-blur-md transition-[background-color,color,transform] duration-300 ease-glide hover:-translate-y-0.5 hover:bg-roxo-profundo/90 hover:text-white active:translate-y-0"
        >
          <GitBranch size={12} />
          {project.repoName}
        </a>
      </div>

      <div className="flex flex-1 flex-col p-4.5">
        <div className="flex-1">
          <h3 className="text-[14.5px] font-semibold tracking-[-0.014em]">{project.title}</h3>
          {project.description && (
            <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{project.description}</p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-edge pt-4">
          {primary && (
            <a
              href={primary.url}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex h-8 items-center gap-1 rounded-pill bg-amarelo px-3.5 text-[12.5px] font-semibold text-roxo-profundo transition-[background-color,transform] duration-300 ease-glide hover:bg-amarelo-claro active:scale-95"
            >
              {primary.label}
              <ArrowUpRight size={13} strokeWidth={2.2} className={ARROW} />
            </a>
          )}
          {others.map((l, i) => (
            <a
              key={`${l.url}-${i}`}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex h-8 items-center gap-1 rounded-pill border border-border px-3.5 text-[12.5px] font-semibold transition-[border-color,background-color,transform] duration-300 ease-glide hover:border-border-strong hover:bg-raise active:scale-95"
            >
              {l.label}
              <ArrowUpRight size={13} strokeWidth={2} className={`text-faint ${ARROW}`} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
