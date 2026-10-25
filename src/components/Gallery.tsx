"use client";

import { useState } from "react";
import type { Body } from "@/lib/types";
import { CarImage } from "./CarImage";

const VIEWS = [
  { label: "Bok vozu", icon: "" },
  { label: "Interiér", icon: "🪑" },
  { label: "Palubní deska a tachometr", icon: "⏱" },
  { label: "Zadní část a kufr", icon: "🧳" },
  { label: "Motorový prostor", icon: "⚙" },
];

/** Photo gallery with thumbnails and arrow-key navigation. The prototype has no real photos, only labelled placeholders. */
export function Gallery({ body, color, title }: { body: Body; color: string; title: string }) {
  const [index, setIndex] = useState(0);
  const go = (delta: number) => setIndex((i) => (i + delta + VIEWS.length) % VIEWS.length);
  const view = VIEWS[index];

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
      <div className="relative">
        {index === 0 ? (
          <CarImage body={body} color={color} className="w-full aspect-[16/10]" />
        ) : (
          <div className="w-full aspect-[16/10] grid place-items-center bg-[var(--color-photo)] text-center">
            <div>
              <div className="text-5xl" aria-hidden="true">{view.icon}</div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{view.label}<br />(v prototypu bez fotografií)</p>
            </div>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white" aria-live="polite">
          {index + 1} / {VIEWS.length} · {view.label}
        </span>
        <button onClick={() => go(-1)} aria-label="Předchozí fotografie" className="absolute left-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white hover:bg-black/75">‹</button>
        <button onClick={() => go(1)} aria-label="Další fotografie" className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white hover:bg-black/75">›</button>
      </div>
      <div className="grid grid-cols-5 gap-1 p-1">
        {VIEWS.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setIndex(i)}
            aria-label={`Fotografie ${i + 1}: ${v.label}`}
            aria-current={i === index}
            className={`aspect-[4/3] rounded-md bg-[var(--color-field)] grid place-items-center text-lg border-2 ${i === index ? "border-[var(--color-brand)]" : "border-transparent"}`}
          >
            {i === 0 ? <CarImage body={body} color={color} className="w-full h-full rounded-sm" /> : <span aria-hidden="true">{v.icon}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
