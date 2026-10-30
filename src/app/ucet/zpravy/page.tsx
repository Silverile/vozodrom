import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { conversationsOf } from "@/lib/chat";
import { Messages } from "./Messages";

export const metadata: Metadata = { title: "Zprávy", robots: { index: false } };

export default async function MessagesPage() {
  await connection();
  const session = await getSession();
  if (!session) redirect("/prihlaseni/?dalsi=/ucet/zpravy/");
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense>
        <Messages userId={session.user.id} initial={await conversationsOf(session.user.id)} />
      </Suspense>
    </div>
  );
}
