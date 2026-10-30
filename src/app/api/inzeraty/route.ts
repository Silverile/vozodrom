import { getSession } from "@/lib/auth";
import { createListing, errorResponse, parseDraft } from "@/lib/listing-store";

// POST { data } creates a draft listing for the signed-in user and returns its id.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = (await request.json().catch(() => null)) as { data?: unknown } | null;
    const id = await createListing(session, parseDraft(body?.data));
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
