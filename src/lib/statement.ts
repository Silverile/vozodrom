import { OPERATOR } from "./operator";

// Statement of reasons for restricting someone's content (DSA art. 17, terms section 6): which
// content and how far, the facts, the concrete rule broken, how it came to our attention and who
// decided, for how long, and how to object. Sent to the author's Vozodrom thread by every place
// that hides or removes content. Moderators pick the rule from RULES; the reason is their own words.

/** Rules a moderator can rely on, from the terms of use (vozodrom.cz/podminky/). */
export const RULES = {
  podvod: "Podvodné nabídky, kradená vozidla, padělané doklady a úmyslně nepravdivé údaje (Podmínky užívání, oddíl 4)",
  udaje: "Pravdivé a úplné údaje o voze v inzerátu (Podmínky užívání, oddíl 5)",
  opravneni: "Inzerovat lze jen vlastní auto nebo auto, které smíte prodat (Podmínky užívání, oddíl 5)",
  tachometr: "Stáčení tachometru, obcházení STK nebo emisních předpisů (Podmínky užívání, oddíl 4)",
  soukromi: "Neoprávněné zveřejnění cizích soukromých údajů nebo podobizen (Podmínky užívání, oddíl 4)",
  urazky: "Urážky, vyhrožování, nenávistné projevy a zesměšňování lidí (Podmínky užívání, oddíl 4)",
  prava: "Porušení autorských práv, ochranných známek nebo obchodního tajemství (Podmínky užívání, oddíl 4)",
  spam: "Reklama a odkazy mimo inzeráty, spam a opakované vkládání (Podmínky užívání, oddíl 4)",
  nevhodne: "Pornografie, násilí a obsah, který na web o autech nepatří (Podmínky užívání, oddíl 4)",
  zakon: "Nezákonný obsah: konkrétní právní předpis je uveden v důvodu",
} as const;
export type RuleKey = keyof typeof RULES;

export function isRule(key: unknown): key is RuleKey {
  return typeof key === "string" && key in RULES;
}

export interface Restriction {
  /** which content, e.g. "Inzerát Škoda Octavia 2015" */
  what: string;
  /** where it is, a site path, so the author can find it */
  link?: string;
  /** what happened to it, e.g. "jsme stáhli z webu" */
  action: string;
  /** the facts and reasons, in words the author understands */
  reason: string;
  /** the rule relied on: a RULES key, or own words where no single rule fits (automatic steps) */
  rule: RuleKey | { text: string };
  /** how it came to our attention */
  flaggedBy: "hlášením uživatelů" | "automatickou kontrolou" | "vlastní kontrolou moderátora";
  /** who decided: a person, or the system automatically */
  decidedBy: "moderátor" | "automaticky systém";
  /** how long it lasts */
  duration?: string;
}

/** Where to ask for a review: the contact e-mail, or the terms' contact section while it is empty. */
export function reviewContact(): string {
  return OPERATOR.email || "kontakt uvedený v podmínkách užívání (vozodrom.cz/podminky/#kontakt)";
}

/** The redress sentence that ends every decision, for authors and notifiers alike. */
export function redress(): string {
  return `S rozhodnutím nesouhlasíte? Napište na ${reviewContact()} a označte, o který obsah jde; žádost posoudí člověk. Můžete se také obrátit na soud.`;
}

export function statementOfReasons(r: Restriction): string {
  return [
    `${r.what} ${r.action}.${r.link ? ` (vozodrom.cz${r.link})` : ""}`,
    `Důvod: ${r.reason}`,
    `Pravidlo: ${typeof r.rule === "string" ? RULES[r.rule] : r.rule.text}.`,
    `Obsah byl označen ${r.flaggedBy}; ${r.decidedBy === "moderátor" ? "o omezení rozhodl moderátor" : "omezení provedl automaticky systém, posoudí ho moderátor"}.`,
    `Trvání: ${r.duration ?? "do odvolání; obsah můžete upravit nebo požádat o přezkoumání"}.`,
    redress(),
  ].join("\n");
}
