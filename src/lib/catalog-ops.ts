import type { CardGeneration, ModelCard } from "./modelCards";

// Admins' edits of the catalogue as operations on a model card. Every save is one or more
// operations, kept in order in the database (catalog_edit, field "op"); replaying them on the
// card as built from the data files gives the card the site shows. Paths point into the card, e.g.
// ["generations", 2, "engines", 0, "powerKw"], so any field can be edited, added or removed.
//
// The data files may change under the edits (Codex refreshes the catalogue). Each operation carries
// what it expected to find, and one that no longer fits is skipped and reported as a conflict
// instead of changing the wrong thing. An operation inside a generation also carries the
// generation's identity (code, name, first year): when the data files reorder generations, it
// finds its own generation again, and when that generation is gone it is a conflict.
//
// Front drawings and STK statistics belong to a generation by its index in the data files. Replaying
// keeps, for every array item, the index it came from (null for one an admin added): for
// generations that gives `origins`, and "back to the data" (reset) finds the right original value
// even after items were added, removed or moved.
//
// Plain TypeScript without path aliases: the build scripts import this file directly (Node 24).

export type Path = (string | number)[];

/** How a generation is recognised when an operation refers to it by index. */
export interface GenIdentity {
  code: string | null;
  name: string | null;
  from: number | null;
}

export type CatalogOp =
  /** set a field (or add one that is missing); expect is the value the editor saw */
  | { op: "set"; path: Path; value: unknown; expect?: unknown; gen?: GenIdentity }
  /** back to the value in the data files (a field, an array item, a whole generation) */
  | { op: "reset"; path: Path; gen?: GenIdentity }
  /** insert into an array (path ends with the new item's index); ["generations", i] adds a generation */
  | { op: "insert"; path: Path; value: unknown; gen?: GenIdentity }
  /** remove an array item or an object field; expect as for set */
  | { op: "remove"; path: Path; expect?: unknown; gen?: GenIdentity }
  /** move an array item within its array (path is the array) */
  | { op: "move"; path: Path; from: number; to: number; expect?: unknown; gen?: GenIdentity }
  /** a generation's front drawing: a site path of an uploaded drawing, or null for none */
  | { op: "drawing"; index: number; src: string | null; expect?: GenIdentity };

/** One stored operation, as the database keeps it. */
export interface StoredOp {
  id: string;
  makeSlug: string;
  lineSlug: string;
  op: CatalogOp;
  createdAt: string;
}

export interface Conflict {
  id: string;
  reason: string;
}

export interface Applied {
  card: ModelCard;
  /** per generation of the result: its index in the data files, or null when an admin added it */
  origins: (number | null)[];
  /** per generation: undefined = the drawing from the data files, a path = uploaded, null = none */
  drawings: (string | null | undefined)[];
  conflicts: Conflict[];
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const clone = <T,>(v: T): T => (v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T));

/** Deep equality of JSON values; a missing field equals null. */
export function same(a: unknown, b: unknown): boolean {
  if (a === undefined) a = null;
  if (b === undefined) b = null;
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((x, i) => same(x, b[i]));
  }
  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...keys].every((k) => same(a[k], b[k]));
  }
  return false;
}

export const identityOf = (g: CardGeneration | undefined): GenIdentity | undefined =>
  g && { code: g.code ?? null, name: g.name ?? null, from: g.from ?? null };

/** The value at a path, or undefined; only the card's own fields, never inherited ones. */
export function getAt(root: unknown, path: Path): unknown {
  let node: unknown = root;
  for (const key of path) {
    if (Array.isArray(node) && typeof key === "number") node = node[key];
    else if (isObject(node) && typeof key === "string" && own(node, key)) node = node[key];
    else return undefined;
  }
  return node;
}

/** A path is well formed: strings for object keys, whole numbers for array items, no prototype tricks. */
export function validPath(path: unknown): path is Path {
  return (
    Array.isArray(path) &&
    path.length > 0 &&
    path.length <= 12 &&
    path.every((k) => (typeof k === "number" ? Number.isInteger(k) && k >= 0 && k < 10000 : typeof k === "string" && k.length > 0 && k.length <= 64 && k !== "__proto__" && k !== "constructor" && k !== "prototype"))
  );
}

