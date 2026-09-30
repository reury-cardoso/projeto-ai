'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Modal sobre <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte sem lib.
 * Clicar fora (no backdrop) também fecha. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // guarda o último conteúdo aberto: na animação de saída o modal não esvazia de uma vez
  const [shown, setShown] = useState({ title, children });
  useEffect(() => {
    if (open) setShown({ title, children });
  }, [open, title, children]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      dialog.removeAttribute('data-closing');
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (!dialog.open) return;
    // deixa a animação de saída rodar antes de fechar de fato
    dialog.setAttribute('data-closing', '');
    const t = setTimeout(() => {
      dialog.close();
      dialog.removeAttribute('data-closing');
    }, 260);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className="pda-modal m-auto w-[calc(100%-2rem)] max-w-[640px] rounded-lg border border-edge-hi bg-transparent p-0 text-foreground"
    >
      <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-lg bg-background p-6 shadow-[var(--depth-hi)] sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-heading text-[20px] font-bold tracking-[-0.02em]">
            {shown.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-faint transition-colors duration-300 ease-soft hover:bg-raise hover:text-foreground"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>
        {shown.children}
      </div>
    </dialog>
  );
}
