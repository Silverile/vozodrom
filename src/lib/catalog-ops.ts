import type { CardGeneration, ModelCard } from "./modelCards";

// Admins' edits of the catalogue as operations on a model card. Every save is one or more
// operations, kept in order in the database (catalog_edit, field "op"); replaying them on the
// card as built from the data files gives the card the site shows. Paths point into the card, e.g.
// ["generations", 2, "engines", 0, "powerKw"], so any field can be edited, added or removed.
//
// The data files may change under the edits (Codex refreshes the catalogue). Each operation carries
// what it expected to find, and one that no longer fits is skipped and reported as a conflict
// instead of changing the wrong thing.
//
// Generations are special: front drawings and STK statistics belong to a generation by its index
// in the data files. Replaying keeps, for every generation of the result, the index it came from
// (origins; null for a generation added by an admin) and its drawing as set by an admin.
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
  | { op: "set"; path: Path; value: unknown; expect?: unknown }
  /** back to the value in the data files */
  | { op: "reset"; path: Path }
  /** insert into an array (path ends with the new item's index); ["generations", i] adds a generation */
  | { op: "insert"; path: Path; value: unknown }
  /** remove an array item or an object field; expect as for set */
  | { op: "remove"; path: Path; expect?: unknown }
  /** move an array item within its array (path is the array) */
  | { op: "move"; path: Path; from: number; to: number; expect?: unknown }
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

const sameIdentity = (g: CardGeneration | undefined, id: GenIdentity | undefined) => !id || (!!g && same(identityOf(g), id));

