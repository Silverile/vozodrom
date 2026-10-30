// What the listing form needs from a model card: per generation the years, body types, engines and
// gearboxes the catalogue knows, mapped to the listing's own values. Shared by the API and the form.

export type ListingFuel = "benzin" | "nafta" | "hybrid" | "elektro" | "lpg";
export type ListingGearbox = "manuál" | "automat";

export interface FormEngine {
  /** "1.5 TSI" when the catalogue names the variant, else "1.2" */
  label: string;
  fuel: ListingFuel | null;
  kwMin: number | null;
  kwMax: number | null;
}

export interface FormGeneration {
  code: string;
  name: string | null;
  from: number | null;
  to: number | null;
  bodies: string[];
  engines: FormEngine[];
  gearboxes: ListingGearbox[];
  photo: string | null;
}

const FUEL: Record<string, ListingFuel> = {
  petrol: "benzin",
  diesel: "nafta",
  "petrol-cng": "benzin",
  "petrol-lpg": "lpg",
  "petrol-mhev": "hybrid",
  "diesel-mhev": "hybrid",
  "petrol-hev": "hybrid",
  "petrol-phev": "hybrid",
  electric: "elektro",
};

/**
 * The catalogue card's generation for a generation of the model list. Their codes differ for some
 * lines ("GB/IB" in the list, "GB" on the card), so codes are compared part by part, then years.
 */
export function cardGeneration<T extends { code: string | null; from: number | null; to: number | null }>(
  g: { code: string | null; from: number | null; to: number | null },
  cards: T[],
): T | undefined {
  const parts = (code: string | null) => (code ?? "").split(/[s/,]+/).filter(Boolean).map((p) => p.toLowerCase());
  const mine = parts(g.code);
  return (
    cards.find((c) => c.code !== null && c.code === g.code) ??
    cards.find((c) => parts(c.code).some((p) => mine.includes(p))) ??
    (g.from !== null ? cards.find((c) => c.from === g.from && (c.to === g.to || g.to === null || c.to === null)) : undefined) ??
    (g.to !== null ? cards.find((c) => c.code === null && c.to === g.to && c.from !== null) : undefined)
  );
}

export const toListingFuel = (fuel: string | null | undefined): ListingFuel | null => (fuel ? FUEL[fuel] ?? null : null);
export const toGearbox = (type: string): ListingGearbox => (type === "manual" ? "manuál" : "automat");

export function engineLabel(e: { variant: string | null; displacementLitresNominal: number | null }): string {
  return e.variant ?? (e.displacementLitresNominal ? e.displacementLitresNominal.toFixed(1) : "");
}

/** Does a generation (null years = unknown) include the year? */
export function coversYear(g: { from: number | null; to: number | null }, year: number): boolean {
  return (g.from === null || year >= g.from) && (g.to === null || year <= g.to);
}

/** Body types a listing can have (the catalogue's keys), with their Czech names. */
export const BODY_KEYS: Record<string, string> = {
  hatchback: "hatchback",
  liftback: "liftback",
  sedan: "sedan",
  kombi: "kombi",
  suv: "SUV",
  mpv: "MPV",
  kupe: "kupé",
  kabriolet: "kabriolet",
  pickup: "pick-up",
  dodavka: "dodávka",
};

/** The five pictogram bodies used by search filters and placeholders. */
export function pictogramBody(body: string): "hatchback" | "kombi" | "sedan" | "suv" | "mpv" {
  if (body === "kombi" || body === "sedan" || body === "suv" || body === "mpv") return body;
  if (body === "kupe" || body === "kabriolet") return "sedan";
  if (body === "pickup") return "suv";
  if (body === "dodavka") return "mpv";
  return "hatchback";
}
