// Partner (affiliate) offers shown next to a car: insurance, a history check, an inspection, a loan.
// A partner appears only once its partner link is filled in below, after the owner is accepted into
// its programme (see docs/oslovovani.md). Links are marked as partner links and use
// rel="sponsored"; nothing about the visitor or the listing (no VIN, no contact) is sent along.
//
// Consumer credit may only be advertised with the APR (RPSN) and a representative example
// (zákon č. 257/2016 Sb.), so a "credit" partner is shown only with the disclosure text the lender
// supplies — never with rates written by us.

export type PartnerKind = "insurance" | "history" | "inspection" | "credit";

export interface Partner {
  key: string;
  kind: PartnerKind;
  /** shown as the link text's brand */
  name: string;
  title: string;
  text: string;
  /** partner (affiliate) link from the programme; empty = not shown */
  url: string;
  /** for credit: the lender's RPSN + representative example, verbatim; required to show it */
  disclosure?: string;
}

export const PARTNERS: Partner[] = [
  {
    key: "usetreno",
    kind: "insurance",
    name: "Ušetřeno.cz",
    title: "Spočítat pojištění",
    text: "Povinné ručení a havarijní pojištění od více pojišťoven na jednom místě.",
    url: "",
  },
  {
    key: "cebia",
    kind: "history",
    name: "Cebia",
    title: "Prověřit historii vozu",
    text: "Kontrola podle VIN: nájezdy, poškození, původ vozu.",
    url: "",
  },
  {
    key: "carvertical",
    kind: "history",
    name: "carVertical",
    title: "Prověřit historii vozu",
    text: "Zpráva o historii vozu podle VIN.",
    url: "",
  },
  {
    key: "automato",
    kind: "inspection",
    name: "Automato",
    title: "Objednat kontrolu technikem",
    text: "Nezávislý technik prohlédne auto ještě před koupí.",
    url: "",
  },
  {
    key: "zonky",
    kind: "credit",
    name: "Zonky",
    title: "Financování vozu",
    text: "Půjčka na auto.",
    url: "",
    disclosure: "",
  },
];

/** Partners ready to show: a partner link, and for credit also the lender's disclosure. One per kind. */
export function activePartners(kinds: PartnerKind[] = ["history", "inspection", "insurance", "credit"]): Partner[] {
  const ready = PARTNERS.filter((p) => p.url && (p.kind !== "credit" || p.disclosure?.trim()));
  return kinds.flatMap((k) => ready.find((p) => p.kind === k) ?? []);
}
