"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { createStore, savedSearches, shortlist, type SavedSearch } from "@/lib/storage";

// Keeps the browser shortlist and saved searches in step with the signed-in account.
// The first time a user signs in on this browser, local items are merged into the account;
// afterwards the account is the source and every local change is saved back.

const syncedUser = createStore<string | null>("vozodrom.syncedUser", null, (v): v is string | null => v === null || typeof v === "string");

interface Lists {
  favorites: string[];
  searches: SavedSearch[];
}

async function send(lists: Partial<Lists>, merge = false): Promise<Lists | null> {
  const response = await fetch(`/api/ucet/seznamy/${merge ? "?merge=1" : ""}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lists),
  });
  return response.ok ? response.json() : null;
}

export function AccountSync() {
  const userId = authClient.useSession().data?.user.id ?? null;
  // JSON of what the server last confirmed, to skip echoing our own writes back.
  const confirmed = useRef({ favorites: "", searches: "" });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    let ready = false;

    const apply = (lists: Lists) => {
      confirmed.current = { favorites: JSON.stringify(lists.favorites), searches: JSON.stringify(lists.searches) };
      shortlist.write(lists.favorites);
      savedSearches.write(lists.searches);
    };

    (async () => {
      let lists: Lists | null;
      if (syncedUser.read() === userId) {
        const response = await fetch("/api/ucet/seznamy/");
        lists = response.ok ? await response.json() : null;
      } else {
        lists = await send({ favorites: shortlist.read(), searches: savedSearches.read() }, true);
      }
      if (cancelled || !lists) return;
      apply(lists);
      syncedUser.write(userId);
      ready = true;
    })().catch(() => {});

    const push = () => {
      if (!ready) return;
      const favorites = shortlist.read();
      const searches = savedSearches.read();
      const changed: Partial<Lists> = {};
      if (JSON.stringify(favorites) !== confirmed.current.favorites) changed.favorites = favorites;
      if (JSON.stringify(searches) !== confirmed.current.searches) changed.searches = searches;
      if (!changed.favorites && !changed.searches) return;
      send(changed).then((lists) => lists && !cancelled && (confirmed.current = { favorites: JSON.stringify(lists.favorites), searches: JSON.stringify(lists.searches) })).catch(() => {});
    };
    const unsubscribe = [shortlist.subscribe(push), savedSearches.subscribe(push)];
    return () => {
      cancelled = true;
      unsubscribe.forEach((u) => u());
    };
  }, [userId]);

  return null;
}
