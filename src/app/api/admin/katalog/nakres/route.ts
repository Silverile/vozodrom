import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { getSession, hasRole } from "@/lib/auth";
import { modelLinesOf } from "@/lib/makes";

// POST ?znacka=&model= with a WebP body: a front drawing made in the editor (lib/drawing-format
// turned the admin's image into the site's format in the browser). Stored in R2 under a key that is
// never reused and served by /foto/katalog/…; the editor then saves a "drawing" operation with it.
const MAX_BYTES = 2 * 1024 * 1024;

/** Width and height from a WebP's headers (lossy, lossless or extended), or null when it is not one. */
function webpSize(bytes: Uint8Array): { width: number; height: number } | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes.length < 30 || ascii(0, 4) !== "RIFF" || ascii(8, 12) !== "WEBP") return null;
  const riff = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24);
  if (riff + 8 !== bytes.length) return null;
  const chunk = ascii(12, 16);
  if (chunk === "VP8X") return { width: 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)), height: 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) };
  if (chunk === "VP8L" && bytes[20] === 0x2f) {
    const bits = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8 " && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a)
    return { width: (bytes[26] | (bytes[27] << 8)) & 0x3fff, height: (bytes[28] | (bytes[29] << 8)) & 0x3fff };
  return null;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!hasRole(session, ["admin"])) return Response.json({ error: "Jen pro administrátory." }, { status: 403 });
  const q = new URL(request.url).searchParams;
  const make = q.get("znacka") ?? "";
  const line = q.get("model") ?? "";
  if (!modelLinesOf(make).some((l) => l.slug === line)) return Response.json({ error: "Model nenalezen." }, { status: 404 });
  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) return Response.json({ error: "Nákres je příliš velký." }, { status: 413 });
  const size = webpSize(new Uint8Array(body));
  if (!size) return Response.json({ error: "Nákres musí být WebP." }, { status: 415 });
  if (size.width !== 960 || size.height !== 600) return Response.json({ error: "Nákres musí mít formát webu (960 × 600)." }, { status: 415 });
  const key = `katalog/${make}--${line}--${generateRandomString(12, "a-z", "0-9")}.webp`;
  await getCloudflareContext().env.PHOTOS.put(key, body, { httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" } });
  return Response.json({ src: `/foto/${key}` });
}
