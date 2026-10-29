/** CC0 identity data. See SOURCES.md for scope and null semantics. */
export type CatalogSection = "auto" | "moto" | "technika" | "pneu";
export type CatalogBody = "hatchback" | "liftback" | "kombi" | "sedan" | "suv" | "mpv" | "kupe" | "kabriolet" | "pickup" | "dodavka";
export interface CatalogMake {
  slug: string;
  name: string;
  country: string | null;
  countryQid: string | null;
  countries: { qid: string; name: string | null }[];
  qid: string;
  /** Reviewed manufacturer/brand identifiers used for model attribution, not corporate synonyms. */
  relatedQids: string[];
  /** Status of the canonical source entity. Null means unverified; a brand may outlive its company. */
  status: "defunct" | null;
  foundedYear: number | null;
  dissolvedYear: number | null;
  sections: CatalogSection[];
  aliases: string[];
  sourceUrl: string;
}
export interface CatalogModel {
  /** Unique with makeSlug; use qid for durable identity. */
  slug: string;
  name: string;
  makeSlug: string;
  qid: string;
  kind: "model" | "series";
  body: CatalogBody | null;
  bodyTypes: CatalogBody[] | null;
  /** Direct source P580/P582 bounds; inception and manufacturer-specific periods remain separate. */
  productionStart: number | null;
  productionEnd: number | null;
  inceptionYear: number | null;
  discontinuedYear: number | null;
  manufacturerPeriods: { qid: string; from: number | null; to: number | null }[] | null;
  codes: string[];
  seriesQids: string[];
  manufacturerQids: string[];
  brandQids: string[];
  bodyClassQids: string[];
  generations: { qid: string; name: string; code: string | null; from: number | null; to: number | null }[] | null;
  sourceUrl: string;
}

export interface CatalogModelLineReview {
  /** A model-line field or indexed generation field. */
  field: string;
  reason: string;
}
export interface CatalogModelLineGeneration {
  /** Source code; null when not established. Facelift names are not generation codes. */
  code: string | null;
  from: number | null;
  to: number | null;
  productionStatus: "current" | "ended" | "unknown";
  bodyTypes: CatalogBody[] | null;
  sources: string[];
}
/** Manually selected European-market lines; metadata gaps are explicit, not fabricated. */
export interface CatalogModelLine {
  slug: string;
  name: string;
  makeSlug: string;
  aliases: string[];
  bodyTypes: CatalogBody[] | null;
  from: number | null;
  /** Null means current only if productionStatus=current; unknown ends also require needsReview. */
  to: number | null;
  productionStatus: "current" | "ended" | "unknown";
  /** Production evidence is not a promise of contemporary Czech availability. */
  dateScope: "europe" | "source-production";
  productionPeriods: { from: number; to: number | null }[] | null;
  segment?: string | null;
  generations: CatalogModelLineGeneration[] | null;
  wikidataQid: string | null;
  /** Source URLs, including fixed Wikipedia revisions and manufacturer facts where checked. */
  sources: string[];
  needsReview: CatalogModelLineReview[];
}

