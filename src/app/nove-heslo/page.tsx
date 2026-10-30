import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Nové heslo", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
