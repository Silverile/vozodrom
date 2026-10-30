import { getSession } from "@/lib/auth";
import { conversationsOf, openListingChat, unreadTotal } from "@/lib/chat";
import { errorResponse } from "@/lib/listing-store";

const unauthorized = () => Response.json({ error: "Přihlaste se." }, { status: 401 });

// GET: the signed-in user's conversations and unread total.
export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  const [conversations, unread] = await Promise.all([conversationsOf(session.user.id), unreadTotal(session.user.id)]);
  return Response.json({ conversations, unread });
}

// POST { listingId }: opens (or finds) the chat with the seller of a published listing.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  try {
    const body = ((await request.json().catch(() => null)) ?? {}) as { listingId?: unknown };
    return Response.json({ id: await openListingChat(session, String(body.listingId ?? "")) });
  } catch (error) {
    return errorResponse(error);
  }
}
