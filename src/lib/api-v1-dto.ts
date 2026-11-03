import type { Listing } from "./types";
import type { ListingPhoto } from "@/db/schema";
import { getMake, modelLinesOf, type Make, type ModelLine } from "./makes";
import type { ListingDto, MakeDto, ModelLineDto, PhotoDto } from "./api-v1-contract";
import logoFiles from "@/data/brand-logo-files.json";

export const photoDto = (photo: ListingPhoto): PhotoDto => ({ url: `/foto/${photo.key}`, width: photo.width, height: photo.height });
export const makeDto = (make: Make): MakeDto => ({ slug: make.slug, name: make.name, country: make.country, logoUrl: (logoFiles as Record<string, { file: string }>)[make.slug]?.file ?? null });
export const lineDto = (line: ModelLine): ModelLineDto => ({ slug: line.slug, name: line.name, from: line.from, to: line.to, current: line.current, bodyTypes: [...line.bodyTypes] });
export function listingDto(item: Listing): ListingDto {
  const brand = getMake(item.brandSlug)?.name ?? item.brandSlug;
  const model = modelLinesOf(item.brandSlug).find((l) => l.slug === item.modelSlug)?.name ?? item.modelSlug;
  return {
    id: item.id, title: `${brand} ${model}`, brandSlug: item.brandSlug, modelSlug: item.modelSlug,
    generation: item.generation, year: item.year, mileageKm: item.mileageKm, price: item.price,
    engine: item.engine, fuel: item.fuel, transmission: item.transmission, powerKw: item.powerKw,
    body: item.body, color: item.color, region: item.region, city: item.city,
    sellerType: item.sellerType, sellerName: item.sellerName, vin: item.vin, postedAt: item.postedAt,
    features: [...item.features], description: item.description, photos: (item.photos ?? []).map(photoDto),
    stkHistory: item.stkHistory.map((r) => ({ date: r.date, odometerKm: r.odometerKm, result: r.result })),
    battery: item.battery ? { capacityKwh: item.battery.capacityKwh, sohPercent: item.battery.sohPercent, testedAt: item.battery.testedAt, testMethod: item.battery.testMethod, warrantyUntil: item.battery.warrantyUntil } : null,
  };
}
