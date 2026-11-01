import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { editsOf } from "@/lib/catalog-edit-store";
import { CATALOG_EDIT_FIELDS, type CatalogEditField } from "@/lib/catalog-edits";
import { getMake, makesIn, modelLinesOf } from "@/lib/makes";
import { cardOf } from "@/lib/modelCards";
import { EditField, PublishButton } from "./CatalogEditor";

export const metadata: Metadata = { title: "Katalog" };

// Corrections of catalogue texts (model description, generation names, notes on years). Saved at
// once; "Publikovat na web" starts a deploy whose build takes them into the static pages.
export default async function CatalogEditPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await getSession();
  if (!hasRole(session, ["admin"])) notFound();
  const q = await searchParams;
  const make = q.znacka && getMake(q.znacka) ? q.znacka : "";
  const lines = make ? modelLinesOf(make) : [];
  const lineSlug = lines.some((l) => l.slug === q.model) ? q.model! : "";
  const card = make && lineSlug ? cardOf(make, lineSlug) : undefined;
  const edits = card ? await editsOf(make, lineSlug) : [];
  const editOf = (genIndex: number | null, field: CatalogEditField) => edits.find((e) => e.genIndex === genIndex && e.field === field)?.value || null;
  // the card as built may already carry older edits; the catalogue's own text is what the edit replaces
  const field = (genIndex: number | null, name: CatalogEditField, source: string | null | undefined) => (
    <EditField
      key={`${genIndex}-${name}`}
      makeSlug={make}
      lineSlug={lineSlug}
      genIndex={genIndex}
      field={name}
      label={CATALOG_EDIT_FIELDS[name].label}
      source={source ?? ""}
      current={editOf(genIndex, name)}
      long={CATALOG_EDIT_FIELDS[name].long}
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Katalog</h1>
        <PublishButton />
      </div>
      <p className="text-sm text-[var(--color-muted)] max-w-3xl">
        Opravy textů katalogu se uloží hned, na web se dostanou po nasazení: tlačítkem „Publikovat na web“ nebo s nejbližší jinou změnou webu.
        Prázdné pole nebo „Vrátit text katalogu“ vrátí původní text.
      </p>
      <form className="card p-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
        <label className="text-sm">
          Značka
          <select name="znacka" className="input mt-1" defaultValue={make}>
            <option value="">Vyberte</option>
            {makesIn("auto").map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          Model
          <select name="model" className="input mt-1" defaultValue={lineSlug} disabled={!make}>
            <option value="">{make ? "Vyberte" : "Nejdřív značka"}</option>
            {lines.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
          </select>
        </label>
        <button type="submit" className="pill justify-center">Otevřít</button>
      </form>
      {make && lineSlug && !card && <div className="card p-6 text-sm text-[var(--color-muted)]">Tento model nemá v katalogu kartu s generacemi.</div>}
      {card && (
        <>
          <section className="card p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-bold text-lg">{getMake(make)?.name} {card.name}</h2>
              <Link href={`/katalog/${make}/${lineSlug}/`} className="text-sm text-[var(--color-brand)] hover:underline">Stránka v katalogu →</Link>
            </div>
            {field(null, "summary", sourceCard(make, lineSlug)?.summary)}
          </section>
          {card.generations.map((g, i) => (
            <section key={i} className="card p-5 space-y-4">
              <h2 className="font-bold">{i + 1}. generace{g.code ? ` · ${g.code}` : ""}{g.from ? ` · ${g.from}–${g.to ?? "dosud"}` : ""}</h2>
              {field(i, "name", sourceCard(make, lineSlug)?.generations[i]?.name)}
              {field(i, "dateNote", sourceCard(make, lineSlug)?.generations[i]?.dateNote)}
            </section>
          ))}
        </>
      )}
    </div>
  );
}

/** The card without any edits: what the catalogue data itself says. */
function sourceCard(make: string, line: string) {
  return cardOf(make, line, { edits: false });
}
