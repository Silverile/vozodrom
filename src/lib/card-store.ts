import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { applyEdits, builtEditsOf } from "./catalog-edits";
import type { ModelCard } from "./modelCards";

// Model cards are static files, one per model line (public/katalog-data/<make>/<line>.json, written
// by scripts/app-model-cards.mjs), not part of the Worker bundle. When pages are prerendered they
// are read from disk; in the Worker through the ASSETS binding. Cards are cached per isolate.

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

function read(makeSlug: string, lineSlug: string): Promise<ModelCard | undefined> {
  const path = `/katalog-data/${makeSlug}/${lineSlug}.json`;
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

/** The model card with admins' text corrections applied (lib/catalog-edits); edits: false gives the data as built. */
export async function loadCard(makeSlug: string, lineSlug: string, { edits = true } = {}): Promise<ModelCard | undefined> {
  if (!SLUG.test(makeSlug) || !SLUG.test(lineSlug)) return undefined;
  const card = await read(makeSlug, lineSlug);
  return card && (edits ? applyEdits(card, builtEditsOf(makeSlug, lineSlug)) : card);
}
