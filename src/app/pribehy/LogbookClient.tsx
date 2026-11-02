"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SignInLink } from "@/components/SignInModal";
import { OPERATOR } from "@/lib/operator";

// Interactive parts of the public logbook pages: likes and follows, comments, reports. A visitor
// who is not signed in gets the sign-in dialog instead.

async function post(url: string, body: unknown, method = "POST") {
  const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const result = (await response.json().catch(() => ({}))) as { count?: number; error?: string };
  return response.ok ? { ok: true as const, count: result.count ?? 0 } : { ok: false as const, error: result.error ?? "Akce se nepovedla." };
}

/** Like of a car or an entry, or follow of a car; counts update at once and roll back on failure. */
export function Reaction({ what, id, initialOn, initialCount, signedIn, next, own }: {
  what: "car-like" | "follow" | "entry-like";
  id: string;
  initialOn: boolean;
  initialCount: number;
  signedIn: boolean;
  next: string;
  own: boolean;
}) {
  const [on, setOn] = useState(initialOn);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const follow = what === "follow";
  const label = follow ? (on ? "Sledujete" : "Sledovat") : on ? "Líbí se vám" : "Líbí se mi";
  const content = (
    <>
      {!follow && <Icon name={on ? "favorite-filled" : "favorite"} />}
      {follow && <Icon name="notifications" />}
      <span>{label}</span>
      <span className="text-[var(--color-muted)]">{count}</span>
    </>
  );
  if (own) {
    return (
      <span className="pill gap-1.5 cursor-default" title={follow ? "Sledující vašeho auta" : "Kolika lidem se líbí"}>
        {!follow ? <Icon name="favorite" /> : <Icon name="notifications" />}
        <span>{follow ? "Sledující" : "Líbí se"}</span>
        <span className="text-[var(--color-muted)]">{count}</span>
      </span>
    );
  }
  if (!signedIn) return <SignInLink next={next} className="pill gap-1.5">{content}</SignInLink>;
  return (
    <button
      type="button"
      className="pill gap-1.5"
      data-on={on}
      aria-pressed={on}
      disabled={busy}
      onClick={async () => {
        const nextOn = !on;
        setOn(nextOn);
        setCount((c) => c + (nextOn ? 1 : -1));
        setBusy(true);
        const result = await post("/api/deniky/reakce/", { what, id, on: nextOn });
        setBusy(false);
        if (result.ok) setCount(result.count);
        else {
          setOn(!nextOn);
          setCount((c) => c + (nextOn ? -1 : 1));
        }
      }}
    >
      {content}
    </button>
  );
}

export function CommentForm({ entryId, signedIn, next }: { entryId: string; signedIn: boolean; next: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!signedIn) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        <SignInLink next={next} className="text-[var(--color-brand)] hover:underline">Přihlaste se</SignInLink> a napište komentář.
      </p>
    );
  }
  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const result = await post("/api/deniky/komentare/", { entryId, body: text });
        setBusy(false);
        if (!result.ok) return setError(result.error);
        setText("");
        router.refresh();
      }}
    >
      <label htmlFor="komentar" className="sr-only">Komentář</label>
      <textarea id="komentar" className="input min-h-24" maxLength={2000} placeholder="Napište komentář" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-cta text-sm" disabled={busy || text.trim().length < 2}>Odeslat</button>
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </div>
    </form>
  );
}

export function DeleteComment({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-xs text-[var(--color-muted)] hover:text-[var(--color-warn)]"
      onClick={async () => {
        if (!window.confirm("Smazat komentář?")) return;
        const response = await fetch(`/api/deniky/komentare/?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (response.ok) router.refresh();
      }}
    >
      Smazat
    </button>
  );
}

/** "Nahlásit" for a car, an entry or a comment: a short reason goes to the moderators. Without an
 *  account the notice goes by e-mail (terms section 6), so anyone can report (DSA art. 16). */
export function ReportContent({ kind, id, signedIn, next }: { kind: "car" | "entry" | "comment"; id: string; signedIn: boolean; next: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [goodFaith, setGoodFaith] = useState(false);
  const [state, setState] = useState<"" | "busy" | "sent">("");
  const [error, setError] = useState("");
  const trigger = "text-xs text-[var(--color-muted)] hover:text-[var(--color-warn)]";
  if (!signedIn && !open) return <button type="button" className={trigger} onClick={() => setOpen(true)}>Nahlásit</button>;
  if (!signedIn)
    return (
      <p className="w-full text-xs text-[var(--color-muted)]">
        <SignInLink next={next} className="underline">Přihlaste se</SignInLink> a nahlaste obsah tady. Obsah můžete nahlásit i bez účtu na{" "}
        {OPERATOR.email ? <a href={`mailto:${OPERATOR.email}`} className="underline">{OPERATOR.email}</a> : <a href="/podminky/#kontakt" className="underline">kontaktní e-mail</a>}.
        Uveďte přesný odkaz, důvod a prohlášení, že jsou informace podle vašeho nejlepšího vědomí přesné a úplné. Podrobnosti najdete v{" "}
        <a href="/podminky/#hlaseni" className="underline">podmínkách užívání</a>.{" "}
        <button type="button" className="underline" onClick={() => setOpen(false)}>Zavřít</button>
      </p>
    );
  if (state === "sent") return <span role="status" className="text-xs text-[var(--color-muted)]">Nahlášeno, děkujeme.</span>;
  if (!open) return <button type="button" className={trigger} onClick={() => setOpen(true)}>Nahlásit</button>;
  return (
    <form
      className="w-full space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        const result = await post("/api/deniky/hlaseni/", { kind, id, reason, goodFaith });
        if (result.ok) setState("sent");
        else {
          setState("");
          setError(result.error);
        }
      }}
    >
      <label htmlFor={`hlaseni-${id}`} className="text-xs text-[var(--color-muted)]">Co je v nepořádku?</label>
      <textarea id={`hlaseni-${id}`} className="input min-h-20" maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} />
      <label className="flex gap-2 text-xs text-[var(--color-muted)]">
        <input type="checkbox" checked={goodFaith} onChange={(e) => setGoodFaith(e.target.checked)} className="mt-0.5" />
        <span>Prohlašuji, že údaje v hlášení jsou podle mého nejlepšího vědomí přesné a úplné a podávám ho v dobré víře.</span>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="pill" disabled={state === "busy" || reason.trim().length < 10 || !goodFaith}>Odeslat hlášení</button>
        <button type="button" className="text-xs text-[var(--color-muted)]" onClick={() => setOpen(false)}>Zrušit</button>
        {error && <span role="alert" className="text-xs text-[var(--color-warn)]">{error}</span>}
      </div>
    </form>
  );
}
