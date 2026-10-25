const czk = new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("cs-CZ");

export const formatPrice = (value: number) => czk.format(value);
export const formatKm = (value: number) => `${num.format(value)} km`;
export const formatNumber = (value: number) => num.format(value);
export const formatPercent = (value: number) => `${Math.round(value * 100)} %`;

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

/** Turns a basePath-less public path into one that works on GitHub Pages too. */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
