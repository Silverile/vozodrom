import { getSession } from "@/lib/auth";
import { addComment, deleteComment } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

// POST { entryId, body }: a comment under a logbook entry; its author gets a notification.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = (await request.json().catch(() => ({}))) as { entryId?: unknown; body?: unknown };
    if (typeof body.entryId !== "string" || typeof body.body !== "string") return Response.json({ error: "Neplatný komentář." }, { status: 400 });
    return Response.json({ id: await addComment(session, body.entryId, body.body) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE ?id=<comment>: by its author or a moderator.
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await deleteComment(session, new URL(request.url).searchParams.get("id") ?? "");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
