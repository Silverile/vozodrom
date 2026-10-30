"use client";

import { useEffect, useState } from "react";
import type { Listing } from "@/lib/types";

// Listings of one model line: the prerendered count of test and feed listings plus the published
// listings of users, which only the server knows (/api/inzeraty/verejne/, cached a minute).
export function ModelListingCount({ brand, model, prerendered }: { brand: string; model: string; prerendered: number }) {
  const [users, setUsers] = useState(0);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/inzeraty/verejne/")
      .then((r) => (r.ok ? (r.json() as Promise<Listing[]>) : []))
      .then((list) => !cancelled && setUsers(list.filter((l) => l.brandSlug === brand && l.modelSlug === model).length))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [brand, model]);
  return <>{prerendered + users}</>;
}
