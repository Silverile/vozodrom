import BUILT from "@/data/catalog-built.json";

// What scripts/app-model-cards.mjs recorded about lines admins edited: for each generation of the
// card the index it came from in the data files, the drawings by generation, and the generations'
// codes and years. Front drawings and STK statistics are keyed by the data files' index, so they go
// through originOf; untouched lines keep their own indices.

export type BuiltDrawing = [index: number, from: number | null, to: number | null, src: string];

interface BuiltLine {
  origins: (number | null)[];
  drawings: BuiltDrawing[];
  generations: { code: string | null; from: number | null; to: number | null }[];
}

// through unknown: the JSON's inferred type depends on its content, which only the build knows
const LINES = (BUILT as unknown as { lines: Record<string, BuiltLine> }).lines;

export function builtLine(make: string, line: string): BuiltLine | undefined {
  return LINES[`${make}--${line}`];
}

/** The data files' index of a generation of the card, or null for one an admin added. */
export function originOf(make: string, line: string, index: number): number | null {
  const built = builtLine(make, line);
  if (!built) return index;
  return built.origins[index] ?? null;
}

/** Per-generation statistics (keyed by the data files' index) for a generation of the card. */
export function genStatsOf<T>(gens: Record<string, T> | undefined, make: string, line: string, index: number): T | undefined {
  const origin = originOf(make, line, index);
  return origin === null ? undefined : gens?.[String(origin)];
}
