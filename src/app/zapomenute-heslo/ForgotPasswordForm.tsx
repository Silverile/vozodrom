"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="card p-6 space-y-4">
      <h1 className="text-2xl font-extrabold">Zapomenuté heslo</h1>
      {sent ? (
        // The same answer whether or not the address has an account, so it cannot be used to probe e-mails.
        <p className="text-sm text-[var(--color-muted)]">
          Pokud u nás má tato adresa účet, poslali jsme na ni odkaz pro nastavení nového hesla. Odkaz platí 1 hodinu.
        </p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
            setBusy(true);
            await authClient.requestPasswordReset({ email, redirectTo: "/nove-heslo/" });
            setBusy(false);
            setSent(true);
          }}
        >
          <p className="text-sm text-[var(--color-muted)]">Zadejte e-mail účtu a pošleme vám odkaz pro nastavení nového hesla.</p>
          <label className="block text-sm">E-mail
            <input className="input mt-1" name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit" disabled={busy} className="btn-cta w-full disabled:opacity-60">Poslat odkaz</button>
        </form>
      )}
      <p className="text-sm text-center">
        <Link href="/prihlaseni/" className="text-[var(--color-brand)] hover:underline">Zpět na přihlášení</Link>
      </p>
    </div>
  );
}
