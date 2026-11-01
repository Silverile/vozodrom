import { getSession } from "@/lib/auth";
import { saveEdit } from "@/lib/catalog-edit-store";
import { errorResponse } from "@/lib/listing-store";

// POST { makeSlug, lineSlug, genIndex, field, value }: an admin's catalogue correction.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await saveEdit(session, await request.json().catch(() => ({})));
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
