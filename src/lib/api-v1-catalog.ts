import "server-only";
import { asc, count, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { catalogEdit } from "@/db/schema";
import BUILT from "@/data/catalog-built.json";
import { editorState, saveOps, deleteOp, publishEdits, MAX_OPS } from "./catalog-edit-store";
import { applyOps, rowToOp, type EditRow, type StoredOp } from "./catalog-ops";
import { artifactProjection, editRevision, fingerprint, servedFingerprint, publicationRecord, storePublication, readPublication, publicationDto, type PublicationTarget } from "./catalog-publication";
import { ApiError, readJson, staffSession } from "./api-v1-http";
import { uploadCatalogDrawing } from "./catalog-drawing-upload";
import type { CatalogEditDto, CatalogEditLineDto, CatalogEditorDto, CatalogPublicationDto } from "./api-v1-contract";
import type { Session } from "./auth";
import { CATALOG_REQUEST_MAX_BYTES } from "./form-constraints";

function editDto(row: EditRow): CatalogEditDto {
  return { id: row.id ?? "", makeSlug: row.makeSlug, lineSlug: row.lineSlug, genIndex: row.genIndex, field: row.field, value: row.value, createdAt: row.createdAt ?? "" };
}
async function inspectLine(session: Session, make: string, line: string) {
  const { base, rows } = await editorState(session, make, line);
  const ops: StoredOp[] = [], invalid: { id: string; reason: string }[] = [];
  rows.forEach((row, index) => {
    const op = rowToOp(row, index);
    if (op) ops.push(op); else invalid.push({ id: row.id, reason: "Neplatná uložená operace." });
  });
  const applied = applyOps(base, ops), conflicts = [...invalid, ...applied.conflicts];
  return { base, rows, applied, conflicts, revision: await editRevision(rows), expected: await fingerprint(artifactProjection(make, line, applied)) };
}
export async function catalogEditor(request: Request, make: string, line: string): Promise<CatalogEditorDto> {
  const state = await inspectLine(await staffSession(request, true), make, line);
  const published = !state.conflicts.length && state.expected === await servedFingerprint(make, line);
  const projection = artifactProjection(make, line, state.applied);
  return { base: state.base, preview: state.applied.card, rows: state.rows.map(editDto), conflicts: state.conflicts,
    publicationState: published ? "published" : "saved", publishedEvidence: published ? "served_assets_match" : null, maxOperationsPerSave: MAX_OPS,
    maxRequestBytes: CATALOG_REQUEST_MAX_BYTES, origins: state.applied.origins, generationTokens: state.applied.tokens,
    previewDrawings: state.applied.card.generations.map((_, index) => ({ index, src: projection.drawings.find(([i]) => i === index)?.[3] ?? null, overridden: state.applied.drawings[index] !== undefined })) };
}
export async function saveCatalogOperations(request: Request, make: string, line: string) {
  const session = await staffSession(request, true), body = await readJson(request, CATALOG_REQUEST_MAX_BYTES);
  const rows = await saveOps(session, make, line, body.ops);
  return { rows: rows.map(editDto), state: "saved" as const };
}
export async function deleteCatalogOperation(request: Request, id: string) {
  await deleteOp(await staffSession(request, true), id); return { ok: true as const };
}
export async function catalogOverview(request: Request): Promise<{ items: CatalogEditLineDto[] }> {
  await staffSession(request, true);
  const rows = await getDb().select({ makeSlug: catalogEdit.makeSlug, lineSlug: catalogEdit.lineSlug, operationCount: count(),
    lastSavedAt: sql<string>`max(${catalogEdit.createdAt})::text` }).from(catalogEdit).groupBy(catalogEdit.makeSlug, catalogEdit.lineSlug)
    .orderBy(asc(catalogEdit.makeSlug), asc(catalogEdit.lineSlug));
  const lines = new Map<string, CatalogEditLineDto>(rows.map((row) => [`${row.makeSlug}--${row.lineSlug}`, { ...row, lastSavedAt: row.lastSavedAt ? new Date(row.lastSavedAt).toISOString() : null }]));
  // Include lines whose last stored operation was deleted: reverting a published edit also needs a build.
  for (const key of Object.keys(BUILT.lines)) {
    if (!lines.has(key)) { const [makeSlug, lineSlug] = key.split("--"); lines.set(key, { makeSlug, lineSlug, operationCount: 0, lastSavedAt: null }); }
  }
  return { items: [...lines.values()] };
}
export const catalogDrawing = uploadCatalogDrawing;

/** Persist only hashes and model identities in a private R2 namespace, never admin identity or credentials. */
export async function requestCatalogPublication(request: Request): Promise<CatalogPublicationDto> {
  const session = await staffSession(request, true), body = await readJson(request);
  let keys: { makeSlug: string; lineSlug: string }[];
  if (body.makeSlug !== undefined || body.lineSlug !== undefined) {
    if (typeof body.makeSlug !== "string" || typeof body.lineSlug !== "string") throw new ApiError(400, "invalid_model", "Vyberte model.");
    keys = [{ makeSlug: body.makeSlug, lineSlug: body.lineSlug }];
  } else keys = (await catalogOverview(request)).items;
  if (!keys.length) throw new ApiError(409, "no_changes", "Nejsou uložené úpravy k publikaci.");
  const targets: PublicationTarget[] = [];
  for (const { makeSlug, lineSlug } of keys) {
    const state = await inspectLine(session, makeSlug, lineSlug);
    if (state.conflicts.length) throw new ApiError(409, "catalog_conflicts", "Před publikací vyřešte konflikty uložených úprav.");
    targets.push({ make: makeSlug, line: lineSlug, revision: state.revision, fingerprint: state.expected });
  }
  const record = publicationRecord(targets);
  // Save the tracking record before dispatch: an unavailable store cannot accidentally start an untracked deployment.
  await storePublication(record);
  try { await publishEdits(session); }
  catch (error) {
    record.dispatchAccepted = false;
    await storePublication(record).catch(() => {});
    throw error;
  }
  record.dispatchAccepted = true;
  let tracked = true;
  await storePublication(record).catch(() => { tracked = false; });
  // A storage failure after GitHub accepted dispatch must not be reported as a failed dispatch (and retried).
  return publicationDto(record, false, false, tracked);
}
export async function catalogPublicationStatus(request: Request, id: string): Promise<CatalogPublicationDto> {
  const session = await staffSession(request, true), record = await readPublication(id);
  let published = true, superseded = false;
  const conflicts: CatalogPublicationDto["conflicts"] = [];
  for (const target of record.targets) {
    if (await servedFingerprint(target.make, target.line) !== target.fingerprint) published = false;
    const state = await inspectLine(session, target.make, target.line);
    if (state.revision !== target.revision) superseded = true;
    for (const conflict of state.conflicts) conflicts.push({ makeSlug: target.make, lineSlug: target.line, reason: conflict.reason });
  }
  return { ...publicationDto(record, published, superseded), conflicts };
}
