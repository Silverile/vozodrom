import "server-only";

import drawingReview from "@/data/front-drawing-review.json";
import listingStats from "@/data/listing-stats.json";
import { frontDrawingId } from "@/components/FrontDrawing";
import { coversYear, toListingFuel } from "./listing-catalog";
import { generationId, lineOf, type Draft } from "./listing-draft";
import { type CardEngine, type CardGeneration, type CardTrim, type ModelCard, cardOf, stagesOf } from "./modelCards";
import type { Listing } from "./types";

// Catalogue context for the page of a user listing: the generation the car belongs to, the catalogue
// engine and technical version that match what the seller filled in, and the real register and STK
// figures for that generation (src/data/listing-stats.json, made by scripts/listing-stats-index.mjs).

export interface CarStats {
  n: number | null;
  failRate: number | null;
  /** [age, fail rate] */
  byAge: [number, number][];
  /** [age, p25, median, p75] km */
  km: [number, number, number, number][];
  /** [defect, share of failed items] */
  defects: [string, number][];
  rollback: number | null;
}

type StatsLine = CarStats & { gens?: Record<string, CarStats> };
const STATS = listingStats as unknown as { meta: { stkFrom: string; stkTo: string }; makes: Record<string, Record<string, StatsLine>> };

export const statsPeriod = STATS.meta;

export interface ListingContext {
  lineSlug: string;
  lineName: string;
  card: ModelCard;
  gen: CardGeneration;
  genIndex: number;
  /** "facelift" etc. when the car is from a later stage of the generation */
  stage: string;
  drawing: string | null;
  engine: CardEngine | null;
  trim: CardTrim | null;
  stats: CarStats | null;
  /** the statistics are for the generation, not only the whole line */
  statsOfGeneration: boolean;
  /** age of the car this year, as the STK figures count it */
  age: number;
}

const near = (a: number | null | undefined, b: number, slack = 2) => a != null && Math.abs(a - b) <= slack;

function matchEngine(gen: CardGeneration, listing: Listing): CardEngine | null {
  const sameFuel = gen.engines.filter((e) => toListingFuel(e.fuel) === listing.fuel);
  return (
    sameFuel.find((e) => (e.powerKwMin ?? 0) - 2 <= listing.powerKw && listing.powerKw <= (e.powerKwMax ?? e.powerKwMin ?? 0) + 2) ??
    null
  );
}

function matchTrim(gen: CardGeneration, listing: Listing): CardTrim | null {
  const automatic = listing.transmission === "automat";
  const candidates = gen.trims.filter(
    (t) =>
      toListingFuel(t.engine?.fuel) === listing.fuel &&
      near(t.engine?.powerKw, listing.powerKw) &&
      coversYear({ from: t.from ?? null, to: t.to ?? null }, listing.year),
  );
  return candidates.find((t) => !t.transmission?.type || (t.transmission.type === "manual") !== automatic) ?? candidates[0] ?? null;
}

export function listingContext(listing: Listing, draft: Draft): ListingContext | null {
  const line = lineOf(draft);
  const card = line && cardOf(draft.brand, line.slug);
  if (!line || !card) return null;
  const chosen = card.generations.findIndex((g) => draft.generation && generationId(g) === draft.generation);
  const covering = card.generations.map((g, i) => [g, i] as const).filter(([g]) => g.from !== null && coversYear(g, listing.year));
  const genIndex = chosen >= 0 ? chosen : covering.length ? covering[covering.length - 1][1] : -1;
  if (genIndex < 0) return null;
  const gen = card.generations[genIndex];
  const stage = stagesOf(gen).filter((s) => s.from === null || s.from <= listing.year).pop()?.label ?? "";

  // Lines whose drawings await review may have generations out of step with the statistics: whole line only.
  const statsLine = STATS.makes[draft.brand]?.[line.slug];
  const genStats = `${draft.brand}--${line.slug}` in drawingReview ? undefined : statsLine?.gens?.[String(genIndex)];
  const { gens: _, ...lineStats } = statsLine ?? {};

  return {
    lineSlug: line.slug,
    lineName: card.name,
    card,
    gen,
    genIndex,
    stage,
    drawing: frontDrawingId(draft.brand, line.slug, genIndex),
    engine: matchEngine(gen, listing),
    trim: matchTrim(gen, listing),
    stats: genStats ?? (statsLine ? (lineStats as CarStats) : null),
    statsOfGeneration: Boolean(genStats),
    age: new Date().getFullYear() - listing.year,
  };
}

/** The statistic for the car's age, or the nearest age that has one. */
export function atAge<T extends [number, ...number[]]>(rows: T[], age: number): T | null {
  if (!rows.length) return null;
  return rows.reduce((best, row) => (Math.abs(row[0] - age) < Math.abs(best[0] - age) ? row : best));
}
