import { getSession } from "@/lib/auth";
import { deleteListing, errorResponse, listingFor, parseDraft, parseMessengers, parsePhone, updateListing } from "@/lib/listing-store";

type Context = { params: Promise<{ id: string }> };

const unauthorized = () => Response.json({ error: "Přihlaste se." }, { status: 401 });

export async function GET(_: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  try {
    return Response.json(await listingFor(session, (await params).id, { staff: true }));
  } catch (error) {
    return errorResponse(error);
  }
}

// PATCH { data?, phone?, messengers?, order? }: vehicle details, contact phone and the messengers on it,
// or the photo order (list of keys).
export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { data?: unknown; phone?: unknown; messengers?: unknown; order?: unknown };
    const order = body.order === undefined ? undefined : Array.isArray(body.order) && body.order.every((k) => typeof k === "string") ? body.order : null;
    if (order === null) return Response.json({ error: "Neplatné pořadí fotek." }, { status: 400 });
    await updateListing(session, (await params).id, {
      ...(body.data !== undefined && { data: parseDraft(body.data) }),
      ...(body.phone !== undefined && { phone: parsePhone(body.phone) }),
      ...(body.messengers !== undefined && { messengers: parseMessengers(body.messengers) }),
      ...(order && { order }),
    });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  try {
    await deleteListing(session, (await params).id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
