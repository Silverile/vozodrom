import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { getSession, hasRole } from "@/lib/auth";
import { modelLinesOf } from "@/lib/makes";

// POST ?znacka=&model= with a WebP body: a front drawing made in the editor (lib/drawing-format
// turned the admin's image into the site's format in the browser). Stored in R2 under a key that is
// never reused and served by /foto/katalog/…; the editor then saves a "drawing" operation with it.
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!hasRole(session, ["admin"])) return Response.json({ error: "Jen pro administrátory." }, { status: 403 });
  const q = new URL(request.url).searchParams;
  const make = q.get("znacka") ?? "";
  const line = q.get("model") ?? "";
  if (!modelLinesOf(make).some((l) => l.slug === line)) return Response.json({ error: "Model nenalezen." }, { status: 404 });
  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) return Response.json({ error: "Nákres je příliš velký." }, { status: 413 });
  const head = String.fromCharCode(...new Uint8Array(body, 0, Math.min(16, body.byteLength)));
  if (head.slice(0, 4) !== "RIFF" || head.slice(8, 12) !== "WEBP") return Response.json({ error: "Nákres musí být WebP." }, { status: 415 });
  const key = `katalog/${make}--${line}--${generateRandomString(12, "a-z", "0-9")}.webp`;
  await getCloudflareContext().env.PHOTOS.put(key, body, { httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" } });
  return Response.json({ src: `/foto/${key}` });
}
