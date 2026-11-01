import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { LogbookCard } from "@/components/LogbookCard";
import { ENTRY_CATEGORIES } from "@/lib/garage";
import { feed } from "@/lib/garage-store";
import { getMake, makesIn, modelLinesOf } from "@/lib/makes";

export const metadata: Metadata = {
  title: "Deníky aut",
  description: "Majitelé píšou, co na svých autech opravovali, měnili a kolik to stálo. Deníky podle značek, modelů a témat.",
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
    return `/deniky/${params.size ? `?${params}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Deníky aut</h1>
          <p className="mt-1 text-[var(--color-muted)] max-w-2xl">
            Majitelé píšou, co na svých autech opravovali, měnili a kolik to stálo. Dobrý zdroj, než si stejné auto koupíte.
          </p>
        </div>
        <Link href="/garaz/" className="btn-cta text-sm">Moje garáž</Link>
      </div>

      <form action="/deniky/" className="mt-6 card p-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
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
        <div className="card mt-6 p-8 text-center text-[var(--color-muted)]">
          {before ? "Starší zápisy už nejsou." : "Tady zatím nikdo nic nenapsal."}{" "}
          <Link href="/garaz/" className="text-[var(--color-brand)]">Založte deník svého auta.</Link>
        </div>
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
