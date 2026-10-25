"use client";

import Link from "next/link";
import { savedSearches, shortlist } from "@/lib/storage";

/** Header link to /vyber/; the badge counts saved cars and saved searches, as the page shows both. */
export function ShortlistLink() {
  const cars = shortlist.useValue().length;
  const searches = savedSearches.useValue().length;
  const total = cars + searches;
  const label = `Výběr: ${cars} aut, ${searches} uložených hledání`;
  return (
    <Link
      href="/vyber/"
      aria-label={label}
      title={label}
      className="px-2 sm:px-3 py-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap"
    >
      {total > 0 ? "★" : "☆"}
      <span className="hidden sm:inline"> Výběr</span>
      {total > 0 && <span className="ml-1 rounded-full bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-1.5 text-xs font-bold">{total}</span>}
    </Link>
  );
}
