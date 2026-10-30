import type { ListingStatus } from "@/db/schema";

export const STATUS_LABEL: Record<ListingStatus, string> = {
  draft: "koncept",
  pending: "čeká na schválení",
  published: "zveřejněno",
  rejected: "zamítnuto",
  withdrawn: "staženo",
};

export const STATUS_STYLE: Record<ListingStatus, string> = {
  draft: "bg-[var(--color-field)] text-[var(--color-muted)]",
  pending: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  published: "bg-[var(--color-good-soft)] text-[var(--color-good)]",
  rejected: "bg-[var(--color-bad-soft)] text-[var(--color-bad)]",
  withdrawn: "bg-[var(--color-field)] text-[var(--color-muted)]",
};

/** Messengers a seller can offer on the listing phone number. */
export const MESSENGERS = ["whatsapp", "telegram", "viber"] as const;
export type Messenger = (typeof MESSENGERS)[number];
export const MESSENGER_LABEL: Record<Messenger, string> = { whatsapp: "WhatsApp", telegram: "Telegram", viber: "Viber" };

/** Reasons offered in the "Nahlásit inzerát" form (keys: REPORT_CATEGORIES in db/schema). */
export const REPORT_CATEGORY_LABEL = {
  podvod: "Podezření na podvod",
  nezakonny: "Nezákonný obsah (kradené vozidlo, padělek…)",
  nepravdive: "Nepravdivé údaje o voze",
  jine: "Jiný důvod",
} as const;

/** Public URL of a stored listing photo (served by /foto/[...key]). */
export const photoUrl = (key: string) => `/foto/${key}`;
