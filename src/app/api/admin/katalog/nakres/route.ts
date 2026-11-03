import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { getSession, hasRole } from "@/lib/auth";
import { modelLinesOf } from "@/lib/makes";

// POST ?znacka=&model= with a WebP body: a front drawing made in the editor (lib/drawing-format
// turned the admin's image into the site's format in the browser). Stored in R2 under a key that is
// never reused and served by /foto/katalog/…; the editor then saves a "drawing" operation with it.
const MAX_BYTES = 2 * 1024 * 1024;

/**
 * Width and height of a complete WebP (lossy, lossless or extended), or null when it is not one: the
 * RIFF size must match, every chunk must fit, and an image chunk (VP8 or VP8L) with data must be
 * there, not only a header.
 */
function webpSize(bytes: Uint8Array): { width: number; height: number } | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  const u32 = (at: number) => (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;
  if (bytes.length < 20 || ascii(0, 4) !== "RIFF" || ascii(8, 12) !== "WEBP" || u32(4) + 8 !== bytes.length) return null;
  let canvas: { width: number; height: number } | null = null;
  let image: { width: number; height: number } | null = null;
  for (let at = 12; at < bytes.length; ) {
    if (at + 8 > bytes.length) return null;
    const type = ascii(at, at + 4);
    const size = u32(at + 4);
    const data = at + 8;
    if (data + size > bytes.length) return null;
    if (type === "VP8X" && size >= 10)
      canvas = { width: 1 + (bytes[data + 4] | (bytes[data + 5] << 8) | (bytes[data + 6] << 16)), height: 1 + (bytes[data + 7] | (bytes[data + 8] << 8) | (bytes[data + 9] << 16)) };
    if (type === "VP8L" && size > 5 && bytes[data] === 0x2f) {
      const bits = u32(data + 1);
      image = { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
    if (type === "VP8 " && size > 10 && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a)
      image = { width: (bytes[data + 6] | (bytes[data + 7] << 8)) & 0x3fff, height: (bytes[data + 8] | (bytes[data + 9] << 8)) & 0x3fff };
    at = data + size + (size & 1); // chunks are padded to an even length
  }
  if (!image) return null;
  if (canvas && (canvas.width !== image.width || canvas.height !== image.height)) return null;
  return image;
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
