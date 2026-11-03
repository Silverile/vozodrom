import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { and, asc, eq } from "drizzle-orm";
import { type Db, getDb } from "@/db";
import { catalogEdit } from "@/db/schema";
import { type Session, hasRole } from "./auth";
import { loadCard } from "./card-store";
import { type CatalogOp, type EditRow, applyOps, parseOp, rowToOp } from "./catalog-ops";
import { ListingError } from "./listing-store";
import { modelLinesOf } from "./makes";

// Catalogue edits in the database: admins save operations on a model card (lib/catalog-ops), one
// row each, in order. The public list feeds the next build, which replays them into the static
// catalogue; "Publikovat" starts that build on GitHub. Deliberately without lib/modelCards: the
// model cards (~20 MB) would be bundled once more for these routes and push the Worker over its
// size limit. Base cards come from the static files (lib/card-store).

const REPOSITORY = "Silverile/vozodrom";
const WORKFLOW = "deploy-cloudflare.yml";
/** Operations one save may carry. */
const MAX_OPS = 200;

const toRow = (r: typeof catalogEdit.$inferSelect): EditRow & { id: string; createdAt: string } => ({
  id: r.id,
  makeSlug: r.makeSlug,
  lineSlug: r.lineSlug,
  genIndex: r.genIndex,
  field: r.field,
  value: r.value,
  createdAt: r.createdAt.toISOString(),
});

/** All edits, oldest first, for the build (GET /api/katalog/opravy/). */
export async function allEdits(): Promise<EditRow[]> {
  return (await getDb().select().from(catalogEdit).orderBy(asc(catalogEdit.createdAt), asc(catalogEdit.id))).map(toRow);
}

/** Edits of one model line, oldest first (db: a transaction, when called inside one). */
export async function editsOf(makeSlug: string, lineSlug: string, db: Pick<Db, "select"> = getDb()) {
  return (
    await db
      .select()
      .from(catalogEdit)
      .where(and(eq(catalogEdit.makeSlug, makeSlug), eq(catalogEdit.lineSlug, lineSlug)))
      .orderBy(asc(catalogEdit.createdAt), asc(catalogEdit.id))
  ).map(toRow);
}

function requireAdmin(session: Session | null): asserts session is Session {
  if (!hasRole(session, ["admin"])) throw new ListingError(403, "Jen pro administrátory.");
}

function requireLine(makeSlug: string, lineSlug: string) {
  if (!modelLinesOf(makeSlug).some((l) => l.slug === lineSlug)) throw new ListingError(404, "Model nenalezen.");
}

/** The card as the data files have it plus all its edits so far, for the editor. */
export async function editorState(session: Session | null, makeSlug: string, lineSlug: string) {
  requireAdmin(session);
  requireLine(makeSlug, lineSlug);
  const base = await loadCard(makeSlug, lineSlug, { base: true });
  if (!base) throw new ListingError(404, "Model nemá kartu v katalogu.");
  return { base, rows: await editsOf(makeSlug, lineSlug) };
}

/**
 * Saves operations made in the editor. They are replayed on the card with the line's earlier edits
 * first: a save whose operations do not fit (someone else changed the same thing meanwhile) is
 * refused as a whole, so the history only ever holds operations that applied cleanly. The check and
 * the insert run in one SERIALIZABLE transaction: when two editors save the same line at once,
 * Postgres aborts one of them (40001) and that one is told to reload. (Hyperdrive does not support
 * advisory locks; a transaction holds one connection, so the isolation level works through it.)
 */
export async function saveOps(session: Session | null, makeSlug: string, lineSlug: string, input: unknown) {
  requireAdmin(session);
  requireLine(makeSlug, lineSlug);
  const list = Array.isArray(input) ? input : [];
  if (!list.length || list.length > MAX_OPS) throw new ListingError(400, "Žádné nebo příliš mnoho úprav najednou.");
  const ops: CatalogOp[] = [];
  for (const raw of list) {
    const op = parseOp(raw);
    if (typeof op === "string") throw new ListingError(400, op);
    ops.push(op);
  }
  const base = await loadCard(makeSlug, lineSlug, { base: true });
  if (!base) throw new ListingError(404, "Model nemá kartu v katalogu.");

  try {
    await getDb().transaction(
      async (tx) => {
        const rows = await editsOf(makeSlug, lineSlug, tx);
        const earlier = rows.map((r, n) => rowToOp(r, n)).filter((o) => o !== null);
        const fresh = ops.map((op, n) => ({ id: `new-${n}`, makeSlug, lineSlug, op, createdAt: "" }));
        const failed = applyOps(base, [...earlier, ...fresh]).conflicts.filter((c) => c.id.startsWith("new-"));
        if (failed.length) throw new ListingError(409, `Úpravu nelze uložit: ${failed[0].reason}. Načtěte editor znovu.`);

        // one time for the whole save, after every earlier row; the id keeps the save's own order
        const last = rows.length ? Date.parse(rows[rows.length - 1].createdAt) : 0;
        const createdAt = new Date(Math.max(Date.now(), last + 1));
        const batch = generateRandomString(8, "a-z", "0-9");
        await tx.insert(catalogEdit).values(
          ops.map((op, n) => ({
            id: `o-${batch}-${n.toString(36).padStart(3, "0")}`,
            makeSlug,
            lineSlug,
            genIndex: null,
            field: "op",
            value: JSON.stringify(op),
            authorId: session!.user.id,
            createdAt,
          })),
        );
      },
      { isolationLevel: "serializable" },
    );
  } catch (error) {
    if ((error as { code?: string }).code === "40001" || (error as { cause?: { code?: string } }).cause?.code === "40001")
      throw new ListingError(409, "Tuto řadu právě ukládá někdo jiný. Načtěte editor znovu a změny zopakujte.");
    throw error;
  }
  return editsOf(makeSlug, lineSlug);
}

/** Takes back one saved operation (later ones that depended on it then show as conflicts). */
export async function deleteOp(session: Session | null, id: string) {
  requireAdmin(session);
  const deleted = await getDb().delete(catalogEdit).where(eq(catalogEdit.id, id)).returning({ id: catalogEdit.id });
  if (!deleted.length) throw new ListingError(404, "Úprava nenalezena.");
}

/**
 * Starts the deploy workflow, whose build fetches the current edits. Needs GITHUB_DEPLOY_TOKEN: a
 * fine-grained token for this repository with "Actions: read and write" only.
 */
export async function publishEdits(session: Session | null) {
  requireAdmin(session);
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
