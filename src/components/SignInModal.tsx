"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { SignInForm } from "@/app/prihlaseni/SignInForm";

const OPEN_EVENT = "vozodrom:prihlasit";

interface Options {
  google: boolean;
  signupOpen: boolean;
}

let options: Promise<Options> | undefined;
function loadOptions(): Promise<Options> {
  options ??= fetch("/api/prihlaseni/volby/")
    .then((response) => (response.ok ? (response.json() as Promise<Options>) : Promise.reject(new Error())))
    .catch(() => {
      options = undefined;
      return { google: false, signupOpen: true };
    });
  return options;
}

/** Opens the sign-in dialog; `next` is where Google and e-mail links return (default: this page). */
export function openSignIn(next?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: next }));
}

/**
 * Link to the sign-in page that opens the dialog instead. It stays a real link, so a new tab,
 * a page without JavaScript and the sign-in pages themselves still get /prihlaseni/.
 */
export function SignInLink({ next, className, children }: { next?: string; className?: string; children: ReactNode }) {
  const pathname = usePathname();
  const href = next ? `/prihlaseni/?dalsi=${encodeURIComponent(next)}` : "/prihlaseni/";
  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (pathname.startsWith("/prihlaseni")) return;
    event.preventDefault();
    openSignIn(next);
  }
  return <Link href={href} className={className} onClick={open} onMouseEnter={() => void loadOptions()} prefetch={false}>{children}</Link>;
}

/** The sign-in dialog, mounted once in the layout. */
export function SignInModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<{ next: string; options: Options } | null>(null);

  useEffect(() => {
    async function open(event: Event) {
      const next = (event as CustomEvent<string | undefined>).detail ?? location.pathname + location.search;
      setState({ next, options: await loadOptions() });
      dialog.current?.showModal();
    }
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="sign-in-title"
      className="sign-in-dialog card p-6 w-[calc(100%-2rem)] max-w-md"
      onClose={() => setState(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {state && (
        <>
          <button type="button" aria-label="Zavřít" onClick={close} className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-field)] hover:text-[var(--color-ink)]">
            ✕
          </button>
          <Suspense>
            <SignInForm google={state.options.google} signupOpen={state.options.signupOpen} modal={{ next: state.next, onClose: close }} />
          </Suspense>
        </>
      )}
    </dialog>
  );
}
