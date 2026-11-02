// Who runs Vozodrom: shown in the terms of use (/podminky/) and the privacy page. The name, address
// and a working e-mail belong here before the service is announced; the IČO is added once the trade
// licence is issued. An empty field is shown as "doplníme".

export const OPERATOR = {
  /** full name of the sole trader, as in the trade register */
  name: "",
  /** identification number (IČO), 8 digits; until it is issued the pages say it will be added */
  ico: "",
  /** registered address (místo podnikání) */
  address: "",
  /** contact e-mail for users and authorities, also the DSA single point of contact (art. 11, 12) */
  email: "vozodrom@gmail.com",
};

/** When the current terms of use took effect, e.g. "1. 12. 2026"; empty until they are published. */
export const TERMS_EFFECTIVE = "";

/** The operator line for legal pages, or null while the name is not filled in. */
export function operatorLine(): string | null {
  const { name, ico, address } = OPERATOR;
  if (!name) return null;
  return [name, address && `místo podnikání ${address}`, `IČO ${ico || "bude doplněno po přidělení"}`].filter(Boolean).join(", ");
}
