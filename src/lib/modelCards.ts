import cardIndex from "@/data/model-cards-index.json";

// Model cards: generations, engines, trims and Commons photos per model line
// (src/data/catalog/model-cards/ via scripts/model-cards-index.mjs). Unknown values are null.

export type CardFuel = "petrol" | "diesel" | "petrol-cng" | "petrol-lpg" | "petrol-mhev" | "petrol-hev" | "petrol-phev" | "diesel-mhev" | "electric" | "hydrogen";

export interface CardEngine {
  fuel: CardFuel | null;
  displacementCc: number | null;
  displacementLitresNominal: number | null;
  powerKwMin: number | null;
  powerKwMax: number | null;
  variant: string | null;
}

export interface CardTrim {
  name: string | null;
  from?: number | null;
  to?: number | null;
  bodyType?: string | null;
  engine?: {
    fuel?: CardFuel | null;
    displacementCc?: number | null;
    cylinders?: number | null;
    powerKw?: number | null;
    /** Measurement standard of powerKw: "ISO", "SAE" or "UN-GTR.21"; null when the source does not say. */
    powerStandard?: string | null;
    torqueNm?: number | null;
  } | null;
  transmission?: { type?: string | null; gears?: number | null } | null;
  drive?: string | null;
  dimensionsMm?: { length?: number | null; width?: number | null; height?: number | null; wheelbase?: number | null } | null;
  massKg?: number | null;
  topSpeedKmh?: number | null;
  acceleration0to100s?: number | null;
  consumptionL100?: number | null;
  /** Test cycle of the consumption and range figures, e.g. "WLTP", "NEDC", "ČSN". */
  consumptionCycle?: string | null;
  consumptionKwh100?: number | null;
  rangeKm?: number | null;
  rangeCycle?: string | null;
  /** What the mass includes (kerb with or without driver, historical "pohotovostní"…), as the source states it. */
  massBasis?: string | null;
  /** "published-minimum" when massKg is the lowest value of a published range. */
  massReference?: string | null;
  massRangeKg?: { min: number; max: number } | null;
}

export interface CardPhoto {
  /** width / height of the original, from scripts/photo-sizes.mjs; null when unknown */
  aspect?: number | null;
  url: string;
  page: string;
  credit: string;
  licence: string;
  licenceUrl: string | null;
}

export interface CardFacelift {
  year: number;
  /** last year of this stage; null = until the next facelift or the generation's end */
  to: number | null;
  name: string | null;
  code: string | null;
  note: string | null;
  photo: CardPhoto | null;
}

/** A generation's look-stages as Drom shows them: the original, then each facelift with its own years. */
export interface GenerationStage {
  label: string;
  code: string | null;
  from: number | null;
  to: number | null;
  current: boolean;
  photo: CardPhoto | null;
}

export function stagesOf(g: CardGeneration): GenerationStage[] {
  const fl = [...g.facelifts].sort((a, b) => a.year - b.year);
  if (!fl.length) return [{ label: "", code: g.code, from: g.from, to: g.to, current: g.current, photo: g.photo }];
  const many = fl.length > 1;
  return [
    { label: "", code: g.code, from: g.from, to: fl[0].year, current: false, photo: g.photo },
    ...fl.map((f, i) => {
      const last = i === fl.length - 1;
      return {
        label: f.name ?? (many ? `${i + 1}. facelift` : "facelift"),
        code: f.code,
        from: f.year,
        to: f.to ?? (last ? g.to : fl[i + 1].year),
        current: last && g.current,
        photo: f.photo,
      };
    }),
  ];
}

export interface CardGeneration {
  dateBasis?: string;
  dateNote?: string | null;
  code: string | null;
  name: string | null;
  from: number | null;
  to: number | null;
  current: boolean;
  facelifts: CardFacelift[];
  bodyTypes: string[];
  engines: CardEngine[];
  drivetrains: string[];
  transmissions: { type: string; gears: number | null }[];
  dimensionsMm: { length: number | null; width: number | null; height: number | null; wheelbase: number | null } | null;
  trunkL: number | null;
  markets: string[];
  trims: CardTrim[];
  photo: CardPhoto | null;
  sources: string[];
}

export interface ModelCard {
  name: string;
  segment: string | null;
  summary: string | null;
  generations: CardGeneration[];
  sources: string[];
}

const CARDS = cardIndex as unknown as Record<string, Record<string, ModelCard>>;

export function cardOf(makeSlug: string, lineSlug: string): ModelCard | undefined {
  return CARDS[makeSlug]?.[lineSlug];
}

// Commons serves thumbnails only in standard widths; others answer 400.
const THUMB_WIDTHS = [250, 330, 500, 960, 1280, 1920];

/** Commons thumbnail of a full-size upload URL (snapped up to a standard width); other URLs as they are. */
export function thumb(url: string, width = 500): string {
  const m = url.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f]\/[0-9a-f]{2})\/([^/]+)$/);
  if (!m) return url;
  const file = m[2];
  const png = /\.svg$/i.test(file) ? ".png" : "";
  const w = THUMB_WIDTHS.find((x) => x >= width) ?? THUMB_WIDTHS[THUMB_WIDTHS.length - 1];
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${file}/${w}px-${file}${png}`;
}

/** Newest generation that has a photo, for list thumbnails. */
export function coverOf(card: ModelCard | undefined): CardPhoto | null {
  if (!card) return null;
  return [...card.generations].reverse().find((g) => g.photo)?.photo ?? null;
}

export const BODY_NAMES: Record<string, string> = {
  hatchback: "hatchback",
  kombi: "kombi",
  sedan: "sedan",
  liftback: "liftback",
  suv: "SUV",
  mpv: "MPV",
  kupe: "kupé",
  kabriolet: "kabriolet",
  pickup: "pick-up",
  dodavka: "dodávka",
};

/** Plural headings for grouping a make's models by body type, in display order. */
export const BODY_GROUPS: [string, string][] = [
  ["hatchback", "Hatchbacky"],
  ["liftback", "Liftbacky"],
  ["sedan", "Sedany"],
  ["kombi", "Kombi"],
  ["suv", "SUV"],
  ["mpv", "MPV"],
  ["kupe", "Kupé"],
  ["kabriolet", "Kabriolety"],
  ["pickup", "Pick-upy"],
  ["dodavka", "Dodávky"],
];

export const CARD_FUEL: Record<CardFuel, string> = {
  petrol: "benzin",
  diesel: "nafta",
  "petrol-cng": "benzin + CNG",
  "petrol-lpg": "benzin + LPG",
  "petrol-mhev": "mild hybrid",
  "petrol-hev": "plný hybrid",
  "diesel-mhev": "nafta, mild hybrid",
  hydrogen: "vodík",
  "petrol-phev": "plug-in hybrid",
  electric: "elektro",
};

export const DRIVE: Record<string, string> = {
  fwd: "přední",
  rwd: "zadní",
  awd: "4×4",
  rr: "zadní (motor vzadu)",
};

export const GEARBOX: Record<string, string> = {
  manual: "manuál",
  "automated-manual": "automatizovaný manuál",
  automatic: "automat",
  "dual-clutch": "DSG",
  "single-speed": "jednostupňová",
  cvt: "CVT",
  "e-cvt": "e-CVT",
};

export function yearsSpan(from: number | null, to: number | null, current: boolean): string {
  if (from && to) return `${from}–${to}`;
  if (from && current) return `${from}–dosud`;
  if (from) return `od ${from}`;
  return "";
}
