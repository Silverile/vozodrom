"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FrontDrawing } from "@/components/FrontDrawing";
import { formatDate } from "@/lib/format";
import { ENTRY_CATEGORIES, type FeedItem } from "@/lib/garage";
import { photoUrl } from "@/lib/listing-status";

// The first screen's picture: the newest owner's logbook entry that has a photograph, large, with
// what was done, to which car, when and for how much. Fetched in the browser (the page is static);
// until then, or while no entry has a photo, a front drawing from the catalogue holds the place.

const nf = new Intl.NumberFormat("cs-CZ");

export function HomeStory({ placeholderDrawing }: { placeholderDrawing: string | null }) {
  const [item, setItem] = useState<FeedItem | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/deniky/?pocet=8")
      .then((r) => (r.ok ? (r.json() as Promise<{ items: FeedItem[] }>) : { items: [] }))
      .then((data) => !cancelled && setItem(data.items.find((i) => i.photo) ?? null))
      .catch(() => !cancelled && setItem(null));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!item) {
    return (
      <figure className="rounded-[14px] overflow-hidden bg-[var(--color-surface)]">
        {placeholderDrawing && <FrontDrawing id={placeholderDrawing} alt="Nákres auta zepředu" aspect="aspect-[4/3]" />}
        <figcaption className="p-5 text-base text-[var(--color-muted)]">
          {item === undefined ? "Načítám nejnovější zápis…" : "Tady se objeví nejnovější zápis z příběhu některého auta."}
        </figcaption>
      </figure>
    );
  }
  return (
    <Link href={`/pribehy/${item.carId}/${item.id}/`} className="group block rounded-[14px] overflow-hidden bg-[var(--color-surface)]">
      <img
        src={photoUrl(item.photo!.key)}
        alt={`${item.carTitle}: ${item.title}`}
        width={item.photo!.width}
        height={item.photo!.height}
        className="w-full aspect-[4/3] object-cover bg-[var(--color-photo)] transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <span className="block p-5 sm:p-6">
        <span className="block text-base text-[var(--color-muted)]">{item.carTitle} · {formatDate(item.happenedOn)}</span>
        <span className="mt-1 block text-2xl font-bold leading-tight group-hover:text-[var(--color-brand)]">{item.title}</span>
        <span className="mt-2 block text-base">
          {[ENTRY_CATEGORIES[item.category], item.costCzk != null ? `${nf.format(item.costCzk)} Kč` : null, item.mileageKm != null ? `${nf.format(item.mileageKm)} km` : null]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
    </Link>
  );
}
