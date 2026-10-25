import type { Body, Brand, Defect, Engine, Fuel, Generation, Model, Opinion } from "./types";

// Prototype catalogue. Model names and generations are real; every number
// (prices, STK statistics, mileage, registrations) is invented test data.

export const brands: Brand[] = [
  { slug: "skoda", name: "Škoda", country: "Česko" },
  { slug: "volkswagen", name: "Volkswagen", country: "Německo" },
  { slug: "hyundai", name: "Hyundai", country: "Jižní Korea" },
  { slug: "kia", name: "Kia", country: "Jižní Korea" },
  { slug: "toyota", name: "Toyota", country: "Japonsko" },
  { slug: "ford", name: "Ford", country: "USA" },
  { slug: "dacia", name: "Dacia", country: "Rumunsko" },
  { slug: "bmw", name: "BMW", country: "Německo" },
  { slug: "tesla", name: "Tesla", country: "USA" },
  { slug: "renault", name: "Renault", country: "Francie" },
];

const DEFECTS = [
  "Brzdová soustava",
  "Osvětlení a signalizace",
  "Náprava a zavěšení",
  "Pneumatiky",
  "Emise",
  "Koroze karoserie",
  "Výfukové potrubí",
  "Řízení",
];

function defects(seed: number): Defect[] {
  const shares = [0.31, 0.24, 0.18, 0.11, 0.08, 0.05, 0.03];
  return shares.map((share, i) => ({ label: DEFECTS[(i + seed) % DEFECTS.length], share }));
}

const PROS = ["prostorné", "úsporné", "spolehlivé", "pohodlné", "dobře se řídí", "tiché", "praktický kufr"];
const CONS = ["infotainment", "cena dílů", "tvrdý podvozek", "hluk v kabině", "spotřeba ve městě", "slabé světlomety"];

function opinions(labels: string[], seed: number, take: number, reviews: number, weight: number): Opinion[] {
  return Array.from({ length: take }, (_, i) => ({
    label: labels[(seed * 3 + i * 2) % labels.length],
    count: Math.round(reviews * weight * (1 - i * 0.18)),
  }));
}

function mileage(annualKm: number): { age: number; km: number }[] {
  return [1, 3, 5, 8, 10, 15].map((age) => ({ age, km: Math.round((annualKm * age) / 1000) * 1000 }));
}

function engine(code: string, fuel: Fuel, powerKw: number, consumption: number): Engine {
  return { code, fuel, powerKw, consumption };
}

interface ModelInput {
  slug: string;
  brandSlug: string;
  name: string;
  body: Body;
  segment: string;
  newPrice: number;
  description: string;
  generations: Generation[];
  engines: Engine[];
  failRate: number;
  annualKm: number;
  registered: number;
  seed: number;
}

function model(m: ModelInput): Model {
  const reviews = Math.round(m.registered / 330);
  return {
    slug: m.slug,
    brandSlug: m.brandSlug,
    name: m.name,
    body: m.body,
    segment: m.segment,
    newPrice: m.newPrice,
    description: m.description,
    generations: m.generations,
    engines: m.engines,
    stk: { inspections: Math.round(m.registered * 0.45), failRate: m.failRate, defects: defects(m.seed) },
    mileageByAge: mileage(m.annualKm),
    registered: m.registered,
    ownerScore: Math.round((9.5 - m.failRate * 10) * 10) / 10,
    reviews,
    pros: opinions(PROS, m.seed, 4, reviews, 0.42),
    cons: opinions(CONS, m.seed, 2, reviews, 0.14),
  };
}

