import factIndex from "@/data/brand-facts.json";

// Facts about each make for its brand page, from Wikidata (CC0) via scripts/brand-facts.mjs,
// with hand corrections in scripts/brand-facts-overrides.json. Unknown values are null.

export interface BrandFacts {
  founded: number | null;
  dissolved: number | null;
  founders: string[];
  foundedIn: string | null;
  hq: string | null;
  parent: string | null;
  website: string | null;
  employees: { value: number; year: number | null } | null;
  description: string | null;
  wikiCs: string | null;
  wikiEn: string | null;
}

const FACTS = factIndex as unknown as Record<string, BrandFacts>;

export function factsOf(slug: string): BrandFacts | undefined {
  return FACTS[slug];
}

/** "skoda-auto.com" from "https://www.skoda-auto.com/". */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
