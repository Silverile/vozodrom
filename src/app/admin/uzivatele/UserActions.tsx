"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const ROLE_LABEL = { user: "uživatel", dealer: "prodejce", moderator: "moderátor", admin: "administrátor" } as const;
type Role = keyof typeof ROLE_LABEL;

// Role and ban changes go through Better Auth's admin endpoints, which check the caller's role again.
export function UserActions({ id, role, banned, self }: { id: string; role: string; banned: boolean; self: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action: () => Promise<{ error: { message?: string } | null }>) {
    setBusy(true);
    setError("");
    const { error } = await action();
    setBusy(false);
    if (error) setError(error.message ?? "Akce se nepovedla.");
    else router.refresh();
  }

  if (self) return <span className="text-sm text-[var(--color-muted)]">{ROLE_LABEL[role as Role] ?? role} (vy)</span>;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <select
        className="input w-auto py-1"
        aria-label="Role"
        value={role}
        disabled={busy}
        onChange={(e) => {
          const next = e.target.value as Role;
          if (next === "admin" && !confirm("Udělit plná práva administrátora?")) return;
          // The client types only know the built-in roles; ours are checked by the server.
          run(() => authClient.admin.setRole({ userId: id, role: next as "admin" | "user" }));
        }}
      >
        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
      </select>
      {banned ? (
        <button type="button" className="pill" disabled={busy} onClick={() => run(() => authClient.admin.unbanUser({ userId: id }))}>Odblokovat</button>
      ) : (
        <button
          type="button"
          className="pill"
          disabled={busy}
          onClick={() => {
            const reason = prompt("Důvod blokace (uvidí ho uživatel při přihlášení):");
            if (reason === null) return;
            const days = prompt("Na kolik dní? Prázdné = natrvalo.", "");
            if (days === null) return;
            const seconds = Number(days) > 0 ? Math.round(Number(days) * 86400) : undefined;
            run(() => authClient.admin.banUser({ userId: id, banReason: reason.trim() || undefined, banExpiresIn: seconds }));
          }}
        >
          Zablokovat
        </button>
      )}
      {error && <span role="alert" className="text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}
