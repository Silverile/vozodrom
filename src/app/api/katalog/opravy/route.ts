import { currentEdits } from "@/lib/catalog-edit-store";
import { errorResponse } from "@/lib/listing-store";

// GET: admins' current catalogue corrections. The build fetches them into the static pages
// (scripts/fetch-catalog-edits.mjs); they are public anyway once published.
export async function GET() {
  try {
    return Response.json({ edits: await currentEdits() }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
