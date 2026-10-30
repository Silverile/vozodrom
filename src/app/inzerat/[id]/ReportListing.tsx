"use client";

import { useState } from "react";
import { REPORT_CATEGORY_LABEL } from "@/lib/listing-status";

// "Nahlásit inzerát": the notice form required for hosting services (DSA art. 16). It asks for
// what the law expects from a notice: what is wrong and why, who reports it, and good faith.
export function ReportListing({ listingId, name, email }: { listingId: string; name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) return <p role="status" className="text-sm text-[var(--color-good)]">Děkujeme, hlášení jsme přijali. Potvrzení a výsledek najdete {email ? "ve Zprávách" : "v e-mailu"}.</p>;
  if (!open) {
    return (
      <button type="button" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => setOpen(true)}>
        ⚑ Nahlásit inzerát
      </button>
    );
  }

  return (
    <form
      className="space-y-2 text-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setBusy(true);
        setError("");
        const response = await fetch("/api/hlaseni/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            listingId,
            category: form.get("category"),
            explanation: form.get("explanation"),
            name: form.get("name"),
            email: form.get("email"),
            goodFaith: form.get("goodFaith") === "on",
          }),
        });
        setBusy(false);
        if (response.ok) setDone(true);
        else setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Odeslání se nepovedlo.");
      }}
    >
      <h3 className="font-bold">Nahlásit inzerát</h3>
      <label className="block">Důvod
        <select name="category" className="input mt-1" required defaultValue="">
          <option value="" disabled>Vyberte</option>
          {Object.entries(REPORT_CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="block">Co je s inzerátem v nepořádku a proč
        <textarea name="explanation" className="input mt-1 min-h-24" required minLength={20} maxLength={3000} />
      </label>
      <label className="block">Jméno
        <input name="name" className="input mt-1" required defaultValue={name} autoComplete="name" />
      </label>
      <label className="block">E-mail (pošleme na něj výsledek)
        <input name="email" type="email" className="input mt-1" required defaultValue={email} autoComplete="email" />
      </label>
      <label className="flex gap-2 text-[var(--color-muted)]">
        <input name="goodFaith" type="checkbox" required className="mt-1" />
        <span>Prohlašuji, že údaje v hlášení jsou podle mého nejlepšího vědomí přesné a úplné a podávám ho v dobré víře.</span>
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-cta !py-1.5 text-sm disabled:opacity-60" disabled={busy}>Odeslat hlášení</button>
        <button type="button" className="text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => setOpen(false)}>Zrušit</button>
      </div>
      {error && <p role="alert" className="text-[var(--color-warn)]">{error}</p>}
    </form>
  );
}
