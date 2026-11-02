"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import { Typewriter } from "@/components/Typewriter";
import { ENTRY_CATEGORIES, type FeedItem } from "@/lib/garage";

// Owners' newest logbook entries on the (prerendered) home page, fetched in the browser so they
// stay current. Set like a printed sheet: what was done at the left, what it cost at the right.
// While there are only a few entries, the invitation to start one stands beside them.

const nf = new Intl.NumberFormat("cs-CZ");

/** What owners write about, from the everyday to the big trip (typed in turn). */
const ENDINGS = [
  "léto v Chorvatsku s octavií plnou kufrů",
  "jízdu do porodnice ve tři ráno",
  "cestu na Nordkapp ve staré felicii",
  "opravu spojky na koleně v garáži",
  "noční výměnu alternátoru na odpočívadle",
  "cestu do Mongolska na charitativní rallye",
  "cestu kolem světa ve starém trabantu",
  "první rande v tátově autě",
  "první jízdu s řidičákem v kapse",
  "závod do vrchu se starým favoritem",
  "renovaci škodovky ze stodoly",
  "přezouvání pneumatik o půlnoci před sněhem",
  "první den na okruhu",
  "noc v autě pod hvězdami v Tatrách",
  "stěhování celé rodiny v jednom kombíku",
  "první servis po koupi z bazaru",
  "zimu na horách se sněhovými řetězy",
  "lakování v barvě, kterou chtěl děda",
  "svatbu ve vyzdobeném veteránovi",
  "sraz majitelů stejných aut na Slovensku",
  "cestu s obytňákem až do Portugalska",
  "dovolenou u moře se stanem na střeše",
  "sto tisíc kilometrů bez jediné poruchy",
  "přestavbu na elektřinu doma v garáži",
  "dvacet let s jedním autem",
  "poslední cestu na vrakoviště",
];

export function HomeLogbooks() {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/deniky/?pocet=8")
      .then((r) => (r.ok ? (r.json() as Promise<{ items: FeedItem[] }>) : { items: [] }))
      .then((data) => !cancelled && setItems(data.items))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
      <div className="rounded-[14px] bg-[var(--color-surface)] p-6 sm:p-10">
        {items === null ? (
          <p className="text-base text-[var(--color-muted)]">Načítám zápisy…</p>
        ) : items.length === 0 ? (
          <p className="text-base">Zatím tu není žádný zápis. Buďte první, kdo popíše, co na svém autě dělal a kolik to stálo.</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/pribehy/${item.carId}/${item.id}/`} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6">
                  <span className="text-lg font-semibold group-hover:text-[var(--color-brand)]">{item.title}</span>
                  <span className="text-lg font-semibold tabular-nums">{item.costCzk != null ? `${nf.format(item.costCzk)} Kč` : ""}</span>
                  <span className="text-base text-[var(--color-muted)]">
                    {item.carTitle} · {ENTRY_CATEGORIES[item.category]} · {formatDate(item.happenedOn)}
                    {item.mileageKm != null && ` · ${nf.format(item.mileageKm)} km`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-y-4 text-lg leading-relaxed">
        <Typewriter
          prefix="Od výměny brzd po "
          endings={ENDINGS}
          suffix="."
          className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight"
          minHeight="3.75em"
        />
        <p>Majitelé tu píšou, co se svými auty zažili. Než si stejné auto koupíte, přečtete si, jak se mu daří v rukou skutečných lidí.</p>
        <p className="flex flex-wrap gap-x-6 gap-y-3 items-center">
          <Link href="/garaz/nove/" className="btn-cta !px-5 !py-3 text-base">Napsat příběh svého auta</Link>
          <Link href="/pribehy/" className="font-semibold underline underline-offset-4">Všechny příběhy</Link>
        </p>
      </div>
    </div>
  );
}
