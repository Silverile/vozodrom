import { allArticles, saveArticle } from "@/lib/article-store";
import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/listing-store";

// GET ?pocet=: the newest articles, for the (prerendered) home page.
// POST { slug?, article }: staff save an article; a new one when slug is missing. Answers { slug }.
export async function GET(request: Request) {
  const count = Math.min(Number(new URL(request.url).searchParams.get("pocet")) || 20, 50);
  try {
    const articles = (await allArticles()).slice(0, count);
    return Response.json({ articles }, { headers: { "cache-control": "public, max-age=60" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { slug?: unknown; article?: unknown };
    const slug = await saveArticle(await getSession(), typeof body.slug === "string" && body.slug ? body.slug : null, body.article);
    return Response.json({ slug }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
