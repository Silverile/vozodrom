"use client";

import { useState } from "react";
import { photoUrl } from "@/lib/listing-status";

/** Seller photos with thumbnails and arrow-key navigation (user listings). */
export function PhotoGallery({ photos, title }: { photos: { key: string; width: number; height: number }[]; title: string }) {
  const [index, setIndex] = useState(0);
  const go = (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length);
  const current = photos[index];
  // The frame takes the first photo's shape (within 4:3 to 16:9), so a gallery of landscape shots has
  // no bars and the frame does not jump between photos.
  const first = photos[0];
  const aspect = Math.min(16 / 9, Math.max(4 / 3, first.width / first.height || 4 / 3));

  return (
    <div
      className="card overflow-hidden"
      role="region"
      aria-roledescription="galerie"
      aria-label={`Fotografie: ${title}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative bg-[var(--color-photo)]">
        <img src={photoUrl(current.key)} alt={`${title}, fotka ${index + 1} z ${photos.length}`} width={current.width} height={current.height} className="w-full object-contain" style={{ aspectRatio: aspect }} />
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Předchozí fotka" className="absolute left-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white">‹</button>
            <button type="button" onClick={() => go(1)} aria-label="Další fotka" className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white">›</button>
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{index + 1} / {photos.length}</span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto p-2">
          {photos.map((p, i) => (
            <li key={p.key} className="shrink-0">
              <button type="button" onClick={() => setIndex(i)} aria-label={`Fotka ${i + 1}`} aria-current={i === index} className="block rounded-[8px] overflow-hidden ring-2 ring-transparent aria-[current=true]:ring-[var(--color-brand)]">
                <img src={photoUrl(p.key)} alt="" className="h-14 aspect-[4/3] object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
