export function ActivityGrid({
  activity,
  color = 'var(--color-amarelo)',
  columns = 14,
}: {
  activity: number[];
  color?: string;
  columns?: number;
}) {
  return (
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-hidden
    >
      {activity.map((op, i) => (
        <div key={i} className="aspect-square rounded-[2px]" style={{ background: color, opacity: op }} />
      ))}
    </div>
  );
}
