import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ModelCard } from "./modelCards";

// Model cards are static files, one per model line (public/katalog-data/<make>/<line>.json, written
// by scripts/app-model-cards.mjs), not part of the Worker bundle. When pages are prerendered they
// are read from disk; in the Worker through the ASSETS binding. Cards are cached per isolate.
// Admins' edits are already in the files (scripts/app-model-cards.mjs replays them); an edited line
// also has <line>.base.json, the card as the data files have it.

const SLUG = /^[a-z0-9-]+$/;
const cache = new Map<string, Promise<ModelCard | undefined>>();

async function fromDisk(path: string): Promise<string | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    return await readFile(`${process.cwd()}/public${path}`, "utf8");
  } catch {
    return null;
  }
}

async function fromAssets(path: string): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const response = await env.ASSETS?.fetch(new URL(path, "https://assets.local"));
    if (!response) return null;
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
}

function read(path: string): Promise<ModelCard | undefined> {
  let card = cache.get(path);
  if (!card) {
    card = (async () => {
      const text = (await fromDisk(path)) ?? (await fromAssets(path));
      // a miss is not kept: a model without a card asks again, a failed fetch is retried
      if (!text) cache.delete(path);
      return text ? (JSON.parse(text) as ModelCard) : undefined;
    })();
    cache.set(path, card);
  }
  return card;
}

/** The model card as the site shows it, with admins' edits; base: true gives it as the data files have it. */
export async function loadCard(makeSlug: string, lineSlug: string, { base = false } = {}): Promise<ModelCard | undefined> {
  if (!SLUG.test(makeSlug) || !SLUG.test(lineSlug)) return undefined;
  const path = `/katalog-data/${makeSlug}/${lineSlug}`;
  return (base && (await read(`${path}.base.json`))) || read(`${path}.json`);
}
