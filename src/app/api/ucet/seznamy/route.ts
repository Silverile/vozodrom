import { getSession } from "@/lib/auth";
import { parseFavorites, parseSearches, readFavorites, readSearches, writeFavorites, writeSearches } from "@/lib/account-lists";

// GET returns the signed-in user's shortlist and saved searches.
// PUT replaces them; with ?merge=1 it adds the sent items to what is stored (first sign-in on a device).

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const [favorites, searches] = await Promise.all([readFavorites(session.user.id), readSearches(session.user.id)]);
  return Response.json({ favorites, searches });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body: unknown = await request.json().catch(() => null);
  const input = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  let favorites = input.favorites === undefined ? undefined : parseFavorites(input.favorites);
  let searches = input.searches === undefined ? undefined : parseSearches(input.searches);
  if (favorites === null || searches === null) return Response.json({ error: "invalid" }, { status: 400 });

  if (new URL(request.url).searchParams.get("merge") === "1") {
    const [storedFavorites, storedSearches] = await Promise.all([readFavorites(userId), readSearches(userId)]);
    favorites = parseFavorites([...storedFavorites, ...(favorites ?? [])]) ?? storedFavorites;
    searches = parseSearches([...storedSearches, ...(searches ?? [])]) ?? storedSearches;
  }

  if (favorites) await writeFavorites(userId, favorites);
  if (searches) await writeSearches(userId, searches);
  const [savedFavorites, savedSearches] = await Promise.all([readFavorites(userId), readSearches(userId)]);
  return Response.json({ favorites: savedFavorites, searches: savedSearches });
}
