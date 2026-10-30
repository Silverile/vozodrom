"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ListingPhoto, ListingStatus } from "@/db/schema";
import { FUEL_LABEL } from "@/lib/catalog";
import { formatKm, formatPrice } from "@/lib/format";
import { getCity } from "@/lib/geo";
import { BODY_KEYS } from "@/lib/listing-catalog";
import type { Draft } from "@/lib/listing-draft";
import { MESSENGERS, MESSENGER_LABEL, type Messenger, STATUS_LABEL, STATUS_STYLE, photoUrl } from "@/lib/listing-status";
import { resizePhoto } from "@/lib/photo-resize";
import { draftStore } from "../../../pridat/AddListingForm";

const MAX_PHOTOS = 20;

interface Props {
  listing: { id: string; title: string; status: ListingStatus; data: Draft; photos: ListingPhoto[]; phone: string; messengers: Messenger[]; rejectReason: string | null };
}

async function call(url: string, method: string, body?: unknown): Promise<string | null> {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.ok) return null;
  return ((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Akce se nepovedla.";
}

export function ManageListing({ listing }: Props) {
  const router = useRouter();
  const base = `/api/inzeraty/${listing.id}/`;
  const [photos, setPhotos] = useState(listing.photos);
  const [phone, setPhone] = useState(listing.phone);
  const [messengers, setMessengers] = useState<Messenger[]>(listing.messengers);
  const contactChanged = phone !== listing.phone || messengers.join() !== listing.messengers.join();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const editable = listing.status !== "withdrawn";
  const live = listing.status === "pending" || listing.status === "published";

  async function run(action: () => Promise<string | null>, done?: string) {
    setBusy(true);
    setError("");
    setNotice("");
    const problem = await action();
    setBusy(false);
    if (problem) setError(problem);
    else {
      if (done) setNotice(done);
      router.refresh();
    }
  }

  async function upload(files: FileList) {
    const room = MAX_PHOTOS - photos.length;
    const chosen = [...files].slice(0, room);
    setBusy(true);
    setError("");
    for (const [i, file] of chosen.entries()) {
      setProgress(`Nahrávám ${i + 1} / ${chosen.length}…`);
      try {
        const { blob, width, height } = await resizePhoto(file);
        const response = await fetch(`${base}fotky/?w=${width}&h=${height}`, { method: "POST", headers: { "content-type": blob.type }, body: blob });
        const result = (await response.json().catch(() => ({}))) as ListingPhoto & { error?: string };
        if (!response.ok) throw new Error(result.error ?? "Nahrání se nepovedlo.");
        setPhotos((current) => [...current, result]);
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : "nahrání se nepovedlo"}`);
        break;
      }
    }
    if (files.length > room) setError(`Lze nahrát nejvýše ${MAX_PHOTOS} fotek.`);
    setProgress("");
    setBusy(false);
    router.refresh();
  }

  async function move(index: number, delta: number) {
    const next = [...photos];
    const [photo] = next.splice(index, 1);
    next.splice(index + delta, 0, photo);
    setPhotos(next);
    await run(() => call(base, "PATCH", { order: next.map((p) => p.key) }));
  }

  const d = listing.data;
  const specs: [string, string][] = [
    ["Rok výroby", String(d.year)],
    ["Najeto", formatKm(d.mileageKm)],
    ["Cena", formatPrice(d.price)],
    ["Motor", `${d.engine}, ${d.powerKw} kW`],
    ["Palivo", FUEL_LABEL[d.fuel as keyof typeof FUEL_LABEL] ?? d.fuel],
    ["Karoserie", BODY_KEYS[d.body] ?? d.body],
    ["Převodovka", d.transmission],
    ["Místo", getCity(d.city)?.name ?? d.region],
    ["VIN", d.vin || "neuveden"],
  ];

  return (
    <div className="space-y-5">
      <Link href="/ucet/?sekce=inzeraty" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">← Moje inzeráty</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{listing.title}</h1>
        <span className={`chip ${STATUS_STYLE[listing.status]}`}>{STATUS_LABEL[listing.status]}</span>
      </div>

      {listing.status === "rejected" && listing.rejectReason && (
        <p className="card p-4 text-sm"><strong>Důvod zamítnutí:</strong> {listing.rejectReason}<br />Upravte inzerát a odešlete ho znovu.</p>
      )}
      {listing.status === "pending" && <p className="card p-4 text-sm text-[var(--color-muted)]">Automatická kontrola našla v inzerátu něco, na co se musí podívat moderátor. O výsledku vám pošleme e-mail.</p>}
      {live && editable && <p className="text-xs text-[var(--color-muted)]">Změněné údaje znovu projdou automatickou kontrolou.</p>}

      <section className="card p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Fotky <span className="text-[var(--color-muted)] font-normal">{photos.length} / {MAX_PHOTOS}</span></h2>
          {editable && photos.length < MAX_PHOTOS && (
            <label className="pill cursor-pointer">
              + Přidat fotky
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  if (e.target.files?.length) upload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
        {photos.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Přidejte alespoň jednu fotku; první bude hlavní. Fotky před nahráním zmenšíme a odstraníme z nich údaje o poloze.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((p, i) => (
              <li key={p.key} className="space-y-1">
                <img src={photoUrl(p.key)} alt={`Fotka ${i + 1}`} width={p.width} height={p.height} className="w-full aspect-[4/3] object-cover rounded-[10px] bg-[var(--color-photo)]" loading="lazy" />
                <div className="flex items-center gap-1 text-xs">
                  {i === 0 ? <span className="chip">hlavní</span> : <span className="text-[var(--color-muted)]">{i + 1}.</span>}
                  {editable && (
                    <span className="ml-auto flex gap-1">
                      <button type="button" className="pill !px-2" disabled={busy || i === 0} aria-label="Posunout dopředu" onClick={() => move(i, -1)}>←</button>
                      <button type="button" className="pill !px-2" disabled={busy || i === photos.length - 1} aria-label="Posunout dozadu" onClick={() => move(i, 1)}>→</button>
                      <button
                        type="button"
                        className="pill !px-2"
                        disabled={busy}
                        aria-label="Smazat fotku"
                        onClick={() =>
                          run(async () => {
                            const problem = await call(`${base}fotky/?klic=${encodeURIComponent(p.key)}`, "DELETE");
                            if (!problem) setPhotos((current) => current.filter((x) => x.key !== p.key));
                            return problem;
                          })
                        }
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {progress && <p className="text-sm text-[var(--color-muted)]" role="status">{progress}</p>}
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Údaje o voze</h2>
          {editable && (
            <button
              type="button"
              className="pill"
              onClick={() => {
                draftStore.write({ ...listing.data, serverId: listing.id });
                router.push("/pridat/");
              }}
            >
              Upravit údaje
            </button>
          )}
        </div>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          {specs.map(([k, v]) => (
            <div key={k} className="contents"><dt className="text-[var(--color-muted)]">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
        </dl>
        {d.description && <p className="mt-3 text-sm text-[var(--color-muted)] whitespace-pre-line">{d.description}</p>}
      </section>

      <section className="card p-4">
        <h2 className="font-bold">Kontakt</h2>
        <p className="text-sm text-[var(--color-muted)]">Telefon se zobrazí v inzerátu. E-mail kupujícím neukazujeme.</p>
        <form
          className="mt-2 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => call(base, "PATCH", { phone, messengers: phone.trim() ? MESSENGERS.filter((m) => messengers.includes(m)) : [] }), "Kontakt uložen.");
          }}
        >
          <input className="input w-auto" type="tel" autoComplete="tel" placeholder="+420 123 456 789" value={phone} disabled={!editable} onChange={(e) => setPhone(e.target.value)} aria-label="Telefon" />
          <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" disabled={!editable || !phone.trim()}>
            <legend className="sr-only">Komunikátory na tomto čísle</legend>
            <span className="text-[var(--color-muted)]">Na tomto čísle také:</span>
            {MESSENGERS.map((m) => (
              <label key={m} className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={messengers.includes(m)}
                  onChange={(e) => setMessengers((current) => (e.target.checked ? [...current, m] : current.filter((x) => x !== m)))}
                />
                {MESSENGER_LABEL[m]}
              </label>
            ))}
          </fieldset>
          {editable && <button type="submit" className="pill" disabled={busy || !contactChanged}>Uložit</button>}
        </form>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {(listing.status === "draft" || listing.status === "rejected") && (
          <button type="button" className="btn-cta disabled:opacity-60" disabled={busy || photos.length === 0} onClick={() => run(() => call(`${base}stav/`, "POST", { action: "submit" }))}>
            Zveřejnit inzerát
          </button>
        )}
        {listing.status === "pending" && (
          <button type="button" className="pill" disabled={busy} onClick={() => run(() => call(`${base}stav/`, "POST", { action: "cancel" }))}>Vrátit do konceptu</button>
        )}
        {listing.status === "published" && <Link href={`/inzerat/${listing.id}/`} className="pill">Zobrazit inzerát</Link>}
        {(listing.status === "published" || listing.status === "pending") && (
          <button type="button" className="pill" disabled={busy} onClick={() => confirm("Stáhnout inzerát z webu? Znovu zveřejnit ho už nepůjde.") && run(() => call(`${base}stav/`, "POST", { action: "withdraw" }))}>
            Stáhnout z prodeje
          </button>
        )}
        <button
          type="button"
          className="ml-auto text-sm text-[var(--color-muted)] hover:text-[var(--color-bad)]"
          disabled={busy}
          onClick={async () => {
            if (!confirm("Smazat inzerát i s fotkami? Nejde to vrátit.")) return;
            setBusy(true);
            const problem = await call(base, "DELETE");
            setBusy(false);
            if (problem) setError(problem);
            else router.replace("/ucet/?sekce=inzeraty");
          }}
        >
          Smazat inzerát
        </button>
      </div>
      {photos.length === 0 && (listing.status === "draft" || listing.status === "rejected") && <p className="text-xs text-[var(--color-muted)]">Před zveřejněním přidejte alespoň jednu fotku.</p>}
      {error && <p role="alert" className="text-sm text-[var(--color-warn)]">{error}</p>}
      {notice && <p role="status" className="text-sm text-[var(--color-good)]">{notice}</p>}
    </div>
  );
}
