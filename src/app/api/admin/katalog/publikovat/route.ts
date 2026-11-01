import { getSession } from "@/lib/auth";
import { publishEdits } from "@/lib/catalog-edit-store";
import { errorResponse } from "@/lib/listing-store";

// POST: starts a deploy, which builds the catalogue with the current corrections.
export async function POST() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await publishEdits(session);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
