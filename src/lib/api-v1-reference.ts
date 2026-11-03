import "server-only";
import { FUEL_LABEL, REGIONS } from "./catalog";
import { BODY_KEYS } from "./listing-catalog";
import { CAR_DRIVES, ENTRY_CATEGORIES, MAX_COMMENT, MAX_ENTRY_PHOTOS, MAX_GARAGE_PHOTOS, today } from "./garage";
import { EQUIPMENT, EQUIPMENT_GROUPS } from "./equipment";
import { CITIES } from "./geo";
import { listings } from "./listings";
import { RULES } from "./statement";
import { MESSENGER_LABEL, REPORT_CATEGORY_LABEL } from "./listing-status";
import { MAX_PHOTOS } from "./listing-store";
import { MAX_PHOTO_BYTES } from "./photo-store";
import { MAX_MESSAGE } from "./chat";
import { GARAGE_LIMITS as GARAGE, ENTRY_LIMITS as ENTRY, PHOTO_CLIENT_MAX_SIDE, PHOTO_SERVER_MAX_SIDE, CATALOG_REQUEST_MAX_BYTES } from "./form-constraints";
import { VEHICLE_TEXT_LIMITS as TEXT, LISTING_NUMBER_LIMITS as LISTING, LISTING_DESCRIPTION_MAX } from "./listing-draft";
import { ANONYMOUS_REPORT_CATEGORY } from "./reports";
import { MAX_OPS } from "./catalog-edit-store";
import { MAX_CATALOG_DRAWING_BYTES } from "./catalog-drawing-upload";
import type { FieldConstraintDto, ReferenceDataDto } from "./api-v1-contract";

const options = (values: Record<string, string>) => Object.entries(values).map(([value, label]) => ({ value, label }));
const text = (maxLength: number, minLength = 0): FieldConstraintDto => ({ maxLength, minLength, required: minLength > 0 });
const number = (min: number, max: number, required = true): FieldConstraintDto => ({ min, max, integer: true, required });
export async function referenceData(): Promise<ReferenceDataDto> {
  const year = new Date().getFullYear();
  const vehicleText = { brand: text(TEXT.brand, 1), model: text(TEXT.model, 1), generation: text(TEXT.generation), engine: text(TEXT.engine), color: text(TEXT.color), vin: { ...text(TEXT.vin), pattern: "^[A-HJ-NPR-Z0-9]{17}$" } };
  return {
    version: 1, currentYear: year,
    entryCategories: options(ENTRY_CATEGORIES), fuels: options(FUEL_LABEL), bodies: options(BODY_KEYS),
    transmissions: options({ "manuál": "Manuální", automat: "Automatická" }), drives: options(CAR_DRIVES),
    colors: { options: [...new Set(listings.map((l) => l.color))].sort((a, b) => a.localeCompare(b, "cs")).map((value) => ({ value, label: value })), allowCustom: true },
    regions: REGIONS.map((value) => ({ value, label: value })),
    cities: CITIES.map((city) => ({ value: city.slug, label: city.name, region: city.region, latitude: city.lat, longitude: city.lon })),
    equipmentGroups: [...EQUIPMENT_GROUPS], equipment: EQUIPMENT.map((e) => ({ key: e.key, label: e.label, group: e.group, aliases: [...(e.aliases ?? [])] })),
    moderationRules: options(RULES), reportCategories: options(REPORT_CATEGORY_LABEL).map((option) => ({ ...option, anonymousAllowed: option.value === ANONYMOUS_REPORT_CATEGORY })), messengers: options(MESSENGER_LABEL),
    limits: {
      listing: { ...vehicleText, engine: text(TEXT.engine, 1), year: number(LISTING.yearMin, year + 1), mileageKm: number(LISTING.mileageMin, LISTING.mileageMax),
        price: number(LISTING.priceMin, LISTING.priceMax), powerKw: number(LISTING.powerMin, LISTING.powerMax),
        description: text(LISTING_DESCRIPTION_MAX), fuel: { required: true }, body: { required: true }, transmission: { required: true }, region: { required: true }, city: { required: false },
        phone: { required: false, pattern: "^\\+?\\d{9,15}$" } },
      garage: { ...vehicleText, fuel: text(20), body: { required: false }, transmission: { required: false }, drive: { required: false },
        plateVisible: { required: false }, nickname: text(GARAGE.nickname), plate: text(GARAGE.plate), story: text(GARAGE.story),
        year: { ...number(GARAGE.yearMin, year + 1, false), allowZeroAsUnknown: true },
        purchaseYear: { ...number(GARAGE.yearMin, year, false), allowZeroAsUnknown: true }, powerKw: { ...number(GARAGE.powerMin, GARAGE.powerMax, false), allowZeroAsUnknown: true } },
      entry: { title: text(ENTRY.titleMax, ENTRY.titleMin), body: text(ENTRY.body), category: { required: true, maxLength: 20 },
        costCzk: { ...number(0, ENTRY.costMax, false), nullable: true }, mileageKm: { ...number(0, ENTRY.mileageMax, false), nullable: true }, happenedOn: { required: true, pattern: "^\\d{4}-\\d{2}-\\d{2}$" } },
      comment: text(MAX_COMMENT, 2), message: text(MAX_MESSAGE, 1),
      listingReport: { explanation: text(3000, 20), name: text(120, 1), email: text(200, 1), category: { required: true }, goodFaith: { required: true, mustBeTrue: true } },
      communityReport: { reason: text(1000, 10), goodFaithRequired: true },
      moderation: { listingReason: text(1000, 1), communityReason: text(500, 5), ruleRequiredForRestriction: true },
      photos: { maxBytes: MAX_PHOTO_BYTES, clientMaxSide: PHOTO_CLIENT_MAX_SIDE, serverMaxSide: PHOTO_SERVER_MAX_SIDE,
        listingMaxCount: MAX_PHOTOS, garageMaxCount: MAX_GARAGE_PHOTOS, entryMaxCount: MAX_ENTRY_PHOTOS, listingMinToPublish: 1, mimeTypes: ["image/jpeg", "image/webp"] },
      catalog: { maxOperationsPerSave: MAX_OPS, maxRequestBytes: CATALOG_REQUEST_MAX_BYTES, drawingMaxBytes: MAX_CATALOG_DRAWING_BYTES, drawingWidth: 960, drawingHeight: 600, drawingMimeType: "image/webp" },
      dates: { entryMin: "1900-01-01", entryMax: today() },
    },
  };
}
