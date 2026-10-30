"use client";

import { authClient } from "@/lib/auth-client";
import { useChatConnection } from "@/lib/chat-client";

/** Opens the chat connection for signed-in visitors on every page (mounted once in the layout). */
export function ChatConnection() {
  const signedIn = Boolean(authClient.useSession().data?.user);
  useChatConnection(signedIn);
  return null;
}
