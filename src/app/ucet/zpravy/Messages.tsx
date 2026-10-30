"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatEvent, ChatMessage, ConversationSummary } from "@/lib/chat";
import { useChatEvents } from "@/lib/chat-client";

const time = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today ? d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleString("cs-CZ", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
};

/** Conversation list on the left, the open thread (?k=<id>) on the right; one column on phones. */
export function Messages({
  userId,
  initial,
  initialThread,
}: {
  userId: string;
  initial: ConversationSummary[];
  /** the thread named in the URL, rendered with the page */
  initialThread: { id: string; messages: ChatMessage[] } | null;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const openId = params.get("k");
  const [conversations, setConversations] = useState(initial);
  const [messages, setMessages] = useState<ChatMessage[]>(initialThread?.messages ?? []);
  // The thread already rendered by the server does not need to be fetched again.
  const preloaded = useRef(initialThread?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const open = conversations.find((c) => c.id === openId);

  const reloadList = useCallback(async () => {
    const response = await fetch("/api/zpravy/", { cache: "no-store" });
    if (response.ok) setConversations(((await response.json()) as { conversations: ConversationSummary[] }).conversations);
  }, []);

  const markRead = useCallback(async (id: string) => {
    await fetch(`/api/zpravy/${id}/precteno/`, { method: "POST" });
    setConversations((list) => list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  useEffect(() => {
    if (!openId) return;
    if (preloaded.current === openId) {
      preloaded.current = null;
      markRead(openId);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/api/zpravy/${openId}/`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<ChatMessage[]>) : []))
      .then((list) => {
        if (cancelled) return;
        setMessages(list);
        setLoading(false);
        markRead(openId);
      });
    return () => {
      cancelled = true;
    };
  }, [openId, markRead]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  // New messages arrive through the chat connection: append to the open thread, refresh the list.
  useChatEvents(
    useCallback(
      (event: ChatEvent) => {
        if (event.type !== "message") return;
        if (event.conversationId === openId) {
          setMessages((list) => {
            if (list.some((m) => m.id === event.message.id)) return list;
            // Our own message pushed back before the send request answered: it replaces the pending copy.
            const pending = list.findIndex((m) => m.id.startsWith("odesilani-") && m.body === event.message.body);
            return pending >= 0 ? list.map((m, i) => (i === pending ? event.message : m)) : [...list, event.message];
          });
          if (document.visibilityState === "visible") markRead(event.conversationId);
        }
        if (conversations.some((c) => c.id === event.conversationId)) {
          setConversations((list) =>
            list
              .map((c) =>
                c.id === event.conversationId
                  ? { ...c, preview: event.message.body.slice(0, 140), lastMessageAt: event.message.createdAt, unread: c.id === openId || event.message.senderId === userId ? c.unread : c.unread + 1 }
                  : c,
              )
              .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
          );
        } else reloadList();
      },
      [openId, conversations, userId, markRead, reloadList],
    ),
  );

  async function send() {
    if (!open || !text.trim()) return;
    setError("");
    // Shown at once; replaced by the stored message when the server answers, removed if it fails.
    const draft = text;
    const pending: ChatMessage = { id: `odesilani-${Date.now()}`, senderId: userId, body: draft.trim(), link: null, createdAt: new Date().toISOString() };
    setText("");
    setMessages((list) => [...list, pending]);
    const response = await fetch(`/api/zpravy/${open.id}/`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body: draft }) }).catch(() => null);
    const result = (await response?.json().catch(() => ({}))) as (ChatMessage & { error?: string }) | undefined;
    if (!response?.ok || !result?.id) {
      setMessages((list) => list.filter((m) => m.id !== pending.id));
      setText(draft);
      return setError(result?.error ?? "Zprávu se nepodařilo odeslat.");
    }
    // The pushed copy may already be in the list; keep exactly one.
    setMessages((list) => {
      const withoutPending = list.filter((m) => m.id !== pending.id);
      return withoutPending.some((m) => m.id === result.id) ? withoutPending : [...withoutPending, result];
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-[300px_minmax(0,1fr)] items-start">
      <section className={`card overflow-hidden ${openId ? "hidden md:block" : ""}`} aria-label="Konverzace">
        <h1 className="text-xl font-extrabold px-4 pt-4 pb-2">Zprávy</h1>
        {conversations.length === 0 && (
          <p className="px-4 pb-4 text-sm text-[var(--color-muted)]">Zatím žádné zprávy. Prodejci napíšete z inzerátu tlačítkem „Napsat prodejci“.</p>
        )}
        <ul>
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/ucet/zpravy/?k=${c.id}`}
                replace
                scroll={false}
                aria-current={c.id === openId ? "true" : undefined}
                className="flex gap-3 px-4 py-3 border-t border-[var(--color-line)] hover:bg-[var(--color-field)] aria-[current=true]:bg-[var(--color-field)]"
              >
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-field)]">{c.kind === "system" ? "🔔" : "💬"}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={`truncate ${c.unread ? "font-bold" : "font-semibold"}`}>{c.kind === "system" ? "Vozodrom" : c.counterpart ?? "Uživatel"}</span>
                    <span className="ml-auto shrink-0 text-xs text-[var(--color-muted)]">{time(c.lastMessageAt)}</span>
                  </span>
                  {c.kind === "listing" && <span className="block text-xs text-[var(--color-muted)] truncate">{c.title}</span>}
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm text-[var(--color-muted)]">{c.preview}</span>
                    {c.unread > 0 && <span className="ml-auto shrink-0 rounded-full bg-[var(--color-accent)] px-1.5 text-xs font-bold text-white">{c.unread}</span>}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`card flex flex-col min-h-[60vh] ${openId ? "" : "hidden md:flex"}`} aria-label="Konverzace">
        {!open ? (
          <p className="m-auto p-6 text-sm text-[var(--color-muted)]">Vyberte konverzaci.</p>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-[var(--color-line)] p-4">
              <button type="button" className="md:hidden pill !px-2" aria-label="Zpět na konverzace" onClick={() => router.replace("/ucet/zpravy/")}>←</button>
              <div className="min-w-0">
                <p className="font-bold truncate">{open.kind === "system" ? "Vozodrom" : open.counterpart ?? "Uživatel"}</p>
                {open.kind === "listing" &&
                  (open.listingId ? (
                    <Link href={`/inzerat/${open.listingId}/`} className="text-sm text-[var(--color-brand)] hover:underline truncate block">{open.title}</Link>
                  ) : (
                    <p className="text-sm text-[var(--color-muted)]">{open.title}</p>
                  ))}
                {open.kind === "system" && <p className="text-sm text-[var(--color-muted)]">Oznámení o vašich inzerátech a účtu</p>}
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[60vh]" aria-live="polite">
              {loading && <p className="text-sm text-[var(--color-muted)]">Načítám…</p>}
              {messages.map((m) => {
                const mine = m.senderId === userId;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-[14px] px-3 py-2 text-sm ${mine ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)]" : "bg-[var(--color-field)]"}`}>
                      <p className="whitespace-pre-line break-words">{m.body}</p>
                      {m.link && <Link href={m.link} className="mt-1 inline-block font-semibold underline">Otevřít</Link>}
                      <p className={`mt-1 text-[11px] ${mine ? "opacity-80" : "text-[var(--color-muted)]"}`}>{time(m.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottom} />
            </div>
            {open.kind === "listing" ? (
              <form
                className="border-t border-[var(--color-line)] p-3 flex gap-2 items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <textarea
                  className="input min-h-11 max-h-40 flex-1"
                  rows={1}
                  maxLength={2000}
                  placeholder="Napište zprávu…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  aria-label="Zpráva"
                />
                <button type="submit" className="btn-cta !py-2 text-sm" disabled={!text.trim()}>Odeslat</button>
              </form>
            ) : (
              <p className="border-t border-[var(--color-line)] p-3 text-xs text-[var(--color-muted)]">Na oznámení se neodpovídá.</p>
            )}
            {error && <p role="alert" className="px-4 pb-3 text-sm text-[var(--color-warn)]">{error}</p>}
          </>
        )}
      </section>
    </div>
  );
}
