import { ArrowRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Avatar } from '@/components/ui/avatar';
import { Pill } from '@/components/ui/pill';
import { STATUS_COLOR, STATUS_LABEL, activityStrip, type Student } from '@/lib/mock-data';

export function StudentTile({ student }: { student: Student }) {
  const strip = activityStrip(Number(student.id) * 7, 18);
  return (
    <Link
      href={`/alunos/${student.slug}`}
      className="group glass glass-hover glass-lift block h-full rounded-lg p-4.5"
    >
      <div className="mb-3.5 flex items-center gap-3">
        <Avatar initials={student.initials} bg={student.avatarBg} size={38} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold tracking-[-0.016em]">{student.name}</div>
          <div className="mt-0.5 font-mono text-[10.5px] text-faint">turma {student.cohort}</div>
        </div>
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 -translate-x-1 items-center justify-center rounded-pill bg-tint text-accent-text opacity-0 transition-[opacity,transform] duration-300 ease-glide group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        >
          <ArrowRight size={13} strokeWidth={2.2} />
        </span>
      </div>

      <Pill color={STATUS_COLOR[student.status]} className="mb-3.5">
        {STATUS_LABEL[student.status]}
      </Pill>

      <div className="mb-3.5 grid grid-cols-[repeat(18,1fr)] gap-[2.5px]" aria-hidden>
        {strip.map((op, i) => (
          <div key={i} className="aspect-square rounded-[1.5px] bg-amarelo" style={{ opacity: op }} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {student.github.languages.slice(0, 3).map((l) => (
          <span
            key={l.name}
            className="inline-flex h-[22px] items-center gap-1.5 rounded-pill bg-kbd px-2.5 text-[10.5px] text-muted"
          >
            <span aria-hidden className="h-[5px] w-[5px] rounded-pill" style={{ background: l.color }} />
            {l.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
