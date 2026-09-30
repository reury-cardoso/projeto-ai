import Image from 'next/image';
import { cn } from '@/lib/cn';

/** Wordmark TalentPDA. Duas variantes: branca/amarela pro tema escuro e roxa pro claro (troca via .light no <html>). */
export function Logo({ className }: { className?: string }) {
  const shared = 'w-auto';
  return (
    <>
      <Image
        src="/logo-wordmark.png"
        alt="TalentPDA"
        width={900}
        height={94}
        priority
        className={cn(shared, 'logo-dark', className)}
      />
      <Image
        src="/logo-wordmark-light.png"
        alt="TalentPDA"
        width={900}
        height={94}
        priority
        className={cn(shared, 'logo-light', className)}
      />
    </>
  );
}
