import files from "@/data/brand-logo-files.json";
import logos from "@/data/brand-logos.json";
import { asset } from "@/lib/format";

// One-colour brand mark of a vehicle make, drawn in the current text colour so it fits both
// themes. Sources: Simple Icons (CC0) paths, and public-domain files from Wikimedia Commons for
// makes Simple Icons lacks (src/data/brand-logo-files.json; one-colour versions in
// public/logos/mono/, made by scripts/mono-logos.mjs). Logos are trademarks of their owners and
// identify the make only. Makes without a mark get a letter badge of the same height.
// Server components only: the mark data stays out of client bundles.

const PATHS = logos as Record<string, { title: string; path: string }>;
const FILES = files as Record<string, { file: string; aspect: number; source: string }>;

/** `square` keeps wide wordmarks inside a size×size box, for aligned lists. */
export function BrandLogo({ slug, name, size = 32, square = false }: { slug: string; name: string; size?: number; square?: boolean }) {
  const path = PATHS[slug];
  const file = FILES[slug];

  if (path) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className="shrink-0" fill="currentColor" role="img" aria-label={`Logo ${name}`}>
        <path d={path.path} />
      </svg>
    );
  }
  if (file) {
    const mask = `url(${asset(file.file.replace("/logos/", "/logos/mono/"))}) center / contain no-repeat`;
    return (
      <span
        className="shrink-0 inline-block bg-current"
        style={{ width: square ? size : Math.round(size * Math.min(file.aspect, 2.4)), height: size, mask, WebkitMask: mask }}
        role="img"
        aria-label={`Logo ${name}`}
      />
    );
  }
  const letters = name.replace(/[^A-Za-zÀ-ž0-9]/g, "").slice(0, name.length > 3 ? 2 : 3).toUpperCase();
  return (
    <span
      className="shrink-0 inline-grid place-items-center rounded-full bg-[var(--color-field)] text-[var(--color-muted)] font-extrabold tracking-tight"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {letters}
    </span>
  );
}

/** Wordmarks wider than about 2:1 read better unsquared, in a wider box. */
export function isWide(slug: string): boolean {
  return !PATHS[slug] && (FILES[slug]?.aspect ?? 1) > 2;
}
