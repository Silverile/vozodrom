import lines from "@/data/front-drawings.json";
import review from "@/data/front-drawing-review.json";
import { builtLine } from "@/lib/catalog-built";
import { asset } from "@/lib/format";

// Front-view line drawing of a generation, the placeholder until there is a photo. The drawings are
// transparent WebP files (public/front/<make>--<line>--<generation index>.webp, made by
// vozodrom-data/tools/front/site_drawings.py) used as a mask, so the line colour follows the theme.
// Every drawing has the car at the same height with the tyres on one ground line.

/** per model line: [generation index, first year, last year or null while in production] */
const LINES = lines as unknown as Record<string, [number, number | null, number | null][]>;
// Drawings held back for review (front-drawing-review.json, kept by Codex's pipeline): a key
// "make--line" holds the whole model line, "make--line--<generation index>" one generation.
const HELD = review as Record<string, string>;
const lineHeld = (make: string, line: string) => `${make}--${line}` in HELD;

/** Drawings of this model line, or of this one generation, are being checked and not shown yet. */
export function drawingPending(make: string, line: string, genIndex?: number): boolean {
  // a line edited by admins had its drawings resolved, held ones left out, when it was built
  if (builtLine(make, line)) return false;
  return lineHeld(make, line) || (genIndex !== undefined && `${make}--${line}--${genIndex}` in HELD);
}

/** Published, not held drawings of a model line, as [generation index, first year, last year]. */
const shownOf = (make: string, line: string) =>
  builtLine(make, line)?.drawings.map(([i, from, to]) => [i, from, to] as [number, number | null, number | null]) ??
  (lineHeld(make, line) ? [] : (LINES[`${make}--${line}`] ?? []).filter(([i]) => !drawingPending(make, line, i)));

/** The data files' drawing of a generation (by its index there), held for review or not; for the editor. */
export function dataDrawingSrc(make: string, line: string, index: number): string | null {
  return (LINES[`${make}--${line}`] ?? []).some(([i]) => i === index) ? asset(`/front/${make}--${line}--${index}.webp`) : null;
}

/** The file of a drawing id ("make--line--index"): an uploaded drawing or the data files' one. */
function drawingSrc(id: string): string {
  const cut = id.lastIndexOf("--");
  const [make, line] = id.slice(0, cut).split("--");
  const built = builtLine(make, line);
  const src = built?.drawings.find(([i]) => i === Number(id.slice(cut + 2)))?.[3];
  return src ?? `/front/${id}.webp`;
}

export function frontDrawingId(makeSlug: string, lineSlug: string, genIndex: number): string | null {
  return shownOf(makeSlug, lineSlug).some(([i]) => i === genIndex) ? `${makeSlug}--${lineSlug}--${genIndex}` : null;
}

/** The newest drawn generation of a model line. */
export function newestFrontDrawing(makeSlug: string, lineSlug: string): string | null {
  const gens = shownOf(makeSlug, lineSlug);
  return gens.length ? `${makeSlug}--${lineSlug}--${gens[gens.length - 1][0]}` : null;
}

/** Drawing of the generation built in `year`; where generations overlap, the newer one. */
export function frontDrawingFor(makeSlug: string, lineSlug: string, year: number): string | null {
  const hit = shownOf(makeSlug, lineSlug).filter(([, from, to]) => (from ?? 0) <= year && year <= (to ?? 9999)).pop();
  return hit ? `${makeSlug}--${lineSlug}--${hit[0]}` : null;
}

export function FrontDrawing({ id, alt, className = "", aspect = "aspect-[16/10]" }: { id: string; alt: string; className?: string; aspect?: string }) {
  const mask = `url(${asset(drawingSrc(id))}) center / contain no-repeat`;
  return (
    <div className={`w-full ${aspect} bg-[var(--color-blueprint)] ${className}`} role="img" aria-label={`Nákres: ${alt}`}>
      <div className="w-full h-full bg-[var(--color-blueprint-ink)]" style={{ mask, WebkitMask: mask }} />
    </div>
  );
}
