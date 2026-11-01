import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { carTitle } from "@/lib/garage";
import { carFor, entryFor } from "@/lib/garage-store";
import { ListingError } from "@/lib/listing-store";
import { EntryForm } from "../../EntryForm";
import { DeleteButton, GaragePhotos } from "../../GarageClient";

export const metadata: Metadata = { title: "Úprava zápisu", robots: { index: false } };

export default async function EditEntryPage({ params }: { params: Promise<{ entryId: string }> }) {
  await connection();
  const { entryId } = await params;
  const session = await getSession();
  if (!session) redirect(`/prihlaseni/?dalsi=/garaz/zapis/${entryId}/`);
  const notFoundOn = (error: unknown): never => {
    if (error instanceof ListingError) notFound();
    throw error;
  };
  const entry = await entryFor(session, entryId, { staff: true }).catch(notFoundOn);
  const car = await carFor(session, entry.carId, { staff: true }).catch(notFoundOn);
  const title = carTitle(car.data);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <p className="text-sm text-[var(--color-muted)]">
          <Link href="/garaz/" className="hover:text-[var(--color-brand)]">Moje garáž</Link> / <Link href={`/garaz/${car.id}/`} className="hover:text-[var(--color-brand)]">{title}</Link> / Zápis
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{entry.title}</h1>
          <Link href={`/deniky/${car.id}/${entry.id}/`} className="pill">Zobrazit zápis</Link>
        </div>
        {entry.hiddenReason && <p className="mt-3 card p-4 text-sm bg-[var(--color-warn-soft)] text-[var(--color-warn)]">Moderátor zápis skryl: {entry.hiddenReason}</p>}
      </div>
      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-lg">Fotky</h2>
        <GaragePhotos owner="entry" id={entry.id} initial={entry.photos} />
      </section>
      <EntryForm
        carId={car.id}
        entryId={entry.id}
        initial={{ title: entry.title, body: entry.body, category: entry.category, costCzk: entry.costCzk, mileageKm: entry.mileageKm, happenedOn: entry.happenedOn }}
      />
      <DeleteButton url={`/api/zapisy/${entry.id}/`} label="Smazat zápis" confirmText="Smazat zápis i s fotkami a komentáři? Nejde to vrátit." then={`/garaz/${car.id}/`} />
    </div>
  );
}
