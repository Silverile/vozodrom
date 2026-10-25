import { getBrand, models } from "./catalog";
import { CITIES } from "./geo";
import { mulberry32 } from "./listings";
import type { SellerType } from "./types";

// Fictional test listings for the sections beyond cars: utility vehicles and machinery,
// motorcycles, parts and tyres. Deterministic like the car data; names of real makes and
// models are used only as labels, every price, seller and vehicle is invented.

export type ItemSection = "technika" | "moto" | "dily" | "pneu";
export type Condition = "nové" | "použité";
export type Season = "letní" | "zimní" | "celoroční";

export interface Category {
  slug: string;
  label: string;
}

export interface Tyre {
  width: number;
  profile: number;
  rim: number;
  season: Season;
  count: number;
  /** remaining tread depth for used tyres, mm */
  treadMm: number | null;
  dot: number;
}

export interface Item {
  id: string;
  section: ItemSection;
  category: string;
  title: string;
  make: string;
  price: number;
  condition: Condition;
  year: number | null;
  region: string;
  city: string;
  sellerType: SellerType;
  sellerName: string;
  postedAt: string;
  description: string;
  specs: [string, string][];
  /** parts: which car models it fits (labels from the catalogue) */
  fits?: string[];
  tyre?: Tyre;
}

export const CATEGORIES: Record<ItemSection, Category[]> = {
  technika: [
    { slug: "dodavky", label: "Dodávky" },
    { slug: "nakladni", label: "Nákladní auta" },
    { slug: "tahace", label: "Tahače" },
    { slug: "autobusy", label: "Autobusy" },
    { slug: "zemedelska", label: "Traktory a zemědělská" },
    { slug: "stavebni", label: "Stavební stroje" },
    { slug: "privesy", label: "Přívěsy a návěsy" },
  ],
  moto: [
    { slug: "motocykly", label: "Motocykly" },
    { slug: "skutry", label: "Skútry a mopedy" },
    { slug: "ctyrkolky", label: "Čtyřkolky" },
    { slug: "vybava", label: "Výbava a oblečení" },
  ],
  dily: [
    { slug: "motor", label: "Motor a převodovka" },
    { slug: "podvozek", label: "Podvozek a brzdy" },
    { slug: "karoserie", label: "Karoserie" },
    { slug: "elektro", label: "Elektro a osvětlení" },
    { slug: "interier", label: "Interiér" },
    { slug: "kola", label: "Disky a kola" },
  ],
  pneu: [
    { slug: "letni", label: "Letní" },
    { slug: "zimni", label: "Zimní" },
    { slug: "celorocni", label: "Celoroční" },
  ],
};

export function categoryOf(section: ItemSection, slug: string): Category | undefined {
  return CATEGORIES[section].find((c) => c.slug === slug);
}

// --- generator ----------------------------------------------------------------------------

const CURRENT_YEAR = 2026;
let rand = mulberry32(1);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rand() * items.length)];
const between = (min: number, max: number) => min + rand() * (max - min);
const roundTo = (value: number, step: number) => Math.max(step, Math.round(value / step) * step);

function place() {
  // Regional capitals carry about half of the listings, as in the car data.
  const city = rand() < 0.5 ? pick(CITIES.filter((c, i, all) => all.findIndex((x) => x.region === c.region) === i)) : pick(CITIES);
  return { region: city.region, city: city.slug };
}

function seller(dealers: string[]) {
  const dealer = rand() < 0.5;
  return { sellerType: (dealer ? "autobazar" : "soukromý") as SellerType, sellerName: dealer ? pick(dealers) : "Soukromý prodejce" };
}

function posted() {
  return new Date(Date.UTC(CURRENT_YEAR, 9, 25) - Math.floor(rand() * 40) * 86400000).toISOString().slice(0, 10);
}

const nf = new Intl.NumberFormat("cs-CZ");

