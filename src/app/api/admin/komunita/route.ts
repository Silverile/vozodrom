import { COMMUNITY_TARGETS } from "@/db/schema";
import { STAFF_ROLES, getSession, hasRole } from "@/lib/auth";
import { moderate } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

const ACTIONS = ["hide", "restore", "dismiss"] as const;

// POST { kind, id, action: hide | restore | dismiss, reason }: moderators only.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !hasRole(session, STAFF_ROLES)) return Response.json({ error: "Nenalezeno." }, { status: 404 });
  try {
    const body = (await request.json().catch(() => ({}))) as { kind?: string; id?: unknown; action?: string; reason?: unknown };
    const kind = COMMUNITY_TARGETS.find((k) => k === body.kind);
    const action = ACTIONS.find((a) => a === body.action);
    if (!kind || !action || typeof body.id !== "string") return Response.json({ error: "Neplatná akce." }, { status: 400 });
    await moderate(session, kind, body.id, action, typeof body.reason === "string" ? body.reason : "");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
