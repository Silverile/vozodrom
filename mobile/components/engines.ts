import type { ListingFormEngineDto } from "../lib/api";

export interface EngineChoice { key: string; label: string; chip: string; engine: ListingFormEngineDto }

const power = (e: ListingFormEngineDto) => (e.kwMin == null ? "" : e.kwMin === e.kwMax || e.kwMax == null ? `${e.kwMin} kW` : `${e.kwMin}–${e.kwMax} kW`);

/** Catalogue engines can share a label (MX-5 NB has three "1.8"); chips then show the power so each is tellable apart. */
export function engineChoices(engines: ListingFormEngineDto[]): EngineChoice[] {
  const counts = new Map<string, number>();
  for (const e of engines) counts.set(e.label, (counts.get(e.label) ?? 0) + 1);
  return engines.map((e, i) => ({
    key: `${i}:${e.label}`,
    label: e.label,
    chip: (counts.get(e.label) ?? 0) > 1 && power(e) ? `${e.label} · ${power(e)}` : e.label,
    engine: e,
  }));
}
