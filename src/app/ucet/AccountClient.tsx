"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingRow } from "@/components/ListingRow";
import { getBrand, getModel } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { getListing } from "@/lib/listings";
import { savedSearches, shortlist } from "@/lib/storage";
import type { Listing } from "@/lib/types";
import { draftStore } from "../pridat/AddListingForm";

// Preview of the account area modelled on Drom's: the sections exist, and the ones that
// can work without accounts (favourites, saved searches, the listing draft) show this
// browser's real data. The rest explain what they will do once accounts launch.

const SECTIONS = [
  { key: "inzeraty", label: "Moje inzeráty", icon: "＋" },
  { key: "zpravy", label: "Zprávy", icon: "✉" },
  { key: "oblibene", label: "Oblíbené", icon: "☆" },
  { key: "hlidaci-pes", label: "Hlídací pes", icon: "🔔" },
  { key: "statistiky", label: "Statistiky", icon: "▮" },
  { key: "vin", label: "Prověrky VIN", icon: "🔎" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

function Empty({ title, text, action }: { title: string; text: string; action?: { href: string; label: string } }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">{text}</p>
      {action && <Link href={action.href} className="btn-cta inline-flex mt-5 text-sm">{action.label}</Link>}
    </div>
  );
}

function MyListings() {
  const draft = draftStore.useValue();
  const model = getModel(draft.brand, draft.model);
  if (!model) {
    return <Empty title="Zatím žádné inzeráty" text="Inzerát můžete připravit už teď; zveřejnit půjde po spuštění účtů." action={{ href: "/pridat/", label: "+ Přidat inzerát zdarma" }} />;
  }
  return (
    <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">rozpracováno</span>
        <p className="font-bold mt-2">{getBrand(draft.brand)?.name} {model.name}, {draft.year}</p>
        <p className="text-sm text-[var(--color-muted)]">{draft.price ? formatPrice(draft.price) : "cena zatím nevyplněna"} · uloženo jen v tomto prohlížeči</p>
      </div>
      <Link href="/pridat/" className="pill">Pokračovat v úpravách</Link>
    </div>
  );
}

function Favourites() {
  const ids = shortlist.useValue();
  const cars = ids.map(getListing).filter((l): l is Listing => Boolean(l));
  if (cars.length === 0) {
    return <Empty title="Žádná oblíbená auta" text="U inzerátu klikněte na ☆ a auto se uloží sem." action={{ href: "/inzeraty/", label: "Přejít na inzeráty" }} />;
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-end"><Link href="/vyber/" className="pill">Porovnat vybraná auta</Link></div>
      {cars.map((l) => <ListingRow key={l.id} listing={l} />)}
    </div>
  );
}

function Watchdog() {
  const searches = savedSearches.useValue();
  if (searches.length === 0) {
    return <Empty title="Nemáte žádného hlídacího psa" text="Ve vyhledávání nastavte filtry a klikněte na „Uložit hledání“. Po spuštění účtů vám pošleme e-mail, když přibude nové auto." action={{ href: "/inzeraty/", label: "Přejít na inzeráty" }} />;
  }
  return (
    <ul className="space-y-2">
      {searches.map((s) => (
        <li key={s.query} className="card p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/inzeraty/?${s.query}`} className="font-semibold hover:text-[var(--color-brand)]">{s.label}</Link>
            <p className="text-xs text-[var(--color-muted)]">uloženo {formatDate(s.savedAt)} · upozornění e-mailem po spuštění účtů</p>
          </div>
          <button className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => savedSearches.write(searches.filter((x) => x.query !== s.query))}>
            Smazat
          </button>
        </li>
      ))}
    </ul>
  );
}

function Section({ name }: { name: SectionKey }) {
  switch (name) {
    case "inzeraty":
      return <MyListings />;
    case "oblibene":
      return <Favourites />;
    case "hlidaci-pes":
      return <Watchdog />;
    case "zpravy":
      return <Empty title="Žádné zprávy" text="Po spuštění účtů si tu budete psát s prodávajícími a kupujícími, bez zveřejnění telefonu nebo e-mailu." />;
    case "statistiky":
      return <Empty title="Statistiky inzerátů" text="Po zveřejnění inzerátu tu uvidíte počet zobrazení, uložení do oblíbených a dotazů po dnech." />;
    case "vin":
      return <Empty title="Žádné prověrky" text="Prověrky historie vozu podle VIN budou dostupné přes partnera. Zakoupené zprávy najdete tady." />;
  }
}

export function AccountClient() {
  const params = useSearchParams();
  const requested = params.get("sekce");
  const active: SectionKey = SECTIONS.some((s) => s.key === requested) ? (requested as SectionKey) : "inzeraty";
  const current = SECTIONS.find((s) => s.key === active)!;

  return (
    <>
      <p className="card p-3 text-sm text-[var(--color-warn)]">
        Náhled účtu. Přihlášení zatím není spuštěné; oblíbená auta, hlídací psi a rozpracovaný inzerát jsou jen z tohoto prohlížeče.
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] mt-6 items-start">
        <section aria-labelledby="section-title" className="min-w-0">
          <h1 id="section-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">{current.label}</h1>
          <Section name={active} />
        </section>
        <nav aria-label="Můj účet" className="md:order-last order-first min-w-0">
          <ul className="flex md:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <li key={s.key}>
                <Link
                  href={`/ucet/?sekce=${s.key}`}
                  replace
                  scroll={false}
                  aria-current={s.key === active ? "page" : undefined}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-[var(--color-muted)] hover:bg-[var(--color-field)] hover:text-[var(--color-ink)] aria-[current=page]:text-[var(--color-brand)] aria-[current=page]:bg-[var(--color-field)]"
                >
                  <span aria-hidden="true" className="w-5 text-center">{s.icon}</span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
