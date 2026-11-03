import "server-only";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db";
import { communityReport, entryComment, garageCar, listing, logEntry, report, user, LISTING_STATUSES } from "@/db/schema";
import { getAuth, ROLES } from "./auth";
import { ApiError, pageSize, readJson, staffSession } from "./api-v1-http";
import { kindOf, ok, ownerListingDto, requiredText } from "./api-v1-write";
import { decideReports } from "./reports";
import { moderate } from "./garage-store";
import type { AdminCommunityReportDto, AdminListingDto, AdminListingReportDto, AdminOverviewDto, AdminUserDto, OffsetPageDto, RoleDto } from "./api-v1-contract";

function paging(request: Request) {
  const params = new URL(request.url).searchParams, limit = pageSize(params), page = Number(params.get("page") ?? 1);
  if (!Number.isInteger(page) || page < 1 || page > 10000) throw new ApiError(400, "invalid_page", "Neplatná stránka.");
  return { params, limit, page, offset: (page - 1) * limit };
}
export async function adminOverview(request: Request): Promise<AdminOverviewDto> {
  await staffSession(request);
  const db = getDb();
  const [[users], [banned], [pending], [notices], [community]] = await Promise.all([
    db.select({ n: count() }).from(user), db.select({ n: count() }).from(user).where(eq(user.banned, true)),
    db.select({ n: count() }).from(listing).where(eq(listing.status, "pending")),
    db.select({ n: count() }).from(report).where(eq(report.status, "open")),
    db.select({ n: count() }).from(communityReport).where(eq(communityReport.status, "open")),
  ]);
  return { users: users.n, bannedUsers: banned.n, pendingListings: pending.n, listingReports: notices.n, communityReports: community.n };
}
export async function adminListings(request: Request): Promise<OffsetPageDto<AdminListingDto>> {
  await staffSession(request);
  const { params, limit, page, offset } = paging(request), status = params.get("status") ?? "pending";
  if (!LISTING_STATUSES.includes(status as typeof LISTING_STATUSES[number])) throw new ApiError(400, "invalid_query", "Neplatný stav.");
  const where = eq(listing.status, status as typeof LISTING_STATUSES[number]);
  const db = getDb();
  const [rows, [total]] = await Promise.all([
    db.select().from(listing).where(where).orderBy(asc(listing.submittedAt), asc(listing.id)).limit(limit).offset(offset),
    db.select({ n: count() }).from(listing).where(where),
  ]);
  return { items: rows.map((row) => ({ ...ownerListingDto(row), ownerId: row.userId })), page, pageSize: limit, total: total.n };
}
export async function adminListingReports(request: Request): Promise<OffsetPageDto<AdminListingReportDto>> {
  await staffSession(request);
  const { limit, page, offset } = paging(request), db = getDb();
  const [rows, [total]] = await Promise.all([
    db.select({ notice: report, listing }).from(report).leftJoin(listing, eq(listing.id, report.listingId)).where(eq(report.status, "open"))
      .orderBy(asc(report.createdAt), asc(report.id)).limit(limit).offset(offset),
    db.select({ n: count() }).from(report).where(eq(report.status, "open")),
  ]);
  return { items: rows.map(({ notice, listing: row }) => ({ id: notice.id, listingId: notice.listingId, category: notice.category,
    explanation: notice.explanation, notifierName: notice.notifierName, notifierEmail: notice.notifierEmail, createdAt: notice.createdAt.toISOString(),
    listing: row ? { ...ownerListingDto(row), ownerId: row.userId } : null })), page, pageSize: limit, total: total.n };
}
export async function adminCommunityReports(request: Request): Promise<OffsetPageDto<AdminCommunityReportDto>> {
  await staffSession(request);
  const { limit, page, offset } = paging(request), db = getDb();
  const [rows, [total]] = await Promise.all([
    db.select().from(communityReport).where(eq(communityReport.status, "open")).orderBy(asc(communityReport.createdAt), asc(communityReport.id)).limit(limit).offset(offset),
    db.select({ n: count() }).from(communityReport).where(eq(communityReport.status, "open")),
  ]);
  const items = await Promise.all(rows.map(async (notice) => {
    let preview: string | null = null, hidden: boolean | null = null;
    if (notice.kind === "car") {
      const [car] = await db.select({ data: garageCar.data, hiddenReason: garageCar.hiddenReason }).from(garageCar).where(eq(garageCar.id, notice.targetId)).limit(1);
      if (car) { preview = car.data.story.slice(0, 1000); hidden = car.hiddenReason !== null; }
    } else if (notice.kind === "entry") {
      const [entry] = await db.select({ title: logEntry.title, body: logEntry.body, hiddenReason: logEntry.hiddenReason }).from(logEntry).where(eq(logEntry.id, notice.targetId)).limit(1);
      if (entry) { preview = `${entry.title}\n${entry.body}`.slice(0, 1000); hidden = entry.hiddenReason !== null; }
    } else {
      const [comment] = await db.select({ body: entryComment.body, hiddenReason: entryComment.hiddenReason }).from(entryComment).where(eq(entryComment.id, notice.targetId)).limit(1);
      if (comment) { preview = comment.body.slice(0, 1000); hidden = comment.hiddenReason !== null; }
    }
    return { id: notice.id, kind: notice.kind, targetId: notice.targetId, reason: notice.reason, createdAt: notice.createdAt.toISOString(), preview, hidden };
  }));
  return { items, page, pageSize: limit, total: total.n };
}
export async function listingDecision(request: Request, id: string) {
  const session = await staffSession(request), body = await readJson(request);
  if (body.decision !== "remove" && body.decision !== "dismiss") throw new ApiError(400, "invalid_decision", "Neplatné rozhodnutí.");
  await decideReports(session, id, body.decision, requiredText(body.reason, "reason", 1000), body.rule); return ok();
}
export async function communityDecision(request: Request, kind: string, id: string) {
  const session = await staffSession(request), body = await readJson(request);
  if (body.action !== "hide" && body.action !== "restore" && body.action !== "dismiss") throw new ApiError(400, "invalid_action", "Neplatná akce.");
  await moderate(session, kindOf(kind), id, body.action, typeof body.reason === "string" ? body.reason : "", body.rule); return ok();
}
export async function adminUsers(request: Request): Promise<OffsetPageDto<AdminUserDto>> {
  await staffSession(request, true);
  const { params, limit, page, offset } = paging(request), db = getDb(), query = params.get("q")?.trim() ?? "";
  if (query.length > 200) throw new ApiError(400, "invalid_query", "Příliš dlouhý dotaz.");
  const escaped = query.replace(/[\\%_]/g, "\\$&");
  const where = query ? or(ilike(user.email, `%${escaped}%`), ilike(user.name, `%${escaped}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db.select({ id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, role: user.role, banned: user.banned,
      banReason: user.banReason, banExpires: user.banExpires, createdAt: user.createdAt }).from(user).where(where).orderBy(desc(user.createdAt), asc(user.id)).limit(limit).offset(offset),
    db.select({ n: count() }).from(user).where(where),
  ]);
  return { items: rows.map((row) => ({ id: row.id, name: row.name, email: row.email, emailVerified: row.emailVerified,
    role: row.role as RoleDto, banned: row.banned, banReason: row.banReason, banExpires: row.banExpires?.toISOString() ?? null, createdAt: row.createdAt.toISOString() })),
    page, pageSize: limit, total: total.n };
}
export async function userRole(request: Request, id: string) {
  const session = await staffSession(request, true), body = await readJson(request);
  if (id === session.user.id) throw new ApiError(409, "self_change", "Vlastní roli zde měnit nelze.");
  if (!ROLES.includes(body.role as RoleDto)) throw new ApiError(400, "invalid_role", "Neplatná role.");
  await getAuth().api.setRole({ headers: request.headers, body: { userId: id, role: body.role as "admin" | "user" } }); return ok();
}
export async function userBan(request: Request, id: string) {
  const session = await staffSession(request, true);
  if (id === session.user.id) throw new ApiError(409, "self_change", "Vlastní účet zde blokovat nelze.");
  if (request.method === "DELETE") await getAuth().api.unbanUser({ headers: request.headers, body: { userId: id } });
  else {
    const body = await readJson(request), reason = requiredText(body.reason, "reason", 1000);
    if (body.expiresIn !== undefined && (typeof body.expiresIn !== "number" || !Number.isSafeInteger(body.expiresIn) || body.expiresIn < 1 || body.expiresIn > 315360000))
      throw new ApiError(400, "invalid_duration", "Neplatná doba blokace.");
    await getAuth().api.banUser({ headers: request.headers, body: { userId: id, banReason: reason, ...(body.expiresIn !== undefined && { banExpiresIn: body.expiresIn as number }) } });
  }
  return ok();
}
