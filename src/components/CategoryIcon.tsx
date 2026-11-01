import { CATEGORY_PATHS, type CategoryPathName } from "./category-icon-paths";

// Pictograms for the non-car categories, parts and article covers, from the project's icon sheet.
// Each is centred in the same 64×42 box, so callers size them by width as before. Fill follows the
// text colour, so the icons work in both themes.

const SLUG_ICON: Record<string, CategoryPathName> = {
  // utility vehicles and machinery
  dodavky: "van-commercial",
  nakladni: "truck",
  tahace: "tractor-unit",
  autobusy: "bus",
  zemedelska: "farm-tractor",
  stavebni: "excavator",
  privesy: "trailer",
  // motorcycles
  motocykly: "naked",
  skutry: "scooter",
  ctyrkolky: "atv",
  // parts
  motor: "engine",
  podvozek: "brakes",
  karoserie: "bodywork",
  elektro: "electrics",
  interier: "interior",
  kola: "wheelset",
  letni: "summer-tyres",
  zimni: "winter-tyres",
  celorocni: "tyre",
  // article covers
  urad: "historic-maker",
  dokument: "docs",
  lupa: "search",
  baterie: "battery",
};

/** The sheet has no riding gear, so the helmet keeps its own outline drawing. */
const HELMET = (
  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
    <path d="M8 34 Q8 8 32 8 Q56 8 56 27 V34 Z" style={{ fill: "var(--color-brand-soft)" }} />
    <path d="M30 16 H54 V26 H34 Q30 26 30 22 Z" />
  </g>
);

export function CategoryIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const name = SLUG_ICON[slug];
  const icon = name && CATEGORY_PATHS[name];
  return (
    <svg viewBox="0 0 64 42" className={className} aria-hidden="true" fill="currentColor">
      {icon ? (
        <svg viewBox={`0 0 ${icon.w} ${icon.h}`} width="64" height="42">
          <path d={icon.d} fillRule="evenodd" />
        </svg>
      ) : slug === "vybava" ? HELMET : null}
    </svg>
  );
}
