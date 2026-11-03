import { allEdits } from "@/lib/catalog-edit-store";
import { errorResponse } from "@/lib/listing-store";

// GET: admins' catalogue edits, oldest first. The build fetches them and replays them into the static
// pages (scripts/fetch-catalog-edits.mjs, app-model-cards.mjs); they are public anyway once published.
export async function GET() {
  try {
    return Response.json({ edits: await allEdits() }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
