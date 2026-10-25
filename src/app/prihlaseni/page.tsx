import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInMock } from "./SignInMock";

export const metadata: Metadata = { title: "Přihlášení a registrace" };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Suspense>
        <SignInMock />
      </Suspense>
    </div>
  );
}
