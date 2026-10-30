"use client";

import { useEffect, useState } from "react";
import type { Listing } from "@/lib/types";
import { ListingCard } from "./ListingCard";

/** Homepage tiles: the prerendered test listings, with freshly published user listings put in front. */
export function LatestListings({ listings, count }: { listings: Listing[]; count: number }) {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  useEffect(() => {
    fetch("/api/inzeraty/verejne/")
      .then((r): Promise<Listing[]> | Listing[] => (r.ok ? r.json() : []))
      .then(setUserListings)
      .catch(() => {});
  }, []);
  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[...userListings, ...listings].slice(0, count).map((l) => <ListingCard key={l.id} listing={l} />)}
    </div>
  );
}
