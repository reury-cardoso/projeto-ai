import { activityStrip } from '@/lib/mock-data';

/** Textura de fundo do hero — mesmo motivo de "grade de atividade" dos cartões,
 * bem sutil e mascarada pra sumir antes da próxima seção. */
export function HeroGrid() {
  const cells = activityStrip(0, 140).map((op) => op * 0.5);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid grid-cols-[repeat(28,1fr)] gap-[5px] p-6 opacity-[0.14]"
      style={{
        maskImage: 'linear-gradient(to bottom, #000 0%, #000 34%, transparent 62%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 34%, transparent 62%)',
      }}
    >
      {cells.map((op, i) => (
        <div key={i} className="aspect-square rounded-[2px] bg-amarelo" style={{ opacity: op }} />
      ))}
    </div>
  );
}
