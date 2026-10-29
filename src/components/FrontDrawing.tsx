import lines from "@/data/front-drawings.json";
import { asset } from "@/lib/format";

// Front-view line drawing of a generation, the placeholder until there is a photo. The drawings are
// transparent WebP files (public/front/<make>--<line>--<generation index>.webp, made by
// vozodrom-data/tools/front/site_drawings.py) used as a mask, so the line colour follows the theme.
// Every drawing has the car at the same height with the tyres on one ground line.

/** per model line: [generation index, first year, last year or null while in production] */
const LINES = lines as unknown as Record<string, [number, number | null, number | null][]>;

export function frontDrawingId(makeSlug: string, lineSlug: string, genIndex: number): string | null {
  return LINES[`${makeSlug}--${lineSlug}`]?.some(([i]) => i === genIndex) ? `${makeSlug}--${lineSlug}--${genIndex}` : null;
}

/** The newest drawn generation of a model line. */
export function newestFrontDrawing(makeSlug: string, lineSlug: string): string | null {
  const gens = LINES[`${makeSlug}--${lineSlug}`];
  return gens?.length ? `${makeSlug}--${lineSlug}--${gens[gens.length - 1][0]}` : null;
}

/** Drawing of the generation built in `year`; where generations overlap, the newer one. */
export function frontDrawingFor(makeSlug: string, lineSlug: string, year: number): string | null {
  const hit = (LINES[`${makeSlug}--${lineSlug}`] ?? []).filter(([, from, to]) => (from ?? 0) <= year && year <= (to ?? 9999)).pop();
  return hit ? `${makeSlug}--${lineSlug}--${hit[0]}` : null;
}

export function FrontDrawing({ id, alt, className = "", aspect = "aspect-[16/10]" }: { id: string; alt: string; className?: string; aspect?: string }) {
  const mask = `url(${asset(`/front/${id}.webp`)}) center / contain no-repeat`;
  return (
    <div className={`w-full ${aspect} bg-[var(--color-blueprint)] ${className}`} role="img" aria-label={`Nákres: ${alt}`}>
      <div className="w-full h-full bg-[var(--color-blueprint-ink)]" style={{ mask, WebkitMask: mask }} />
    </div>
  );
}
