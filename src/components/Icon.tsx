import { ICON_PATHS, type IconName } from "./icon-paths";

/** An interface icon from the project's icon sheet, one text line high, in the text colour. */
export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const { w, h, d } = ICON_PATHS[name];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`inline-block h-[1.25em] w-auto align-[-0.3em] ${className}`} aria-hidden="true" fill="currentColor">
      <path d={d} fillRule="evenodd" />
    </svg>
  );
}

/** Line glyphs the icon sheet does not have (menu, person), drawn to match its stroke. */
export function LineGlyph({ name, className = "" }: { name: "menu" | "person"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`inline-block h-[1.25em] w-auto align-[-0.3em] ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {name === "menu" ? <path d="M4 7h16M4 12h16M4 17h16" /> : <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5" />}
    </svg>
  );
}
