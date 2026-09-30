import { Logo } from './logo';

export function Footer() {
  return (
    <div className="border-t border-border">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3.5 px-5 py-6 sm:px-8 lg:px-14">
        <div className="flex items-center gap-2.5">
          <Logo className="h-[14px]" />
          <span className="font-mono text-[11px] text-muted">
            <span aria-hidden className="mr-2.5 text-faint">·</span>
            Programadores do Amanhã
          </span>
        </div>
        <span className="font-mono text-[11px] text-faint">
          &copy; {new Date().getFullYear()} Programadores do Amanhã
        </span>
      </div>
    </div>
  );
}
