import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import type { ListingPhoto } from "@/db/schema";
import { PHOTO_SERVER_MAX_SIDE } from "./form-constraints";
import { ListingError } from "./listing-store";

// Photos in R2 (listings, garage cars, logbook entries): resized in the browser, checked here by
// their first bytes and size, stored under a random key that is never reused.

export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

/** Detects the real image type from the first bytes; the browser always sends JPEG or WebP. */
function imageType(bytes: Uint8Array): "image/jpeg" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

/** Checks and stores one photo under `<folder>/<random>.<ext>`; folder is e.g. "garaz/c-abc". */
export async function storePhoto(folder: string, body: ArrayBuffer, width: number, height: number): Promise<ListingPhoto> {
  if (body.byteLength === 0 || body.byteLength > MAX_PHOTO_BYTES) throw new ListingError(413, "Fotka je příliš velká.");
  const type = imageType(new Uint8Array(body, 0, Math.min(12, body.byteLength)));
  if (!type) throw new ListingError(415, "Nahrajte fotku ve formátu JPEG nebo WebP.");
  if (!(width > 0 && width <= PHOTO_SERVER_MAX_SIDE && height > 0 && height <= PHOTO_SERVER_MAX_SIDE)) throw new ListingError(400, "Neplatné rozměry fotky.");
  const photo: ListingPhoto = { key: `${folder}/${generateRandomString(16, "a-z", "0-9")}.${type === "image/webp" ? "webp" : "jpg"}`, width, height };
  await getCloudflareContext().env.PHOTOS.put(photo.key, body, { httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" } });
  return photo;
}

export async function deletePhotos(keys: string[]) {
  if (keys.length) await getCloudflareContext().env.PHOTOS.delete(keys);
}
