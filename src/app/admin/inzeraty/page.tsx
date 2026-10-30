import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inzeráty" };

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Inzeráty</h1>
      <div className="card p-6 text-sm text-[var(--color-muted)]">
        <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">připravujeme</span>
        <p className="mt-3">Fronta nových inzerátů ke schválení, zamítnutí s důvodem a stažení z webu. Přibude s podáváním inzerátů.</p>
      </div>
    </div>
  );
}
