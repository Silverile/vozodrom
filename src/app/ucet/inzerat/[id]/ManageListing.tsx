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
import { PhotoManager } from "@/components/PhotoManager";
import { equipmentLabels } from "@/lib/equipment";
import { MESSENGERS, MESSENGER_LABEL, type Messenger, STATUS_LABEL, STATUS_STYLE } from "@/lib/listing-status";
import { draftStore } from "../../../pridat/AddListingForm";

interface Props {
  listing: { id: string; title: string; status: ListingStatus; data: Draft; photos: ListingPhoto[]; phone: string; messengers: Messenger[]; rejectReason: string | null; wasPublished: boolean };
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
    ["Výbava", equipmentLabels(d.features).join(", ") || "neuvedena"],
  ];

  return (
    <div className="space-y-5">
      <Link href="/ucet/?sekce=inzeraty" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">← Moje inzeráty</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{listing.title}</h1>
        <span className={`chip ${STATUS_STYLE[listing.status]}`}>{STATUS_LABEL[listing.status]}</span>
      </div>

      {listing.status === "rejected" && listing.rejectReason && (
        <p className="card p-4 text-sm">
          <strong>Inzerát {listing.wasPublished ? "jsme stáhli z webu" : "jsme nezveřejnili"}.</strong> Důvod: {listing.rejectReason}
          <br />
          <span className="text-[var(--color-muted)]">
            Rozhodl moderátor{listing.wasPublished ? " po kontrole nebo hlášení uživatelů" : ""}. Upravte inzerát a odešlete ho znovu, případně vysvětlete
            situaci v popisu; obrátit se můžete také na soud.
          </span>
        </p>
      )}
      {listing.status === "pending" && <p className="card p-4 text-sm text-[var(--color-muted)]">Automatická kontrola našla v inzerátu něco, na co se musí podívat moderátor. Výsledek uvidíte tady a v Moje inzeráty.</p>}
      {live && editable && <p className="text-xs text-[var(--color-muted)]">Změněné údaje znovu projdou automatickou kontrolou.</p>}

      <section className="card p-4 space-y-3">
        <h2 className="font-bold">Fotky</h2>
        <PhotoManager listingId={listing.id} photos={photos} editable={editable} onChange={setPhotos} />
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
