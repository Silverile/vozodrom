import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { user } from "@/db/schema";
import { getAuth, type Session } from "./auth";
import { ListingError } from "./listing-store";
import { isAPIError } from "better-auth/api";
import { DEVELOPMENT_WEB_ORIGIN, withDevelopmentCors } from "./development-cors";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export const json = (data: unknown, status = 200) => Response.json(data, {
  status, headers: { "cache-control": "private, no-store", vary: "Cookie, Authorization" },
});
export async function handle(work: () => Promise<unknown>, request?: Request, status = 200) {
  let response: Response;
  try {
    if (request && !["GET", "HEAD", "OPTIONS"].includes(request.method)) checkWriteOrigin(request);
    response = json(await work(), status);
  }
  catch (error) {
    if (error instanceof ApiError || error instanceof ListingError) response = json({ error: { code: error instanceof ApiError ? error.code : "validation_error", message: error.message } }, error.status);
    else if (isAPIError(error)) response = json({ error: { code: error.body?.code ?? "auth_error", message: error.body?.message ?? "Požadavek byl odmítnut." } }, error.statusCode);
    // Never serialize database/auth exceptions or their input values to clients.
    else response = json({ error: { code: "internal_error", message: "Požadavek se nepodařilo zpracovat." } }, 500);
  }
  return request ? withDevelopmentCors(response, request) : response;
}
export function OPTIONS(request: Request) { return withDevelopmentCors(new Response(null, { status: 204, headers: { "cache-control": "no-store" } }), request); }
function checkWriteOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin && !(process.env.NODE_ENV === "development" && origin === DEVELOPMENT_WEB_ORIGIN))
    throw new ApiError(403, "invalid_origin", "Nepovolený původ požadavku.");
  if (!origin && request.headers.get("sec-fetch-site") === "cross-site") throw new ApiError(403, "invalid_origin", "Nepovolený původ požadavku.");
}
/** Route wrapper shared by reads, writes and preflight, including errors. */
export function endpoint<P extends Record<string, string> = Record<string, never>>(
  work: (request: Request, params: P) => Promise<unknown>, status = 200,
) {
  return (request: Request, context: { params: Promise<P> }) => handle(async () => work(request, await context.params), request, status);
}
export function publicEndpoint<P extends Record<string, string> = Record<string, never>>(work: (request: Request, params: P) => Promise<unknown>, maxAge = 300) {
  return async (request: Request, context: { params: Promise<P> }) => {
    const response = await endpoint(work)(request, context);
    if (response.ok) {
      response.headers.set("cache-control", `public, max-age=${maxAge}`);
      response.headers.set("vary", "Origin");
    }
    return response;
  };
}
export async function readBytes(request: Request, max: number): Promise<ArrayBuffer> {
  if (Number(request.headers.get("content-length") ?? 0) > max) throw new ApiError(413, "body_too_large", "Příliš velký požadavek.");
  const reader = request.body?.getReader();
  if (!reader) return new ArrayBuffer(0);
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > max) { await reader.cancel(); throw new ApiError(413, "body_too_large", "Příliš velký požadavek."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes.buffer;
}
export async function readJson(request: Request, maxBytes = 128 * 1024): Promise<Record<string, unknown>> {
  const bytes = await readBytes(request, maxBytes);
  try {
    const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch { throw new ApiError(400, "invalid_json", "Neplatný JSON objekt."); }
}
export async function staffSession(request: Request, adminOnly = false) {
  const session = await apiSession(request);
  if (!(adminOnly ? ["admin"] : ["moderator", "admin"]).includes(session.user.role ?? "")) throw new ApiError(403, "forbidden", "Nedostatečné oprávnění.");
  return session;
}
/** Better Auth validates both its signed cookie and its own bearer token. No JWT conversion. */
export async function apiSession(request: Request): Promise<Session> {
  const session = await getAuth().api.getSession({ headers: request.headers, query: { disableCookieCache: true } });
  if (!session) throw new ApiError(401, "unauthorized", "Přihlaste se.");
  // Check the live role and ban even if a token/session predates an administrative change.
  const [current] = await getDb().select({ role: user.role, banned: user.banned }).from(user).where(eq(user.id, session.user.id)).limit(1);
  if (!current || current.banned) throw new ApiError(401, "unauthorized", "Přihlaste se.");
  return { ...session, user: { ...session.user, role: current.role } };
}
export function pageSize(params: URLSearchParams, max = 50) {
  const raw = params.get("limit");
  if (raw === null) return 24;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > max) throw new ApiError(400, "invalid_limit", `Limit musí být 1–${max}.`);
  return value;
}
/** Opaque navigation data, not an authorization credential. Bound to the canonical query. */
export function cursorScope(params: URLSearchParams) {
  const query = new URLSearchParams(params);
  query.delete("cursor"); query.delete("limit"); query.sort();
  return query.toString();
}
export function encodeCursor(value: { key: string | number; id: string; scope: string }) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}
export function decodeCursor(raw: string | null, scope: string): { key: string | number; id: string } | null {
  if (!raw) return null;
  try {
    if (raw.length > 8192) throw new Error();
    const value = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (value.scope !== scope || typeof value.id !== "string" || !value.id || value.id.length > 100 ||
      !(typeof value.key === "string" || (typeof value.key === "number" && Number.isFinite(value.key)))) throw new Error();
    return value;
  } catch { throw new ApiError(400, "invalid_cursor", "Neplatný kurzor stránkování."); }
}
