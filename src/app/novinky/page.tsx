import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Novinky a rady pro motoristy",
  description: "Praktické rady k nákupu a prodeji auta, přepisu, pneumatikám a elektromobilům.",
};

export default function NewsPage() {
  const [lead, ...rest] = articles;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Novinky a rady</h1>
      <p className="mt-1 text-[var(--color-muted)] max-w-2xl">Praktické rady k nákupu, prodeji a provozu auta. Bez clickbaitu a se zdroji.</p>

      <Link href={`/novinky/${lead.slug}/`} className="card mt-6 grid gap-4 sm:grid-cols-[220px_1fr] overflow-hidden hover:border-[var(--color-brand)]">
        <div className="grid place-items-center bg-[var(--color-brand-soft)] text-7xl min-h-36" aria-hidden="true">{lead.icon}</div>
        <div className="p-5 sm:pl-0">
          <p className="text-xs uppercase tracking-wide text-[var(--color-brand)]">{lead.category} · {formatDate(lead.date)}</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">{lead.title}</h2>
          <p className="mt-2 text-[var(--color-muted)]">{lead.perex}</p>
        </div>
      </Link>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <li key={a.slug}>
            <Link href={`/novinky/${a.slug}/`} className="card h-full flex flex-col overflow-hidden hover:border-[var(--color-brand)]">
              <div className="grid place-items-center bg-[var(--color-photo)] text-5xl h-28" aria-hidden="true">{a.icon}</div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--color-brand)]">{a.category} · {formatDate(a.date)}</p>
                <h2 className="font-bold mt-1 leading-snug">{a.title}</h2>
                <p className="mt-1.5 text-sm text-[var(--color-muted)]">{a.perex}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
