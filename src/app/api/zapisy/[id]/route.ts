import { getSession } from "@/lib/auth";
import { deleteEntry, parseEntry, updateEntry } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

type Context = { params: Promise<{ id: string }> };

// PATCH: the entry's fields, as when it was written.
export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await updateEntry(session, (await params).id, parseEntry(await request.json().catch(() => ({}))));
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await deleteEntry(session, (await params).id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
