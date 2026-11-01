// Fetches admins' catalogue corrections from the live site into src/data/catalog-edits.json before
// the build, so the static catalogue pages carry them. Runs on CI only (GitHub sets CI=true);
// locally the committed file stays as it is. If the site does not answer, the build goes on with
// the committed file rather than failing the deploy.
import { writeFileSync } from "node:fs";

const SOURCE = process.env.CATALOG_EDITS_URL ?? "https://vozodrom.cz/api/katalog/opravy/";
const TARGET = new URL("../src/data/catalog-edits.json", import.meta.url);

if (process.env.CI !== "true") process.exit(0);
try {
  const response = await fetch(SOURCE, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { edits } = await response.json();
  if (!Array.isArray(edits)) throw new Error("no edits array");
  writeFileSync(TARGET, `${JSON.stringify({ edits }, null, 2)}\n`);
  console.log(`catalog edits: ${edits.length}`);
} catch (error) {
  console.warn(`catalog edits not fetched (${error.message}); building with the committed file`);
}
