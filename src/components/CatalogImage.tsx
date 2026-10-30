import { CarImage } from "@/components/CarImage";
import { FrontDrawing, drawingPending } from "@/components/FrontDrawing";
import type { Body } from "@/lib/types";

// The picture of a model or generation in the catalogue: its approved front drawing, or a
// placeholder that says it is one. The placeholder is the generic body-type pictogram on the
// drawing's background, labelled "Ilustrační obrázek", so it is never taken for this car. Lines
// whose drawings are being checked (front-drawing-review.json) say so instead. Both keep the
// drawing's 16:10 box, so a drawing added later does not move the layout.

const PICTOGRAM: Record<string, Body> = { kupe: "hatchback", kabriolet: "hatchback", liftback: "hatchback", pickup: "suv", dodavka: "mpv" };

/** Pictogram for a catalogue body type ("kombi", "kupe"…). */
export const pictogramOf = (bodyType: string | undefined): Body => PICTOGRAM[bodyType ?? ""] ?? ((bodyType as Body) || "hatchback");

export function CatalogImage({ drawing, make, line, alt, bodyType, className = "", label = true, genIndex }: {
  /** drawing id from frontDrawingId / newestFrontDrawing, or null */
  drawing: string | null;
  make: string;
  line: string;
  /** what the drawing shows, e.g. "Adler Favorit 2U" */
  alt: string;
  /** catalogue body type for the placeholder pictogram */
  bodyType?: string;
  className?: string;
  /** small cards may hide the corner label; the accessible name still says it is illustrative */
  label?: boolean;
  /** the generation shown, so a drawing held for review just for it says so */
  genIndex?: number;
}) {
  if (drawing) return <FrontDrawing id={drawing} alt={alt} className={className} />;
  const pending = drawingPending(make, line, genIndex);
  return (
    <div
      role="img"
      aria-label={pending ? `${alt}: nákres se ověřuje` : "Ilustrační obrázek – nákres zatím není dostupný"}
      className={`relative w-full aspect-[16/10] overflow-hidden bg-[var(--color-blueprint)] ${className}`}
    >
      {pending ? (
        <span className="absolute inset-0 grid place-items-center text-sm text-[var(--color-blueprint-ink)] opacity-80">Nákres se ověřuje</span>
      ) : (
        <>
          <span aria-hidden="true" className="absolute inset-[12%_14%] opacity-35 grayscale">
            <CarImage body={pictogramOf(bodyType)} color="stříbrná" className="w-full h-full" />
          </span>
          {label && (
            <span aria-hidden="true" className="absolute left-2 bottom-2 rounded-md bg-black/35 px-1.5 py-0.5 text-[11px] text-white/85">
              Ilustrační obrázek
            </span>
          )}
        </>
      )}
    </div>
  );
}
