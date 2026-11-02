import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { editsOf } from "@/lib/catalog-edit-store";
import { getMake, makesIn, modelLinesOf } from "@/lib/makes";
import { CatalogTexts, PublishButton } from "./CatalogEditor";

export const metadata: Metadata = { title: "Katalog" };

// Corrections of catalogue texts (model description, generation names, notes on years). Saved at
// once; "Publikovat na web" starts a deploy whose build takes them into the static pages. The
// catalogue's own texts come from /api/katalog/<make>/<line>/?texty=1, so this page does not bundle
// the model cards a second time (Worker size limit).
export default async function CatalogEditPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await getSession();
  if (!hasRole(session, ["admin"])) notFound();
  const q = await searchParams;
  const make = q.znacka && getMake(q.znacka) ? q.znacka : "";
  const lines = make ? modelLinesOf(make) : [];
  const lineSlug = lines.some((l) => l.slug === q.model) ? q.model! : "";
  const edits = make && lineSlug ? await editsOf(make, lineSlug) : [];

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
      {make && lineSlug && <CatalogTexts key={`${make}/${lineSlug}`} makeSlug={make} lineSlug={lineSlug} makeName={getMake(make)?.name ?? make} edits={edits} />}
    </div>
  );
}
