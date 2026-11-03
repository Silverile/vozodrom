"use client";

import { useEffect, useRef, useState } from "react";
import { toSiteDrawing } from "@/lib/drawing-format";

// A generation's front drawing in the catalogue editor. An image comes from a file, Ctrl+V or a
// drop; lib/drawing-format turns it into the site's format (white lines in alpha, the car at the
// same height on one ground line, 960×600), the admin sees the result as the site shows it and
// confirms, and the WebP goes to R2 (/api/admin/katalog/nakres). The editor then records it as the
// generation's drawing.

/** Longest side an input is scaled down to before converting, for speed. */
const MAX_INPUT = 2400;

async function readImage(blob: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_INPUT / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return ctx.getImageData(0, 0, w, h);
}

function toBlob(img: { width: number; height: number; data: Uint8ClampedArray }): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d")!.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b && b.type === "image/webp" ? b : null), "image/webp", 0.82));
}

/** The drawing as the site shows it: its alpha as a mask over the theme's line colour. */
export function DrawingPreview({ src, label }: { src: string; label: string }) {
  const mask = `url(${src}) center / contain no-repeat`;
  return (
    <div className="w-full max-w-sm aspect-[16/10] rounded-[10px] bg-[var(--color-blueprint)]" role="img" aria-label={label}>
      <div className="h-full w-full bg-[var(--color-blueprint-ink)]" style={{ mask, WebkitMask: mask }} />
    </div>
  );
}

export function DrawingField({
  makeSlug,
  lineSlug,
  current,
  title,
  heading = "Nákres zepředu",
  empty = "Generace zatím nákres nemá.",
  onUploaded,
  onRemove,
}: {
  makeSlug: string;
  lineSlug: string;
  current: string | null;
  title: string;
  heading?: string;
  empty?: string;
  onUploaded: (src: string) => void;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState<{ url: string; blob: Blob } | null>(null);
  const [state, setState] = useState<"" | "converting" | "uploading">("");
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview.url)), [preview]);

  async function take(blob: Blob | null | undefined) {
    if (!blob || !blob.type.startsWith("image/")) return setError("Vložte obrázek (PNG, JPEG nebo WebP).");
    setError("");
    setState("converting");
    try {
      const input = await readImage(blob);
      // let the "Převádím" state paint before the synchronous conversion
      await new Promise((r) => setTimeout(r, 20));
      const out = toSiteDrawing({ width: input.width, height: input.height, data: input.data });
      if (!out) throw new Error("Na obrázku se nepodařilo najít auto.");
      const webp = await toBlob(out);
      if (!webp) throw new Error("Tento prohlížeč neumí uložit WebP; použijte Chrome, Edge nebo Firefox.");
      setPreview({ url: URL.createObjectURL(webp), blob: webp });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Obrázek se nepodařilo převést.");
    } finally {
      setState("");
    }
  }

  async function upload() {
    if (!preview) return;
    setState("uploading");
    setError("");
    try {
      const r = await fetch(`/api/admin/katalog/nakres/?znacka=${makeSlug}&model=${lineSlug}`, { method: "POST", headers: { "content-type": "image/webp" }, body: preview.blob });
      const data = (await r.json().catch(() => ({}))) as { src?: string; error?: string };
      if (!r.ok || !data.src) return setError(data.error ?? "Nahrání se nepovedlo, zkuste to znovu.");
      setPreview(null);
      onUploaded(data.src);
    } catch {
      setError("Nahrání se nepovedlo (spojení), zkuste to znovu.");
    } finally {
      setState("");
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{heading}</p>
      <div className="flex flex-wrap items-start gap-3">
        {current ? <DrawingPreview src={current} label={`Současný nákres: ${title}`} /> : <p className="text-sm text-[var(--color-muted)]">{empty}</p>}
        {preview && (
          <div className="space-y-2">
            <DrawingPreview src={preview.url} label={`Nový nákres: ${title}`} />
            <p className="flex gap-2">
              <button type="button" className="btn-cta !py-1.5 text-sm" disabled={state !== ""} onClick={upload}>{state === "uploading" ? "Nahrávám…" : "Použít tento nákres"}</button>
              <button type="button" className="pill text-sm" onClick={() => setPreview(null)}>Zrušit</button>
            </p>
          </div>
        )}
      </div>
      <div
        ref={zone}
        tabIndex={0}
        aria-label="Pole pro nákres: klikněte sem a vložte obrázek Ctrl+V, nebo ho sem přetáhněte"
        className={`rounded-[10px] border-2 border-dashed p-4 text-center text-sm outline-none focus:border-[var(--color-brand)] ${over ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]" : "border-[var(--color-line)]"}`}
        onClick={() => zone.current?.focus()}
        onPaste={(e) => {
          const item = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"));
          if (item) {
            e.preventDefault();
            void take(item.getAsFile());
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void take(e.dataTransfer.files[0]);
        }}
      >
        {state === "converting" ? (
          "Převádím do formátu webu…"
        ) : (
          <>
            Přetáhněte sem obrázek, nebo sem klikněte a vložte ho Ctrl+V, nebo{" "}
            <button type="button" className="font-semibold text-[var(--color-brand)] underline" onClick={(e) => (e.stopPropagation(), file.current?.click())}>
              vyberte soubor
            </button>
            .
          </>
        )}
        <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => {
            void take(e.target.files?.[0]);
            e.target.value = ""; // the same file again fires change too
          }}
        />
      </div>
      <p className="text-xs text-[var(--color-muted)]">
        Nákres jako z ChatGPT (bílé čáry na tmavě modré, se středovou a zemní čárou) se převede sám: čáry do průhlednosti, auto na jednotnou výšku a zemní čáru.
      </p>
      {current && (
        <button type="button" className="text-sm text-[var(--color-warn)] hover:underline" onClick={onRemove}>Odebrat nákres</button>
      )}
      {error && <p role="alert" className="text-sm text-[var(--color-warn)]">{error}</p>}
    </div>
  );
}
