"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ChatEvent } from "./chat";

// The browser side of the chat: one WebSocket per tab (opened by ChatConnection in the layout),
// the unread total for the header, and a feed of new messages for the open thread. When the
// socket cannot be opened (e.g. under `next dev`), the unread total is polled instead.

let unread = 0;
const unreadListeners = new Set<() => void>();
const eventListeners = new Set<(event: ChatEvent) => void>();

export function setUnread(total: number) {
  if (total === unread) return;
  unread = total;
  unreadListeners.forEach((l) => l());
}

export function useUnread(): number {
  return useSyncExternalStore(
    (l) => {
      unreadListeners.add(l);
      return () => unreadListeners.delete(l);
    },
    () => unread,
    () => 0,
  );
}

/** Calls the handler for every chat event pushed to this user while the component is mounted. */
export function useChatEvents(handler: (event: ChatEvent) => void) {
  useEffect(() => {
    eventListeners.add(handler);
    return () => {
      eventListeners.delete(handler);
    };
  }, [handler]);
}

function dispatch(event: ChatEvent) {
  if (event.type === "unread") setUnread(event.total);
  eventListeners.forEach((l) => l(event));
}

/** Keeps the socket open while `enabled` (signed in); reconnects with backoff, polls as a fallback. */
export function useChatConnection(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      setUnread(0);
      return;
    }
    let socket: WebSocket | null = null;
    let stopped = false;
    let failures = 0;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let ping: ReturnType<typeof setInterval> | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;

    async function token(): Promise<string | null> {
      const response = await fetch("/api/zpravy/token/", { cache: "no-store" }).catch(() => null);
      if (!response?.ok) return null;
      const data = (await response.json()) as { token: string; unread: number };
      setUnread(data.unread);
      return data.token;
    }

    async function connect() {
      const t = await token();
      if (stopped || !t) return;
      const ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/zpravy?token=${encodeURIComponent(t)}`);
      socket = ws;
      ws.onopen = () => {
        failures = 0;
        if (poll) clearInterval(poll);
        poll = undefined;
        ping = setInterval(() => ws.readyState === WebSocket.OPEN && ws.send("ping"), 30_000);
      };
      ws.onmessage = (e) => {
        if (e.data === "pong") return;
        try {
          dispatch(JSON.parse(e.data) as ChatEvent);
        } catch {
          // Ignore anything that is not an event.
        }
      };
      ws.onclose = () => {
        if (ping) clearInterval(ping);
        if (stopped) return;
        failures++;
        // After a few failed attempts keep the badge current by polling, and keep retrying slowly.
        if (failures >= 3 && !poll) poll = setInterval(token, 60_000);
        retry = setTimeout(connect, Math.min(30_000, 1000 * 2 ** failures));
      };
    }

    connect();
    return () => {
      stopped = true;
      if (retry) clearTimeout(retry);
      if (ping) clearInterval(ping);
      if (poll) clearInterval(poll);
      socket?.close();
    };
  }, [enabled]);
}
