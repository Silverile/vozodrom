import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { applyOps, type Applied, type EditRow } from "./catalog-ops";
import { loadCard } from "./card-store";
import { builtLine } from "./catalog-built";
import drawings from "@/data/front-drawings.json";
import held from "@/data/front-drawing-review.json";
import { ApiError } from "./api-v1-http";
import type { CatalogPublicationDto } from "./api-v1-contract";

const SOURCES = drawings as unknown as Record<string, [number, number | null, number | null][]>;
/** Projection of the served card plus the operation effects kept outside its JSON (drawings/origins).
 * Used as publication evidence only; it never mutates the public catalog or marks a workflow successful.
 */
export function artifactProjection(make: string, line: string, applied: Applied) {
  const key = `${make}--${line}`, originals = new Set((SOURCES[key] ?? []).map(([index]) => index));
  const front: [number, number | null, number | null, string][] = [];
  const facelifts: [number, number | null, number | null, string][] = [];
  applied.card.generations.forEach((g, index) => {
    const override = applied.drawings[index], origin = applied.origins[index];
    const src = typeof override === "string" ? override : override === undefined && origin !== null && originals.has(origin) && !(key in held) && !(`${key}--${origin}` in held) ? `/front/${key}--${origin}.webp` : null;
    if (src) front.push([index, g.from ?? null, g.current ? null : g.to ?? null, src]);
    const stages = [...(g.facelifts ?? [])].sort((a, b) => a.year - b.year);
    stages.forEach((stage, n) => {
      if (typeof stage.drawing !== "string" || !/^\/foto\/katalog\/[a-z0-9-]+\.webp$/.test(stage.drawing)) return;
      facelifts.push([index, stage.year ?? null, stage.to ?? (n === stages.length - 1 ? (g.current ? null : g.to ?? null) : stages[n + 1].year), stage.drawing]);
    });
  });
  return { card: applied.card, origins: applied.origins, drawings: front, faceliftDrawings: facelifts };
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((v) => canonical(v ?? null)).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
export async function fingerprint(value: unknown) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical(value)));
  return [...new Uint8Array(digest)].map((n) => n.toString(16).padStart(2, "0")).join("");
}
export const editRevision = (rows: EditRow[]) => fingerprint(rows);
export async function servedFingerprint(make: string, line: string): Promise<string | null> {
  const card = await loadCard(make, line);
  if (!card) return null;
  const built = builtLine(make, line), fallback = artifactProjection(make, line, applyOps(card, []));
  return fingerprint(built ? { card, origins: built.origins, drawings: built.drawings, faceliftDrawings: built.faceliftDrawings ?? [] } : fallback);
}
export interface PublicationTarget { make: string; line: string; revision: string; fingerprint: string }
export interface PublicationRecord { version: 1; id: string; requestedAt: string; dispatchAccepted: boolean | null; targets: PublicationTarget[] }
const privateKey = (id: string) => `internal/catalog-publications/${id}.json`;
export function publicationRecord(targets: PublicationTarget[]): PublicationRecord {
  return { version: 1, id: `p-${generateRandomString(24, "a-z", "0-9")}`, requestedAt: new Date().toISOString(), dispatchAccepted: null, targets };
}
export async function storePublication(record: PublicationRecord) {
  await getCloudflareContext().env.PHOTOS.put(privateKey(record.id), JSON.stringify(record), { httpMetadata: { contentType: "application/json", cacheControl: "no-store" } });
}
export async function readPublication(id: string): Promise<PublicationRecord> {
  if (!/^p-[a-z0-9]{24}$/.test(id)) throw new ApiError(404, "not_found", "Publikace nenalezena.");
  const object = await getCloudflareContext().env.PHOTOS.get(privateKey(id));
  if (!object) throw new ApiError(404, "not_found", "Publikace nenalezena.");
  return object.json<PublicationRecord>();
}
export function publicationDto(record: PublicationRecord, published: boolean, superseded: boolean, trackingAvailable = true): CatalogPublicationDto {
  return { id: record.id, state: published ? "published" : record.dispatchAccepted === true ? "publication_requested" : "saved",
    dispatchAccepted: record.dispatchAccepted, deploymentSucceeded: null, evidence: published ? "served_assets_match" : null,
    requestedAt: record.requestedAt, trackingAvailable, superseded, conflicts: [] };
}
