"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhotoManager } from "@/components/PhotoManager";
import type { ListingPhoto } from "@/db/schema";

// Small client parts of the garage pages: photos of a car or an entry, and deleting.

export function GaragePhotos({ owner, id, initial }: { owner: "car" | "entry"; id: string; initial: ListingPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  const base = owner === "car" ? `/api/garaz/${id}/fotky/` : `/api/zapisy/${id}/fotky/`;
  return (
    <PhotoManager
      listingId={id}
      photos={photos}
      editable
      onChange={setPhotos}
      api={{ photos: base, order: base }}
      emptyText={owner === "car" ? "Přidejte fotky auta." : "Fotky k zápisu jsou nepovinné."}
    />
  );
}

/** A delete button that asks first, then goes to `then`. */
export function DeleteButton({ url, label, confirmText, then }: { url: string; label: string; confirmText: string; then: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="pill text-[var(--color-warn)]"
        disabled={busy}
        onClick={async () => {
          if (!window.confirm(confirmText)) return;
          setBusy(true);
          const response = await fetch(url, { method: "DELETE" });
          setBusy(false);
          if (!response.ok) return setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Smazání se nepovedlo.");
          router.push(then);
          router.refresh();
        }}
      >
        {label}
      </button>
      {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
    </span>
  );
}
