import index from "@/data/makes-index.json";

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
