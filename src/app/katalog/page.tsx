import type { Metadata } from "next";
import Link from "next/link";
import { brands, modelsOf } from "@/lib/catalog";

export const metadata: Metadata = { title: "Katalog značek a modelů" };

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Katalog</h1>
      <p className="text-[var(--color-muted)] mt-1">Značky a modely s technickými údaji a daty z technických kontrol.</p>
      <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => {
          const list = modelsOf(brand.slug);
          return (
            <div key={brand.slug} className="card p-5">
              <Link href={`/katalog/${brand.slug}/`} className="text-lg font-bold hover:text-[var(--color-brand)]">
                {brand.name}
              </Link>
              <div className="text-xs text-[var(--color-muted)]">{brand.country}</div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {list.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/katalog/${brand.slug}/${m.slug}/`}
                      className="chip bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:opacity-80"
                    >
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
