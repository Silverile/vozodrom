import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import type { ListingDto, ReferenceDataDto, StoryDto } from "../lib/api/types";
import * as demo from "./demo";

declare const process: { env: { EXPO_PUBLIC_DEMO?: string } };

/** EXPO_PUBLIC_DEMO=1 shows the labelled demonstration data instead of calling the API. */
export const DEMO = process.env.EXPO_PUBLIC_DEMO === "1";

export interface Remote<T> { data: T | null; error: string | null; loading: boolean; reload: () => void }

/** Loads once per key; aborts on unmount or key change so a stale answer never lands. */
export function useRemote<T>(key: string, load: (signal: AbortSignal) => Promise<T>): Remote<T> {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({ data: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);
  const loader = useRef(load);
  loader.current = load;
  useEffect(() => {
    const abort = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    loader.current(abort.signal)
      .then((data) => { if (!abort.signal.aborted) setState({ data, error: null, loading: false }); })
      .catch((e: unknown) => { if (!abort.signal.aborted) setState({ data: null, error: e instanceof Error ? e.message : "Něco se nepovedlo.", loading: false }); });
    return () => abort.abort();
  }, [key, attempt]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}

/** What a listing card shows, whether it came from the API or the demo set. */
export interface CardListing {
  id: string;
  title: string;
  price: number;
  year: number;
  km: number | null;
  fuel: string;
  gearbox: string;
  powerKw: number;
  place: string;
  age: string;
  photo: string | null;
  photoCount: number;
  stkRecords: number;
  generation: string;
}

export function ago(iso: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `před ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `před ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "včera";
  if (days < 7) return `před ${days} dny`;
  return new Date(iso).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
}

const FUEL_LABEL: Record<string, string> = { benzin: "Benzín", nafta: "Nafta", hybrid: "Hybrid", elektro: "Elektro", lpg: "LPG" };
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function fromListingDto(l: ListingDto): CardListing {
  return {
    id: l.id,
    title: l.title,
    price: l.price,
    year: l.year,
    km: l.mileageKm > 0 ? l.mileageKm : null,
    fuel: FUEL_LABEL[l.fuel] ?? capital(l.fuel),
    gearbox: capital(l.transmission),
    powerKw: l.powerKw,
    place: l.city || l.region,
    age: ago(l.postedAt),
    photo: l.photos[0] ? api.assetUrl(l.photos[0].url) : null,
    photoCount: l.photos.length,
    stkRecords: l.stkHistory.length,
    generation: l.generation,
  };
}

const fromDemo = (l: demo.DemoListing): CardListing => ({ ...l, stkRecords: l.stkUntil ? 1 : 0 });

export async function loadListings(query: Parameters<typeof api.listings>[0], signal: AbortSignal) {
  if (DEMO) return { items: demo.listings.map(fromDemo), nextCursor: null };
  const page = await api.listings(query, { signal });
  return { items: page.items.map(fromListingDto), nextCursor: page.nextCursor };
}

export async function loadListing(id: string, signal: AbortSignal) {
  if (DEMO) {
    const l = demo.listings.find((x) => x.id === id) ?? demo.listings[0];
    return { card: fromDemo(l), description: "", phone: null as string | null, photos: [l.photo] };
  }
  const d = await api.listing(id, { signal });
  return { card: fromListingDto(d.listing), description: d.listing.description, phone: d.contact.phone, photos: d.listing.photos.map((p) => api.assetUrl(p.url)) };
}

export interface CardStory { id: string; title: string; car: string; km: number | null; cost: number | null; when: string; category: string; likes: number; comments: number; photo: string | null }

const fromStoryDto = (s: StoryDto): CardStory => ({
  id: s.id, title: s.title, car: s.carTitle, km: s.mileageKm, cost: s.costCzk, category: s.category,
  when: new Date(s.happenedOn).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" }),
  likes: s.likes, comments: s.comments, photo: s.photo ? api.assetUrl(s.photo.url) : null,
});

export async function loadStories(limit: number, signal: AbortSignal): Promise<CardStory[]> {
  if (DEMO) return demo.stories.slice(0, limit).map((s) => ({ id: s.id, title: s.title, car: s.car, km: s.km, cost: s.cost, when: s.when, category: s.kind, likes: s.likes, comments: s.comments, photo: s.photo ?? null }));
  const page = await api.stories({ limit }, { signal });
  return page.items.map(fromStoryDto);
}

let referenceCache: Promise<ReferenceDataDto> | null = null;

/** Labels, options and limits the web forms use; fetched once per app run. */
export function useReference() {
  return useRemote("reference-data", () => {
    referenceCache ??= api.referenceData().catch((e: unknown) => { referenceCache = null; throw e; });
    return referenceCache;
  });
}
