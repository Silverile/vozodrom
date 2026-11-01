import { getSession } from "@/lib/auth";
import { createEntry, parseEntry } from "@/lib/garage-store";
import { errorResponse } from "@/lib/listing-store";

// POST { title, body, category, costCzk, mileageKm, happenedOn }: a new logbook entry of the car.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  try {
    const id = await createEntry(session, (await params).id, parseEntry(await request.json().catch(() => ({}))));
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
