import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { brands, modelsOf } from "@/lib/catalog";
import { items } from "@/lib/classifieds";
import { listings } from "@/lib/listings";
import { type Make, type MakeSection, initialOf, makesIn, resolveMake } from "@/lib/makes";

export const metadata: Metadata = {
  title: "Katalog značek a modelů",
  description: "Všechny značky aut, motocyklů, užitkových vozidel, strojů a pneumatik od A do Z.",
};

const SECTIONS: { key: MakeSection; label: string; id: string }[] = [
  { key: "auto", label: "Osobní auta", id: "auta" },
  { key: "moto", label: "Motorky", id: "motorky" },
  { key: "technika", label: "Užitkové a stroje", id: "technika" },
  { key: "pneu", label: "Pneumatiky", id: "pneumatiky" },
];

// Listing counts per make and section, from the test listings.
const counts = new Map<string, number>();
const bump = (key: string) => counts.set(key, (counts.get(key) ?? 0) + 1);
for (const l of listings) bump(`auto:${l.brandSlug}`);
for (const i of items) {
  const make = resolveMake(i.make);
  if (make) bump(`${i.section === "dily" ? "auto" : i.section}:${make.slug}`);
}

function AzList({ section, makes }: { section: MakeSection; makes: Make[] }) {
  const groups = new Map<string, Make[]>();
  for (const m of makes) groups.set(initialOf(m.name), [...(groups.get(initialOf(m.name)) ?? []), m]);
  return (
    <div className="space-y-5">
      {[...groups].map(([letter, list]) => (
        <div key={letter}>
          <h3 className="text-sm font-bold text-[var(--color-muted)] border-b border-[var(--color-line)] pb-1 mb-1">{letter}</h3>
          <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list.map((m) => {
              const n = counts.get(`${section}:${m.slug}`) ?? 0;
              return (
                <li key={m.slug}>
                  <Link href={`/katalog/${m.slug}/`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--color-field)]">
                    <BrandLogo slug={m.slug} name={m.name} size={26} />
                    <span className={`min-w-0 truncate ${n ? "font-semibold" : ""} ${m.defunct ? "text-[var(--color-muted)]" : ""}`}>{m.name}</span>
                    {n > 0 && <span className="text-xs text-[var(--color-muted)]">{n}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Katalog značek</h1>
      <p className="text-[var(--color-muted)] mt-1">
        Všechny značky od A do Z. U vybraných modelů najdete technické údaje, data z technických kontrol a recenze majitelů.
      </p>

      <nav aria-label="Druh vozidla" className="mt-5 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a key={s.key} href={`#${s.id}`} className="pill">
            {s.label} <span className="opacity-70">{makesIn(s.key).length}</span>
          </a>
        ))}
      </nav>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-3">Modely s technickými daty</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.slug} className="card p-4">
              <Link href={`/katalog/${brand.slug}/`} className="flex items-center gap-3 font-bold hover:text-[var(--color-brand)]">
                <BrandLogo slug={brand.slug} name={brand.name} size={30} />
                {brand.name}
              </Link>
              <ul className="mt-3 flex flex-wrap gap-2">
                {modelsOf(brand.slug).map((m) => (
                  <li key={m.slug}>
                    <Link href={`/katalog/${brand.slug}/${m.slug}/`} className="chip bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:opacity-80">
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.key} id={s.id} className="mt-12 scroll-mt-32">
          <h2 className="text-xl font-bold mb-3">
            {s.label} <span className="text-[var(--color-muted)] font-normal text-base">· {makesIn(s.key).length} značek</span>
          </h2>
          <div className="card p-4">
            <AzList section={s.key} makes={makesIn(s.key)} />
          </div>
        </section>
      ))}

      <p className="mt-8 text-xs text-[var(--color-muted)]">
        Seznam značek: Wikidata (CC0), stav k 25. 10. 2026; šedě značky, které už nevyrábějí. Loga značek jsou ochranné známky jejich
        vlastníků a slouží jen k označení značky. Grafika: Simple Icons (CC0) a volná díla z Wikimedia Commons.
      </p>
    </div>
  );
}
