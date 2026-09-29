import { ArrowLeft, ExternalLink, GitBranch, Star, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { StudentCard } from '@/components/student-card';
import { Tag } from '@/components/ui/pill';
import { STATUS_LABEL, STUDENTS, getStudentBySlug } from '@/lib/mock-data';

export function generateStaticParams() {
  return STUDENTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const student = getStudentBySlug(slug);
  if (!student) return { title: 'Aluno não encontrado — PdA Perfis' };
  return {
    title: `${student.name} — PdA Perfis`,
    description: student.linkedin?.headline ?? student.github.bio,
  };
}

export default async function StudentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const student = getStudentBySlug(slug);
  if (!student) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:px-14">
      <Link href="/alunos" className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-300 ease-soft hover:text-foreground">
        <ArrowLeft size={14} />
        Voltar pra vitrine
      </Link>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <StudentCard student={student} />
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <span className="label text-accent-text">{STATUS_LABEL[student.status]} · turma {student.cohort}</span>
            <h1 className="font-heading mt-2 text-[clamp(28px,3.4vw,42px)] font-bold tracking-[-0.03em] text-balance">
              {student.name}
            </h1>
            {student.linkedin && <p className="lead mt-2">{student.linkedin.headline}</p>}
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <span className="label text-faint">GitHub</span>
              <Tag>automático</Tag>
            </div>
            <div className="glass rounded-lg p-6">
              <p className="prose-body text-muted">{student.github.bio}</p>
              <div className="mt-5 flex flex-wrap gap-6 border-t border-edge pt-5">
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <GitBranch size={14} className="text-accent-text" />
                  <span className="font-mono tabular-nums text-foreground">{student.github.publicRepos}</span> repositórios
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <Users size={14} className="text-accent-text" />
                  <span className="font-mono tabular-nums text-foreground">{student.github.followers}</span> seguidores
                </div>
                <a
                  href={student.github.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80"
                >
                  @{student.github.username}
                  <ExternalLink size={13} />
                </a>
              </div>

              {student.github.featuredRepos.length > 0 && (
                <div className="mt-5 flex flex-col gap-3 border-t border-edge pt-5">
                  <span className="label text-faint">Repositórios em destaque</span>
                  {student.github.featuredRepos.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-md border border-border p-3.5 transition-[border-color,transform] duration-300 ease-glide hover:-translate-y-0.5 hover:border-border-strong"
                    >
                      <div>
                        <div className="font-mono text-[13px] font-medium">{r.name}</div>
                        <div className="mt-0.5 text-[12.5px] text-muted">{r.description}</div>
                      </div>
                      <Star size={14} className="shrink-0 text-faint transition-colors duration-300 ease-soft group-hover:text-accent-text" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <span className="label text-faint">LinkedIn</span>
              <Tag>{student.linkedin ? 'declarado pelo aluno' : 'não conectado'}</Tag>
            </div>
            {student.linkedin ? (
              <div className="glass rounded-lg p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="label text-faint">Cargo atual</dt>
                    <dd className="prose-body mt-1.5">{student.linkedin.currentPosition}</dd>
                  </div>
                  <div>
                    <dt className="label text-faint">Formação</dt>
                    <dd className="prose-body mt-1.5">{student.linkedin.education}</dd>
                  </div>
                </dl>
                <a
                  href={student.linkedin.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 border-t border-edge pt-5 text-[13px] font-medium text-accent-text transition-opacity duration-300 ease-soft hover:opacity-80"
                >
                  Ver perfil no LinkedIn
                  <ExternalLink size={13} />
                </a>
              </div>
            ) : (
              <div className="glass rounded-lg p-6 text-[13.5px] text-muted">
                Este aluno ainda não autorizou a exibição dos dados do LinkedIn.
              </div>
            )}
          </section>

          <section>
            <ContactForm studentName={student.name} />
          </section>
        </div>
      </div>
    </div>
  );
}
