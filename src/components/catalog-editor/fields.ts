import { BODY_NAMES, CARD_FUEL, DRIVE, GEARBOX } from "@/lib/modelCards";

// How the catalogue editor shows each field of a model card: a Czech label and the kind of input.
// Keys not listed here are still editable, with the key as the label and the input picked by the
// value's type, so no field of the card is out of reach. Templates are what "Přidat" inserts.

export type FieldKind = "text" | "long" | "number" | "year" | "bool" | "enum";

export interface FieldSpec {
  label: string;
  kind?: FieldKind;
  options?: Record<string, string>;
  /** for arrays: what a new item looks like */
  item?: () => unknown;
  /** for arrays of plain values: how each item is edited */
  itemKind?: FieldKind;
  itemOptions?: Record<string, string>;
  /** fields that do not need a full row, shown with the others */
  hidden?: boolean;
}

const dims = () => ({ length: null, width: null, height: null, wheelbase: null });

export const FIELDS: Record<string, FieldSpec> = {
  // the model line
  name: { label: "Název", kind: "text" },
  segment: { label: "Segment", kind: "text" },
  summary: { label: "Popis modelu", kind: "long" },
  // a generation
  code: { label: "Kód", kind: "text" },
  from: { label: "Od roku", kind: "year" },
  to: { label: "Do roku", kind: "year" },
  current: { label: "Stále se vyrábí", kind: "bool" },
  dateBasis: { label: "Základ let", kind: "enum", options: { production: "výroba", sale: "prodej", announcement: "jen ohlášeno" } },
  dateNote: { label: "Poznámka k rokům", kind: "long" },
  bodyTypes: { label: "Karoserie", itemKind: "enum", itemOptions: BODY_NAMES, item: () => "hatchback" },
  drivetrains: { label: "Pohon", itemKind: "enum", itemOptions: DRIVE, item: () => "fwd" },
  markets: { label: "Trhy", itemKind: "text", item: () => "" },
  trunkL: { label: "Zavazadelník (l)", kind: "number" },
  drawingStage: { label: "Nákres ukazuje vzhled (0 = původní, 1 = 1. facelift…)", kind: "number" },
  dimensionsMm: { label: "Rozměry (mm)" },
  length: { label: "Délka", kind: "number" },
  width: { label: "Šířka", kind: "number" },
  height: { label: "Výška", kind: "number" },
  wheelbase: { label: "Rozvor", kind: "number" },
  transmissions: { label: "Převodovky", item: () => ({ type: "manual", gears: null }) },
  type: { label: "Typ", kind: "enum", options: GEARBOX },
  gears: { label: "Stupňů", kind: "number" },
  engines: {
    label: "Motory",
    item: () => ({ fuel: "petrol", displacementCc: null, displacementLitresNominal: null, powerKwMin: null, powerKwMax: null, variant: "" }),
  },
  fuel: { label: "Palivo", kind: "enum", options: CARD_FUEL },
  displacementCc: { label: "Objem (cm³)", kind: "number" },
  displacementLitresNominal: { label: "Objem (l, jmenovitý)", kind: "number" },
  powerKwMin: { label: "Výkon od (kW)", kind: "number" },
  powerKwMax: { label: "Výkon do (kW)", kind: "number" },
  variant: { label: "Označení", kind: "text" },
  powerRangeCoverage: { label: "Rozsah výkonů", kind: "text" },
  availablePowerKw: { label: "Výkony (kW)", itemKind: "number", item: () => null },
  facelifts: { label: "Facelifty", item: () => ({ year: new Date().getFullYear(), to: null, name: null, code: null, note: null, photo: null }) },
  year: { label: "Rok", kind: "year" },
  note: { label: "Poznámka", kind: "long" },
  bodyVariants: { label: "Rozměry podle karoserie", item: () => ({ bodyType: "hatchback", label: null, dimensionsMm: dims(), trunkL: null, noteCs: null }) },
  bodyType: { label: "Karoserie", kind: "enum", options: BODY_NAMES },
  label: { label: "Rozlišení", kind: "text" },
  noteCs: { label: "Poznámka", kind: "long" },
  trims: { label: "Verze (technické údaje)", item: () => ({ name: "", from: null, to: null, bodyType: null, engine: { fuel: "petrol", displacementCc: null, powerKw: null, torqueNm: null }, transmission: { type: "manual", gears: null }, drive: null }) },
  engine: { label: "Motor" },
  cylinders: { label: "Válců", kind: "number" },
  powerKw: { label: "Výkon (kW)", kind: "number" },
  powerStandard: { label: "Norma výkonu", kind: "text" },
  torqueNm: { label: "Točivý moment (Nm)", kind: "number" },
  powerBasis: { label: "Základ výkonu", kind: "text" },
  combustionPowerKw: { label: "Výkon spalovacího motoru (kW)", kind: "number" },
  electricPowerKw: { label: "Výkon elektromotoru (kW)", kind: "number" },
  transmission: { label: "Převodovka" },
  drive: { label: "Pohon", kind: "enum", options: DRIVE },
  massKg: { label: "Hmotnost (kg)", kind: "number" },
  massBasis: { label: "Co hmotnost zahrnuje", kind: "text" },
  massReference: { label: "Hmotnost je", kind: "text" },
  massRangeKg: { label: "Rozpětí hmotnosti (kg)" },
  min: { label: "Od", kind: "number" },
  max: { label: "Do", kind: "number" },
  topSpeedKmh: { label: "Max. rychlost (km/h)", kind: "number" },
  acceleration0to100s: { label: "0–100 km/h (s)", kind: "number" },
  consumptionL100: { label: "Spotřeba (l/100 km)", kind: "number" },
  consumptionKwh100: { label: "Spotřeba (kWh/100 km)", kind: "number" },
  consumptionCycle: { label: "Cyklus spotřeby", kind: "text" },
  rangeKm: { label: "Dojezd (km)", kind: "number" },
  rangeCycle: { label: "Cyklus dojezdu", kind: "text" },
  equipmentLineIds: { label: "Výbavové stupně", itemKind: "text", item: () => "" },
  equipmentLines: { label: "Výbavové stupně", item: () => ({ id: "", name: "", kind: "equipment-line", from: null, to: null, noteCs: null }) },
  id: { label: "Identifikátor", kind: "text" },
  kind: { label: "Druh", kind: "enum", options: { "equipment-line": "výbava", "performance-line": "sportovní řada" } },
  photo: { label: "Fotka" },
  url: { label: "Adresa obrázku", kind: "text" },
  page: { label: "Stránka zdroje", kind: "text" },
  credit: { label: "Autor", kind: "text" },
  licence: { label: "Licence", kind: "text" },
  licenceUrl: { label: "Adresa licence", kind: "text" },
  aspect: { label: "Poměr stran", kind: "number" },
};

