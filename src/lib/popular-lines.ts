import "server-only";

import listingStats from "@/data/listing-stats.json";
import { getMake, modelLinesOf } from "./makes";

// The model lines Czech owners drive most, by the register (src/data/listing-stats.json), for
// pickers that should stay small (the home page's "Jaké auto máte?").

export interface PopularLine {
  make: string;
  line: string;
  /** "Škoda Octavia" */
  name: string;
}

const MAKES = (listingStats as unknown as { makes: Record<string, Record<string, { n?: number }>> }).makes;

export function popularLines(limit = 80): PopularLine[] {
  const all: (PopularLine & { n: number })[] = [];
  for (const [make, lines] of Object.entries(MAKES)) {
    for (const [line, s] of Object.entries(lines)) {
      const name = modelLinesOf(make).find((l) => l.slug === line)?.name;
      if (s?.n && name) all.push({ make, line, name: `${getMake(make)?.name ?? make} ${name}`, n: s.n });
    }
  }
  return all
    .sort((a, b) => b.n - a.n)
    .slice(0, limit)
    .map(({ make, line, name }) => ({ make, line, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "cs"));
}
