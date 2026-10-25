import logos from "@/data/brand-logos.json";

// Brand mark of a vehicle make (Simple Icons, CC0; logos are trademarks of their owners and
// identify the make only). Makes without a mark get a typographic badge of the same size.
// Server components only: the mark data stays out of client bundles.

const LOGOS = logos as Record<string, { title: string; path: string }>;

export const makeSlug = (name: string) =>
  name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function BrandLogo({ slug, name, className = "h-8 w-8" }: { slug: string; name: string; className?: string }) {
  const logo = LOGOS[slug];
  if (logo) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="currentColor" role="img" aria-label={`Logo ${name}`}>
        <path d={logo.path} />
      </svg>
    );
  }
  const letters = name.replace(/[^A-Za-zÀ-ž0-9]/g, "").slice(0, name.length > 3 ? 2 : 3).toUpperCase();
  return (
    <span
      className={`shrink-0 grid place-items-center rounded-full border border-current text-[0.6rem] font-extrabold tracking-tight opacity-80 ${className}`}
      aria-hidden="true"
    >
      {letters}
    </span>
  );
}
