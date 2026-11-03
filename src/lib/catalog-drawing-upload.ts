import "server-only";
import { POST as legacyUpload } from "@/app/api/admin/katalog/nakres/route";
import { ApiError, readBytes, staffSession } from "./api-v1-http";

export const MAX_CATALOG_DRAWING_BYTES = 2 * 1024 * 1024;

/** Delegate to the existing web handler: one validator, format, R2 path and authorization policy.
 * The Next request context retains the original cookie/bearer headers used by getSession().
 */
export async function uploadCatalogDrawing(request: Request, make: string, line: string): Promise<{ src: string }> {
  await staffSession(request, true);
  const bytes = await readBytes(request, MAX_CATALOG_DRAWING_BYTES);
  const url = new URL("/api/admin/katalog/nakres/", request.url);
  url.searchParams.set("znacka", make); url.searchParams.set("model", line);
  const response = await legacyUpload(new Request(url, { method: "POST", headers: request.headers, body: bytes }));
  const data = await response.json() as { src?: unknown; error?: unknown };
  if (!response.ok) throw new ApiError(response.status, "drawing_error", typeof data.error === "string" ? data.error : "Nákres se nepodařilo uložit.");
  if (typeof data.src !== "string") throw new ApiError(502, "invalid_response", "Nákres se nepodařilo uložit.");
  return { src: data.src };
}
