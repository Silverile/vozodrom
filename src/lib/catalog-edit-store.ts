import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { catalogEdit } from "@/db/schema";
import { type Session, hasRole } from "./auth";
import { CATALOG_EDIT_FIELDS, type CatalogEdit, isEditField } from "./catalog-edits";
import { ListingError } from "./listing-store";
import { modelLinesOf } from "./makes";

// Catalogue edits in the database: admins save them here (each save is kept, the newest per field
// wins), the public list feeds the next build, and "Publikovat" starts that build on GitHub.
// Deliberately without lib/modelCards: the model cards (~20 MB) would be bundled once more for
// these routes and push the Worker over its size limit.

const REPOSITORY = "Silverile/vozodrom";
const WORKFLOW = "deploy-cloudflare.yml";

/** Newest edit per line, generation and field; the order of the table is the history. */
function newest(rows: (typeof catalogEdit.$inferSelect)[]): CatalogEdit[] {
  const seen = new Map<string, CatalogEdit>();
  for (const r of rows) {
    const key = `${r.makeSlug}/${r.lineSlug}/${r.genIndex ?? "-"}/${r.field}`;
    if (!seen.has(key) && isEditField(r.field)) seen.set(key, { makeSlug: r.makeSlug, lineSlug: r.lineSlug, genIndex: r.genIndex, field: r.field, value: r.value });
  }
  return [...seen.values()];
}

/** All current edits, for the build (GET /api/katalog/opravy/). */
export async function currentEdits(): Promise<CatalogEdit[]> {
  return newest(await getDb().select().from(catalogEdit).orderBy(desc(catalogEdit.createdAt)));
}

/** Current edits of one model line, for the admin form (newer than what the pages were built with). */
export async function editsOf(makeSlug: string, lineSlug: string): Promise<CatalogEdit[]> {
  return newest(
    await getDb()
      .select()
      .from(catalogEdit)
      .where(and(eq(catalogEdit.makeSlug, makeSlug), eq(catalogEdit.lineSlug, lineSlug)))
      .orderBy(desc(catalogEdit.createdAt)),
  );
}

export async function saveEdit(session: Session, input: unknown) {
  if (!hasRole(session, ["admin"])) throw new ListingError(403, "Jen pro administrátory.");
  const b = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const field = typeof b.field === "string" && isEditField(b.field) ? b.field : null;
  const makeSlug = typeof b.makeSlug === "string" ? b.makeSlug : "";
  const lineSlug = typeof b.lineSlug === "string" ? b.lineSlug : "";
  const genIndex = typeof b.genIndex === "number" && Number.isInteger(b.genIndex) ? b.genIndex : null;
  const value = typeof b.value === "string" ? b.value.trim().slice(0, 5000) : "";
  if (!field || !modelLinesOf(makeSlug).some((l) => l.slug === lineSlug)) throw new ListingError(400, "Neplatná úprava.");
  const generationField = CATALOG_EDIT_FIELDS[field].level === "generation";
  if (generationField !== (genIndex !== null) || (genIndex !== null && (genIndex < 0 || genIndex > 50))) throw new ListingError(400, "Neplatná generace.");
  await getDb().insert(catalogEdit).values({
    id: `o-${generateRandomString(12, "a-z", "0-9")}`,
    makeSlug,
    lineSlug,
    genIndex,
    field,
    value,
    authorId: session.user.id,
  });
}

/**
 * Starts the deploy workflow, whose build fetches the current edits. Needs GITHUB_DEPLOY_TOKEN: a
 * fine-grained token for this repository with "Actions: read and write" only.
 */
export async function publishEdits(session: Session) {
  if (!hasRole(session, ["admin"])) throw new ListingError(403, "Jen pro administrátory.");
  const token = (getCloudflareContext().env as unknown as { GITHUB_DEPLOY_TOKEN?: string }).GITHUB_DEPLOY_TOKEN;
  if (!token) throw new ListingError(503, "Chybí GITHUB_DEPLOY_TOKEN, nasazení nelze spustit odsud.");
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/actions/workflows/${WORKFLOW}/dispatches`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "user-agent": "vozodrom", "x-github-api-version": "2022-11-28" },
    body: JSON.stringify({ ref: "main" }),
  });
  if (!response.ok) {
    console.error("[publishEdits]", response.status, await response.text().catch(() => ""));
    throw new ListingError(502, "GitHub nasazení nespustil.");
  }
}
