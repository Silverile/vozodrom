"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ListingRow } from "@/components/ListingRow";
import { getBrand, getModel } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_LABEL, STATUS_STYLE, photoUrl } from "@/lib/listing-status";
import { getListing } from "@/lib/listings";
import { getMake } from "@/lib/makes";
import { savedSearches, shortlist } from "@/lib/storage";
import type { Listing } from "@/lib/types";
import type { ListingStatus } from "@/db/schema";
import { draftStore } from "../pridat/AddListingForm";

// Account area modelled on Drom's. Listings and favourites/saved searches (AccountSync) live in the
// account; an unsaved form draft stays in this browser. The remaining sections explain what they will do.

export interface MyListing {
  id: string;
  title: string;
  status: ListingStatus;
  price: number;
  photo: string | null;
  updatedAt: string;
}

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

function MyListings({ listings }: { listings: MyListing[] }) {
  const draft = draftStore.useValue();
  const model = getModel(draft.brand, draft.model);
  const hasDraft = Boolean(draft.brand && draft.model.trim());
  if (!hasDraft && listings.length === 0) {
    return <Empty title="Zatím žádné inzeráty" text="Vyplňte údaje o voze, přidejte fotky a po kontrole moderátorem se inzerát zveřejní." action={{ href: "/pridat/", label: "+ Přidat inzerát zdarma" }} />;
  }
  return (
    <div className="space-y-3">
      {hasDraft && (
        <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">{draft.serverId ? "neuložené změny" : "rozpracováno"}</span>
            <p className="font-bold mt-2">{getBrand(draft.brand)?.name ?? getMake(draft.brand)?.name} {model?.name ?? draft.model}, {draft.year}</p>
            <p className="text-sm text-[var(--color-muted)]">{draft.price ? formatPrice(draft.price) : "cena zatím nevyplněna"} · zatím jen v tomto prohlížeči</p>
          </div>
          <Link href="/pridat/" className="pill">Pokračovat v úpravách</Link>
        </div>
      )}
      {listings.map((l) => (
        <Link key={l.id} href={`/ucet/inzerat/${l.id}/`} className="card p-3 flex items-center gap-4 hover:border-[var(--color-brand)]">
          {l.photo ? (
            <img src={photoUrl(l.photo)} alt="" className="w-24 aspect-[4/3] object-cover rounded-[8px] bg-[var(--color-photo)]" loading="lazy" />
          ) : (
            <span className="w-24 aspect-[4/3] grid place-items-center rounded-[8px] bg-[var(--color-field)] text-xs text-[var(--color-muted)]">bez fotky</span>
          )}
          <span className="min-w-0">
            <span className={`chip ${STATUS_STYLE[l.status]}`}>{STATUS_LABEL[l.status]}</span>
            <span className="block font-bold mt-1 truncate">{l.title}</span>
            <span className="block text-sm text-[var(--color-muted)]">{formatPrice(l.price)} · upraveno {formatDate(l.updatedAt)}</span>
          </span>
        </Link>
      ))}
      <div className="flex justify-end"><Link href="/pridat/" className="pill">+ Přidat další inzerát</Link></div>
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
    return <Empty title="Nemáte žádného hlídacího psa" text="Ve vyhledávání nastavte filtry a klikněte na „Uložit hledání“. E-mailová upozornění na nová auta brzy doplníme." action={{ href: "/inzeraty/", label: "Přejít na inzeráty" }} />;
  }
  return (
    <ul className="space-y-2">
      {searches.map((s) => (
        <li key={s.query} className="card p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/inzeraty/?${s.query}`} className="font-semibold hover:text-[var(--color-brand)]">{s.label}</Link>
            <p className="text-xs text-[var(--color-muted)]">uloženo {formatDate(s.savedAt)} · e-mailová upozornění připravujeme</p>
          </div>
          <button className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => savedSearches.write(searches.filter((x) => x.query !== s.query))}>
            Smazat
          </button>
        </li>
      ))}
    </ul>
  );
}

function Section({ name, listings }: { name: SectionKey; listings: MyListing[] }) {
  switch (name) {
    case "inzeraty":
      return <MyListings listings={listings} />;
    case "oblibene":
      return <Favourites />;
    case "hlidaci-pes":
      return <Watchdog />;
    case "zpravy":
      return <Empty title="Zprávy" text="Konverzace s prodávajícími a kupujícími a oznámení od Vozodromu." action={{ href: "/ucet/zpravy/", label: "Otevřít zprávy" }} />;
    case "statistiky":
      return <Empty title="Statistiky inzerátů" text="Po zveřejnění inzerátu tu uvidíte počet zobrazení, uložení do oblíbených a dotazů po dnech." />;
    case "vin":
      return <Empty title="Žádné prověrky" text="Prověrky historie vozu podle VIN budou dostupné přes partnera. Zakoupené zprávy najdete tady." />;
  }
}

export function AccountClient({ user, staff, listings }: { user: { name: string; email: string }; staff: boolean; listings: MyListing[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const requested = params.get("sekce");
  const active: SectionKey = SECTIONS.some((s) => s.key === requested) ? (requested as SectionKey) : "inzeraty";
  const current = SECTIONS.find((s) => s.key === active)!;

  return (
    <>
      <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold truncate">{user.name}</p>
          <p className="text-sm text-[var(--color-muted)] truncate">{user.email} · oblíbená auta a hlídací psi se ukládají k účtu</p>
        </div>
        <div className="flex gap-2">
          {staff && <Link href="/admin/" className="pill">Administrace</Link>}
          <button
            type="button"
            className="pill"
            onClick={async () => {
              await authClient.signOut();
              router.replace("/");
              router.refresh();
            }}
          >
            Odhlásit se
          </button>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] mt-6 items-start">
        <section aria-labelledby="section-title" className="min-w-0">
          <h1 id="section-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">{current.label}</h1>
          <Section name={active} listings={listings} />
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
