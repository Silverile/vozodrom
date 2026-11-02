"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FeedItem } from "@/lib/garage";
import { LogbookCard } from "./LogbookCard";

/**
 * Newest logbook entries of a model line on its (prerendered) catalogue page, fetched in the
 * browser so they stay current. Shows an invitation to start one when there are none yet.
 */
export function OwnerLogbooks({ make, line, name }: { make: string; line: string; name: string }) {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/deniky/?znacka=${encodeURIComponent(make)}&model=${encodeURIComponent(line)}&pocet=3`)
      .then((r) => (r.ok ? (r.json() as Promise<{ items: FeedItem[] }>) : { items: [] }))
      .then((data) => !cancelled && setItems(data.items))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, [make, line]);
  if (items === null) return null;
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <h2 className="text-xl font-bold">Příběhy majitelů</h2>
        {items.length > 0 && <Link href={`/pribehy/?znacka=${make}&model=${line}`} className="text-sm text-[var(--color-brand)] hover:underline">Všechny zápisy →</Link>}
      </div>
      {items.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <li key={item.id}><LogbookCard item={item} /></li>)}
        </ul>
      ) : (
        <p className="card p-5 text-sm text-[var(--color-muted)]">
          Jezdíte s {name}? <Link href="/garaz/nove/" className="text-[var(--color-brand)] hover:underline">Napište jeho příběh</Link>: opravy, úpravy, cesty a co všechno stály.
        </p>
      )}
    </section>
  );
}
