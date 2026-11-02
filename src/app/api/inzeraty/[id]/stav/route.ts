import { getSession } from "@/lib/auth";
import { changeStatus, errorResponse } from "@/lib/listing-store";

// POST { action, reason?, rule? }: submit | cancel | withdraw for the owner, approve | reject for staff
// (reject needs the reason and the rule broken, lib/statement RULES).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { action?: unknown; reason?: unknown; rule?: unknown };
    await changeStatus(session, (await params).id, String(body.action ?? ""), typeof body.reason === "string" ? body.reason : undefined, { rule: body.rule });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
