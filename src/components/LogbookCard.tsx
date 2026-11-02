import Link from "next/link";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { ENTRY_CATEGORIES, type FeedItem } from "@/lib/garage";
import { photoUrl } from "@/lib/listing-status";
import { Icon } from "./Icon";

/** A logbook entry in a feed: photo, car, title, topic and what it cost. */
export function LogbookCard({ item }: { item: FeedItem }) {
  return (
    <Link href={`/pribehy/${item.carId}/${item.id}/`} className="card block overflow-hidden h-full hover:border-[var(--color-brand)]">
      {item.photo ? (
        <img src={photoUrl(item.photo.key)} alt="" width={item.photo.width} height={item.photo.height} className="w-full aspect-[16/10] object-cover bg-[var(--color-photo)]" loading="lazy" />
      ) : (
        <span className="block w-full aspect-[16/10] bg-[var(--color-field)]" />
      )}
      <span className="block p-4">
        <span className="block text-xs text-[var(--color-muted)]">{item.carTitle}</span>
        <span className="mt-0.5 block font-semibold leading-snug">{item.title}</span>
        <span className="mt-1 block text-sm text-[var(--color-muted)]">{ENTRY_CATEGORIES[item.category]}</span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)]">
          <span>{formatDate(item.happenedOn)}</span>
          {item.costCzk != null && <span>{formatPrice(item.costCzk)}</span>}
          {item.mileageKm != null && <span>{formatKm(item.mileageKm)}</span>}
          <span className="inline-flex items-center gap-1"><Icon name="favorite" /> {item.likes}</span>
          <span className="inline-flex items-center gap-1"><Icon name="messages" /> {item.comments}</span>
        </span>
      </span>
    </Link>
  );
}
