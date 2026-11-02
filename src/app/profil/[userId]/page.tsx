import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GarageCarImage } from "@/components/GarageCarImage";
import { ListingCard } from "@/components/ListingCard";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { ENTRY_CATEGORIES, carTitle } from "@/lib/garage";
import { type ProfileCar, profilePage } from "@/lib/garage-store";
import { listingsOf } from "@/lib/listing-store";
import { photoUrl } from "@/lib/listing-status";
import { toListing } from "@/lib/user-listings";

// An owner's public page, like a profile on drive2: the cars they drive (the newest first, large),
// their former cars, their newest story entries and what they sell. Only what is public anyway:
// the shortened name, garage cars and entries not hidden by a moderator, published listings.

type Params = Promise<{ userId: string }>;

async function load(userId: string) {
  await connection();
  return profilePage(userId);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await load((await params).userId);
  if (!page) return { title: "Profil" };
  const driving = page.cars.filter((c) => !c.former).map((c) => carTitle(c.data));
  return { title: `${page.name} — profil`, description: driving.length ? `Jezdí s ${driving.join(", ")}.` : undefined };
}

const nf = new Intl.NumberFormat("cs-CZ");
const count = (n: number, one: string, few: string, many: string) => `${nf.format(n)} ${n === 1 ? one : n >= 2 && n <= 4 ? few : many}`;

function CarTile({ car, large = false }: { car: ProfileCar; large?: boolean }) {
  const title = carTitle(car.data);
  return (
    <Link href={`/pribehy/${car.id}/`} className="group block rounded-[14px] overflow-hidden bg-[var(--color-surface)] hover:bg-[var(--color-field)] transition-colors">
      <GarageCarImage car={car.data} photo={car.photo} alt={title} />
      <span className={`block ${large ? "p-5 sm:p-6" : "p-4"}`}>
        <span className={`block font-bold leading-tight group-hover:text-[var(--color-brand)] ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>{title}</span>
        <span className="mt-1 block text-base text-[var(--color-muted)]">
          {[car.data.year ? String(car.data.year) : null, count(car.entries, "zápis", "zápisy", "zápisů"), car.likes ? `líbí se ${nf.format(car.likes)}` : null].filter(Boolean).join(" · ")}
        </span>
      </span>
    </Link>
  );
}

export default async function ProfilePage({ params }: { params: Params }) {
  const { userId } = await params;
  const page = await load(userId);
  if (!page) notFound();
  const current = page.cars.filter((c) => !c.former);
  const former = page.cars.filter((c) => c.former);
  const selling = (await listingsOf(userId)).filter((r) => r.status === "published").map((r) => toListing(r, page.name));
  const entryCount = page.cars.reduce((sum, c) => sum + c.entries, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{page.name}</h1>
      <p className="mt-2 text-lg text-[var(--color-muted)]">Na Vozodromu od {formatDate(page.since.toISOString())}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">{current.length ? "Jezdí s" : "Auta"}</h2>
            {current.length === 0 ? (
              <p className="rounded-[14px] bg-[var(--color-surface)] p-6 text-base text-[var(--color-muted)]">Zatím tu nemá žádné auto.</p>
            ) : (
              <div className="space-y-4">
                <CarTile car={current[0]} large />
                {current.length > 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {current.slice(1).map((c) => <CarTile key={c.id} car={c} />)}
                  </div>
                )}
              </div>
            )}
          </section>

          {page.entries.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Poslední zápisy</h2>
              <ul className="space-y-3">
                {page.entries.map((e) => (
                  <li key={e.id}>
                    <Link href={`/pribehy/${e.carId}/${e.id}/`} className="flex gap-4 rounded-[14px] bg-[var(--color-surface)] p-3 hover:bg-[var(--color-field)] transition-colors">
                      {e.photo ? (
                        <img src={photoUrl(e.photo.key)} alt="" className="w-28 sm:w-36 aspect-[4/3] shrink-0 rounded-[10px] object-cover bg-[var(--color-photo)]" loading="lazy" />
                      ) : (
                        <span className="w-28 sm:w-36 aspect-[4/3] shrink-0 rounded-[10px] bg-[var(--color-field)]" />
                      )}
                      <span className="min-w-0">
                        <span className="block text-lg font-semibold leading-snug">{e.title}</span>
                        <span className="block text-base text-[var(--color-muted)]">{e.carTitle} · {ENTRY_CATEGORIES[e.category]}</span>
                        <span className="mt-1 block text-sm text-[var(--color-muted)]">
                          {[formatDate(e.happenedOn), e.costCzk != null ? formatPrice(e.costCzk) : null, e.mileageKm != null ? formatKm(e.mileageKm) : null].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="min-w-0 space-y-6">
          <dl className="rounded-[14px] bg-[var(--color-surface)] p-5 grid grid-cols-3 gap-3 text-center">
            <div><dt className="text-sm text-[var(--color-muted)]">Aut</dt><dd className="text-2xl font-extrabold tabular-nums">{nf.format(page.cars.length)}</dd></div>
            <div><dt className="text-sm text-[var(--color-muted)]">Zápisů</dt><dd className="text-2xl font-extrabold tabular-nums">{nf.format(entryCount)}</dd></div>
            <div><dt className="text-sm text-[var(--color-muted)]">Sledujících</dt><dd className="text-2xl font-extrabold tabular-nums">{nf.format(page.followers)}</dd></div>
          </dl>
          {former.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Bývalá auta <span className="font-normal text-[var(--color-muted)]">{former.length}</span></h2>
              <div className="space-y-3">{former.map((c) => <CarTile key={c.id} car={c} />)}</div>
            </section>
          )}
        </aside>
      </div>

      {selling.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Prodává</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {selling.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
