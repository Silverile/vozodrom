import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { type ChatMessage, conversationsOf, messagesOf } from "@/lib/chat";
import { Messages } from "./Messages";

export const metadata: Metadata = { title: "Zprávy", robots: { index: false } };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  await connection();
  const session = await getSession();
  if (!session) redirect("/prihlaseni/?dalsi=/ucet/zpravy/");
  const { k } = await searchParams;
  // The open thread is loaded together with the list, so a reload shows it without a second round trip.
  const [conversations, messages] = await Promise.all([
    conversationsOf(session.user.id),
    k ? messagesOf(session, k).catch((): ChatMessage[] | null => null) : Promise.resolve(null),
  ]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense>
        <Messages userId={session.user.id} initial={conversations} initialThread={k && messages ? { id: k, messages } : null} />
      </Suspense>
    </div>
  );
}
