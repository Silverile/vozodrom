"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Listing } from "@/lib/types";
import { ListingCard } from "./ListingCard";

/** Homepage tiles: the newest published user listings, fetched so they stay current. */
export function LatestListings({ count }: { count: number }) {
  const [listings, setListings] = useState<Listing[] | null>(null);
  useEffect(() => {
    fetch("/api/inzeraty/verejne/")
      .then((r): Promise<Listing[]> | Listing[] => (r.ok ? r.json() : []))
      .then(setListings)
      .catch(() => setListings([]));
  }, []);
  if (listings === null) return <p className="text-base text-[var(--color-muted)]">Načítám inzeráty…</p>;
  if (listings.length === 0)
    return (
      <div className="rounded-[14px] bg-[var(--color-surface)] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-base">
          <b className="block text-lg">Zatím tu není žádný inzerát.</b>
          Prodáváte auto? Buďte první, kdo ho tu nabídne. Vložení je zdarma.
        </p>
        <Link href="/pridat/" className="btn-cta">Přidat inzerát</Link>
      </div>
    );
  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {listings.slice(0, count).map((l) => <ListingCard key={l.id} listing={l} />)}
    </div>
  );
}
