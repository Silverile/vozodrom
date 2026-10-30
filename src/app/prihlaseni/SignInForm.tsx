"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/lib/safe-next";

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

const ERRORS: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Nesprávný e-mail nebo heslo.",
  USER_ALREADY_EXISTS: "Účet s tímto e-mailem už existuje. Přihlaste se nebo si obnovte heslo.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Účet s tímto e-mailem už existuje. Přihlaste se nebo si obnovte heslo.",
  PASSWORD_TOO_SHORT: "Heslo musí mít alespoň 10 znaků.",
  BANNED_USER: "Tento účet je zablokovaný. Pokud jde o omyl, napište nám.",
};

function message(error: { code?: string; message?: string } | null): string {
  if (!error) return "";
  return (error.code && ERRORS[error.code]) || "Něco se nepovedlo. Zkuste to prosím znovu.";
}

export function SignInForm({ google }: { google: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const register = params.get("rezim") === "registrace";
  const next = safeNext(params.get("dalsi"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function submit(form: FormData) {
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setError("");
    setUnverified(null);
    if (register) {
      const name = String(form.get("name") ?? "").trim() || email.split("@")[0];
      const { error } = await authClient.signUp.email({ email, password, name, callbackURL: next });
      if (error) setError(message(error));
      else setSentTo(email);
    } else {
      const { error } = await authClient.signIn.email({ email, password, callbackURL: next });
      if (error?.code === "EMAIL_NOT_VERIFIED") setUnverified(email);
      else if (error) setError(message(error));
      else {
        router.replace(next);
        router.refresh();
      }
    }
    setBusy(false);
  }

  async function resend(email: string) {
    setBusy(true);
    await authClient.sendVerificationEmail({ email, callbackURL: next });
    setBusy(false);
    setUnverified(null);
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <div className="card p-6 space-y-3">
        <h1 className="text-2xl font-extrabold">Zkontrolujte e-mail</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Na adresu <strong className="text-[var(--color-ink)]">{sentTo}</strong> jsme poslali odkaz pro potvrzení. Po jeho otevření budete přihlášeni.
        </p>
        <button type="button" className="text-sm text-[var(--color-brand)] hover:underline" onClick={() => setSentTo(null)}>Zpět</button>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">{register ? "Vytvořit účet" : "Přihlásit se"}</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Účet slouží k uložení oblíbených aut a hlídacích psů na všech zařízeních a později k přidání inzerátu.
        </p>
      </div>

      {google && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: next })}
            className="w-full flex items-center justify-center gap-3 rounded-[10px] border border-[#dadce0] bg-white text-[#1f1f1f] font-semibold py-2.5 hover:bg-[#f2f2f2] disabled:opacity-60"
          >
            <GoogleIcon /> Pokračovat přes Google
          </button>
          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
            <span className="h-px flex-1 bg-[var(--color-line)]" /> nebo e-mailem <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>
        </>
      )}

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(new FormData(e.currentTarget));
        }}
      >
        {register && (
          <label className="block text-sm">Jméno nebo přezdívka
            <input className="input mt-1" name="name" autoComplete="nickname" maxLength={60} />
          </label>
        )}
        <label className="block text-sm">E-mail
          <input className="input mt-1" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="block text-sm">Heslo
          <input className="input mt-1" name="password" type="password" autoComplete={register ? "new-password" : "current-password"} required minLength={register ? 10 : undefined} />
          {register && <span className="text-xs text-[var(--color-muted)]">alespoň 10 znaků</span>}
        </label>
        {register && (
          <label className="flex gap-2 text-sm text-[var(--color-muted)]">
            <input type="checkbox" required className="mt-1" />
            <span>Souhlasím s podmínkami a beru na vědomí <Link href="/soukromi/" className="underline">zásady ochrany soukromí</Link>.</span>
          </label>
        )}
        <button type="submit" disabled={busy} className="btn-cta w-full disabled:opacity-60">{register ? "Vytvořit účet" : "Přihlásit se"}</button>
      </form>

      {error && <p role="alert" className="text-sm text-[var(--color-warn)]">{error}</p>}
      {unverified && (
        <p role="alert" className="text-sm text-[var(--color-warn)]">
          E-mail zatím není potvrzený.{" "}
          <button type="button" disabled={busy} className="underline" onClick={() => resend(unverified)}>Poslat odkaz znovu</button>
        </p>
      )}

      {!register && (
        <p className="text-sm text-center">
          <Link href="/zapomenute-heslo/" className="text-[var(--color-brand)] hover:underline">Zapomněli jste heslo?</Link>
        </p>
      )}
      <p className="text-sm text-center text-[var(--color-muted)]">
        {register ? "Už účet máte? " : "Nemáte účet? "}
        <button
          type="button"
          className="text-[var(--color-brand)] hover:underline"
          onClick={() => {
            setError("");
            const query = new URLSearchParams(params);
            if (register) query.delete("rezim");
            else query.set("rezim", "registrace");
            router.replace(`/prihlaseni/${query.size ? `?${query}` : ""}`);
          }}
        >
          {register ? "Přihlásit se" : "Zaregistrovat se"}
        </button>
      </p>
    </div>
  );
}
