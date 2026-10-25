/** Horizontal bar with a label and value, scaled against `max`. */
export function Bar({ label, value, max, display }: { label: string; value: number; max: number; display: string }) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="grid grid-cols-[minmax(7rem,11rem)_1fr_auto] items-center gap-3 text-sm">
      <span className="truncate text-[var(--color-muted)]">{label}</span>
      <span className="h-2.5 rounded-full bg-[var(--color-line)] overflow-hidden">
        <span className="block h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${width}%` }} />
      </span>
      <span className="tabular-nums font-medium">{display}</span>
    </div>
  );
}
