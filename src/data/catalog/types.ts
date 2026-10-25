/** CC0 identity data. See SOURCES.md for scope and null semantics. */
export type CatalogSection = "auto" | "moto" | "technika" | "pneu";
export type CatalogBody = "hatchback" | "kombi" | "sedan" | "suv" | "mpv" | "kupe" | "kabriolet" | "pickup" | "dodavka";
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
