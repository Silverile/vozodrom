"use client";

import { useSyncExternalStore } from "react";

// Small localStorage-backed stores for per-browser conveniences (shortlist, saved
// searches, listing drafts). Storage can be unavailable (private mode, blocked
// site data), so every access is guarded and the UI works without it.

type Listener = () => void;

export function createStore<T>(key: string, fallback: T) {
  const listeners = new Set<Listener>();
  let cache: T | undefined;

  function read(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? (JSON.parse(raw) as T) : fallback;
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

export const shortlist = createStore<string[]>("vozodrom.shortlist", []);

export function toggleShortlist(id: string) {
  const current = shortlist.read();
  shortlist.write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
}

export interface SavedSearch {
  query: string;
  label: string;
  savedAt: string;
}

export const savedSearches = createStore<SavedSearch[]>("vozodrom.savedSearches", []);
