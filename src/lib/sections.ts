// Top-level marketplace sections, like Drom's Auto / Spectechnika / Moto / Zapchasti / Shiny.
// Each section shows its own sub-brand next to the logo ("vozodrom AUTO", "vozodrom DÍLY").

export type SectionKey = "auto" | "technika" | "moto" | "dily" | "pneu";

export interface Section {
  key: SectionKey;
  /** label in the section tabs */
  label: string;
  /** sub-brand shown after the wordmark */
  brand: string;
  href: string;
  /** path prefixes that belong to the section */
  paths: string[];
}

export const SECTIONS: Section[] = [
  { key: "auto", label: "Auta", brand: "AUTO", href: "/", paths: ["/inzeraty", "/katalog", "/pridat", "/vyber"] },
  { key: "technika", label: "Užitkové a stroje", brand: "TECHNIKA", href: "/technika/", paths: ["/technika"] },
  { key: "moto", label: "Motorky", brand: "MOTO", href: "/moto/", paths: ["/moto"] },
  { key: "dily", label: "Díly", brand: "DÍLY", href: "/dily/", paths: ["/dily"] },
  { key: "pneu", label: "Pneumatiky", brand: "PNEU", href: "/pneumatiky/", paths: ["/pneumatiky"] },
];

/** The section a path belongs to; the home page is the car section, service pages belong to none. */
export function sectionOf(pathname: string): Section | undefined {
  if (pathname === "/") return SECTIONS[0];
  return SECTIONS.find((s) => s.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`)));
}
