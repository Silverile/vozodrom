import { getSession } from "@/lib/auth";
import { createCar, parseCar } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

// POST { data }: adds a car to the signed-in user's garage.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const body = (await request.json().catch(() => ({}))) as { data?: unknown };
    return Response.json({ id: await createCar(session, parseCar(body.data)) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
