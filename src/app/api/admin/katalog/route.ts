import { getSession } from "@/lib/auth";
import { deleteOp, editorState, saveOps } from "@/lib/catalog-edit-store";
import { errorResponse } from "@/lib/listing-store";

// The catalogue editor's API, admins only (lib/catalog-edit-store checks the role):
// GET ?znacka=&model=           the card as the data files have it and its saved edits
// POST { makeSlug, lineSlug, ops } saves operations (lib/catalog-ops), answers the line's edits
// DELETE ?id=                   takes back one saved operation
const noStore = { headers: { "cache-control": "no-store" } };

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  try {
    return Response.json(await editorState(await getSession(), q.get("znacka") ?? "", q.get("model") ?? ""), noStore);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { makeSlug?: unknown; lineSlug?: unknown; ops?: unknown };
    const rows = await saveOps(await getSession(), String(body.makeSlug ?? ""), String(body.lineSlug ?? ""), body.ops);
    return Response.json({ rows }, noStore);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await deleteOp(await getSession(), new URL(request.url).searchParams.get("id") ?? "");
    return Response.json({ ok: true }, noStore);
  } catch (error) {
    return errorResponse(error);
  }
}
