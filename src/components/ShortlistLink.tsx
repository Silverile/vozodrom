"use client";

import Link from "next/link";
import { shortlist } from "@/lib/storage";

export function ShortlistLink() {
  const count = shortlist.useValue().length;
  return (
    <Link href="/vyber/" className="px-3 py-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap">
      ☆ Výběr{count > 0 && <span className="ml-1 rounded-full bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-1.5 text-xs font-bold">{count}</span>}
    </Link>
  );
}
