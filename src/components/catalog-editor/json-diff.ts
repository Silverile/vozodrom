import { type CatalogOp, type Path, same } from "@/lib/catalog-ops";
import type { CardGeneration, ModelCard } from "@/lib/modelCards";

// "Vložit JSON" in the catalogue editor: an admin copies the card as JSON, has it corrected (by an AI,
// say) and pastes it back. This turns the difference into the editor's operations: generations are
// matched by code (or name), so removed, added and reordered generations become remove, insert and
// move (their drawings and STK statistics follow them); then each field that differs becomes a set,
// and a field that disappeared a remove. Operations come in order: structure first, then fields at
// the generations' final places.

/** What a pasted card must look like; the reason it is refused, or the card. */
export function parseCard(text: string): ModelCard | string {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return `Neplatný JSON: ${e instanceof Error ? e.message : "chyba zápisu"}.`;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Čekám objekt karty modelu ({ … }).";
  const card = data as ModelCard;
  if (!Array.isArray(card.generations)) return "Karta musí mít seznam „generations“.";
  const lists = ["facelifts", "bodyTypes", "engines", "drivetrains", "transmissions", "markets", "trims"] as const;
  for (const [i, g] of card.generations.entries()) {
    if (!g || typeof g !== "object" || Array.isArray(g)) return `${i + 1}. generace není objekt.`;
    const missing = lists.filter((k) => !Array.isArray((g as unknown as Record<string, unknown>)[k]));
    if (missing.length) return `${i + 1}. generaci chybí seznamy: ${missing.join(", ")}.`;
  }
  return card;
}

/** Keys that identify generations across the two cards; repeated keys get a counter. */
function keysOf(gens: CardGeneration[]): string[] {
  const seen = new Map<string, number>();
  return gens.map((g, i) => {
    const base = (g.code || g.name || (g.from ? `od ${g.from}` : "") || `#${i}`).trim().toLowerCase();
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n > 1 ? `${base}#${n}` : base;
  });
}

const isPlain = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const REQUIRED = new Set(["facelifts", "bodyTypes", "engines", "drivetrains", "transmissions", "markets", "trims"]);

/** Operations that make one value into another: objects field by field, everything else whole. */
function diffValue(path: Path, a: unknown, b: unknown, ops: CatalogOp[]) {
  if (same(a, b)) return;
  if (isPlain(a) && isPlain(b)) {
    for (const k of Object.keys(b)) {
      if (!(k in a)) ops.push({ op: "set", path: [...path, k], value: b[k], expect: null });
      else diffValue([...path, k], a[k], b[k], ops);
    }
    // a generation's lists stay (they can be emptied); other fields that went away are removed
    const inGeneration = path.length === 2 && path[0] === "generations";
    for (const k of Object.keys(a)) if (!(k in b) && !(inGeneration && REQUIRED.has(k))) ops.push({ op: "remove", path: [...path, k], expect: a[k] });
    return;
  }
  ops.push({ op: "set", path, value: b, expect: a ?? null });
}

export function diffCard(current: ModelCard, next: ModelCard): CatalogOp[] {
  const ops: CatalogOp[] = [];
  const work = [...current.generations];
  let keys = keysOf(work);
  const want = keysOf(next.generations);

  // 1. generations the new card no longer has, from the end so the indices stay right
  for (let i = work.length - 1; i >= 0; i--) {
    if (!want.includes(keys[i])) {
      ops.push({ op: "remove", path: ["generations", i], expect: work[i] });
      work.splice(i, 1);
      keys.splice(i, 1);
    }
  }
  // 2. into the new order: move the ones that are there, insert the new ones
  for (let j = 0; j < want.length; j++) {
    if (keys[j] === want[j]) continue;
    const from = keys.indexOf(want[j]);
    if (from > j) {
      ops.push({ op: "move", path: ["generations"], from, to: j, expect: work[from] });
      work.splice(j, 0, ...work.splice(from, 1));
      keys.splice(j, 0, ...keys.splice(from, 1));
    } else {
      ops.push({ op: "insert", path: ["generations", j], value: next.generations[j] });
      work.splice(j, 0, next.generations[j]);
      keys.splice(j, 0, want[j]);
    }
  }
  keys = keys.slice(0, want.length);

  // 3. fields of each generation, at its final place
  next.generations.forEach((g, j) => diffValue(["generations", j], work[j], g, ops));

  // 4. the card's own fields
  const { generations: _a, ...restA } = current;
  const { generations: _b, ...restB } = next;
  for (const k of Object.keys(restB)) {
    const before = (restA as Record<string, unknown>)[k];
    const after = (restB as Record<string, unknown>)[k];
    if (!(k in restA)) ops.push({ op: "set", path: [k], value: after, expect: null });
    else diffValue([k], before, after, ops);
  }
  for (const k of Object.keys(restA)) if (!(k in restB)) ops.push({ op: "remove", path: [k], expect: (restA as Record<string, unknown>)[k] });
  return ops;
}
