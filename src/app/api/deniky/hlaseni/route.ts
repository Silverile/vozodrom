import { COMMUNITY_TARGETS } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { reportContent } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

// POST { kind: car | entry | comment, id, reason, goodFaith }: a signed-in user reports garage content.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = (await request.json().catch(() => ({}))) as { kind?: string; id?: unknown; reason?: unknown; goodFaith?: unknown };
    const kind = COMMUNITY_TARGETS.find((k) => k === body.kind);
    if (!kind || typeof body.id !== "string" || typeof body.reason !== "string") return Response.json({ error: "Neplatné hlášení." }, { status: 400 });
    await reportContent(session, kind, body.id, body.reason, body.goodFaith === true);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
