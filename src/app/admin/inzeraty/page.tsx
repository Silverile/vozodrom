import type { Metadata } from "next";
import Link from "next/link";
import { FUEL_LABEL } from "@/lib/catalog";
import { formatKm, formatPrice } from "@/lib/format";
import { getCity } from "@/lib/geo";
import { draftTitle } from "@/lib/listing-draft";
import { STATUS_LABEL, STATUS_STYLE, photoUrl } from "@/lib/listing-status";
import { type ListingRow, pendingListings, publishedListings } from "@/lib/listing-store";
import { ModerationActions } from "./ModerationActions";

export const metadata: Metadata = { title: "Inzeráty" };

function ListingCard({ row }: { row: ListingRow }) {
  const d = row.data;
  return (
    <li className="card p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip ${STATUS_STYLE[row.status]}`}>{STATUS_LABEL[row.status]}</span>
        <h2 className="font-bold">{draftTitle(d)}</h2>
        <span className="text-sm text-[var(--color-muted)]">
          {formatPrice(d.price)} · {formatKm(d.mileageKm)} · {d.engine}, {d.powerKw} kW · {FUEL_LABEL[d.fuel as keyof typeof FUEL_LABEL] ?? d.fuel} · {getCity(d.city)?.name ?? d.region}
        </span>
      </div>
      {row.photos.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto">
          {row.photos.map((p) => (
            <li key={p.key} className="shrink-0">
              <a href={photoUrl(p.key)} target="_blank" rel="noreferrer">
                <img src={photoUrl(p.key)} alt="" className="h-24 aspect-[4/3] object-cover rounded-[8px] bg-[var(--color-photo)]" loading="lazy" />
              </a>
            </li>
          ))}
        </ul>
      )}
      {d.description && <p className="text-sm text-[var(--color-muted)] whitespace-pre-line line-clamp-6">{d.description}</p>}
      <p className="text-xs text-[var(--color-muted)]">
        VIN {d.vin || "neuveden"} · telefon {row.phone ?? "neuveden"} · odesláno {row.submittedAt?.toLocaleString("cs-CZ") ?? "—"}
        {row.status === "published" && (
          <>
            {" · "}
            <Link href={`/inzerat/${row.id}/`} className="text-[var(--color-brand)] hover:underline">na webu</Link>
          </>
        )}
      </p>
      <ModerationActions id={row.id} status={row.status} />
    </li>
  );
}

export default async function ModerationPage() {
  const [pending, published] = await Promise.all([pendingListings(), publishedListings()]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Inzeráty</h1>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Ke schválení <span className="text-[var(--color-muted)] font-normal">{pending.length}</span></h2>
        {pending.length === 0 ? (
          <p className="card p-6 text-sm text-[var(--color-muted)]">Žádné inzeráty nečekají na kontrolu.</p>
        ) : (
          <ul className="space-y-3">{pending.map((row) => <ListingCard key={row.id} row={row} />)}</ul>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Naposledy zveřejněné</h2>
        {published.length === 0 ? (
          <p className="card p-6 text-sm text-[var(--color-muted)]">Zatím nic.</p>
        ) : (
          <ul className="space-y-3">{published.map((row) => <ListingCard key={row.id} row={row} />)}</ul>
        )}
      </section>
    </div>
  );
}
