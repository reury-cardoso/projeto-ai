'use client';

import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="label text-faint">
        {label}
      </label>
      {children}
      {hint && <span className="text-[12px] text-faint">{hint}</span>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-11 w-full rounded-md border border-border bg-raise px-3.5 text-[14px] tracking-[-0.006em] text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-soft placeholder:text-faint hover:border-border-strong focus:border-azul-ceu focus:shadow-[0_0_0_3px_rgb(136_201_247/18%)]',
        props.className,
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full resize-y rounded-md border border-border bg-raise px-3.5 py-3 text-[14px] tracking-[-0.006em] text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-soft placeholder:text-faint hover:border-border-strong focus:border-azul-ceu focus:shadow-[0_0_0_3px_rgb(136_201_247/18%)]',
        props.className,
      )}
    />
  );
}

export function CheckboxRow({
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] leading-snug text-muted">
      <input type="checkbox" {...props} className="mt-0.5 h-4 w-4 accent-[var(--color-amarelo)]" />
      <span>{children}</span>
    </label>
  );
}

export function InlineLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn('label text-faint', props.className)} />;
}