/** JSON-only value of a sane size: what an edit may store. */
export function validValue(value: unknown): boolean {
  try {
    const text = JSON.stringify(value);
    return text !== undefined && text.length <= 200_000;
  } catch {
    return false;
  }
}

function parseIdentity(raw: unknown): GenIdentity | undefined | null {
  if (raw === undefined) return undefined;
  if (!isObject(raw)) return null;
  const text = (v: unknown) => v === null || (typeof v === "string" && v.length <= 200);
  if (!text(raw.code) || !text(raw.name) || !(raw.from === null || Number.isInteger(raw.from))) return null;
  return { code: raw.code as string | null, name: raw.name as string | null, from: raw.from as number | null };
}

/** Checks the shape of one operation from a request; returns it, or a reason it is refused. */
export function parseOp(raw: unknown): CatalogOp | string {
  if (!isObject(raw)) return "Neplatná úprava.";
  const gen = parseIdentity(raw.gen);
  if (gen === null) return "Neplatná generace.";
  const withGen = (op: Exclude<CatalogOp, { op: "drawing" }>): CatalogOp => (gen ? { ...op, gen } : op);
  const bad = "Hodnota je příliš velká nebo neplatná.";
  switch (raw.op) {
    case "set":
      if (!validPath(raw.path)) return "Neplatná cesta.";
      if (raw.value === undefined) return "Chybí hodnota.";
      return validValue(raw.value) && validValue(raw.expect ?? null) ? withGen({ op: "set", path: raw.path, value: raw.value, expect: raw.expect }) : bad;
    case "reset":
      return validPath(raw.path) ? withGen({ op: "reset", path: raw.path }) : "Neplatná cesta.";
    case "insert":
      if (!validPath(raw.path) || typeof raw.path[raw.path.length - 1] !== "number") return "Neplatná cesta.";
      if (raw.value === undefined) return "Chybí hodnota.";
      return validValue(raw.value) ? withGen({ op: "insert", path: raw.path, value: raw.value }) : bad;
    case "remove":
      return validPath(raw.path) && validValue(raw.expect ?? null) ? withGen({ op: "remove", path: raw.path, expect: raw.expect }) : "Neplatná cesta.";
    case "move": {
      const ok = validPath(raw.path) && Number.isInteger(raw.from) && Number.isInteger(raw.to) && (raw.from as number) >= 0 && (raw.to as number) >= 0;
      return ok && validValue(raw.expect ?? null) ? withGen({ op: "move", path: raw.path as Path, from: raw.from as number, to: raw.to as number, expect: raw.expect }) : "Neplatný přesun.";
    }
    case "drawing": {
      const src = raw.src;
      const srcOk = src === null || (typeof src === "string" && /^\/foto\/katalog\/[a-z0-9-]+\.webp$/.test(src));
      const expect = parseIdentity(raw.expect);
      if (!Number.isInteger(raw.index) || (raw.index as number) < 0 || !srcOk || expect === null) return "Neplatný nákres.";
      return { op: "drawing", index: raw.index as number, src: src as string | null, expect };
    }
    default:
      return "Neznámá úprava.";
  }
}

const GENERATIONS = JSON.stringify(["generations"]);
const isGenerationsPath = (path: Path) => path.length === 1 && path[0] === "generations";
/** A generation as an admin may insert it: an object with the lists every generation has. */
const generationLike = (v: unknown) => isObject(v) && ["facelifts", "bodyTypes", "engines", "drivetrains", "transmissions", "markets", "trims"].every((k) => Array.isArray(v[k]));

/**
 * Replays operations on a card as built from the data files. The input card is not changed.
 * Operations are applied in the order given (oldest first).
 */
