"use client";

import { shortlist, toggleShortlist } from "@/lib/storage";

export function FavoriteButton({ id, label, className = "" }: { id: string; label: string; className?: string }) {
  const saved = shortlist.useValue().includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleShortlist(id)}
      aria-pressed={saved}
      aria-label={saved ? `Odebrat ${label} z výběru` : `Přidat ${label} do výběru`}
      title={saved ? "Odebrat z výběru" : "Přidat do výběru a porovnání"}
      className={`grid h-9 w-9 place-items-center rounded-full border text-lg transition-colors ${
        saved
          ? "border-transparent bg-[var(--color-brand)] text-[var(--color-brand-ink)]"
          : "border-[var(--color-line)] bg-[var(--color-field)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      } ${className}`}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}
