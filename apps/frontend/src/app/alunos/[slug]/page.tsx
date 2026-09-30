import { ArrowLeft, Briefcase, ExternalLink, GitBranch } from 'lucide-react';
import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { ProjectCard } from '@/components/project-card';
import { StudentCard } from '@/components/student-card';
import { StudentPhoto } from '@/components/student-photo';
import { STATUS_LABEL, STUDENTS, getProjects, getStudentBySlug } from '@/lib/mock-data';

export function generateStaticParams() {
  return STUDENTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const student = getStudentBySlug(slug);
  if (!student) return { title: 'Perfil não encontrado — PdA Talentos' };
  return {
    title: `${student.name} — PdA Talentos`,
    description: student.linkedin?.headline ?? student.github.bio,
  };
}

export default async function StudentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const student = getStudentBySlug(slug);
  if (!student) notFound();
  const projects = getProjects(student.id);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:px-14">
      <Link href="/alunos" className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-300 ease-soft hover:text-foreground">
        <ArrowLeft size={14} />
        Voltar para os talentos
      </Link>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
        <div>
          <StudentCard student={student} />
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <span className="label text-accent-text">{STATUS_LABEL[student.status]} · turma {student.cohort}</span>
              <h1 className="font-heading mt-2 text-[clamp(28px,3.4vw,42px)] font-bold tracking-[-0.03em] text-balance">
                {student.name}
              </h1>
              {student.linkedin && <p className="lead mt-2">{student.linkedin.headline}</p>}
            </div>
            <div className="hidden shrink-0 sm:block">
              <StudentPhoto photo={student.photo} name={student.name} initials={student.initials} bg={student.avatarBg} />
            </div>
          </div>

          <section className="glass glass-hover rounded-lg p-6">
            <p className="prose-body text-muted">{student.github.bio}</p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-edge pt-5 lg:grid-cols-4">
              {student.linkedin && (
                <>
                  <div className="col-span-2">
                    <dt className="label text-faint">Cargo atual</dt>
                    <dd className="mt-1.5 text-[14px] leading-snug">{student.linkedin.currentPosition}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="label text-faint">Formação</dt>
                    <dd className="mt-1.5 text-[14px] leading-snug">{student.linkedin.education}</dd>
                  </div>
                </>
              )}
              <div>
                <dt className="label text-faint">Repositórios</dt>
                <dd className="mt-1.5 font-mono text-[22px] leading-none tabular-nums">{student.github.publicRepos}</dd>
              </div>
              <div>
                <dt className="label text-faint">Seguidores</dt>
                <dd className="mt-1.5 font-mono text-[22px] leading-none tabular-nums">{student.github.followers}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2.5 border-t border-edge pt-5">
              <a
                href={student.github.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-border px-3.5 text-[13px] font-semibold transition-[border-color,background-color] duration-300 ease-soft hover:border-border-strong hover:bg-raise"
              >
                <GitBranch size={14} className="text-accent-text" />
                GitHub · @{student.github.username}
                <ExternalLink size={12} className="text-faint" />
              </a>
              {student.linkedin && (
                <a
                  href={student.linkedin.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-border px-3.5 text-[13px] font-semibold transition-[border-color,background-color] duration-300 ease-soft hover:border-border-strong hover:bg-raise"
                >
                  <Briefcase size={14} className="text-accent-text" />
                  LinkedIn
                  <ExternalLink size={12} className="text-faint" />
                </a>
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-14">
        <div className="mb-4 flex items-center justify-between">
          <span className="label text-faint">Projetos</span>
          {projects.length > 0 && <span className="font-mono text-[11px] text-faint">{projects.length}</span>}
        </div>
        {projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-lg p-6 text-[13.5px] text-muted">
            Os projetos de {student.name.split(' ')[0]} vão aparecer aqui em breve.
          </div>
        )}
      </section>

      <section className="mt-14">
        <ContactForm studentName={student.name} wide />
      </section>
    </div>
  );
}
