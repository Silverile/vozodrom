import { getSession } from "@/lib/auth";
import { changeStatus, errorResponse } from "@/lib/listing-store";

// POST { action, reason? }: submit | cancel | withdraw for the owner, approve | reject for staff.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { action?: unknown; reason?: unknown };
    await changeStatus(session, (await params).id, String(body.action ?? ""), typeof body.reason === "string" ? body.reason : undefined);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
