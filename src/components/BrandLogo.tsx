import files from "@/data/brand-logo-files.json";
import logos from "@/data/brand-logos.json";
import { asset } from "@/lib/format";

// Brand mark of a vehicle make on a small white tile, so coloured marks read in both themes.
// Sources: Simple Icons (CC0) paths, and public-domain files from Wikimedia Commons for makes
// Simple Icons lacks (src/data/brand-logo-files.json). Logos are trademarks of their owners and
// identify the make only. Makes without a mark get a letter badge of the same height.
// Server components only: the mark data stays out of client bundles.

const PATHS = logos as Record<string, { title: string; path: string }>;
const FILES = files as Record<string, { file: string; aspect: number; source: string }>;

export function BrandLogo({ slug, name, size = 32 }: { slug: string; name: string; size?: number }) {
  const path = PATHS[slug];
  const file = FILES[slug];
  const tile = "shrink-0 inline-grid place-items-center rounded-[22%] bg-white";
  const pad = Math.max(2, Math.round(size * 0.14));

  if (path) {
    return (
      <span className={tile} style={{ width: size, height: size, padding: pad }} role="img" aria-label={`Logo ${name}`}>
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="#16191d" aria-hidden="true">
          <path d={path.path} />
        </svg>
      </span>
    );
  }
  if (file) {
    return (
      <span className={tile} style={{ width: Math.round(size * Math.min(file.aspect, 2.4)), height: size, padding: pad }}>
        <img src={asset(file.file)} alt={`Logo ${name}`} className="max-h-full max-w-full" loading="lazy" />
      </span>
    );
  }
  const letters = name.replace(/[^A-Za-zÀ-ž0-9]/g, "").slice(0, name.length > 3 ? 2 : 3).toUpperCase();
  return (
    <span
      className="shrink-0 inline-grid place-items-center rounded-[22%] bg-[var(--color-field)] text-[var(--color-muted)] font-extrabold tracking-tight"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {letters}
    </span>
  );
}