/** The value at a path, or undefined. */
export function getAt(root: unknown, path: Path): unknown {
  let node: unknown = root;
  for (const key of path) {
    if (Array.isArray(node) && typeof key === "number") node = node[key];
    else if (isObject(node) && typeof key === "string") node = node[key];
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

/** Checks the shape of one operation from a request; returns it, or a reason it is refused. */
export function parseOp(raw: unknown): CatalogOp | string {
  if (!isObject(raw)) return "Neplatná úprava.";
  const valueOk = (v: unknown) => validValue(v) || "Hodnota je příliš velká nebo neplatná.";
  switch (raw.op) {
    case "set":
      if (!validPath(raw.path)) return "Neplatná cesta.";
      if (raw.value === undefined) return "Chybí hodnota.";
      return valueOk(raw.value) === true && validValue(raw.expect ?? null) ? { op: "set", path: raw.path, value: raw.value, expect: raw.expect } : "Hodnota je příliš velká nebo neplatná.";
    case "reset":
      return validPath(raw.path) ? { op: "reset", path: raw.path } : "Neplatná cesta.";
    case "insert":
      if (!validPath(raw.path) || typeof raw.path[raw.path.length - 1] !== "number") return "Neplatná cesta.";
      if (raw.value === undefined) return "Chybí hodnota.";
      return valueOk(raw.value) === true ? { op: "insert", path: raw.path, value: raw.value } : "Hodnota je příliš velká nebo neplatná.";
    case "remove":
      return validPath(raw.path) && validValue(raw.expect ?? null) ? { op: "remove", path: raw.path, expect: raw.expect } : "Neplatná cesta.";
    case "move": {
      const ok = validPath(raw.path) && Number.isInteger(raw.from) && Number.isInteger(raw.to) && (raw.from as number) >= 0 && (raw.to as number) >= 0;
      return ok && validValue(raw.expect ?? null) ? { op: "move", path: raw.path as Path, from: raw.from as number, to: raw.to as number, expect: raw.expect } : "Neplatný přesun.";
    }
    case "drawing": {
      const src = raw.src;
      const srcOk = src === null || (typeof src === "string" && /^\/foto\/katalog\/[a-z0-9-]+\.webp$/.test(src));
      if (!Number.isInteger(raw.index) || (raw.index as number) < 0 || !srcOk) return "Neplatný nákres.";
      return { op: "drawing", index: raw.index as number, src: src as string | null, expect: raw.expect as GenIdentity | undefined };
    }
    default:
      return "Neznámá úprava.";
  }
}

/** The parent container and last key of a path, or null when the parent does not exist. */
function parentOf(root: unknown, path: Path): { parent: Record<string, unknown> | unknown[]; key: string | number } | null {
  const parent = getAt(root, path.slice(0, -1));
  const key = path[path.length - 1];
  if (Array.isArray(parent) && typeof key === "number") return { parent, key };
  if (isObject(parent) && typeof key === "string") return { parent, key };
  return null;
}

const isGenerationsPath = (path: Path) => path.length === 1 && path[0] === "generations";

/**
 * Replays operations on a card as built from the data files. The input card is not changed.
 * Operations are applied in the order given (oldest first).
 */
export function applyOps(base: ModelCard, ops: StoredOp[]): Applied {
  const card = clone(base);
  const origins: (number | null)[] = card.generations.map((_, i) => i);
  const drawings: (string | null | undefined)[] = card.generations.map(() => undefined);
  const conflicts: Conflict[] = [];
  const fail = (id: string, reason: string) => conflicts.push({ id, reason });

  for (const { id, op } of ops) {
    if (op.op === "drawing") {
      const gen = card.generations[op.index];
      if (!gen || !sameIdentity(gen, op.expect)) fail(id, "generace se mezitím změnila");
      else drawings[op.index] = op.src;
      continue;
    }

    if (op.op === "move") {
      const list = getAt(card, op.path);
      if (!Array.isArray(list) || op.from >= list.length || op.to >= list.length) {
        fail(id, "položka už neexistuje");
        continue;
      }
      if (op.expect !== undefined && !same(list[op.from], op.expect)) {
        fail(id, "položka se mezitím změnila");
        continue;
      }
      const [item] = list.splice(op.from, 1);
      list.splice(op.to, 0, item);
      if (isGenerationsPath(op.path)) {
        const [o] = origins.splice(op.from, 1);
        origins.splice(op.to, 0, o);
        const [d] = drawings.splice(op.from, 1);
        drawings.splice(op.to, 0, d);
      }
      continue;
    }

    if (op.op === "insert") {
      const target = parentOf(card, op.path);
      if (!target || !Array.isArray(target.parent) || (target.key as number) > target.parent.length) {
        fail(id, "místo pro vložení už neexistuje");
        continue;
      }
      target.parent.splice(target.key as number, 0, clone(op.value));
      if (isGenerationsPath(op.path.slice(0, -1))) {
        origins.splice(target.key as number, 0, null);
        drawings.splice(target.key as number, 0, undefined);
      }
      continue;
    }

    if (op.op === "remove") {
      const target = parentOf(card, op.path);
      const current = getAt(card, op.path);
      if (!target || current === undefined) {
        fail(id, "pole už neexistuje");
        continue;
      }
      if (op.expect !== undefined && !same(current, op.expect)) {
        fail(id, "hodnota se mezitím změnila");
        continue;
      }
      if (Array.isArray(target.parent)) {
        target.parent.splice(target.key as number, 1);
        if (isGenerationsPath(op.path.slice(0, -1))) {
          origins.splice(target.key as number, 1);
          drawings.splice(target.key as number, 1);
        }
      } else delete (target.parent as Record<string, unknown>)[target.key as string];
      continue;
    }

    // set and reset
    let value: unknown;
    if (op.op === "reset") {
      // the same place in the data files: a generation by the index it came from
      let basePath: Path | null = op.path;
      if (op.path[0] === "generations" && typeof op.path[1] === "number") {
        const origin = origins[op.path[1]];
        basePath = origin === undefined || origin === null ? null : ["generations", origin, ...op.path.slice(2)];
      }
      if (!basePath) {
        fail(id, "přidaná generace nemá původní hodnotu");
        continue;
      }
      value = clone(getAt(base, basePath));
    } else {
      if (op.expect !== undefined && !same(getAt(card, op.path), op.expect)) {
        fail(id, "hodnota se mezitím změnila");
        continue;
      }
      value = clone(op.value);
    }
    const target = parentOf(card, op.path);
    if (!target || (Array.isArray(target.parent) && (target.key as number) > target.parent.length)) {
      fail(id, "pole už neexistuje");
      continue;
    }
    if (isGenerationsPath(op.path.slice(0, -1)) || isGenerationsPath(op.path)) {
      // a whole generation or the list is replaced through insert/remove/move only
      fail(id, "celou generaci nelze přepsat");
      continue;
    }
    if (value === undefined) delete (target.parent as Record<string, unknown>)[target.key as string];
    else (target.parent as Record<string, unknown>)[target.key as string] = value;
  }

  return { card, origins, drawings, conflicts };
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
