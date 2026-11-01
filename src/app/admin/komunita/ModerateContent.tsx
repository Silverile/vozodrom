"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Moderator's decision on reported garage content: hide it with a reason its author sees, or
// dismiss the reports and leave it. Hidden content can be restored.

export function ModerateContent({ kind, id, hidden }: { kind: "car" | "entry" | "comment"; id: string; hidden: boolean }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function act(action: "hide" | "restore" | "dismiss") {
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/komunita/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, id, action, reason }),
    });
    setBusy(false);
    if (!response.ok) return setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.");
    router.refresh();
  }

  if (hidden) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="pill" disabled={busy} onClick={() => act("restore")}>Obnovit</button>
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <label className="block text-sm">
        Důvod skrytí (uvidí ho autor)
        <input className="input mt-1" maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="pill text-[var(--color-warn)]" disabled={busy || reason.trim().length < 5} onClick={() => act("hide")}>Skrýt</button>
        <button type="button" className="pill" disabled={busy} onClick={() => act("dismiss")}>Ponechat</button>
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </div>
    </div>
  );
}
