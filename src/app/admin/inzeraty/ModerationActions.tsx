"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ListingStatus } from "@/db/schema";
import { RestrictionForm } from "../RestrictionForm";

// Approve or reject; the author sees the result, the rule broken and the reason in the account. A
// published listing can be taken down (reject) the same way (DSA art. 17).
export function ModerationActions({ id, status }: { id: string; status: ListingStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rejecting, setRejecting] = useState(false);

  async function send(action: "approve" | "reject", reason?: string, rule?: string) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/inzeraty/${id}/stav/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, reason, rule }),
    });
    setBusy(false);
    if (!response.ok) setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.");
    else router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {status === "pending" && (
        <button type="button" className="btn-cta !py-1.5 text-sm disabled:opacity-60" disabled={busy} onClick={() => send("approve")}>Schválit</button>
      )}
      {rejecting ? (
        <RestrictionForm
          label={status === "published" ? "Proč inzerát stahujete (autor to uvidí)" : "Důvod zamítnutí (autor ho uvidí)"}
          submit={status === "published" ? "Stáhnout z webu" : "Zamítnout"}
          busy={busy}
          onSubmit={(rule, reason) => send("reject", reason, rule)}
          onCancel={() => setRejecting(false)}
        />
      ) : (
        <button type="button" className="pill" disabled={busy} onClick={() => setRejecting(true)}>{status === "published" ? "Stáhnout z webu" : "Zamítnout"}</button>
      )}
      {error && <span role="alert" className="text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}
