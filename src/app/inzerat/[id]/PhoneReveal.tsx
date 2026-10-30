"use client";

import { useState } from "react";
import { MESSENGER_LABEL, type Messenger } from "@/lib/listing-status";

/** International digits for messenger links: Czech numbers may be stored without +420. */
const international = (phone: string) => (phone.startsWith("+") ? phone.slice(1) : phone.length === 9 ? `420${phone}` : phone);

const MESSENGER_URL: Record<Messenger, (digits: string) => string> = {
  whatsapp: (d) => `https://wa.me/${d}`,
  telegram: (d) => `https://t.me/+${d}`,
  viber: (d) => `viber://chat?number=%2B${d}`,
};

/**
 * The number and the seller's messengers appear only after a click, which keeps them out of
 * casual copying and simple scrapers' text.
 */
export function PhoneReveal({ phone, messengers }: { phone: string; messengers: Messenger[] }) {
  const [shown, setShown] = useState(false);
  const pretty = phone.replace(/^(\+\d{3})?(\d{3})(\d{3})(\d{3})$/, (_, cc, a, b, c) => [cc, a, b, c].filter(Boolean).join(" "));
  if (!shown) {
    return (
      <button type="button" className="btn-cta w-full" onClick={() => setShown(true)}>
        Zobrazit kontakt
      </button>
    );
  }
  const digits = international(phone);
  return (
    <div className="space-y-2">
      <a href={`tel:${phone}`} className="btn-cta w-full justify-center">{pretty}</a>
      {messengers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {messengers.map((m) => (
            <a key={m} href={MESSENGER_URL[m](digits)} target="_blank" rel="noopener noreferrer" className="pill">
              {MESSENGER_LABEL[m]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
