import { canEditArticles } from "@/lib/article-store";
import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/listing-store";
import { storePhoto } from "@/lib/photo-store";

// POST ?w=&h= with a JPEG or WebP body (resized in the browser): a photo for an article, staff only.
// Stored in R2 as novinky/<random>.<ext> and served by /foto/novinky/…; answers { src }.
export async function POST(request: Request) {
  try {
    if (!canEditArticles(await getSession())) return Response.json({ error: "Jen pro redakci." }, { status: 403 });
    const q = new URL(request.url).searchParams;
    const photo = await storePhoto("novinky", await request.arrayBuffer(), Number(q.get("w")), Number(q.get("h")));
    return Response.json({ src: `/foto/${photo.key}` }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
