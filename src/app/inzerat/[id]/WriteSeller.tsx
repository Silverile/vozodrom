"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** "Napsat prodejci": opens the chat with the seller (sign-in first for visitors). */
export function WriteSeller({ listingId, signedIn }: { listingId: string; signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!signedIn) {
    return <Link href={`/prihlaseni/?dalsi=/inzerat/${listingId}/`} className="pill w-full justify-center">✉ Napsat prodejci</Link>;
  }
  return (
    <>
      <button
        type="button"
        className="pill w-full justify-center"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const response = await fetch("/api/zpravy/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ listingId }) });
          const result = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
          setBusy(false);
          if (response.ok && result.id) router.push(`/ucet/zpravy/?k=${result.id}`);
          else setError(result.error ?? "Konverzaci se nepodařilo otevřít.");
        }}
      >
        ✉ Napsat prodejci
      </button>
      {error && <p role="alert" className="text-sm text-[var(--color-warn)]">{error}</p>}
    </>
  );
}
