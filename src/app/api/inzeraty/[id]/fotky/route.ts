import { getSession } from "@/lib/auth";
import { addPhoto, errorResponse, removePhoto } from "@/lib/listing-store";

type Context = { params: Promise<{ id: string }> };

// POST: the image bytes as the body (already resized in the browser), ?w=&h= its size.
export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const url = new URL(request.url);
    const photo = await addPhoto(session, (await params).id, await request.arrayBuffer(), Number(url.searchParams.get("w")), Number(url.searchParams.get("h")));
    return Response.json(photo, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE ?klic=<photo key>
export async function DELETE(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await removePhoto(session, (await params).id, new URL(request.url).searchParams.get("klic") ?? "");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
