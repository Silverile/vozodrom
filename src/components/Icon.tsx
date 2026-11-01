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
