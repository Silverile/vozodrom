import { getCloudflareContext } from "@opennextjs/cloudflare";

// Serves listing photos from R2. Keys are random and never reused, so responses are cached for a year.
export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!/^inzeraty\/u-[a-z0-9]+\/[a-z0-9]+\.(webp|jpg)$/.test(key)) return new Response("Not found", { status: 404 });
  const object = await getCloudflareContext().env.PHOTOS.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