// [category, make, model, new price CZK, unit of use]
const MACHINES: [string, string, string, number, "km" | "mth"][] = [
  ["dodavky", "Ford", "Transit 2.0 EcoBlue", 1_150_000, "km"],
  ["dodavky", "Volkswagen", "Crafter 2.0 TDI", 1_250_000, "km"],
  ["dodavky", "Renault", "Master 2.3 dCi", 1_050_000, "km"],
  ["dodavky", "Mercedes-Benz", "Sprinter 316 CDI", 1_350_000, "km"],
  ["nakladni", "Iveco", "Daily 70C18 valník", 1_900_000, "km"],
  ["nakladni", "MAN", "TGL 12.250 skříň", 2_900_000, "km"],
  ["tahace", "Scania", "R 450", 3_600_000, "km"],
  ["tahace", "Volvo", "FH 500", 3_800_000, "km"],
  ["tahace", "DAF", "XF 480", 3_400_000, "km"],
  ["autobusy", "SOR", "CN 12", 6_500_000, "km"],
  ["autobusy", "Iveco", "Crossway 12 m", 7_200_000, "km"],
  ["zemedelska", "Zetor", "Proxima 120", 2_300_000, "mth"],
  ["zemedelska", "John Deere", "6R 150", 4_900_000, "mth"],
  ["zemedelska", "New Holland", "T6.180", 4_100_000, "mth"],
  ["stavebni", "Caterpillar", "320 rýpadlo", 5_200_000, "mth"],
  ["stavebni", "JCB", "3CX rypadlo-nakladač", 2_800_000, "mth"],
  ["stavebni", "Bobcat", "S70 smykový nakladač", 950_000, "mth"],
  ["privesy", "Agados", "VZ 27 přívěs 750 kg", 45_000, "km"],
  ["privesy", "Schwarzmüller", "návěs plachta", 1_200_000, "km"],
];

const MOTOS: [string, string, string, number, number][] = [
  // [category, make, model, new price, engine ccm]
  ["motocykly", "Honda", "CB650R", 255_000, 649],
  ["motocykly", "Yamaha", "MT-07", 229_000, 689],
  ["motocykly", "Kawasaki", "Z900", 269_000, 948],
  ["motocykly", "BMW", "R 1250 GS", 489_000, 1254],
  ["motocykly", "KTM", "390 Duke", 159_000, 373],
  ["motocykly", "Ducati", "Monster", 349_000, 937],
  ["motocykly", "Jawa", "350 OHC", 109_000, 397],
  ["skutry", "Honda", "PCX 125", 89_000, 125],
  ["skutry", "Yamaha", "NMAX 125", 92_000, 125],
  ["skutry", "Vespa", "Primavera 125", 115_000, 125],
  ["skutry", "Piaggio", "Liberty 50", 59_000, 50],
  ["ctyrkolky", "Can-Am", "Outlander 650", 339_000, 649],
  ["ctyrkolky", "CFMOTO", "CForce 520", 189_000, 495],
  ["ctyrkolky", "Polaris", "Sportsman 570", 259_000, 567],
];

const GEAR: [string, string, number][] = [
  ["Shoei", "integrální přilba NXR2, vel. M", 16_900],
  ["Rev'It!", "textilní bunda Sand 4, vel. L", 12_500],
  ["Alpinestars", "kožené rukavice SP-8, vel. L", 3_900],
  ["Held", "kalhoty Tourino, vel. 52", 9_800],
  ["TCX", "boty Clima 2 GTX, vel. 43", 7_900],
];

// [category, make, part, new price]
const PARTS: [string, string, string, number][] = [
  ["motor", "Bosch", "Alternátor 140 A", 8_900],
  ["motor", "Garrett", "Turbodmychadlo, repasované", 18_500],
  ["motor", "LuK", "Spojková sada se setrvačníkem", 14_900],
  ["motor", "Valeo", "Startér 1,4 kW", 5_400],
  ["podvozek", "Brembo", "Brzdové kotouče + destičky přední", 4_800],
  ["podvozek", "Bilstein", "Tlumiče B4 zadní (pár)", 3_900],
  ["podvozek", "Lemförder", "Rameno nápravy přední levé", 1_900],
  ["karoserie", "OE", "Dveře přední pravé, v barvě vozu", 6_500],
  ["karoserie", "OE", "Zadní nárazník s PDC", 4_900],
  ["karoserie", "OE", "Zpětné zrcátko levé elektrické", 2_400],
  ["elektro", "Hella", "Světlomet levý LED", 11_900],
  ["elektro", "OE", "Řídicí jednotka motoru", 7_500],
  ["elektro", "Varta", "Autobaterie 74 Ah", 2_900],
  ["interier", "OE", "Přední sedačky s vyhříváním (pár)", 9_900],
  ["interier", "OE", "Multifunkční volant kožený", 3_500],
  ["kola", "Borbet", "Alu kola 16\" 5x112, sada", 12_900],
  ["kola", "OE", "Alu kola 17\" 5x112 originál, sada", 18_900],
];

