import { getBrand, models } from "./catalog";
import { mulberry32 } from "./listings";
import type { Model } from "./types";

// Fictional owner reviews built from each catalogue model's own pros, cons and score,
// so the review pages agree with the ratings shown elsewhere. Authors are invented and
// every review is labelled as a test post in the UI.

export const ASPECTS = ["Spolehlivost", "Pohodlí", "Jízdní vlastnosti", "Náklady na provoz"] as const;
export type Aspect = (typeof ASPECTS)[number];

export interface Review {
  id: string;
  brandSlug: string;
  modelSlug: string;
  author: string;
  postedAt: string;
  year: number;
  engine: string;
  ownedYears: number;
  mileageKm: number;
  overall: number;
  scores: Record<Aspect, number>;
  plus: string[];
  minus: string[];
  text: string;
  recommends: boolean;
}

const PER_MODEL = 5;

const clamp = (v: number) => Math.max(1, Math.min(10, Math.round(v)));

const OPENERS = [
  "Auto jsme kupovali jako ojeté od prvního majitele.",
  "Vůz používám hlavně na dojíždění do práce a víkendové výlety.",
  "Přešel jsem na něj z menšího auta a rozdíl je znát.",
  "Kupovali jsme rodinné auto s ohledem na prostor a spolehlivost.",
  "Najezdil jsem s ním hodně po dálnici i po městě.",
];

function build(model: Model, index: number): Review[] {
  const brand = getBrand(model.brandSlug)!;
  return Array.from({ length: PER_MODEL }, (_, i) => {
    const rand = mulberry32(777 + index * 97 + i * 13);
    const jitter = () => (rand() - 0.5) * 2.4;
    const generation = model.generations[Math.floor(rand() * model.generations.length)];
    const year = Math.min(2025, generation.from + Math.floor(rand() * 4));
    const ownedYears = 1 + Math.floor(rand() * 6);
    const scores = Object.fromEntries(ASPECTS.map((a) => [a, clamp(model.ownerScore + jitter())])) as Record<Aspect, number>;
    const overall = clamp(Object.values(scores).reduce((s, v) => s + v, 0) / ASPECTS.length);
    const plus = model.pros.slice(0, 1 + Math.floor(rand() * 3)).map((p) => p.label);
    const minus = model.cons.slice(Math.floor(rand() * 2), 1 + Math.floor(rand() * 2) + 1).map((p) => p.label);
    const engine = model.engines[Math.floor(rand() * model.engines.length)];
    const day = Math.floor(rand() * 300);
    return {
      id: `${model.brandSlug}-${model.slug}-${i + 1}`,
      brandSlug: model.brandSlug,
      modelSlug: model.slug,
      author: `Testovací majitel ${100 + ((index * PER_MODEL + i) * 37) % 900}`,
      postedAt: new Date(Date.UTC(2026, 9, 25) - day * 86400000).toISOString().slice(0, 10),
      year,
      engine: engine.code,
      ownedYears,
      mileageKm: Math.round((ownedYears * (8000 + rand() * 17000)) / 1000) * 1000,
      overall,
      scores,
      plus,
      minus,
      text: `${OPENERS[Math.floor(rand() * OPENERS.length)]} Na autě oceňuji hlavně tohle: ${plus.join(", ")}. Méně mě baví ${minus.join(" a ")}. Testovací recenze, vůz ani majitel neexistují.`,
      recommends: overall >= 6,
    };
  });
}

export const reviews: Review[] = models.flatMap((m, i) => build(m, i));

export function reviewsOf(brandSlug: string, modelSlug: string): Review[] {
  return reviews.filter((r) => r.brandSlug === brandSlug && r.modelSlug === modelSlug).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

/** Average per aspect over the sample reviews of a model. */
export function aspectAverages(list: Review[]): Record<Aspect, number> {
  return Object.fromEntries(
    ASPECTS.map((a) => [a, list.reduce((s, r) => s + r.scores[a], 0) / Math.max(list.length, 1)]),
  ) as Record<Aspect, number>;
}
