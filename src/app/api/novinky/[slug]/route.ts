import { deleteArticle } from "@/lib/article-store";
import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/listing-store";

// DELETE: staff delete an article (it is hidden; a built-in one stays hidden through a stored mark).
export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await deleteArticle(await getSession(), (await params).slug);
    return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
