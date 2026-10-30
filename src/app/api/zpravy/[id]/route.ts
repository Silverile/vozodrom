import { getSession } from "@/lib/auth";
import { messagesOf, sendMessage } from "@/lib/chat";
import { errorResponse } from "@/lib/listing-store";

type Context = { params: Promise<{ id: string }> };

// GET ?pred=<ISO time>: up to 50 messages before that time (newest last).
export async function GET(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const before = new URL(request.url).searchParams.get("pred");
    return Response.json(await messagesOf(session, (await params).id, before ? new Date(before) : undefined));
  } catch (error) {
    return errorResponse(error);
  }
}

// POST { body }: sends a message; the other member's open tabs get it at once.
export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { body?: unknown };
    return Response.json(await sendMessage(session, (await params).id, String(body.body ?? "")), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
