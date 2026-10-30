"use client";

import { useState } from "react";

/** The number appears only after a click, which keeps it out of casual copying and simple scrapers' text. */
export function PhoneReveal({ phone }: { phone: string }) {
  const [shown, setShown] = useState(false);
  const pretty = phone.replace(/^(\+\d{3})?(\d{3})(\d{3})(\d{3})$/, (_, cc, a, b, c) => [cc, a, b, c].filter(Boolean).join(" "));
  return shown ? (
    <a href={`tel:${phone}`} className="btn-cta w-full justify-center">{pretty}</a>
  ) : (
    <button type="button" className="btn-cta w-full" onClick={() => setShown(true)}>Zobrazit telefon</button>
  );
}