export const models: Model[] = [
  model({
    slug: "octavia", brandSlug: "skoda", name: "Octavia", body: "kombi", segment: "Nižší střední třída",
    newPrice: 720000, description: "Nejprodávanější auto v Česku. Prostorný kombík pro rodiny i firmy.",
    generations: [{ code: "III (5E)", from: 2013, to: 2020 }, { code: "IV (NX)", from: 2020, to: null }],
    engines: [engine("1.5 TSI", "benzin", 110, 5.6), engine("2.0 TDI", "nafta", 110, 4.6), engine("1.4 TSI iV", "hybrid", 150, 1.6)],
    failRate: 0.14, annualKm: 21000, registered: 412000, seed: 0,
  }),
  model({
    slug: "fabia", brandSlug: "skoda", name: "Fabia", body: "hatchback", segment: "Malé auto",
    newPrice: 420000, description: "Úsporný malý vůz do města, oblíbený jako první auto.",
    generations: [{ code: "III (NJ)", from: 2014, to: 2021 }, { code: "IV (PJ)", from: 2021, to: null }],
    engines: [engine("1.0 MPI", "benzin", 59, 5.0), engine("1.0 TSI", "benzin", 81, 5.1)],
    failRate: 0.16, annualKm: 13000, registered: 298000, seed: 1,
  }),
  model({
    slug: "superb", brandSlug: "skoda", name: "Superb", body: "kombi", segment: "Střední třída",
    newPrice: 990000, description: "Vlajková loď Škody s obrovským prostorem pro cestující.",
    generations: [{ code: "III (3V)", from: 2015, to: 2023 }, { code: "IV (3Y)", from: 2023, to: null }],
    engines: [engine("2.0 TDI", "nafta", 140, 5.0), engine("2.0 TSI", "benzin", 140, 7.0), engine("1.5 TSI iV", "hybrid", 150, 0.8)],
    failRate: 0.12, annualKm: 26000, registered: 121000, seed: 2,
  }),
  model({
    slug: "kodiaq", brandSlug: "skoda", name: "Kodiaq", body: "suv", segment: "SUV",
    newPrice: 1050000, description: "Velké rodinné SUV, volitelně se sedmi místy.",
    generations: [{ code: "I (NS)", from: 2016, to: 2024 }, { code: "II (PS)", from: 2024, to: null }],
    engines: [engine("2.0 TDI 4x4", "nafta", 140, 6.2), engine("1.5 TSI", "benzin", 110, 6.6)],
    failRate: 0.11, annualKm: 22000, registered: 98000, seed: 3,
  }),
  model({
    slug: "karoq", brandSlug: "skoda", name: "Karoq", body: "suv", segment: "SUV",
    newPrice: 800000, description: "Kompaktní SUV s praktickým interiérem VarioFlex.",
    generations: [{ code: "I (NU)", from: 2017, to: null }],
    engines: [engine("1.5 TSI", "benzin", 110, 6.1), engine("2.0 TDI", "nafta", 110, 5.2)],
    failRate: 0.12, annualKm: 19000, registered: 87000, seed: 4,
  }),
  model({
    slug: "enyaq", brandSlug: "skoda", name: "Enyaq", body: "suv", segment: "Elektromobil",
    newPrice: 1150000, description: "Elektrické SUV s dojezdem přes 500 km v nejvyšší verzi.",
    generations: [{ code: "I", from: 2020, to: null }],
    engines: [engine("85 (77 kWh)", "elektro", 210, 16.5), engine("60 (62 kWh)", "elektro", 150, 16.0)],
    failRate: 0.07, annualKm: 18000, registered: 24000, seed: 5,
  }),
  model({
    slug: "golf", brandSlug: "volkswagen", name: "Golf", body: "hatchback", segment: "Nižší střední třída",
    newPrice: 740000, description: "Klasika kompaktní třídy, často dovážená z Německa.",
    generations: [{ code: "VII", from: 2012, to: 2019 }, { code: "VIII", from: 2019, to: null }],
    engines: [engine("1.5 TSI", "benzin", 110, 5.7), engine("2.0 TDI", "nafta", 110, 4.5)],
    failRate: 0.15, annualKm: 18000, registered: 104000, seed: 6,
  }),
  model({
    slug: "passat", brandSlug: "volkswagen", name: "Passat", body: "kombi", segment: "Střední třída",
    newPrice: 980000, description: "Oblíbený firemní kombík s úspornými dieselovými motory.",
    generations: [{ code: "B8", from: 2014, to: 2023 }, { code: "B9", from: 2023, to: null }],
    engines: [engine("2.0 TDI", "nafta", 110, 4.9), engine("1.5 TSI", "benzin", 110, 6.0)],
    failRate: 0.14, annualKm: 27000, registered: 89000, seed: 7,
  }),
  model({
    slug: "tiguan", brandSlug: "volkswagen", name: "Tiguan", body: "suv", segment: "SUV",
    newPrice: 1020000, description: "Kompaktní SUV s pohonem všech kol.",
    generations: [{ code: "II", from: 2016, to: 2024 }, { code: "III", from: 2024, to: null }],
    engines: [engine("2.0 TDI 4Motion", "nafta", 140, 6.0), engine("1.5 TSI", "benzin", 110, 6.6)],
    failRate: 0.13, annualKm: 20000, registered: 61000, seed: 8,
  }),
  model({
    slug: "id4", brandSlug: "volkswagen", name: "ID.4", body: "suv", segment: "Elektromobil",
    newPrice: 1100000, description: "Elektrické SUV na platformě MEB, sourozenec Enyaqu.",
    generations: [{ code: "I", from: 2020, to: null }],
    engines: [engine("Pro (77 kWh)", "elektro", 150, 17.0)],
    failRate: 0.08, annualKm: 17000, registered: 9000, seed: 0,
  }),
  model({
    slug: "i30", brandSlug: "hyundai", name: "i30", body: "hatchback", segment: "Nižší střední třída",
    newPrice: 560000, description: "Spolehlivý kompakt vyráběný v Nošovicích.",
    generations: [{ code: "III (PD)", from: 2016, to: null }],
    engines: [engine("1.5 DPi", "benzin", 81, 5.9), engine("1.0 T-GDi", "benzin", 74, 5.4)],
    failRate: 0.1, annualKm: 15000, registered: 112000, seed: 1,
  }),
  model({
    slug: "tucson", brandSlug: "hyundai", name: "Tucson", body: "suv", segment: "SUV",
    newPrice: 850000, description: "Rodinné SUV z Nošovic, i v hybridní verzi.",
    generations: [{ code: "III (TL)", from: 2015, to: 2020 }, { code: "IV (NX4)", from: 2020, to: null }],
    engines: [engine("1.6 T-GDi HEV", "hybrid", 169, 5.6), engine("1.6 CRDi", "nafta", 100, 5.3)],
    failRate: 0.09, annualKm: 18000, registered: 73000, seed: 2,
  }),
  model({
    slug: "ceed", brandSlug: "kia", name: "Ceed", body: "kombi", segment: "Nižší střední třída",
    newPrice: 590000, description: "Praktický kombík se sedmiletou zárukou výrobce.",
    generations: [{ code: "III (CD)", from: 2018, to: null }],
    engines: [engine("1.5 T-GDi", "benzin", 103, 6.0), engine("1.6 CRDi", "nafta", 100, 4.6)],
    failRate: 0.09, annualKm: 16000, registered: 64000, seed: 3,
  }),
  model({
    slug: "sportage", brandSlug: "kia", name: "Sportage", body: "suv", segment: "SUV",
    newPrice: 880000, description: "Výrazné SUV, oblíbené v hybridní verzi.",
    generations: [{ code: "IV (QL)", from: 2015, to: 2021 }, { code: "V (NQ5)", from: 2021, to: null }],
    engines: [engine("1.6 T-GDi HEV", "hybrid", 169, 5.8), engine("1.6 CRDi", "nafta", 100, 5.4)],
    failRate: 0.09, annualKm: 18000, registered: 58000, seed: 4,
  }),
  model({
    slug: "corolla", brandSlug: "toyota", name: "Corolla", body: "hatchback", segment: "Nižší střední třída",
    newPrice: 690000, description: "Hybrid s pověstí nejspolehlivějšího auta ve třídě.",
    generations: [{ code: "XII (E210)", from: 2018, to: null }],
    engines: [engine("1.8 Hybrid", "hybrid", 103, 4.4), engine("2.0 Hybrid", "hybrid", 135, 4.8)],
    failRate: 0.07, annualKm: 17000, registered: 46000, seed: 5,
  }),
  model({
    slug: "yaris", brandSlug: "toyota", name: "Yaris", body: "hatchback", segment: "Malé auto",
    newPrice: 470000, description: "Malý hybrid vyráběný v Kolíně.",
    generations: [{ code: "III (XP130)", from: 2011, to: 2020 }, { code: "IV (XP210)", from: 2020, to: null }],
    engines: [engine("1.5 Hybrid", "hybrid", 85, 3.8), engine("1.0 VVT-i", "benzin", 53, 5.0)],
    failRate: 0.08, annualKm: 12000, registered: 69000, seed: 6,
  }),
  model({
    slug: "rav4", brandSlug: "toyota", name: "RAV4", body: "suv", segment: "SUV",
    newPrice: 1100000, description: "Hybridní SUV s pohonem všech kol.",
    generations: [{ code: "V (XA50)", from: 2018, to: null }],
    engines: [engine("2.5 Hybrid AWD-i", "hybrid", 163, 5.7), engine("2.5 Plug-in", "hybrid", 225, 1.0)],
    failRate: 0.06, annualKm: 19000, registered: 27000, seed: 7,
  }),
  model({
    slug: "focus", brandSlug: "ford", name: "Focus", body: "kombi", segment: "Nižší střední třída",
    newPrice: 620000, description: "Kompakt s výborným podvozkem; výroba skončila v roce 2025.",
    generations: [{ code: "III", from: 2011, to: 2018 }, { code: "IV", from: 2018, to: 2025 }],
    engines: [engine("1.0 EcoBoost", "benzin", 92, 5.5), engine("1.5 EcoBlue", "nafta", 88, 4.4)],
    failRate: 0.16, annualKm: 17000, registered: 71000, seed: 8,
  }),
  model({
    slug: "kuga", brandSlug: "ford", name: "Kuga", body: "suv", segment: "SUV",
    newPrice: 900000, description: "SUV s plug-in hybridem i dieselem.",
    generations: [{ code: "II", from: 2012, to: 2019 }, { code: "III", from: 2019, to: null }],
    engines: [engine("2.5 PHEV", "hybrid", 165, 1.4), engine("2.0 EcoBlue", "nafta", 110, 5.6)],
    failRate: 0.13, annualKm: 19000, registered: 38000, seed: 0,
  }),
  model({
    slug: "duster", brandSlug: "dacia", name: "Duster", body: "suv", segment: "SUV",
    newPrice: 450000, description: "Nejlevnější SUV na trhu, i s LPG z výroby.",
    generations: [{ code: "II", from: 2017, to: 2024 }, { code: "III", from: 2024, to: null }],
    engines: [engine("1.0 TCe LPG", "lpg", 74, 7.2), engine("1.5 dCi 4x4", "nafta", 85, 5.0)],
    failRate: 0.15, annualKm: 16000, registered: 81000, seed: 1,
  }),
  model({
    slug: "sandero", brandSlug: "dacia", name: "Sandero", body: "hatchback", segment: "Malé auto",
    newPrice: 330000, description: "Levné a jednoduché auto, často s LPG.",
    generations: [{ code: "II", from: 2012, to: 2020 }, { code: "III", from: 2020, to: null }],
    engines: [engine("1.0 TCe LPG", "lpg", 74, 6.9), engine("1.0 SCe", "benzin", 49, 5.4)],
    failRate: 0.17, annualKm: 13000, registered: 76000, seed: 2,
  }),
  model({
    slug: "rada-3", brandSlug: "bmw", name: "Řada 3", body: "sedan", segment: "Střední třída",
    newPrice: 1350000, description: "Sportovní sedan i kombi Touring se zadním pohonem.",
    generations: [{ code: "F30", from: 2011, to: 2019 }, { code: "G20", from: 2018, to: null }],
    engines: [engine("320d", "nafta", 140, 4.8), engine("330e", "hybrid", 215, 1.6)],
    failRate: 0.14, annualKm: 21000, registered: 34000, seed: 3,
  }),
  model({
    slug: "model-3", brandSlug: "tesla", name: "Model 3", body: "sedan", segment: "Elektromobil",
    newPrice: 1050000, description: "Nejprodávanější elektrický sedan, aktualizace přes internet.",
    generations: [{ code: "I", from: 2017, to: 2023 }, { code: "I Highland", from: 2023, to: null }],
    engines: [engine("RWD", "elektro", 208, 13.2), engine("Long Range AWD", "elektro", 366, 14.5)],
    failRate: 0.09, annualKm: 20000, registered: 12000, seed: 4,
  }),
  model({
    slug: "model-y", brandSlug: "tesla", name: "Model Y", body: "suv", segment: "Elektromobil",
    newPrice: 1150000, description: "Elektrické SUV, nejprodávanější elektromobil v Evropě.",
    generations: [{ code: "I", from: 2020, to: 2025 }, { code: "I Juniper", from: 2025, to: null }],
    engines: [engine("RWD", "elektro", 220, 15.0), engine("Long Range AWD", "elektro", 378, 16.2)],
    failRate: 0.08, annualKm: 19000, registered: 15000, seed: 5,
  }),
  model({
    slug: "clio", brandSlug: "renault", name: "Clio", body: "hatchback", segment: "Malé auto",
    newPrice: 430000, description: "Malé auto s hybridní verzí E-Tech.",
    generations: [{ code: "IV", from: 2012, to: 2019 }, { code: "V", from: 2019, to: null }],
    engines: [engine("1.0 TCe", "benzin", 67, 5.3), engine("1.6 E-Tech", "hybrid", 105, 4.3)],
    failRate: 0.15, annualKm: 12000, registered: 52000, seed: 6,
  }),
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getModel(brandSlug: string, modelSlug: string): Model | undefined {
  return models.find((m) => m.brandSlug === brandSlug && m.slug === modelSlug);
}

export function modelsOf(brandSlug: string): Model[] {
  return models.filter((m) => m.brandSlug === brandSlug);
}

export function generationFor(model: Model, year: number): Generation {
  return (
    model.generations.find((g) => year >= g.from && (g.to === null || year <= g.to)) ??
    model.generations[model.generations.length - 1]
  );
}

export const FUEL_LABEL: Record<Fuel, string> = {
  benzin: "Benzín",
  nafta: "Nafta",
  hybrid: "Hybrid",
  elektro: "Elektro",
  lpg: "LPG",
};

export const BODY_LABEL: Record<Body, string> = {
  hatchback: "Hatchback",
  kombi: "Kombi",
  sedan: "Sedan",
  suv: "SUV",
  mpv: "MPV",
};

export const REGIONS = [
  "Praha",
  "Středočeský",
  "Jihočeský",
  "Plzeňský",
  "Karlovarský",
  "Ústecký",
  "Liberecký",
  "Královéhradecký",
  "Pardubický",
  "Vysočina",
  "Jihomoravský",
  "Olomoucký",
  "Zlínský",
  "Moravskoslezský",
];
