"use client";

import { useSyncExternalStore } from "react";

// Small localStorage-backed stores for per-browser conveniences (shortlist, saved
// searches, listing drafts). Storage can be unavailable (private mode, blocked
// site data), so every access is guarded and the UI works without it.

type Listener = () => void;

export function createStore<T>(key: string, fallback: T, isValid: (value: unknown) => value is T) {
  const listeners = new Set<Listener>();
  let cache: T | undefined;

  function read(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : fallback;
      // Anything with the wrong shape (old versions, manual edits) is discarded.
      cache = isValid(parsed) ? parsed : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  }

  function write(value: T) {
    cache = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the in-memory value; the page still works for this visit.
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, read, () => fallback);
  }

  return { read, write, useValue };
}

export const MAX_COMPARE = 4;

const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

export const shortlist = createStore<string[]>("vozodrom.shortlist", [], isStringArray);

export function toggleShortlist(id: string) {
  const current = shortlist.read();
  shortlist.write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
}

export interface SavedSearch {
  query: string;
  label: string;
  savedAt: string;
}

const isSavedSearchArray = (v: unknown): v is SavedSearch[] =>
  Array.isArray(v) &&
  v.every((s) => s && typeof s === "object" && ["query", "label", "savedAt"].every((k) => typeof (s as Record<string, unknown>)[k] === "string"));

export const savedSearches = createStore<SavedSearch[]>("vozodrom.savedSearches", [], isSavedSearchArray);

/** Analytics consent: null until the visitor chooses. */
export type Consent = "granted" | "denied";

export const analyticsConsent = createStore<Consent | null>(
  "vozodrom.analyticsConsent",
  null,
  (v): v is Consent | null => v === null || v === "granted" || v === "denied",
);

/** The visitor's chosen town and radius for "near me" search; null means the whole country. */
export interface SavedLocation {
  city: string;
  radius: number;
}

export const savedLocation = createStore<SavedLocation | null>(
  "vozodrom.location",
  null,
  (v): v is SavedLocation | null =>
    v === null ||
    (!!v && typeof v === "object" && typeof (v as SavedLocation).city === "string" && typeof (v as SavedLocation).radius === "number"),
);
