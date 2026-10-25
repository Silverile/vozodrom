export type Fuel = "benzin" | "nafta" | "hybrid" | "elektro" | "lpg";
export type Transmission = "manuál" | "automat";
export type Body = "hatchback" | "kombi" | "sedan" | "suv" | "mpv";
export type SellerType = "soukromý" | "autobazar";

export interface Brand {
  slug: string;
  name: string;
  country: string;
}

export interface Generation {
  code: string;
  from: number;
  to: number | null;
}

export interface Engine {
  code: string;
  fuel: Fuel;
  powerKw: number;
  /** l/100 km, or kWh/100 km for EVs */
  consumption: number;
}

export interface Defect {
  label: string;
  /** share of failed inspections that list this defect, 0–1 */
  share: number;
}

export interface Opinion {
  label: string;
  /** how many owner reviews mention it */
  count: number;
}

export interface Model {
  slug: string;
  brandSlug: string;
  name: string;
  body: Body;
  segment: string;
  /** approximate new price in CZK, used only to generate test listings */
  newPrice: number;
  description: string;
  generations: Generation[];
  engines: Engine[];
  stk: { inspections: number; failRate: number; defects: Defect[] };
  /** median odometer reading by vehicle age in years */
  mileageByAge: { age: number; km: number }[];
  registered: number;
  /** owner rating 1–10 */
  ownerScore: number;
  reviews: number;
  pros: Opinion[];
  cons: Opinion[];
}

export interface StkRecord {
  date: string;
  odometerKm: number;
  result: "způsobilé" | "částečně způsobilé" | "nezpůsobilé";
}

export interface Battery {
  /** declared by the seller */
  capacityKwh: number;
  /** state of health from a dated test, or null when no test was provided */
  sohPercent: number | null;
  testedAt: string | null;
  testMethod: string | null;
  warrantyUntil: string | null;
}

export interface Listing {
  id: string;
  /** where the listing came from: generated test data or a dealer feed */
  source: { kind: "test" } | { kind: "feed"; feed: string; externalId: string; updatedAt: string };
  brandSlug: string;
  modelSlug: string;
  generation: string;
  year: number;
  mileageKm: number;
  price: number;
  engine: string;
  fuel: Fuel;
  transmission: Transmission;
  powerKw: number;
  body: Body;
  color: string;
  region: string;
  sellerType: SellerType;
  sellerName: string;
  vin: string;
  stkHistory: StkRecord[];
  postedAt: string;
  features: string[];
  description: string;
  battery?: Battery;
}
