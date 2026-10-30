"use client";

import { useState } from "react";
import type { ListingPhoto } from "@/db/schema";
import { photoUrl } from "@/lib/listing-status";
import { resizePhoto } from "@/lib/photo-resize";

// Photos of a saved listing: upload (resized in the browser, location data removed), order, main
// photo and delete. Every change is saved at once; used by the listing form and the listing's page
// in the account.

export const MAX_PHOTOS = 20;

async function call(url: string, method: string, body?: unknown): Promise<string | null> {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.ok) return null;
  return ((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.";
}

export function PhotoManager({ listingId, photos, editable, onChange }: {
  listingId: string;
  photos: ListingPhoto[];
  editable: boolean;
  onChange: (photos: ListingPhoto[]) => void;
}) {
  const base = `/api/inzeraty/${listingId}/`;
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  // Files that failed, so the seller can try them again without picking them anew.
  const [failed, setFailed] = useState<File[]>([]);

  async function upload(files: File[]) {
    const room = MAX_PHOTOS - photos.length;
    const chosen = files.slice(0, room);
    let current = photos;
    const failures: File[] = [];
    setBusy(true);
    setError("");
    for (const [i, file] of chosen.entries()) {
      setProgress(`Nahrávám ${i + 1} / ${chosen.length}…`);
      try {
        const { blob, width, height } = await resizePhoto(file);
        const response = await fetch(`${base}fotky/?w=${width}&h=${height}`, { method: "POST", headers: { "content-type": blob.type }, body: blob });
        const result = (await response.json().catch(() => ({}))) as ListingPhoto & { error?: string };
        if (!response.ok) throw new Error(result.error ?? "Nahrání se nepovedlo.");
        current = [...current, result];
        onChange(current);
      } catch (e) {
        failures.push(file);
        setError(`${file.name}: ${e instanceof Error ? e.message : "nahrání se nepovedlo"}`);
      }
    }
    if (files.length > room) setError(`Lze nahrát nejvýše ${MAX_PHOTOS} fotek.`);
    setFailed(failures);
    setProgress("");
    setBusy(false);
  }

  async function reorder(next: ListingPhoto[]) {
    const previous = photos;
    onChange(next);
    setBusy(true);
    const problem = await call(base, "PATCH", { order: next.map((p) => p.key) });
    setBusy(false);
    if (problem) {
      onChange(previous);
      setError(problem);
    }
  }

  function move(index: number, to: number) {
    const next = [...photos];
    const [photo] = next.splice(index, 1);
    next.splice(to, 0, photo);
    return reorder(next);
  }

  async function remove(key: string) {
    setBusy(true);
    setError("");
    const problem = await call(`${base}fotky/?klic=${encodeURIComponent(key)}`, "DELETE");
    setBusy(false);
    if (problem) setError(problem);
    else onChange(photos.filter((x) => x.key !== key));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-muted)]">{photos.length} / {MAX_PHOTOS} fotek{photos.length > 0 && " · první je hlavní"}</p>
        {editable && photos.length < MAX_PHOTOS && (
          <label className={`pill cursor-pointer ${busy ? "opacity-60" : ""}`}>
            + Přidat fotky
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                if (e.target.files?.length) upload([...e.target.files]);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      {photos.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">Přidejte alespoň jednu fotku. Fotky před nahráním zmenšíme a odstraníme z nich údaje o poloze.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <li key={p.key} className="space-y-1">
              <img src={photoUrl(p.key)} alt={`Fotka ${i + 1}`} width={p.width} height={p.height} className="w-full aspect-[4/3] object-cover rounded-[10px] bg-[var(--color-photo)]" loading="lazy" />
              <div className="flex items-center gap-1 text-xs">
                {i === 0 ? (
                  <span className="chip">hlavní</span>
                ) : editable ? (
                  <button type="button" className="text-[var(--color-brand)] hover:underline" disabled={busy} onClick={() => move(i, 0)}>Nastavit jako hlavní</button>
                ) : (
                  <span className="text-[var(--color-muted)]">{i + 1}.</span>
                )}
                {editable && (
                  <span className="ml-auto flex gap-1">
                    <button type="button" className="pill !px-2" disabled={busy || i === 0} aria-label="Posunout dopředu" onClick={() => move(i, i - 1)}>←</button>
                    <button type="button" className="pill !px-2" disabled={busy || i === photos.length - 1} aria-label="Posunout dozadu" onClick={() => move(i, i + 1)}>→</button>
                    <button type="button" className="pill !px-2" disabled={busy} aria-label="Smazat fotku" onClick={() => remove(p.key)}>✕</button>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {progress && <p className="text-sm text-[var(--color-muted)]" role="status">{progress}</p>}
      {error && (
        <p role="alert" className="text-sm text-[var(--color-warn)]">
          {error}
          {failed.length > 0 && !busy && (
            <>
              {" "}
              <button type="button" className="underline" onClick={() => upload(failed)}>Zkusit znovu ({failed.length})</button>
            </>
          )}
        </p>
      )}
    </div>
  );
}
