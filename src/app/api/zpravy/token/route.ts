import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSession } from "@/lib/auth";
import { unreadTotal } from "@/lib/chat";
import { createWsToken } from "@/lib/ws-token";

// GET: a one-minute token for the chat WebSocket (/ws/zpravy) and the current unread total.
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Přihlaste se." }, { status: 401 });
  const token = await createWsToken(session.user.id, getCloudflareContext().env.BETTER_AUTH_SECRET);
  return Response.json({ token, unread: await unreadTotal(session.user.id) }, { headers: { "cache-control": "no-store" } });
}
