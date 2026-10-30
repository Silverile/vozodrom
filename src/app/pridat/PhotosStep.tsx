"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { PhotoManager } from "@/components/PhotoManager";
import { SignInLink } from "@/components/SignInModal";
import type { ListingPhoto, ListingStatus } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { EMPTY_LOCAL_DRAFT, type LocalDraft } from "@/lib/listing-draft";
import { MESSENGERS, MESSENGER_LABEL, type Messenger } from "@/lib/listing-status";

// The last step of the listing form: photos, contact and publishing. Photos belong to a saved
// listing, so the browser draft is first saved to the account as a concept (not public) and the
// form keeps its id. Signing in happens in the dialog over the form; the draft stays in this
// browser through the dialog, a failed sign-in or a reload, and the form opens this step again.

interface Saved {
  status: ListingStatus;
  photos: ListingPhoto[];
  phone: string;
  messengers: Messenger[];
}

export interface PhotosStep {
  /** content of the open step */
  body: ReactNode;
  /** the step's main action, for the step itself and the phone action bar */
  primary: ReactNode;
  /** one line for the closed step */
  summary: string;
  /** the saved listing's photos, for the preview */
  photos: ListingPhoto[];
}

async function send(url: string, method: string, body: unknown): Promise<{ ok: boolean; result: { id?: string; error?: string } }> {
  const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { ok: response.ok, result: (await response.json().catch(() => ({}))) as { id?: string; error?: string } };
}

