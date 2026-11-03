import index from "@/data/makes-index.json";
import lineIndex from "@/data/model-lines-index.json";
import { builtLine } from "./catalog-built";

// All vehicle makes known to the site (432, from Wikidata, CC0), small enough for the browser.
// Built by scripts/makes-index.mjs from src/data/catalog/makes.json. Model lines exist only for
// the demo makes in lib/catalog.ts so far; the rest are listed without models.

export type MakeSection = "auto" | "moto" | "technika" | "pneu";

export interface Make {
  slug: string;
  name: string;
  sections: MakeSection[];
  country: string | null;
  defunct: boolean;
  logo: boolean;
  /** Wikidata item, the source of the make's data */
  qid: string;
  /** folded names and aliases, for matching free-text make names */
  keys: string[];
}

export const MAKES = index as Make[];

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function makesIn(section: MakeSection): Make[] {
  return MAKES.filter((m) => m.sections.includes(section));
}

export function getMake(slug: string | null | undefined): Make | undefined {
  return MAKES.find((m) => m.slug === slug);
}

/** Make for a free-text name such as "MAN" or "Škoda"; undefined if unknown. */
export function resolveMake(name: string): Make | undefined {
  const key = fold(name);
  return MAKES.find((m) => m.keys.includes(key));
}

/** First letter for A–Z grouping ("Š" sorts under S, digits under "0–9"). */
export function initialOf(name: string): string {
  const c = fold(name).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "0–9";
}

// Curated car model lines (src/data/catalog/model-lines-auto.json via scripts/model-lines-index.mjs).
// Years can be unknown (null); `to: null` means "still made" only when `current` is true.

export interface ModelLine {
  slug: string;
  name: string;
  aliases?: string[];
  familyLineSlug?: string | null;
  dateScope?: string;
  from: number | null;
  to: number | null;
  current: boolean;
  bodyTypes: string[];
  generations: { code: string | null; from: number | null; to: number | null }[];
}

const LINES = lineIndex as Record<string, ModelLine[]>;
const edited = new Map<string, ModelLine[]>();

/**
 * Model lines of a make. Where admins edited a line's generations (lib/catalog-built), its
 * generations and years come from the edited card, so the listing form offers, and its checks
 * accept, the same generations the catalogue shows.
 */
export function modelLinesOf(makeSlug: string): ModelLine[] {
  const lines = LINES[makeSlug] ?? [];
  let out = edited.get(makeSlug);
  if (!out) {
    out = lines.map((line) => {
      const gens = builtLine(makeSlug, line.slug)?.generations;
      if (!gens) return line;
      const froms = gens.map((g) => g.from).filter((y): y is number => y !== null);
      const tos = gens.map((g) => g.to).filter((y): y is number => y !== null);
      // from the edited generations: current when one of them is; open-ended when one has no known end
      const current = gens.some((g) => g.current);
      return {
        ...line,
        generations: gens.map(({ code, from, to }) => ({ code, from, to })),
        from: froms.length ? Math.min(...froms) : line.from,
        current,
        to: current || gens.some((g) => g.from !== null && g.to === null) ? null : tos.length ? Math.max(...tos) : line.to,
      };
    });
    edited.set(makeSlug, out);
  }
  return out;
}

/** Exact model identity, allowing spacing/punctuation aliases, never S line -> S. */
export function resolveModelLine(makeSlug: string, name: string): ModelLine | undefined {
  const key = (value: string) => fold(value).replace(/[\s-]+/g, "");
  return modelLinesOf(makeSlug).find(l => [l.slug, l.name, ...(l.aliases ?? [])].some(value => key(value) === key(name)));
}

/** "1996–dosud", "2011–2020", "od 2025", or "" when the years are unknown. */
export function yearsOf(line: { from: number | null; to: number | null; current: boolean }): string {
  if (line.from && line.to) return `${line.from}–${line.to}`;
  if (line.from && line.current) return `${line.from}–dosud`;
  if (line.from) return `od ${line.from}`;
  return "";
}
