"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReportDecision({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function decide(decision: "remove" | "dismiss") {
    const reason = prompt(
      decision === "remove"
        ? "Zdůvodnění stažení (dostane ho autor inzerátu i oznamovatelé):"
        : "Proč inzerát ponecháváte (dostanou to oznamovatelé):",
    );
    if (!reason?.trim()) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/hlaseni/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingId, decision, reason }),
    });
    setBusy(false);
    if (!response.ok) setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.");
    else router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <button type="button" className="btn-cta !py-1.5 text-sm disabled:opacity-60" disabled={busy} onClick={() => decide("remove")}>Stáhnout inzerát</button>
      <button type="button" className="pill" disabled={busy} onClick={() => decide("dismiss")}>Hlášení zamítnout</button>
      {error && <span role="alert" className="text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}