export function applyOps(base: ModelCard, ops: StoredOp[]): Applied {
  const card = clone(base);
  const drawings: (string | null | undefined)[] = card.generations.map(() => undefined);
  const conflicts: Conflict[] = [];
  // for every array touched by insert, remove or move: where each of its items came from, keyed
  // by the array's path in the data files
  const itemOrigins = new Map<string, (number | null)[]>([[GENERATIONS, card.generations.map((_, i) => i)]]);

  /** The same place in the data files, or null when it is inside something an admin added. */
  function toBase(path: Path): Path | null {
    const out: Path = [];
    for (let i = 0; i < path.length; i++) {
      const seg = path[i];
      if (typeof seg === "number" && Array.isArray(getAt(card, path.slice(0, i)))) {
        const list = itemOrigins.get(JSON.stringify(out));
        const origin = list ? list[seg] : seg;
        if (origin === null || origin === undefined) return null;
        out.push(origin);
      } else out.push(seg);
    }
    return out;
  }

  /** Item origins of an array, created on first structural change. */
  function originsOf(arrayPath: Path, length: number): (number | null)[] | null {
    const basePath = toBase(arrayPath);
    if (!basePath) return null;
    const key = JSON.stringify(basePath);
    let list = itemOrigins.get(key);
    if (!list) {
      list = Array.from({ length }, (_, i) => i);
      itemOrigins.set(key, list);
    }
    return list;
  }

  /** Finds the generation an operation was made for, also when the data files reordered them. */
  function locate(index: number, identity: GenIdentity | undefined): number {
    if (!identity) return index;
    const fits = (g: CardGeneration | undefined) => !!g && same(identityOf(g), identity);
    if (fits(card.generations[index])) return index;
    const found = card.generations.map((g, i) => (fits(g) ? i : -1)).filter((i) => i >= 0);
    return found.length === 1 ? found[0] : -1;
  }

  for (const { id, op: raw } of ops) {
    const fail = (reason: string) => conflicts.push({ id, reason });

    if (raw.op === "drawing") {
      const at = locate(raw.index, raw.expect);
      if (at < 0 || !card.generations[at]) fail("generace se mezitím změnila");
      else drawings[at] = raw.src;
      continue;
    }

    // an operation inside a generation goes to the generation it was made for
    let op = raw;
    if (op.gen && op.path[0] === "generations" && typeof op.path[1] === "number" && op.path.length > 1) {
      const at = locate(op.path[1], op.gen);
      if (at < 0) {
        fail("generace, ke které úprava patří, už v datech není");
        continue;
      }
      op = { ...op, path: ["generations", at, ...op.path.slice(2)] } as typeof op;
    }

    if (op.op === "move") {
      const list = getAt(card, op.path);
      if (!Array.isArray(list) || op.from >= list.length || op.to >= list.length) {
        fail("položka už neexistuje");
        continue;
      }
      if (op.expect !== undefined && !same(list[op.from], op.expect)) {
        fail("položka se mezitím změnila");
        continue;
      }
      const origins = originsOf(op.path, list.length);
      const [item] = list.splice(op.from, 1);
      list.splice(op.to, 0, item);
      if (origins) origins.splice(op.to, 0, ...origins.splice(op.from, 1));
      if (isGenerationsPath(op.path)) drawings.splice(op.to, 0, ...drawings.splice(op.from, 1));
      continue;
    }

    if (op.op === "insert") {
      const arrayPath = op.path.slice(0, -1);
      const list = getAt(card, arrayPath);
      const at = op.path[op.path.length - 1] as number;
      if (!Array.isArray(list) || at > list.length) {
        fail("místo pro vložení už neexistuje");
        continue;
      }
      if (isGenerationsPath(arrayPath) && !generationLike(op.value)) {
        fail("nová generace nemá potřebná pole");
        continue;
      }
      const origins = originsOf(arrayPath, list.length);
      list.splice(at, 0, clone(op.value));
      origins?.splice(at, 0, null);
      if (isGenerationsPath(arrayPath)) drawings.splice(at, 0, undefined);
      continue;
    }

    if (op.op === "remove") {
      if (isGenerationsPath(op.path)) {
        fail("seznam generací nelze odstranit");
        continue;
      }
      const parentPath = op.path.slice(0, -1);
      const parent = getAt(card, parentPath);
      const key = op.path[op.path.length - 1];
      const current = getAt(card, op.path);
      if (current === undefined) {
        fail("pole už neexistuje");
        continue;
      }
      if (op.expect !== undefined && !same(current, op.expect)) {
        fail("hodnota se mezitím změnila");
        continue;
      }
      if (Array.isArray(parent)) {
        const origins = originsOf(parentPath, parent.length);
        parent.splice(key as number, 1);
        origins?.splice(key as number, 1);
        if (isGenerationsPath(parentPath)) drawings.splice(key as number, 1);
      } else delete (parent as Record<string, unknown>)[key as string];
      continue;
    }

    // set and reset
    if (isGenerationsPath(op.path)) {
      fail("seznam generací se mění jen přidáním, smazáním a přesunem");
      continue;
    }
    const wholeGeneration = isGenerationsPath(op.path.slice(0, -1));
    const parent = getAt(card, op.path.slice(0, -1));
    const key = op.path[op.path.length - 1];
    if (!(Array.isArray(parent) && typeof key === "number") && !(isObject(parent) && typeof key === "string")) {
      fail("pole už neexistuje");
      continue;
    }
    let value: unknown;
    if (op.op === "reset") {
      const basePath = toBase(op.path);
      if (!basePath) {
        fail("přidaná položka nemá původní hodnotu");
        continue;
      }
      value = clone(getAt(base, basePath));
      if (value === undefined && Array.isArray(parent)) {
        fail("položka v datech katalogu není");
        continue;
      }
      if (value === undefined && getAt(card, op.path) === undefined) {
        // nothing to take back; an inherited name such as "toString" is not a field at all
        if (typeof key === "string" && key in (parent as object)) fail("pole v kartě není");
        continue;
      }
    } else {
      if (wholeGeneration) {
        fail("celou generaci nelze přepsat najednou");
        continue;
      }
      if (op.expect !== undefined && !same(getAt(card, op.path), op.expect)) {
        fail("hodnota se mezitím změnila");
        continue;
      }
      value = clone(op.value);
    }
    if (Array.isArray(parent)) {
      const at = key as number;
      if (at > parent.length || (at === parent.length && op.op === "reset")) {
        fail("položka už neexistuje");
        continue;
      }
      // setting the item just past the end appends it, as an added item
      if (at === parent.length) originsOf(op.path.slice(0, -1), parent.length)?.push(null);
      parent[at] = value;
    } else if (value === undefined) delete parent[key as string];
    else parent[key as string] = value;
  }

  return { card, origins: [...itemOrigins.get(GENERATIONS)!], drawings, conflicts };
}

