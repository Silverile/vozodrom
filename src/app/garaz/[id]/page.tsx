import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { ENTRY_CATEGORIES, carTitle } from "@/lib/garage";
import { carFor, carPage } from "@/lib/garage-store";
import { ListingError } from "@/lib/listing-store";
import { CarForm } from "../CarForm";
import { DeleteButton, GaragePhotos } from "../GarageClient";

export const metadata: Metadata = { title: "Auto v garáži", robots: { index: false } };

// The owner's page of one car: photos, details and the logbook with links to write and edit.
export default async function GarageCarPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect(`/prihlaseni/?dalsi=/garaz/${id}/`);
  const car = await carFor(session, id, { staff: true }).catch((error) => {
    if (error instanceof ListingError) notFound();
    throw error;
  });
  const page = await carPage(id, session);
  const title = carTitle(car.data);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <p className="text-sm text-[var(--color-muted)]"><Link href="/garaz/" className="hover:text-[var(--color-brand)]">Moje garáž</Link> / {title}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          <Link href={`/pribehy/${id}/`} className="pill">Zobrazit veřejnou stránku</Link>
        </div>
        {car.hiddenReason && (
          <p className="mt-3 card p-4 text-sm bg-[var(--color-warn-soft)] text-[var(--color-warn)]">Moderátor auto skryl: {car.hiddenReason}</p>
        )}
      </div>

      <section className="card p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-lg">Příběh auta</h2>
          <Link href={`/garaz/${id}/zapis/`} className="btn-cta text-sm">+ Nový zápis</Link>
        </div>
        {page && page.entries.length > 0 ? (
          <ul className="divide-y divide-[var(--color-line)]">
            {page.entries.map((e) => (
              <li key={e.id} className="py-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Link href={`/garaz/zapis/${e.id}/`} className="font-medium hover:text-[var(--color-brand)]">{e.title}</Link>
                <span className="text-sm text-[var(--color-muted)]">
                  {[formatDate(e.happenedOn), ENTRY_CATEGORIES[e.category], e.costCzk != null ? formatPrice(e.costCzk) : null, e.mileageKm != null ? formatKm(e.mileageKm) : null]
                    .filter(Boolean)
                    .join(" · ")}
                  {e.hiddenReason && <span className="ml-2 chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">skryto</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">Zatím žádné zápisy. Napište, co jste s autem dělali: servis, opravu, úpravu nebo cestu.</p>
        )}
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-lg">Fotky</h2>
        <GaragePhotos owner="car" id={id} initial={car.photos} />
      </section>

      <CarForm carId={id} initial={car.data} initialFormer={car.former} />

      <div className="pt-2">
        <DeleteButton url={`/api/garaz/${id}/`} label="Smazat auto z garáže" confirmText={`Smazat ${title} i s celým příběhem a fotkami? Nejde to vrátit.`} then="/garaz/" />
      </div>
    </div>
  );
}