// [make, summer, winter, all-season, premium factor]
const TYRE_LINES: [string, string, string, string, number][] = [
  ["Michelin", "Primacy 4+", "Alpin 6", "CrossClimate 2", 1.3],
  ["Continental", "PremiumContact 7", "WinterContact TS 870", "AllSeasonContact 2", 1.25],
  ["Bridgestone", "Turanza 6", "Blizzak LM005", "Weather Control A005", 1.2],
  ["Nokian", "Wetproof 1", "Snowproof 2", "Seasonproof 1", 1.1],
  ["Hankook", "Ventus Prime 4", "Winter i*cept RS3", "Kinergy 4S2", 0.95],
  ["Barum", "Bravuris 5HM", "Polaris 6", "Quartaris 5", 0.8],
  ["Matador", "Hectorra 5", "MP 93 Nordicca", "MP 62 All Weather Evo", 0.75],
];

const TYRE_SIZES: [number, number, number, number][] = [
  // [width, profile, rim, base price per new tyre CZK]
  [185, 65, 15, 1_800],
  [195, 65, 15, 1_900],
  [205, 55, 16, 2_200],
  [215, 60, 16, 2_500],
  [225, 45, 17, 2_900],
  [225, 40, 18, 3_500],
  [235, 55, 18, 3_900],
];

const DEALERS: Record<ItemSection, string[]> = {
  technika: ["Testovací užitkové vozy Omega", "Testovací stroje Sigma"],
  moto: ["Testovací motocentrum Delta", "Testovací moto bazar Kappa"],
  dily: ["Testovací vrakoviště Lambda", "Testovací autodíly Theta"],
  pneu: ["Testovací pneuservis Zeta", "Testovací pneu sklad Eta"],
};

