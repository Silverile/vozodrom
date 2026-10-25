import type { PriceVerdict } from "@/lib/market";

const STYLE: Record<PriceVerdict, string> = {
  "výborná cena": "bg-[var(--color-good-soft)] text-[var(--color-good)]",
  "dobrá cena": "bg-[var(--color-good-soft)] text-[var(--color-good)]",
  "odpovídá trhu": "bg-[var(--color-info-soft)] text-[var(--color-info)]",
  "nad trhem": "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "vysoko nad trhem": "bg-[var(--color-bad-soft)] text-[var(--color-bad)]",
};

export function VerdictBadge({ verdict }: { verdict: PriceVerdict }) {
  return <span className={`chip ${STYLE[verdict]}`}>{verdict[0].toUpperCase() + verdict.slice(1)}</span>;
}

/** Five segments; more filled = cheaper relative to comparable listings. */
export function PriceMeter({ score, className = "" }: { score: number; className?: string }) {
  const color = score >= 4 ? "var(--color-good)" : score === 3 ? "var(--color-info)" : "var(--color-warn)";
  return (
    <span className={`inline-flex gap-[3px] ${className}`} role="img" aria-label={`Cena ${score} z 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="h-1.5 w-4 rounded-full" style={{ background: i <= score ? color : "var(--color-line)" }} />
      ))}
    </span>
  );
}
