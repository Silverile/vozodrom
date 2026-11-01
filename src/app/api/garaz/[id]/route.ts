import { getSession } from "@/lib/auth";
import { deleteCar, parseCar, updateCar } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

type Context = { params: Promise<{ id: string }> };

// PATCH { data, former }: saves the car's details.
export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = (await request.json().catch(() => ({}))) as { data?: unknown; former?: unknown };
    await updateCar(session, (await params).id, parseCar(body.data), body.former === true);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE: removes the car with its logbook and photos.
export async function DELETE(_: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    await deleteCar(session, (await params).id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