/** The years and codes of a card's generations, as the model lines index keeps them. */
export function generationSummary(card: ModelCard): { code: string | null; from: number | null; to: number | null }[] {
  return card.generations.map((g) => ({ code: g.code ?? g.name ?? null, from: g.from ?? null, to: g.current ? null : (g.to ?? null) }));
}

/**
 * Database rows as operations. Before operations existed, an edit was one text field (summary of the
 * line, name or dateNote of a generation; an empty value meant "back to the data"): those rows are
 * read as set or reset operations, so their history keeps working.
 */
export interface EditRow {
  id?: string;
  makeSlug: string;
  lineSlug: string;
  genIndex: number | null;
  field: string;
  value: string;
  createdAt?: string;
}

const LEGACY_FIELDS: Record<string, "line" | "generation"> = { summary: "line", name: "generation", dateNote: "generation" };

export function rowToOp(row: EditRow, n = 0): StoredOp | null {
  const id = row.id ?? `legacy-${n}`;
  const meta = { id, makeSlug: row.makeSlug, lineSlug: row.lineSlug, createdAt: row.createdAt ?? "" };
  if (row.field === "op") {
    try {
      const op = parseOp(JSON.parse(row.value));
      return typeof op === "string" ? null : { ...meta, op };
    } catch {
      return null;
    }
  }
  const level = LEGACY_FIELDS[row.field];
  if (!level || (level === "generation") !== (row.genIndex !== null)) return null;
  const path: Path = level === "line" ? [row.field] : ["generations", row.genIndex as number, row.field];
  return { ...meta, op: row.value ? { op: "set", path, value: row.value } : { op: "reset", path } };
}

/** Whether any operation of a line changes its generations' order or number, or a drawing. */
export function changesGenerations(ops: StoredOp[]): boolean {
  return ops.some(
    ({ op }) =>
      op.op === "drawing" ||
      (op.op === "move" && isGenerationsPath(op.path)) ||
      ((op.op === "insert" || op.op === "remove") && isGenerationsPath(op.path.slice(0, -1))),
  );
}
