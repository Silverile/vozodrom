"use client";

import { useEffect, useState } from "react";
import type { FormGeneration } from "./listing-catalog";

/** Catalogue generations (bodies, engines, gearboxes, photo) of a model line, fetched per line. */
export function useCardGenerations(make: string, line: string | undefined): FormGeneration[] {
  const [state, setState] = useState<{ key: string; generations: FormGeneration[] }>({ key: "", generations: [] });
  const key = line ? `${make}/${line}` : "";
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetch(`/api/katalog/${key}/`)
      .then((r) => (r.ok ? (r.json() as Promise<{ generations: FormGeneration[] }>) : { generations: [] }))
      .then((data) => !cancelled && setState({ key, generations: data.generations }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);
  return state.key === key ? state.generations : [];
}