/** Fields a generation may lack, offered under "Přidat pole". */
export const OPTIONAL_GENERATION_FIELDS: Record<string, () => unknown> = {
  dateNote: () => "",
  dateBasis: () => "production",
  drawingStage: () => 0,
  bodyVariants: () => [],
  equipmentLines: () => [],
  photo: () => ({ url: "", page: "", credit: "", licence: "", licenceUrl: null }),
};

/** Optional fields of nested objects, by the field (or list) they sit in, offered under "Přidat pole". */
export const OPTIONAL_FIELDS: Record<string, Record<string, () => unknown>> = {
  engines: { powerRangeCoverage: () => "", availablePowerKw: () => [] },
  trims: {
    from: () => null, to: () => null, bodyType: () => "hatchback", engine: () => ({ fuel: "petrol", displacementCc: null, powerKw: null, torqueNm: null }),
    equipmentLineIds: () => [], transmission: () => ({ type: "manual", gears: null }), drive: () => "fwd",
    dimensionsMm: () => ({ length: null, width: null, height: null, wheelbase: null }), massKg: () => null, topSpeedKmh: () => null,
    acceleration0to100s: () => null, consumptionL100: () => null, consumptionCycle: () => "", consumptionKwh100: () => null,
    rangeKm: () => null, rangeCycle: () => "", massBasis: () => "", massReference: () => "", massRangeKg: () => ({ min: 0, max: 0 }),
  },
  engine: { fuel: () => "petrol", displacementCc: () => null, cylinders: () => null, powerKw: () => null, powerStandard: () => "", torqueNm: () => null, powerBasis: () => "", combustionPowerKw: () => null, electricPowerKw: () => null },
  transmission: { type: () => "manual", gears: () => null },
  bodyVariants: { label: () => "", noteCs: () => "" },
  equipmentLines: { noteCs: () => "" },
  photo: { aspect: () => null },
};

/** A new, empty generation. */
export const newGeneration = (from: number | null = null) => ({
  code: null,
  name: "",
  from,
  to: null,
  current: false,
  facelifts: [],
  bodyTypes: [],
  engines: [],
  drivetrains: [],
  transmissions: [],
  dimensionsMm: dims(),
  trunkL: null,
  markets: [],
  trims: [],
  photo: null,
});

/** The editor's input for a value: the field's own kind, else by the value's type. */
export function kindOf(key: string | number, value: unknown, parentKey?: string): FieldKind | "object" | "array" {
  if (typeof key === "number" && parentKey) {
    const spec = FIELDS[parentKey];
    if (spec?.itemKind) return spec.itemKind;
  }
  const spec = typeof key === "string" ? FIELDS[key] : undefined;
  if (spec?.kind) return spec.kind;
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") return "object";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return "number";
  if (typeof value === "string" && value.length > 80) return "long";
  return "text";
}

export const labelOf = (key: string | number) => (typeof key === "number" ? `${key + 1}.` : (FIELDS[key]?.label ?? key));