function build(): Item[] {
  const out: Item[] = [];
  let n = 1;
  const next = (section: ItemSection) => {
    rand = mulberry32(31337 + n * 104723);
    return `${section === "pneu" ? "pn" : section.slice(0, 2)}-${String(n++).padStart(4, "0")}`;
  };

  for (let i = 0; i < 42; i++) {
    const id = next("technika");
    const [category, make, model, newPrice, unit] = MACHINES[i % MACHINES.length];
    const age = Math.floor(between(0, 14));
    const used = age > 0 || rand() < 0.7;
    const usage = unit === "km" ? roundTo(age * between(25_000, 120_000) + (used ? 3_000 : 0), 1000) : roundTo(age * between(300, 900) + (used ? 50 : 0), 10);
    const price = roundTo(newPrice * Math.pow(0.87, age) * between(0.85, 1.1), 1000);
    out.push({
      id, section: "technika", category, make, title: `${make} ${model}`, price, condition: used ? "použité" : "nové",
      year: CURRENT_YEAR - age, ...place(), ...seller(DEALERS.technika), postedAt: posted(),
      description: `Testovací inzerát. ${make} ${model}, servisní historie k nahlédnutí. Vůz je smyšlený.`,
      specs: [
        ["Rok výroby", String(CURRENT_YEAR - age)],
        [unit === "km" ? "Najeto" : "Motohodiny", unit === "km" ? `${nf.format(usage)} km` : `${nf.format(usage)} mth`],
        ["Stav", used ? "použité" : "nové"],
      ],
    });
  }

  for (let i = 0; i < 40; i++) {
    const id = next("moto");
    if (i % 8 === 7) {
      const [make, label, newPrice] = GEAR[i % GEAR.length];
      const used = rand() < 0.6;
      out.push({
        id, section: "moto", category: "vybava", make, title: `${make} ${label}`, price: roundTo(newPrice * (used ? between(0.4, 0.7) : 0.95), 100),
        condition: used ? "použité" : "nové", year: null, ...place(), ...seller(DEALERS.moto), postedAt: posted(),
        description: "Testovací inzerát výbavy. Zboží je smyšlené.", specs: [["Stav", used ? "použité" : "nové"]],
      });
      continue;
    }
    const [category, make, model, newPrice, ccm] = MOTOS[i % MOTOS.length];
    const age = Math.floor(between(0, 12));
    const km = roundTo(age * between(2_000, 7_000) + (age ? 500 : 10), 100);
    out.push({
      id, section: "moto", category, make, title: `${make} ${model}`, price: roundTo(newPrice * Math.pow(0.88, age) * between(0.85, 1.1), 1000),
      condition: age === 0 ? "nové" : "použité", year: CURRENT_YEAR - age, ...place(), ...seller(DEALERS.moto), postedAt: posted(),
      description: `Testovací inzerát. ${make} ${model}, garážováno. Stroj je smyšlený.`,
      specs: [
        ["Rok výroby", String(CURRENT_YEAR - age)],
        ["Najeto", `${nf.format(km)} km`],
        ["Objem motoru", `${ccm} cm³`],
      ],
    });
  }

  for (let i = 0; i < 48; i++) {
    const id = next("dily");
    const [category, make, part, newPrice] = PARTS[i % PARTS.length];
    const used = rand() < 0.65;
    // A part fits one make's models (shared platforms), never a random mix of makes.
    const fitBrand = pick(models).brandSlug;
    const sameMake = models.filter((m) => m.brandSlug === fitBrand);
    const fitModels = Array.from({ length: 1 + Math.floor(rand() * Math.min(3, sameMake.length)) }, () => pick(sameMake));
    const fits = [...new Set(fitModels.map((m) => `${getBrand(m.brandSlug)?.name} ${m.name}`))];
    out.push({
      id, section: "dily", category, make, title: `${part} — ${fits[0]}`, price: roundTo(newPrice * (used ? between(0.3, 0.6) : between(0.9, 1.05)), 100),
      condition: used ? "použité" : "nové", year: null, ...place(), ...seller(DEALERS.dily), postedAt: posted(), fits,
      description: `Testovací inzerát dílu. ${part}${make !== "OE" ? `, výrobce ${make}` : ", originální díl"}. Před koupí ověřte číslo dílu podle VIN.`,
      specs: [
        ["Výrobce", make === "OE" ? "originál (OE)" : make],
        ["Stav", used ? "použité, funkční" : "nové"],
        ["Pasuje na", fits.join(", ")],
        ["Číslo dílu", `TEST-${String(1000 + i * 37).slice(-4)}-${Math.floor(rand() * 90 + 10)}`],
      ],
    });
  }

  for (let i = 0; i < 56; i++) {
    const id = next("pneu");
    const [make, summer, winter, allSeason, factor] = pick(TYRE_LINES);
    const season = pick<Season>(["letní", "letní", "zimní", "zimní", "celoroční"]);
    const model = season === "letní" ? summer : season === "zimní" ? winter : allSeason;
    const [width, profile, rim, base] = pick(TYRE_SIZES);
    const used = rand() < 0.55;
    const count = pick([4, 4, 4, 2, 2, 1]);
    const treadMm = used ? Math.round(between(3.5, 7.5) * 10) / 10 : null;
    const dot = CURRENT_YEAR - (used ? Math.floor(between(1, 6)) : Math.floor(between(0, 2)));
    const unit = base * factor * (used ? Math.max(0.2, (treadMm! - 1.6) / 7) * 0.6 : between(0.95, 1.05));
    const size = `${width}/${profile} R${rim}`;
    out.push({
      id, section: "pneu", category: season === "letní" ? "letni" : season === "zimní" ? "zimni" : "celorocni", make,
      title: `${make} ${model} ${size}`, price: roundTo(unit * count, 100), condition: used ? "použité" : "nové", year: dot,
      ...place(), ...seller(DEALERS.pneu), postedAt: posted(),
      tyre: { width, profile, rim, season, count, treadMm, dot },
      description: `Testovací inzerát. ${count} ks ${season === "celoroční" ? "celoročních" : season === "letní" ? "letních" : "zimních"} pneumatik ${make} ${model}. Zboží je smyšlené.`,
      specs: [
        ["Rozměr", size],
        ["Sezóna", season],
        ["Počet kusů", `${count} ks`],
        ["Hloubka dezénu", treadMm ? `${String(treadMm).replace(".", ",")} mm` : "nové"],
        ["Rok výroby (DOT)", String(dot)],
      ],
    });
  }

  return out.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export const items: Item[] = build();

export function itemsOf(section: ItemSection): Item[] {
  return items.filter((i) => i.section === section);
}

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

/** Width, profile and rim options that actually occur, for the tyre size filter. */
export const TYRE_OPTIONS = {
  width: [...new Set(TYRE_SIZES.map((s) => s[0]))],
  profile: [...new Set(TYRE_SIZES.map((s) => s[1]))].sort((a, b) => a - b),
  rim: [...new Set(TYRE_SIZES.map((s) => s[2]))],
};
