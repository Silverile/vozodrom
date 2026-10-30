"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// Header entry: "Přihlásit" for visitors, the account for signed-in users. The session is read
// on the client so that prerendered pages stay static.
export function AccountLink() {
  const { data } = authClient.useSession();
  const signedIn = Boolean(data?.user);
  return (
    <Link
      href={signedIn ? "/ucet/" : "/prihlaseni/"}
      aria-label={signedIn ? "Můj účet" : "Přihlásit"}
      className="px-2 sm:px-3 py-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap"
    >
      <span aria-hidden="true" className="sm:hidden">👤</span>
      <span className="hidden sm:inline max-w-[12ch] truncate align-bottom">{signedIn ? "Můj účet" : "Přihlásit"}</span>
    </Link>
  );
}
