import { connection } from "next/server";
import { publishedUserListings } from "@/lib/user-listings";

// Published user listings for the client-side search (/inzeraty/). Short browser cache:
// a newly approved listing shows up within a minute.
export async function GET() {
  await connection();
  return Response.json(await publishedUserListings(), { headers: { "cache-control": "public, max-age=60" } });
}
