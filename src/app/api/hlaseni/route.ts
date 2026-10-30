import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/listing-store";
import { parseNotice, submitNotice } from "@/lib/reports";

// POST { listingId, category, explanation, name, email, goodFaith }: a notice about a listing.
// Signing in is not required; the e-mail receives the confirmation and the decision.
export async function POST(request: Request) {
  try {
    const notice = parseNotice(await request.json().catch(() => null));
    await submitNotice(notice, await getSession());
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
