"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Mock of the planned sign-in: shows the flow, but nothing is sent or stored.
// Real accounts need a backend and an auth provider, chosen before launch.

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function SignInMock() {
  const router = useRouter();
  const register = useSearchParams().get("rezim") === "registrace";
  const [notice, setNotice] = useState<string | null>(null);
  const unavailable = () => setNotice("Toto je náhled. Přihlašování spustíme spolu s účty; nic se neodeslalo ani neuložilo.");

  return (
    <div className="card p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">{register ? "Vytvořit účet" : "Přihlásit se"}</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Účet bude potřeba k přidání inzerátu, upozornění na nová auta a synchronizaci výběru mezi zařízeními.
        </p>
      </div>

      <button
        type="button"
        onClick={unavailable}
        className="w-full flex items-center justify-center gap-3 rounded-[10px] bg-white text-[#1f1f1f] font-semibold py-2.5 hover:bg-[#f2f2f2]"
      >
        <GoogleIcon /> Pokračovat přes Google
      </button>

      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <span className="h-px flex-1 bg-[var(--color-line)]" /> nebo e-mailem <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          e.currentTarget.reset();
          unavailable();
        }}
      >
        {register && (
          <label className="block text-sm">Jméno nebo přezdívka
            <input className="input mt-1" name="name" autoComplete="nickname" />
          </label>
        )}
        <label className="block text-sm">E-mail
          <input className="input mt-1" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="block text-sm">Heslo
          <input className="input mt-1" name="password" type="password" autoComplete={register ? "new-password" : "current-password"} required minLength={register ? 10 : undefined} />
        </label>
        {register && (
          <label className="flex gap-2 text-sm text-[var(--color-muted)]">
            <input type="checkbox" required className="mt-1" />
            <span>Souhlasím s podmínkami a beru na vědomí <Link href="/soukromi/" className="underline">zásady ochrany soukromí</Link>.</span>
          </label>
        )}
        <button type="submit" className="btn-cta w-full">{register ? "Vytvořit účet" : "Přihlásit se"}</button>
      </form>

      {notice && <p role="status" className="text-sm text-[var(--color-warn)]">{notice}</p>}

      <p className="text-sm text-center text-[var(--color-muted)]">
        {register ? "Už účet máte? " : "Nemáte účet? "}
        <button type="button" className="text-[var(--color-brand)] hover:underline" onClick={() => { setNotice(null); router.replace(register ? "/prihlaseni/" : "/prihlaseni/?rezim=registrace"); }}>
          {register ? "Přihlásit se" : "Zaregistrovat se"}
        </button>
      </p>
    </div>
  );
}
