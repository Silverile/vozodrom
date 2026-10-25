import type { Metadata } from "next";
import { Suspense } from "react";
import { ShortlistClient } from "./ShortlistClient";

export const metadata: Metadata = { title: "Můj výběr a porovnání" };

export default function ShortlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Můj výběr</h1>
      <p className="text-[var(--color-muted)] mt-1">
        Auta označená ☆ a uložená hledání. Ukládá se jen v tomto prohlížeči, bez účtu.
      </p>
      <Suspense fallback={<p className="mt-6 text-[var(--color-muted)]">Načítám…</p>}>
        <ShortlistClient />
      </Suspense>
    </div>
  );
}
