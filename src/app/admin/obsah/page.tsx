import type { Metadata } from "next";

export const metadata: Metadata = { title: "Katalog a novinky" };

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Katalog a novinky</h1>
      <div className="card p-6 text-sm text-[var(--color-muted)]">
        <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">připravujeme</span>
        <p className="mt-3">Přidávání a úpravy značek, modelů a generací v katalogu a psaní novinek a rad.</p>
      </div>
    </div>
  );
}
