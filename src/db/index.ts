import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { cache } from "react";
import * as schema from "./schema";

// Workers cannot keep connections between requests, so each request gets its own pool;
// Hyperdrive does the real pooling next to Neon. `cache` shares it within one render.
// maxUses: 1 closes each connection right after use, so none is left open for the runtime to
// kill once the request ends. Through Hyperdrive a request may run up to 4 queries at once; the
// local PGlite server answers parallel connections unreliably, so locally they run one by one.
export const getDb = cache(() => {
  const { env } = getCloudflareContext();
  const connectionString = env.HYPERDRIVE.connectionString;
  const local = /@(127\.0\.0\.1|localhost)[:/]/.test(connectionString);
  const pool = new Pool({ connectionString, max: local ? 1 : 4, maxUses: 1 });
  return drizzle({ client: pool, schema });
});

export type Db = ReturnType<typeof getDb>;
