"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInLink } from "@/components/SignInModal";
import { authClient } from "@/lib/auth-client";
import { EMPTY_LOCAL_DRAFT, type LocalDraft } from "@/lib/listing-draft";
import { draftStore } from "./AddListingForm";

// Saves the browser draft to the account: a new listing goes on to photos and submission,
// an edited one (serverId set) is updated in place. The local draft is cleared afterwards.
export function SubmitListing({ draft, complete }: { draft: LocalDraft; complete: boolean }) {
  const router = useRouter();
  const signedIn = Boolean(authClient.useSession().data?.user);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!signedIn) {
    return (
      <SignInLink next="/pridat/" className="btn-cta text-sm">
        Přihlásit se a pokračovat
      </SignInLink>
    );
  }

  async function save() {
    setBusy(true);
    setError("");
    const { serverId, ...data } = draft;
    const response = serverId
      ? await fetch(`/api/inzeraty/${serverId}/`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ data }) })
      : await fetch("/api/inzeraty/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ data }) });
    const result = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Uložení se nepovedlo.");
    draftStore.write(EMPTY_LOCAL_DRAFT);
    router.push(`/ucet/inzerat/${serverId || result.id}/`);
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button type="button" className="btn-cta text-sm disabled:opacity-60" disabled={!complete || busy} onClick={save}>
        {draft.serverId ? "Uložit změny" : "Pokračovat k fotkám"}
      </button>
      {!complete && <span className="text-xs text-[var(--color-muted)]">Nejdřív doplňte údaje podle kontroly vpravo.</span>}
      {error && <span role="alert" className="text-xs text-[var(--color-warn)]">{error}</span>}
    </span>
  );
}
