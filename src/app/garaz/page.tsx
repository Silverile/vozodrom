import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { GarageCarImage } from "@/components/GarageCarImage";
import { getSession } from "@/lib/auth";
import { carTitle } from "@/lib/garage";
import { carsOf } from "@/lib/garage-store";

export const metadata: Metadata = { title: "Moje garáž", robots: { index: false } };

// The signed-in owner's cars: current ones first, then former. Each opens its own page in the
// garage (details, photos, logbook); the public page is at /pribehy/<car>/.
export default async function GaragePage() {
  await connection();
  const session = await getSession();
  if (!session) redirect("/prihlaseni/?dalsi=/garaz/");
  const cars = await carsOf(session.user.id);
  const current = cars.filter((c) => !c.former);
  const former = cars.filter((c) => c.former);

  const list = (rows: typeof cars) => (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((c) => (
        <li key={c.id}>
          <Link href={`/garaz/${c.id}/`} className="card block overflow-hidden hover:border-[var(--color-brand)]">
            <GarageCarImage car={c.data} photo={c.photos[0]} alt={carTitle(c.data)} />
            <span className="block p-4">
              <span className="block font-semibold">{carTitle(c.data)}</span>
              <span className="block text-sm text-[var(--color-muted)]">
                {[c.data.year || null, c.data.engine || null, c.data.purchaseYear ? `od ${c.data.purchaseYear}` : null].filter(Boolean).join(" · ") || "Doplňte údaje"}
              </span>
              {c.hiddenReason && <span className="mt-2 chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">skryto moderátorem</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Moje garáž</h1>
          <p className="mt-1 text-[var(--color-muted)] max-w-2xl">
            Auta, kterými jezdíte nebo jste jezdili. Ke každému můžete psát jeho příběh: opravy, úpravy, cesty a co všechno stály.
          </p>
        </div>
        <Link href="/garaz/nove/" className="btn-cta text-sm">+ Přidat auto</Link>
      </div>
      {cars.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-[var(--color-muted)]">
          V garáži zatím nic není. <Link href="/garaz/nove/" className="text-[var(--color-brand)]">Přidejte své první auto.</Link>
        </div>
      ) : (
        <>
          <section className="mt-6">{list(current)}</section>
          {former.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold mb-3">Bývalá auta</h2>
              {list(former)}
            </section>
          )}
        </>
      )}
    </div>
  );
}
