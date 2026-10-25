// Top-level sections, like Drom's Auto / Spectechnika / Moto / Zapchasti / Shiny plus its
// reviews, forums and news. Each section shows its own sub-brand next to the logo
// ("vozodrom AUTO", "vozodrom DÍLY", "vozodrom FÓRUM").

export type SectionKey = "auto" | "technika" | "moto" | "dily" | "pneu" | "recenze" | "forum" | "novinky";

export interface Section {
  key: SectionKey;
  /** marketplace sections carry listings; community sections carry content */
  group: "market" | "community";
  /** label in the section tabs */
  label: string;
  /** sub-brand shown after the wordmark */
  brand: string;
  href: string;
  /** path prefixes that belong to the section */
  paths: string[];
}

export const SECTIONS: Section[] = [
  { key: "auto", group: "market", label: "Auta", brand: "AUTO", href: "/", paths: ["/inzeraty", "/katalog", "/vyber"] },
  { key: "technika", group: "market", label: "Užitkové a stroje", brand: "TECHNIKA", href: "/technika/", paths: ["/technika"] },
  { key: "moto", group: "market", label: "Motorky", brand: "MOTO", href: "/moto/", paths: ["/moto"] },
  { key: "dily", group: "market", label: "Díly", brand: "DÍLY", href: "/dily/", paths: ["/dily"] },
  { key: "pneu", group: "market", label: "Pneumatiky", brand: "PNEU", href: "/pneumatiky/", paths: ["/pneumatiky"] },
  { key: "recenze", group: "community", label: "Recenze majitelů", brand: "RECENZE", href: "/recenze/", paths: ["/recenze"] },
  { key: "forum", group: "community", label: "Fórum", brand: "FÓRUM", href: "/forum/", paths: ["/forum"] },
  { key: "novinky", group: "community", label: "Novinky a rady", brand: "NOVINKY", href: "/novinky/", paths: ["/novinky"] },
];

/** The section a path belongs to; the home page is the car section, service pages belong to none. */
export function sectionOf(pathname: string): Section | undefined {
  if (pathname === "/") return SECTIONS[0];
  return SECTIONS.find((s) => s.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`)));
}
