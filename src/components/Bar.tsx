/** Horizontal bar with a label and value, scaled against `max`. */
export function Bar({ label, value, max, display }: { label: string; value: number; max: number; display: string }) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:gap-3 text-sm">
      <span className="truncate text-[var(--color-muted)]">{label}</span>
      <span className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 h-2.5 rounded-full bg-[var(--color-line)] overflow-hidden">
        <span className="block h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${width}%` }} />
      </span>
      <span className="col-start-2 row-start-1 sm:col-start-3 tabular-nums font-medium whitespace-nowrap">{display}</span>
    </div>
  );
}
