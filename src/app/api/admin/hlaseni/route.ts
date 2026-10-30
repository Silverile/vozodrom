import { STAFF_ROLES, getSession, hasRole } from "@/lib/auth";
import { errorResponse } from "@/lib/listing-store";
import { decideReports } from "@/lib/reports";

// POST { listingId, decision: "remove" | "dismiss", reason }: decides all open notices of a listing.
export async function POST(request: Request) {
  const session = await getSession();
  if (!hasRole(session, STAFF_ROLES)) return Response.json({ error: "Nenalezeno." }, { status: 404 });
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { listingId?: unknown; decision?: unknown; reason?: unknown };
    if (body.decision !== "remove" && body.decision !== "dismiss") return Response.json({ error: "Neznámé rozhodnutí." }, { status: 400 });
    await decideReports(session!, String(body.listingId ?? ""), body.decision, typeof body.reason === "string" ? body.reason : "");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
