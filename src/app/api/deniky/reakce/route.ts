import { getSession } from "@/lib/auth";
import { toggle } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

const KINDS = ["car-like", "follow", "entry-like"] as const;

// POST { what: car-like | follow | entry-like, id, on }: sets a like or a follow; answers the new count.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = (await request.json().catch(() => ({}))) as { what?: string; id?: unknown; on?: unknown };
    const what = KINDS.find((k) => k === body.what);
    if (!what || typeof body.id !== "string") return Response.json({ error: "Neplatná akce." }, { status: 400 });
    return Response.json({ count: await toggle(session, what, body.id, body.on === true) });
  } catch (error) {
    return errorResponse(error);
  }
}