export type CatalogFuel = "petrol" | "diesel" | "petrol-cng" | "petrol-lpg" | "petrol-mhev" | "petrol-hev" | "petrol-phev" | "diesel-mhev" | "electric" | "hydrogen";
export interface CatalogModelCardPhoto {
  source: "commons" | "press";
  file: string;
  url: string;
  filePageUrl: string;
  author: string;
  licence: string;
  licenceUrl: string | null;
  credit: string;
  depicts: "generation";
  visualReview: "pending" | "reviewed";
  /** Framing/generation review does not certify trim, originality or exact model year. */
  reviewedAt?: string;
  reviewNoteCs?: string;
  sources: string[];
}
/** Visible mid-life exterior update; year can be the reveal year, productionYear scopes market timing. */
export interface CatalogModelCardFacelift {
  year: number;
  /** End of this appearance stage, not end of the whole generation. */
  to?: number | null;
  name?: string;
  /** Source-published stage label; null if not established. */
  code?: string | null;
  productionYear: number | null;
  note: string;
  sources: string[];
  /** Reviewed illustration of this appearance: Commons attribution or permitted official editorial press photograph. */
  photo?: CatalogModelCardPhoto | null;
}
export interface CatalogModelCardEngine {
  fuel: CatalogFuel | null;
  /** Exact cylinder capacity only; never calculated from a rounded marketing litre value. Electric: null = not applicable. */
  displacementCc: number | null;
  displacementLitresNominal: number | null;
  powerKwMin: number | null;
  powerKwMax: number | null;
  variant: string | null;
}
export interface CatalogModelCardGeneration {
  /** Source-published production total for this whole generation/family; not listings or surviving cars. */
  productionUnits?: number | null;
  /** Source URLs indexed by populated specification field, where reconciled. */
  fieldSources?: Record<string, string[]>;
  /** Selected technical/engine versions, not a complete equipment list. */
  trims: CatalogModelCardTrim[] | null;
  code: string | null;
  name: string;
  from: number | null;
  /** Current only when productionStatus=current; null can otherwise mean unknown. */
  to: number | null;
  productionStatus: "current" | "ended" | "unknown";
  /** Null = unreviewed, not "no facelift". Presentation and production years can differ. */
  facelift: CatalogModelCardFacelift[] | null;
  bodyTypes: CatalogBody[] | null;
  engines: CatalogModelCardEngine[] | null;
  engineCoverage: "partial" | "unknown";
  drivetrains: ("fwd" | "rwd" | "awd")[] | null;
  transmissions: { type: "manual" | "automated-manual" | "automatic" | "dual-clutch" | "single-speed" | "cvt" | "e-cvt"; gears: number | null }[] | null;
  dimensionsMm: { length: number | null; width: number | null; height: number | null; wheelbase: number | null };
  specificationScope: { market: string; modelYear: number | null; variant: string | null; bodyType: CatalogBody | null; noteCs: string };
  trunkL: number | null;
  markets: string[];
  marketNotesCs: string;
  photo: CatalogModelCardPhoto | null;
  sources: string[];
}
export interface CatalogModelCard {
  makeSlug: string;
  lineSlug: string;
  name: string;
  /** Sourced regional names/renames of this same model line, not separate trim cards. */
  aliases?: string[];
  isAddition: boolean;
  segment: string | null;
  summaryCs: string | null;
  coverage: "pilot-partial";
  generations: CatalogModelCardGeneration[];
  sources: string[];
  needsReview: CatalogModelLineReview[];
}

export interface CatalogModelCardTrim {
  name: string;
  kind: "technical-version" | "engine-version";
  from: number | null;
  /** Unknown production bound, not an assertion that the version is current. */
  to: number | null;
  bodyType: CatalogBody | null;
  engine: { fuel: CatalogFuel | null; displacementCc: number | null; cylinders: number | null; powerKw: number | null; torqueNm: number | null; powerStandard?: string | null };
  fieldSources?: Record<string, string[]>;
  transmission: { type: "manual" | "automated-manual" | "automatic" | "dual-clutch" | "single-speed" | "cvt" | "e-cvt" | null; gears: number | null };
  /** rr = rear engine/rear-wheel drive; rwd does not specify engine position. */
  drive: "fwd" | "rwd" | "awd" | "rr" | null;
  dimensionsMm: { length: number | null; width: number | null; height: number | null; wheelbase: number | null };
  massKg: number | null;
  /** Source convention; no conversion between kerb, dry and driver-inclusive weights. */
  massBasis: string | null;
  /** Retained published interval; massKg may identify its minimum only when labelled. */
  massRangeKg?: { min: number; max: number } | null;
  massReference?: "published-minimum" | "base-version" | null;
  topSpeedKmh: number | null;
  acceleration0to100s: number | null;
  consumptionL100: number | null;
  /** Preserve constant-speed/period averages; do not imply WLTP when unspecified. */
  consumptionCycle: string | null;
  consumptionKwh100: number | null;
  rangeKm: number | null;
  rangeCycle: string | null;
  specificationScope: { market: string; modelYear: number | null; noteCs: string };
  sources: string[];
}
