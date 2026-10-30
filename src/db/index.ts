import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { cache } from "react";
import * as schema from "./schema";

// Workers cannot keep connections between requests, so each request gets its own pool;
// Hyperdrive does the real pooling next to Neon. `cache` shares it within one render.
// max: 1 runs a request's queries one after another; maxUses: 1 closes each connection right
// after use, so none is left open for the runtime to kill once the request ends.
export const getDb = cache(() => {
  const { env } = getCloudflareContext();
  const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString, max: 1, maxUses: 1 });
  return drizzle({ client: pool, schema });
});

export type Db = ReturnType<typeof getDb>;
