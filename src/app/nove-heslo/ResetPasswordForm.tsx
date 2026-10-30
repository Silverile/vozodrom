"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

// Opened from the reset e-mail: Better Auth checks the link and redirects here with ?token=…
// (or ?error=INVALID_TOKEN when the link is expired or already used).
export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token || params.get("error")) {
    return (
      <div className="card p-6 space-y-3">
        <h1 className="text-2xl font-extrabold">Odkaz neplatí</h1>
        <p className="text-sm text-[var(--color-muted)]">Odkaz pro nové heslo vypršel nebo už byl použit.</p>
        <Link href="/zapomenute-heslo/" className="btn-cta inline-flex text-sm">Poslat nový odkaz</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-6 space-y-3">
        <h1 className="text-2xl font-extrabold">Heslo je změněné</h1>
        <p className="text-sm text-[var(--color-muted)]">Ostatní přihlášení byla z bezpečnosti odhlášena.</p>
        <Link href="/prihlaseni/" className="btn-cta inline-flex text-sm">Přihlásit se</Link>
      </div>
    );
  }

  return (
    <form
      className="card p-6 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const password = String(form.get("password") ?? "");
        if (password !== String(form.get("again") ?? "")) {
          setError("Hesla se neshodují.");
          return;
        }
        setBusy(true);
        setError("");
        const { error } = await authClient.resetPassword({ newPassword: password, token });
        setBusy(false);
        if (error) setError(error.code === "PASSWORD_TOO_SHORT" ? "Heslo musí mít alespoň 10 znaků." : "Odkaz vypršel nebo už byl použit. Požádejte o nový.");
        else setDone(true);
      }}
    >
      <h1 className="text-2xl font-extrabold">Nové heslo</h1>
      <label className="block text-sm">Nové heslo
        <input className="input mt-1" name="password" type="password" autoComplete="new-password" required minLength={10} />
        <span className="text-xs text-[var(--color-muted)]">alespoň 10 znaků</span>
      </label>
      <label className="block text-sm">Heslo znovu
        <input className="input mt-1" name="again" type="password" autoComplete="new-password" required minLength={10} />
      </label>
      <button type="submit" disabled={busy} className="btn-cta w-full disabled:opacity-60">Uložit heslo</button>
      {error && <p role="alert" className="text-sm text-[var(--color-warn)]">{error}</p>}
    </form>
  );
}
