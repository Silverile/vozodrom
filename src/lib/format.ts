const czk = new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("cs-CZ");

export const formatPrice = (value: number) => czk.format(value);
export const formatKm = (value: number) => `${num.format(value)} km`;
export const formatNumber = (value: number) => num.format(value);
export const formatPercent = (value: number) => `${Math.round(value * 100)} %`;

/** User listings are rendered on request at /inzerat/; test and feed listings are prerendered at /inzeraty/. */
export const listingHref = (listing: { id: string; source: { kind: string } }) =>
  listing.source.kind === "user" ? `/inzerat/${listing.id}/` : `/inzeraty/${listing.id}/`;

/** "30. 10. 2026" from a date ("2026-10-30") or a full ISO timestamp. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

/** "dnes", "včera", "před 5 dny", counted in whole days from today (UTC). */
export function formatAgo(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const days = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${iso.slice(0, 10)}T00:00:00Z`)) / 86400000);
  if (days <= 0) return "dnes";
  if (days === 1) return "včera";
  return `před ${days} dny`;
}

/** Turns a basePath-less public path into one that works on GitHub Pages too. */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
