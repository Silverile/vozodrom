import fs from "node:fs";
import path from "node:path";

// Real statistics from Czech open data (Ministerstvo dopravy: Registr silničních vozidel and
// IS TP technical inspections), aggregated by scripts/stats/ into src/data/stats/<make>.json.
// Read at build time only (static export); groups under the minimum size are not published.

export interface FleetStats {
  n: number;
  avgAge: number | null;
  years: [number, number][];
  fuel: Record<string, number>;
  colors: [string, number][];
  /** Share of cars built from 1995 that were first registered abroad; null when too few. */
  imported: number | null;
  countries: [string, number][];
}

export interface StkStats {
  inspections: number;
  failRate: number;
  unfitRate: number;
  withDefects: number;
  byAge: [number, number, number][];
  defects: { code: string; label: string | null; share: number; severe: number }[];
  km: [number, number, number, number][];
  rollback?: { vehicles: number; share: number };
}

export interface StatsEntry {
  fleet?: FleetStats;
  stk?: StkStats;
}

export interface StatsMeta {
  stk: { from: string; to: string; days: number };
  register: { file: string; built: string };
  minN: number;
}

type MakeFile = { meta: StatsMeta; _?: StatsEntry } & Record<string, StatsEntry & { gens?: Record<string, StatsEntry> }>;

const cache = new Map<string, MakeFile | null>();

function load(make: string): MakeFile | null {
  if (!cache.has(make)) {
    const file = path.join(process.cwd(), "src", "data", "stats", `${make}.json`);
    if (!fs.existsSync(file)) return null; // not cached: the dev server may see the file appear later
    cache.set(make, JSON.parse(fs.readFileSync(file, "utf8")) as MakeFile);
  }
  return cache.get(make) ?? null;
}

export function makeStats(make: string): { meta: StatsMeta; entry: StatsEntry } | null {
  const f = load(make);
  return f?._ ? { meta: f.meta, entry: f._ } : null;
}

export function lineStats(make: string, line: string): { meta: StatsMeta; entry: StatsEntry; gens: Record<string, StatsEntry> } | null {
  const f = load(make);
  const e = f?.[line] as (StatsEntry & { gens?: Record<string, StatsEntry> }) | undefined;
  if (!f || !e || (!e.fleet && !e.stk)) return null;
  return { meta: f.meta, entry: e, gens: e.gens ?? {} };
}

export const FUEL_NAMES: Record<string, string> = {
  benzin: "benzin",
  nafta: "nafta",
  hybrid: "hybrid",
  elektro: "elektro",
  lpg: "LPG",
  cng: "CNG",
  "jiné": "jiné",
};

/** "21. 10. 2023" from "2023-10-21". */
export function czDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}
