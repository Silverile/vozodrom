"use client";

import { ItemRow } from "@/components/ItemRow";
import { REGIONS, getBrand, models } from "@/lib/catalog";
import { CATEGORIES, type Item, type ItemSection, type Season } from "@/lib/classifieds";
import { citiesIn, getCity } from "@/lib/geo";
import { createStore } from "@/lib/storage";

// Add-listing form for motorcycles, machinery, parts and tyres. Like the car form it only
// previews the result: nothing is sent, and the draft is kept in this browser per section.

interface Draft {
  category: string;
  make: string;
  name: string;
  price: number;
  condition: "nové" | "použité";
  year: number;
  usage: number;
  city: string;
  description: string;
  /** parts: catalogue models as "brand/model" */
  fits: string[];
  partNo: string;
  width: number;
  profile: number;
  rim: number;
  count: number;
  treadMm: number;
  dot: number;
}

const EMPTY: Draft = {
  category: "", make: "", name: "", price: 0, condition: "použité", year: 0, usage: 0, city: "", description: "",
  fits: [], partNo: "", width: 0, profile: 0, rim: 0, count: 4, treadMm: 0, dot: 0,
};

const isDraft = (v: unknown): v is Draft =>
  !!v &&
  typeof v === "object" &&
  (Object.keys(EMPTY) as (keyof Draft)[]).every((k) =>
    Array.isArray(EMPTY[k]) ? Array.isArray((v as Record<string, unknown>)[k]) : typeof (v as Record<string, unknown>)[k] === typeof EMPTY[k],
  );

const drafts = Object.fromEntries(
  (["technika", "moto", "dily", "pneu"] as const).map((s) => [s, createStore<Draft>(`vozodrom.itemDraft.${s}`, EMPTY, isDraft)]),
) as Record<ItemSection, ReturnType<typeof createStore<Draft>>>;

const USES_HOURS = new Set(["zemedelska", "stavebni"]);
const nf = new Intl.NumberFormat("cs-CZ");
const SEASON_OF: Record<string, Season> = { letni: "letní", zimni: "zimní", celorocni: "celoroční" };

const LABELS: Record<ItemSection, { make: string; name: string; namePlaceholder: string }> = {
  technika: { make: "Značka", name: "Model a provedení", namePlaceholder: "např. Transit 2.0 EcoBlue skříň L3H2" },
  moto: { make: "Značka", name: "Model", namePlaceholder: "např. MT-07" },
  dily: { make: "Výrobce dílu (nepovinné)", name: "Název dílu", namePlaceholder: "např. Alternátor 140 A" },
  pneu: { make: "Značka", name: "Dezén", namePlaceholder: "např. Alpin 6" },
};

function problemsOf(section: ItemSection, d: Draft): string[] {
  const p: string[] = [];
  if (!d.category) p.push(section === "pneu" ? "vyberte sezónu" : "vyberte kategorii");
  if (section !== "dily" && !d.make.trim()) p.push("chybí značka");
  if (!d.name.trim()) p.push(section === "dily" ? "chybí název dílu" : section === "pneu" ? "chybí dezén" : "chybí model");
  if (!(d.price > 0)) p.push("neplatná cena");
  if (!d.city) p.push("vyberte místo");
  if ((section === "technika" || section === "moto") && d.category !== "vybava" && !(d.year >= 1950 && d.year <= 2027)) p.push("neplatný rok výroby");
  if (section === "dily" && d.fits.length === 0) p.push("uveďte alespoň jeden model, na který díl pasuje");
  if (section === "pneu") {
    if (!d.width || !d.profile || !d.rim) p.push("vyplňte rozměr (šířka, profil, průměr)");
    if (!(d.dot >= 2000 && d.dot <= 2026)) p.push("neplatný rok výroby (DOT)");
    if (d.condition === "použité" && !(d.treadMm >= 1.6 && d.treadMm <= 12)) p.push("uveďte hloubku dezénu (1,6–12 mm)");
  }
  return p;
}

function previewOf(section: ItemSection, d: Draft): Item {
  const city = getCity(d.city);
  const fits = d.fits.map((key) => {
    const [b, m] = key.split("/");
    return `${getBrand(b)?.name} ${models.find((x) => x.brandSlug === b && x.slug === m)?.name}`;
  });
  const size = `${d.width || "…"}/${d.profile || "…"} R${d.rim || "…"}`;
  const title =
    section === "dily" ? `${d.name || "Název dílu"}${fits[0] ? ` — ${fits[0]}` : ""}`
      : section === "pneu" ? `${d.make || "Značka"} ${d.name || "dezén"} ${size}`
        : `${d.make || "Značka"} ${d.name || "model"}`;
  const specs: [string, string][] =
    section === "pneu"
      ? [["Rozměr", size], ["Sezóna", SEASON_OF[d.category] ?? "—"], ["Počet kusů", `${d.count} ks`]]
      : section === "dily"
        ? [["Výrobce", d.make.trim() || "originál (OE)"], ["Stav", d.condition], ["Pasuje na", fits.join(", ") || "—"]]
        : d.category === "vybava"
          ? [["Stav", d.condition]]
          : [
              ["Rok výroby", d.year ? String(d.year) : "—"],
              [USES_HOURS.has(d.category) ? "Motohodiny" : "Najeto", `${nf.format(d.usage)} ${USES_HOURS.has(d.category) ? "mth" : "km"}`],
              ["Stav", d.condition],
            ];
  return {
    id: "nahled", section, category: d.category || CATEGORIES[section][0].slug, title, make: d.make, price: Math.max(d.price, 0),
    condition: d.condition, year: d.year || null, region: city?.region ?? "kraj neuveden", city: d.city,
    sellerType: "soukromý", sellerName: "Vy", postedAt: "2026-10-25", description: d.description, specs,
    tyre: section === "pneu" ? { width: d.width, profile: d.profile, rim: d.rim, season: SEASON_OF[d.category] ?? "letní", count: d.count, treadMm: d.treadMm || null, dot: d.dot } : undefined,
  };
}

