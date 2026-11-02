import { feed } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

// GET ?znacka=&model=&tema=&pred=<ISO time>&pocet=: newest public logbook entries, for the feed and
// the "Příběhy majitelů" block on (static) catalogue pages.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const before = q.get("pred") ? new Date(q.get("pred")!) : undefined;
  try {
    const items = await feed({
      make: q.get("znacka") || undefined,
      line: q.get("model") || undefined,
      category: q.get("tema") || undefined,
      before: before && !Number.isNaN(before.getTime()) ? before : undefined,
      limit: Number(q.get("pocet")) || 24,
    });
    return Response.json({ items }, { headers: { "cache-control": "public, max-age=60" } });
  } catch (error) {
    return errorResponse(error);
  }
}
