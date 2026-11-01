import type { ListingPhoto } from "@/db/schema";
import type { CarData } from "@/lib/garage";
import { carLine } from "@/lib/garage";
import { pictogramBody } from "@/lib/listing-catalog";
import { photoUrl } from "@/lib/listing-status";
import { CarImage } from "./CarImage";
import { FrontDrawing, frontDrawingFor } from "./FrontDrawing";

/** A garage car's picture: its first photo, else the catalogue's front drawing, else a pictogram. */
export function GarageCarImage({ car, photo, alt, className = "" }: { car: CarData; photo?: ListingPhoto | null; alt: string; className?: string }) {
  if (photo) {
    return <img src={photoUrl(photo.key)} alt={alt} width={photo.width} height={photo.height} className={`w-full aspect-[16/10] object-cover bg-[var(--color-photo)] ${className}`} loading="lazy" />;
  }
  const line = carLine(car);
  const drawing = line && car.year ? frontDrawingFor(car.brand, line.slug, car.year) : null;
  if (drawing) return <FrontDrawing id={drawing} alt={alt} className={className} />;
  return <CarImage body={pictogramBody(car.body)} color="" className={`w-full aspect-[16/10] ${className}`} />;
}
