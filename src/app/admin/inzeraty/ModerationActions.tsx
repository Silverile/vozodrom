"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ListingStatus } from "@/db/schema";

// Approve or reject; the author gets an e-mail either way. A published listing can be taken down
// (reject) with a reason, which is what a DSA-style removal needs.
export function ModerationActions({ id, status }: { id: string; status: ListingStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(action: "approve" | "reject", reason?: string) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/inzeraty/${id}/stav/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    setBusy(false);
    if (!response.ok) setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.");
    else router.refresh();
  }

  function reject() {
    const reason = prompt(status === "published" ? "Proč inzerát stahujete? Autor důvod uvidí." : "Důvod zamítnutí (autor ho uvidí):");
    if (reason?.trim()) send("reject", reason);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {status === "pending" && (
        <button type="button" className="btn-cta !py-1.5 text-sm disabled:opacity-60" disabled={busy} onClick={() => send("approve")}>Schválit</button>
      )}
      <button type="button" className="pill" disabled={busy} onClick={reject}>{status === "published" ? "Stáhnout z webu" : "Zamítnout"}</button>
      {error && <span role="alert" className="text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}
