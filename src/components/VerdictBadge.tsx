import type { PriceVerdict } from "@/lib/market";

const STYLE: Record<PriceVerdict, string> = {
  "pod trhem": "bg-[var(--color-good-soft)] text-[var(--color-good)]",
  "odpovídá trhu": "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
  "nad trhem": "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
};

export function VerdictBadge({ verdict }: { verdict: PriceVerdict }) {
  return <span className={`chip whitespace-nowrap ${STYLE[verdict]}`}>{verdict}</span>;
}