export function ItemForm({ section }: { section: ItemSection }) {
  const store = drafts[section];
  const draft = store.useValue();
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => store.write({ ...draft, [key]: value });
  const num = (key: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => set(key, (Number(e.target.value) || 0) as never);
  const problems = problemsOf(section, draft);
  const input = "input mt-1";
  const labels = LABELS[section];
  const isGear = draft.category === "vybava";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px] mt-6 items-start">
      <form className="card p-4 grid gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <label className="text-sm">{section === "pneu" ? "Sezóna" : "Kategorie"}
          <select className={input} value={draft.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">Vyberte</option>
            {CATEGORIES[section].map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </label>
        <label className="text-sm">Stav
          <select className={input} value={draft.condition} onChange={(e) => set("condition", e.target.value as Draft["condition"])}>
            <option value="použité">Použité</option>
            <option value="nové">Nové</option>
          </select>
        </label>
        <label className="text-sm">{labels.make}
          <input className={input} value={draft.make} onChange={(e) => set("make", e.target.value)} />
        </label>
        <label className="text-sm">{labels.name}
          <input className={input} placeholder={labels.namePlaceholder} value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </label>

        {(section === "technika" || section === "moto") && !isGear && (
          <>
            <label className="text-sm">Rok výroby
              <input className={input} type="number" inputMode="numeric" value={draft.year || ""} onChange={num("year")} />
            </label>
            <label className="text-sm">{USES_HOURS.has(draft.category) ? "Motohodiny" : "Najeto (km)"}
              <input className={input} type="number" inputMode="numeric" value={draft.usage || ""} onChange={num("usage")} />
            </label>
          </>
        )}

        {section === "dily" && (
          <>
            <label className="text-sm sm:col-span-2">Pasuje na modely
              <select
                className={`${input} min-h-28`}
                multiple
                value={draft.fits}
                onChange={(e) => set("fits", [...e.target.selectedOptions].map((o) => o.value))}
                aria-describedby="fits-help"
              >
                {models.map((m) => (
                  <option key={`${m.brandSlug}/${m.slug}`} value={`${m.brandSlug}/${m.slug}`}>{getBrand(m.brandSlug)?.name} {m.name}</option>
                ))}
              </select>
              <span id="fits-help" className="text-xs text-[var(--color-muted)]">Více modelů vyberete se stisknutou klávesou Ctrl (na Macu Cmd).</span>
            </label>
            <label className="text-sm">Číslo dílu (doporučeno)
              <input className={input} value={draft.partNo} onChange={(e) => set("partNo", e.target.value.toUpperCase())} />
            </label>
          </>
        )}

        {section === "pneu" && (
          <>
            <div className="sm:col-span-2 grid grid-cols-3 gap-2">
              {([["width", "Šířka", "205"], ["profile", "Profil", "55"], ["rim", "Průměr (R)", "16"]] as const).map(([key, label, ph]) => (
                <label key={key} className="text-sm">{label}
                  <input className={input} type="number" inputMode="numeric" placeholder={ph} value={draft[key] || ""} onChange={num(key)} />
                </label>
              ))}
            </div>
            <label className="text-sm">Počet kusů
              <select className={input} value={draft.count} onChange={(e) => set("count", Number(e.target.value))}>
                {[1, 2, 4].map((k) => <option key={k} value={k}>{k} ks</option>)}
              </select>
            </label>
            <label className="text-sm">Rok výroby (DOT)
              <input className={input} type="number" inputMode="numeric" placeholder="např. 2023" value={draft.dot || ""} onChange={num("dot")} />
            </label>
            {draft.condition === "použité" && (
              <label className="text-sm">Hloubka dezénu (mm)
                <input className={input} type="number" step="0.1" min="0" inputMode="decimal" placeholder="např. 6,5" value={draft.treadMm || ""} onChange={num("treadMm")} />
              </label>
            )}
          </>
        )}

        <label className="text-sm">Cena (Kč){section === "pneu" ? " za všechny kusy" : ""}
          <input className={input} type="number" inputMode="numeric" value={draft.price || ""} onChange={num("price")} />
        </label>
        <label className="text-sm">Místo
          <select className={input} value={draft.city} onChange={(e) => set("city", e.target.value)}>
            <option value="">Vyberte</option>
            {REGIONS.map((r) => (
              <optgroup key={r} label={r}>
                {citiesIn(r).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">Popis
          <textarea className={`${input} min-h-24`} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => store.write(EMPTY)}>
            Smazat rozpracovaný inzerát
          </button>
          <span className="text-sm text-[var(--color-muted)]">Odeslání bude dostupné s účty.</span>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <section className="card p-4" aria-live="polite">
          <h2 className="font-bold">Kontrola inzerátu</h2>
          {problems.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-good)]">✓ Inzerát je kompletní.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-warn)]">{problems.map((p) => <li key={p}>• {p}</li>)}</ul>
          )}
        </section>
        <section>
          <h2 className="font-bold mb-2">Náhled ve výsledcích</h2>
          {/* inert: the preview's link must not be focusable or clickable. */}
          <div inert><ItemRow item={previewOf(section, draft)} /></div>
        </section>
      </aside>
    </div>
  );
}
