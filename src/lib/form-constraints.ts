// Shared by web validation and the mobile reference-data endpoint. No server/runtime imports.
export const GARAGE_LIMITS = { yearMin: 1900, nickname: 60, plate: 12, story: 25_000, powerMin: 1, powerMax: 1500, photos: 20 } as const;
export const ENTRY_LIMITS = { titleMin: 3, titleMax: 120, body: 25_000, costMax: 100_000_000, mileageMax: 3_000_000, photos: 20 } as const;
export const PHOTO_CLIENT_MAX_SIDE = 1920;
export const PHOTO_SERVER_MAX_SIDE = 4096;
export const CATALOG_REQUEST_MAX_BYTES = 1024 * 1024;
