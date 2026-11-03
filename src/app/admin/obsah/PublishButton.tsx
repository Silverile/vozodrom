"use client";

import { useState } from "react";

// "Publikovat na web": starts the deploy that replays the saved catalogue edits into the static
// pages. The same button is in the editor on the model pages.
export function PublishButton() {
  const [state, setState] = useState<"" | "busy" | "done">("");
  const [error, setError] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn-cta text-sm"
        disabled={state === "busy"}
        onClick={async () => {
          setState("busy");
          setError("");
          try {
            const response = await fetch("/api/admin/katalog/publikovat/", { method: "POST" });
            if (response.ok) return setState("done");
            setState("");
            setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Nasazení se nepodařilo spustit.");
          } catch {
            setState("");
            setError("Nasazení se nepodařilo spustit (spojení), zkuste to znovu.");
          }
        }}
      >
        Publikovat na web
      </button>
      {state === "done" && <span role="status" className="text-sm text-[var(--color-good)]">Nasazení spuštěno. Změny se na webu objeví po jeho úspěšném dokončení (asi 5–7 minut).</span>}
      {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}
