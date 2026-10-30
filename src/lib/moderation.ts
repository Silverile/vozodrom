import "server-only";

import type { Draft } from "./listing-draft";

// Automatic first pass over a listing before it goes live. Clean listings are published at once;
// anything matching a rule waits for a moderator, who sees the reasons. The rules aim at the
// usual car-ad fraud (advance payment, contact moved off the site, price far below the market)
// and at content that must not be published. They flag, they never reject on their own.

export interface ReviewContext {
  /** hours since the seller's account was created */
  accountAgeHours: number;
  /** listings of this seller that were published before */
  publishedBefore: number;
  /** market price estimate for comparable cars, when there is one */
  marketPrice: number | null;
}

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Phrases (without diacritics) that send a listing to a moderator. Whole words only. */
const PHRASES: Record<string, string[]> = {
  "platba předem nebo převodem do zahraničí": [
    "western union", "moneygram", "zaloha predem", "zalohu predem", "zalohou predem", "platba predem", "platbu predem",
    "kauce", "kauci", "paysafecard", "bitcoin", "kryptomen",
  ],
  "dodání bez prohlídky": ["doruceni kuryrem", "doruceni dpd", "dovezu az domu bez", "auto je v zahranici", "jsem v zahranici", "jsem momentalne v zahranici"],
  "kontakt mimo web": ["whatsapp", "telegram", "viber", "signal app"],
  "vůz bez dokladů nebo s pochybnou historií": ["kradene", "kradeny", "bez dokladu", "bez tp", "bez technickeho prukazu", "stoceny tachometr", "stocene km", "padelek"],
  "vulgarismy": ["kurva", "kokot", "zmrd", "debil", "pica", "curak"],
};

const LINK = /\bhttps?:\/\/|\bwww\.|\b[a-z0-9-]+\.(cz|sk|com|eu|net|org|info|ru)\b/i;
const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
/** 9+ digits, optionally grouped by spaces, dots or dashes: a phone number written into the text. */
const PHONE = /(\+?\d[\s.-]?){9,}/;

export function reviewListing(data: Draft, context: ReviewContext): string[] {
  const findings = new Set<string>();
  const text = ` ${fold([data.description, data.color, data.engine, data.model].join(" ")).replace(/[^a-z0-9]+/g, " ")} `;
  for (const [reason, phrases] of Object.entries(PHRASES)) {
    if (phrases.some((p) => text.includes(` ${p} `))) findings.add(reason);
  }
  const free = `${data.description} ${data.color} ${data.engine}`;
  if (LINK.test(free)) findings.add("odkaz v textu inzerátu");
  if (EMAIL.test(free) || PHONE.test(free)) findings.add("kontakt v textu inzerátu (patří do pole Telefon)");
  if (context.marketPrice && data.price < context.marketPrice * 0.5) findings.add("cena o více než polovinu nižší než trh");
  if (context.accountAgeHours < 24 && context.publishedBefore === 0) findings.add("první inzerát nového účtu");
  return [...findings];
}
