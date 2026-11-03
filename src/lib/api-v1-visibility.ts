import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { garageCar, logEntry, entryComment, user } from "@/db/schema";
import { ApiError } from "./api-v1-http";
import type { CommunityKindDto } from "./api-v1-contract";

/** Verify the entire ancestor chain, not just the directly targeted row. */
export async function visibleCommunityTarget(kind: CommunityKindDto, id: string): Promise<void> {
  const db = getDb();
  let carId = id;
  let entryId = id;
  if (kind === "comment") {
    const [comment] = await db.select({ entryId: entryComment.entryId }).from(entryComment).innerJoin(user, eq(user.id, entryComment.userId))
      .where(and(eq(entryComment.id, id), isNull(entryComment.hiddenReason), eq(user.banned, false))).limit(1);
    if (!comment) throw new ApiError(404, "not_found", "Obsah nenalezen.");
    entryId = comment.entryId;
  }
  if (kind !== "car") {
    const [entry] = await db.select({ carId: logEntry.carId }).from(logEntry).innerJoin(user, eq(user.id, logEntry.userId))
      .where(and(eq(logEntry.id, entryId), isNull(logEntry.hiddenReason), eq(user.banned, false))).limit(1);
    if (!entry) throw new ApiError(404, "not_found", "Obsah nenalezen.");
    carId = entry.carId;
  }
  const [car] = await db.select({ id: garageCar.id }).from(garageCar).innerJoin(user, eq(user.id, garageCar.userId))
    .where(and(eq(garageCar.id, carId), isNull(garageCar.hiddenReason), eq(user.banned, false))).limit(1);
  if (!car) throw new ApiError(404, "not_found", "Obsah nenalezen.");
}
