import { ownersOf } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

// GET ?znacka=&model=: how many owners keep a car of this model line in their garage here, and how
// many logbook entries they wrote (the home page's "Jaké auto máte?").
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const make = q.get("znacka") ?? "";
  const line = q.get("model") ?? "";
  if (!/^[a-z0-9-]+$/.test(make) || !/^[a-z0-9-]+$/.test(line)) return Response.json({ error: "Neplatný model." }, { status: 400 });
  try {
    return Response.json(await ownersOf(make, line), { headers: { "cache-control": "public, max-age=60" } });
  } catch (error) {
    return errorResponse(error);
  }
}
