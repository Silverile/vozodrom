import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fórum a recenze" };

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Fórum a recenze</h1>
      <div className="card p-6 text-sm text-[var(--color-muted)]">
        <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">připravujeme</span>
        <p className="mt-3">Skrývání a mazání příspěvků ve fóru a recenzí majitelů.</p>
      </div>
    </div>
  );
}
