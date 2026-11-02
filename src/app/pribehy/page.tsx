import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { LogbookCard } from "@/components/LogbookCard";
import { ENTRY_CATEGORIES } from "@/lib/garage";
import { feed } from "@/lib/garage-store";
import { getMake, makesIn, modelLinesOf } from "@/lib/makes";

export const metadata: Metadata = {
  title: "Příběhy aut",
  description: "Majitelé píšou, co se svými auty zažili: opravy, úpravy, cesty a co všechno stály. Příběhy podle značek, modelů a témat.",
};

const PAGE = 24;
const CAR_MAKES = makesIn("auto");

// Newest logbook entries of all garages, filtered by make, model line and topic. Rendered on each
// request, so new entries show at once; "Starší" pages back by time.
export default async function LogbooksPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await connection();
  const q = await searchParams;
  const make = q.znacka && getMake(q.znacka) ? q.znacka : "";
  const line = make && q.model && modelLinesOf(make).some((l) => l.slug === q.model) ? q.model : "";
  const category = q.tema && q.tema in ENTRY_CATEGORIES ? q.tema : "";
  const before = q.pred ? new Date(q.pred) : undefined;
  const items = await feed({ make: make || undefined, line: line || undefined, category: category || undefined, before: before && !Number.isNaN(before.getTime()) ? before : undefined, limit: PAGE });
  const link = (patch: Record<string, string>) => {
    const params = new URLSearchParams(Object.entries({ znacka: make, model: line, tema: category, ...patch }).filter(([, v]) => v));
    return `/pribehy/${params.size ? `?${params}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Příběhy aut</h1>
          <p className="mt-1 text-[var(--color-muted)] max-w-2xl">
            Majitelé píšou, co se svými auty zažili: opravy, úpravy, cesty a co všechno stály. Dobrý zdroj, než si stejné auto koupíte.
          </p>
        </div>
        <Link href="/garaz/" className="btn-cta text-sm">Moje garáž</Link>
      </div>

      <form action="/pribehy/" className="mt-6 card p-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
        <label className="text-sm">
          Značka
          <select name="znacka" className="input mt-1" defaultValue={make}>
            <option value="">Všechny</option>
            {CAR_MAKES.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          Model
          <select name="model" className="input mt-1" defaultValue={line} disabled={!make}>
            <option value="">{make ? "Všechny" : "Nejdřív značka"}</option>
            {make && modelLinesOf(make).map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
          </select>
        </label>
        {category && <input type="hidden" name="tema" value={category} />}
        <button type="submit" className="pill justify-center">Zobrazit</button>
      </form>

      <nav aria-label="Témata" className="mt-4 flex flex-wrap gap-2">
        <Link href={link({ tema: "", pred: "" })} className="pill" data-on={!category}>Vše</Link>
        {Object.entries(ENTRY_CATEGORIES).map(([k, v]) => (
          <Link key={k} href={link({ tema: k })} className="pill" data-on={category === k}>{v}</Link>
        ))}
      </nav>

      {items.length === 0 ? (
        before ? (
          <div className="card mt-6 p-8 text-center text-[var(--color-muted)]">Starší zápisy už nejsou.</div>
        ) : (
          <div className="card mt-6 p-8 sm:p-10 text-center">
            <p className="text-lg font-semibold">{category ? `Na téma ${ENTRY_CATEGORIES[category as keyof typeof ENTRY_CATEGORIES]} tu zatím není žádný zápis.` : "Zatím tu není žádný příběh."}</p>
            <p className="mt-2 text-[var(--color-muted)]">Buďte první, kdo napíše příběh svého auta: opravy, cesty, úpravy a co všechno stály.</p>
            <Link href="/garaz/nove/" className="btn-cta mt-5 inline-flex">Napsat příběh auta</Link>
          </div>
        )
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <li key={item.id}><LogbookCard item={item} /></li>)}
        </ul>
      )}
      {items.length === PAGE && (
        <p className="mt-6 text-center">
          <Link href={link({ pred: items[items.length - 1].createdAt })} className="pill">Starší zápisy</Link>
        </p>
      )}
    </div>
  );
}
