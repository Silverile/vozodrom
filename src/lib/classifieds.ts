import type { SellerType } from "./types";

// Listings for the sections beyond cars: utility vehicles and machinery, motorcycles, parts and
// tyres. Their categories and filters are ready; the listings themselves will come from users.

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

/** Tyre sizes offered in the tyre size filter: [width, profile, rim, typical price]. */
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

// No listings yet: the item form is not connected and the sections are closed until it is.
export const items: Item[] = [];

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
