import { getSession } from "@/lib/auth";
import { markRead } from "@/lib/chat";
import { errorResponse } from "@/lib/listing-store";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await markRead(session, (await params).id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
