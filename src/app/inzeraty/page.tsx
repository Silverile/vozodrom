import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = { title: "Inzeráty aut" };

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense fallback={<p className="text-[var(--color-muted)]">Načítám…</p>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
