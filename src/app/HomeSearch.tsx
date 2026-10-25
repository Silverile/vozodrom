"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Brand } from "@/lib/types";

interface ModelOption {
  slug: string;
  brandSlug: string;
  name: string;
}

export function HomeSearch({ brands, models }: { brands: Brand[]; models: ModelOption[] }) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("znacka", brand);
    if (model) params.set("model", model);
    if (maxPrice) params.set("cenaDo", maxPrice);
    const query = params.toString();
    router.push(`/inzeraty/${query ? `?${query}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] bg-[var(--color-surface)] p-2 rounded-2xl shadow-xl text-[var(--color-ink)]">
      <select className="input" value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); }} aria-label="Značka">
        <option value="">Všechny značky</option>
        {brands.map((b) => (
          <option key={b.slug} value={b.slug}>{b.name}</option>
        ))}
      </select>
      <select className="input" value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand} aria-label="Model">
        <option value="">Všechny modely</option>
        {models.filter((m) => m.brandSlug === brand).map((m) => (
          <option key={m.slug} value={m.slug}>{m.name}</option>
        ))}
      </select>
      <select className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Cena do">
        <option value="">Cena do</option>
        {[150000, 250000, 400000, 600000, 900000].map((p) => (
          <option key={p} value={p}>{new Intl.NumberFormat("cs-CZ").format(p)} Kč</option>
        ))}
      </select>
      <button className="rounded-xl bg-[var(--color-accent)] text-white font-semibold px-6 py-2.5 hover:opacity-90">Hledat</button>
    </form>
  );
}
