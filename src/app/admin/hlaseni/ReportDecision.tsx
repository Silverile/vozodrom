"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RestrictionForm } from "../RestrictionForm";

export function ReportDecision({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);

  async function decide(decision: "remove" | "dismiss", reason?: string | null, rule?: string) {
    if (decision === "dismiss") reason = prompt("Proč inzerát ponecháváte (dostanou to oznamovatelé):");
    if (!reason?.trim()) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/hlaseni/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingId, decision, reason, rule }),
    });
    setBusy(false);
    if (!response.ok) setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.");
    else router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {removing ? (
        <RestrictionForm
          label="Zdůvodnění stažení (autor ho uvidí v účtu, oznamovatelé dostanou výsledek)"
          submit="Stáhnout inzerát"
          busy={busy}
          onSubmit={(rule, reason) => decide("remove", reason, rule)}
          onCancel={() => setRemoving(false)}
        />
      ) : (
        <>
          <button type="button" className="btn-cta !py-1.5 text-sm disabled:opacity-60" disabled={busy} onClick={() => setRemoving(true)}>Stáhnout inzerát</button>
          <button type="button" className="pill" disabled={busy} onClick={() => decide("dismiss")}>Hlášení zamítnout</button>
        </>
      )}
      {error && <span role="alert" className="text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}
