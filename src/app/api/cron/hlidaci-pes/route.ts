import { getCloudflareContext } from "@opennextjs/cloudflare";
import { runWatchdog } from "@/lib/watchdog";

// Called by the daily cron (worker/index.ts) with the app secret; closed to everyone else.
export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  if (request.headers.get("x-cron-secret") !== env.BETTER_AUTH_SECRET) return new Response("Not found", { status: 404 });
  return Response.json({ notified: await runWatchdog() });
}
