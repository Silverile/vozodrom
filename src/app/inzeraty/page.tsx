import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = { title: "Inzeráty aut" };

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Inzeráty</h1>
      <Suspense fallback={<p className="mt-6 text-[var(--color-muted)]">Načítám…</p>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
