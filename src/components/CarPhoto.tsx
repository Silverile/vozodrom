import { type CardPhoto, thumb } from "@/lib/modelCards";

// A model photo in a fixed 16:10 frame with no empty bars. Photos between 1.3:1 and 1.75:1 fill the
// frame (cropping at most ~4 % per side; photos are chosen with a margin around the whole car).
// Others are fitted whole over a blurred copy of themselves, so the frame still looks filled.

export function CarPhoto({ photo, alt, width = 500, eager = false, className = "" }: { photo: CardPhoto; alt: string; width?: number; eager?: boolean; className?: string }) {
  const src = thumb(photo.url, width);
  const fills = photo.aspect != null && photo.aspect >= 1.44 && photo.aspect <= 1.75; // cover crops at most ~5% per edge
  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden bg-[var(--color-photo)] ${className}`}>
      {!fills && <img src={src} alt="" aria-hidden loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60" />}
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} className={`relative w-full h-full ${fills ? "object-cover" : "object-contain"}`} />
    </div>
  );
}
