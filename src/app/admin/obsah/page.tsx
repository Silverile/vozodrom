import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BUILT from "@/data/catalog-built.json";
import { getSession, hasRole } from "@/lib/auth";
import { allEdits } from "@/lib/catalog-edit-store";
import { getMake, modelLinesOf } from "@/lib/makes";
import { PublishButton } from "./PublishButton";

export const metadata: Metadata = { title: "Katalog" };

// Overview of the catalogue edits. Editing itself happens on the model pages ("Upravit katalog",
// visible to admins); here are the lines with saved edits, whether they are already on the web,
// edits the last build could not apply, and the publish button.
export default async function CatalogEditsPage() {
  const session = await getSession();
  if (!hasRole(session, ["admin"])) notFound();
  const rows = await allEdits();
  const byLine = new Map<string, { make: string; line: string; count: number; last: string }>();
  for (const r of rows) {
    const key = `${r.makeSlug}--${r.lineSlug}`;
    const entry = byLine.get(key) ?? { make: r.makeSlug, line: r.lineSlug, count: 0, last: "" };
    entry.count++;
    entry.last = r.createdAt && r.createdAt > entry.last ? r.createdAt : entry.last;
    byLine.set(key, entry);
  }
  const lines = [...byLine.values()].sort((a, b) => b.last.localeCompare(a.last));
  const conflicts = Object.entries((BUILT as { conflicts: Record<string, { id: string; reason: string }[]> }).conflicts);
  const nameOf = (make: string, line: string) => `${getMake(make)?.name ?? make} ${modelLinesOf(make).find((l) => l.slug === line)?.name ?? line}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Katalog</h1>
        <PublishButton />
      </div>
      <p className="text-base max-w-3xl">
        Katalog se upravuje přímo na stránce modelu: tlačítko <b>✎ Upravit katalog</b> u názvu modelu nebo <b>Upravit</b> u generace. Změny nejprve
        potvrďte tlačítkem „Uložit“. Na webu se projeví až po „Publikovat na web“ a úspěšném nasazení (asi 5–7 minut).
      </p>

      {conflicts.length > 0 && (
        <section className="rounded-[14px] bg-[var(--color-warn-soft)] p-4 text-sm">
          <h2 className="font-bold text-[var(--color-warn)]">Úpravy, které se při posledním nasazení nedaly použít</h2>
          <p className="mt-1">Data katalogu se pod nimi změnila. Otevřete editor modelu, zkontrolujte historii a úpravu smažte nebo udělejte znovu.</p>
          <ul className="mt-2 space-y-1">
            {conflicts.map(([key, list]) => {
              const [make, line] = key.split("--");
              return (
                <li key={key}>
                  <Link href={`/katalog/${make}/${line}/`} className="font-semibold underline">{nameOf(make, line)}</Link>: {list.map((c) => c.reason).join("; ")}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Upravené modely <span className="font-normal text-[var(--color-muted)]">{lines.length}</span></h2>
        {lines.length === 0 ? (
          <p className="text-[var(--color-muted)]">Zatím žádné úpravy.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-line)] rounded-[14px] bg-[var(--color-surface)]">
            {lines.map((l) => (
              <li key={`${l.make}--${l.line}`} className="flex flex-wrap items-baseline justify-between gap-2 p-3">
                <Link href={`/katalog/${l.make}/${l.line}/`} className="font-semibold hover:text-[var(--color-brand)]">{nameOf(l.make, l.line)}</Link>
                <span className="text-sm text-[var(--color-muted)]">
                  {l.count} úprav{l.last ? ` · naposledy ${new Date(l.last).toLocaleString("cs-CZ")}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
