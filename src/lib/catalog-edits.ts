import EDITS from "@/data/catalog-edits.json";
import type { ModelCard } from "./modelCards";

// Admins' corrections of catalogue texts. The catalogue itself is built from data files; edits
// are kept in the database and fetched into src/data/catalog-edits.json when the site is built
// (scripts/fetch-catalog-edits.mjs), so they reach the static pages with the next deploy. Applied
// on top of the cards here; an empty value means "back to the catalogue's own text".

export const CATALOG_EDIT_FIELDS = {
  summary: { label: "Popis modelu", level: "line", long: true },
  name: { label: "Název generace", level: "generation", long: false },
  dateNote: { label: "Poznámka k rokům výroby", level: "generation", long: true },
} as const;

export type CatalogEditField = keyof typeof CATALOG_EDIT_FIELDS;

export interface CatalogEdit {
  makeSlug: string;
  lineSlug: string;
  /** null for the model line itself */
  genIndex: number | null;
  field: CatalogEditField;
  value: string;
}

export const isEditField = (field: string): field is CatalogEditField => field in CATALOG_EDIT_FIELDS;

/** Applies edits to one card (a copy; the card from the index stays as built). */
export function applyEdits(card: ModelCard, edits: CatalogEdit[]): ModelCard {
  if (!edits.length) return card;
  const out: ModelCard = { ...card, generations: card.generations.map((g) => ({ ...g })) };
  for (const e of edits) {
    if (!e.value) continue;
    if (e.genIndex === null) {
      if (e.field === "summary") out.summary = e.value;
      continue;
    }
    const gen = out.generations[e.genIndex];
    if (!gen) continue;
    if (e.field === "name") gen.name = e.value;
    else if (e.field === "dateNote") gen.dateNote = e.value;
  }
  return out;
}

const BUILT = (EDITS as { edits: CatalogEdit[] }).edits;

/** Edits of one model line that were fetched into the build. */
export const builtEditsOf = (makeSlug: string, lineSlug: string) => BUILT.filter((e) => e.makeSlug === makeSlug && e.lineSlug === lineSlug);