export function usePhotosStep({ draft, complete, onIncomplete, write }: {
  draft: LocalDraft;
  complete: boolean;
  onIncomplete: () => void;
  write: (changes: Partial<LocalDraft>) => void;
}): PhotosStep {
  const router = useRouter();
  const session = authClient.useSession();
  const signedIn = Boolean(session.data?.user);
  const [saved, setSaved] = useState<{ id: string; listing: Saved } | null>(null);
  const [phone, setPhone] = useState("");
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { serverId, ...data } = draft;
  const listing = saved?.id === serverId ? saved.listing : null;

  // A draft saved earlier (this visit, before a reload, or "Upravit údaje" of a listing): load it.
  useEffect(() => {
    if (!serverId || !signedIn) return;
    let cancelled = false;
    fetch(`/api/inzeraty/${serverId}/`)
      .then(async (r) => {
        if (cancelled) return;
        if (!r.ok) return setError(r.status === 404 ? "Uložený koncept už neexistuje. Uložte údaje znovu." : "Uložený inzerát se nepodařilo načíst.");
        const row = (await r.json()) as Saved & { phone: string | null };
        setSaved({ id: serverId, listing: { ...row, phone: row.phone ?? "" } });
        setPhone(row.phone ?? "");
        setMessengers(row.messengers);
      })
      .catch(() => !cancelled && setError("Uložený inzerát se nepodařilo načíst."));
    return () => {
      cancelled = true;
    };
  }, [serverId, signedIn]);

  async function saveConcept() {
    if (!complete) return onIncomplete();
    setBusy(true);
    setError("");
    const { ok, result } = await send("/api/inzeraty/", "POST", { data });
    setBusy(false);
    if (!ok || !result.id) return setError(result.error ?? "Uložení se nepovedlo.");
    setSaved({ id: result.id, listing: { status: "draft", photos: [], phone: "", messengers: [] } });
    write({ serverId: result.id });
  }

  async function finish() {
    if (!complete) return onIncomplete();
    if (!listing) return;
    const publishing = listing.status === "draft" || listing.status === "rejected";
    if (publishing && listing.photos.length === 0) return setError("Přidejte alespoň jednu fotku.");
    setBusy(true);
    setError("");
    const base = `/api/inzeraty/${serverId}/`;
    const contact = { phone, messengers: phone.trim() ? MESSENGERS.filter((m) => messengers.includes(m)) : [] };
    let { ok, result } = await send(base, "PATCH", { data, ...contact });
    if (ok && publishing) ({ ok, result } = await send(`${base}stav/`, "POST", { action: "submit" }));
    setBusy(false);
    if (!ok) return setError(result.error ?? "Uložení se nepovedlo.");
    write(EMPTY_LOCAL_DRAFT);
    router.push(`/ucet/inzerat/${serverId}/`);
  }

  const errorLine = error && <p role="alert" className="text-sm text-[var(--color-warn)]">{error}</p>;

  if (!signedIn) {
    return {
      photos: [],
      summary: "Po přihlášení",
      primary: complete ? (
        <SignInLink next="/pridat/" className="btn-cta text-sm">Přihlásit se a přidat fotky</SignInLink>
      ) : (
        <button type="button" className="btn-cta text-sm" onClick={onIncomplete}>Pokračovat</button>
      ),
      body: (
        <p className="text-sm text-[var(--color-muted)]">
          Fotky se ukládají k vašemu účtu. Přihlaste se nebo si účet založte, vyplněné údaje zůstanou tady.
        </p>
      ),
    };
  }

  if (!serverId) {
    return {
      photos: [],
      summary: "Zatím nic",
      primary: (
        <button type="button" className="btn-cta text-sm disabled:opacity-60" disabled={busy} onClick={saveConcept}>
          {busy ? "Ukládám…" : "Uložit a přidat fotky"}
        </button>
      ),
      body: (
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-muted)]">Údaje uložíme jako koncept, který zatím nikdo nevidí, a hned přidáte fotky.</p>
          {errorLine}
        </div>
      ),
    };
  }

  const publishing = !listing || listing.status === "draft" || listing.status === "rejected";
  return {
    photos: listing?.photos ?? [],
    summary: listing ? `${listing.photos.length} fotek${listing.phone ? " · telefon" : ""}` : "Načítám…",
    primary:
      listing?.status === "withdrawn" ? null : (
        <button type="button" className="btn-cta text-sm disabled:opacity-60" disabled={busy || !listing} onClick={finish}>
          {busy ? "Ukládám…" : publishing ? "Zveřejnit inzerát" : "Uložit změny"}
        </button>
      ),
    body: !listing ? (
      errorLine || <p className="text-sm text-[var(--color-muted)]" role="status">Načítám uložený inzerát…</p>
    ) : (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold">Fotky</h3>
          <div className="mt-2">
            <PhotoManager
              listingId={serverId}
              photos={listing.photos}
              editable={listing.status !== "withdrawn"}
              onChange={(photos) => {
                setSaved({ id: serverId, listing: { ...listing, photos } });
                setError("");
              }}
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Kontakt <span className="font-normal text-[var(--color-muted)]">(nepovinné)</span></h3>
          <p className="text-sm text-[var(--color-muted)]">Telefon se zobrazí v inzerátu. E-mail kupujícím neukazujeme, mohou vám psát přes zprávy.</p>
          <input className="input mt-2 sm:max-w-xs" type="tel" autoComplete="tel" placeholder="+420 123 456 789" aria-label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <fieldset className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" disabled={!phone.trim()}>
            <legend className="sr-only">Komunikátory na tomto čísle</legend>
            <span className="text-[var(--color-muted)]">Na tomto čísle také:</span>
            {MESSENGERS.map((m) => (
              <label key={m} className="flex items-center gap-1.5">
                <input type="checkbox" checked={messengers.includes(m)} onChange={(e) => setMessengers((c) => (e.target.checked ? [...c, m] : c.filter((x) => x !== m)))} />
                {MESSENGER_LABEL[m]}
              </label>
            ))}
          </fieldset>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          {publishing
            ? "Po zveřejnění inzerát projde automatickou kontrolou; podezřelý počká na moderátora."
            : "Změněné údaje znovu projdou automatickou kontrolou."}
        </p>
        {errorLine}
      </div>
    ),
  };
}
