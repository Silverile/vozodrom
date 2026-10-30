"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useUnread } from "@/lib/chat-client";
import { SignInLink } from "./SignInModal";

// Header entries: "Přihlásit" for visitors; messages (with the unread count) and the account for
// signed-in users. The session is read on the client so that prerendered pages stay static.
export function AccountLink() {
  const { data } = authClient.useSession();
  const signedIn = Boolean(data?.user);
  const unread = useUnread();
  const linkClass = "relative px-2 sm:px-3 py-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap";
  return (
    <>
      {signedIn && (
        <Link href="/ucet/zpravy/" aria-label={unread ? `Zprávy, ${unread} nepřečtených` : "Zprávy"} className={linkClass}>
          <span aria-hidden="true">✉</span>
          <span className="hidden sm:inline"> Zprávy</span>
          {unread > 0 && (
            <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-[var(--color-accent)] text-white text-[11px] font-bold">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>
      )}
      {signedIn ? (
        <Link href="/ucet/" aria-label="Můj účet" className={linkClass}>
          <span aria-hidden="true" className="sm:hidden">👤</span>
          <span className="hidden sm:inline max-w-[12ch] truncate align-bottom">Můj účet</span>
        </Link>
      ) : (
        <SignInLink className={linkClass}>
          <span aria-hidden="true" className="sm:hidden">👤</span>
          <span className="sr-only sm:not-sr-only">Přihlásit</span>
        </SignInLink>
      )}
    </>
  );
}
