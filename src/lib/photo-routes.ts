import "server-only";

import { getSession } from "./auth";
import { type PhotoOwner, photoAction } from "./garage-store";
import { errorResponse } from "./listing-store";

// Route handlers for the photos of a garage car or a logbook entry, the same calls PhotoManager
// makes for listings: POST the bytes (?w=&h=), DELETE ?klic=<key>, PATCH { order }.

type Context = { params: Promise<{ id: string }> };

export function photoRoutes(owner: PhotoOwner) {
  async function handle(request: Request, { params }: Context) {
    const session = await getSession();
    if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
    try {
      const id = (await params).id;
      const url = new URL(request.url);
      if (request.method === "POST") {
        const add = { body: await request.arrayBuffer(), width: Number(url.searchParams.get("w")), height: Number(url.searchParams.get("h")) };
        return Response.json(await photoAction(session, owner, id, { add }), { status: 201 });
      }
      if (request.method === "DELETE") await photoAction(session, owner, id, { remove: url.searchParams.get("klic") ?? "" });
      else await photoAction(session, owner, id, { order: ((await request.json().catch(() => ({}))) as { order?: unknown }).order });
      return Response.json({ ok: true });
    } catch (error) {
      return errorResponse(error);
    }
  }
  return { POST: handle, DELETE: handle, PATCH: handle };
}
