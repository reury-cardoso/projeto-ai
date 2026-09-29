export function Footer() {
  return (
    <div className="border-t border-border">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3.5 px-5 py-6 sm:px-8 lg:px-14">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-2 w-2 rotate-45 rounded-sm bg-amarelo" />
          <span className="font-mono text-[11px] text-muted">
            Programadores do Amanhã · vitrine de perfis dos alunos
          </span>
        </div>
        <span className="font-mono text-[11px] text-faint">
          &copy; {new Date().getFullYear()} Programadores do Amanhã
        </span>
      </div>
    </div>
  );
}
