import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = { title: "Můj účet" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense>
        <AccountClient />
      </Suspense>
    </div>
  );
}
