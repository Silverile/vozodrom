import { stkSignal } from "@/lib/stk";
import type { Listing } from "@/lib/types";

export function StkBadge({ listing }: { listing: Listing }) {
  const signal = stkSignal(listing);
  if (signal.kind === "none") return null;
  if (signal.kind === "drop") {
    return <span className="chip bg-[var(--color-bad-soft)] text-[var(--color-bad)]">⚠ Pokles nájezdu v STK</span>;
  }
  return <span className="chip bg-[var(--color-info-soft)] text-[var(--color-info)]">{signal.count}× STK bez poklesu nájezdu</span>;
}
