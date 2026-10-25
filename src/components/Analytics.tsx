"use client";

import Link from "next/link";
import { useEffect } from "react";
import { analyticsConsent } from "@/lib/storage";

// Google Analytics 4, loaded only after the visitor opts in (Czech law requires
// prior consent for analytics cookies). Without NEXT_PUBLIC_GA_ID nothing loads
// and no banner is shown. GA4 counts client-side navigation itself through its
// default "page changes based on browser history" measurement.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

function loadGtag() {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** Removes GA cookies after consent is withdrawn; a reload then stops the loaded script. */
function clearGaCookies() {
  const host = window.location.hostname;
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host.replace(/^www\./, "")}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

export function setConsent(value: "granted" | "denied") {
  const before = analyticsConsent.read();
  analyticsConsent.write(value);
  if (value === "denied" && before === "granted") {
    clearGaCookies();
    window.location.reload();
  }
}

export function Analytics() {
  const consent = analyticsConsent.useValue();

  useEffect(() => {
    if (GA_ID && consent === "granted") loadGtag();
  }, [consent]);

  if (!GA_ID || consent !== null) return null;
  return (
    <div role="dialog" aria-label="Souhlas s analytikou" className="fixed inset-x-0 bottom-0 z-30 p-3 sm:p-4 print:hidden">
      <div className="card mx-auto max-w-3xl p-4 shadow-2xl sm:flex sm:items-center sm:gap-4">
        <p className="text-sm text-[var(--color-muted)]">
          Chceme měřit návštěvnost přes Google Analytics, abychom věděli, co na webu funguje. Bez vašeho souhlasu se nic
          nespustí. <Link href="/soukromi/" className="underline hover:text-[var(--color-ink)]">Více o ochraně soukromí</Link>
        </p>
        {/* Both choices are equally prominent, as the Czech data protection authority expects. */}
        <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
          <button className="pill" onClick={() => setConsent("denied")}>Odmítnout</button>
          <button className="pill" onClick={() => setConsent("granted")}>Povolit analytiku</button>
        </div>
      </div>
    </div>
  );
}

/** Footer control that lets visitors change their choice at any time. */
export function ConsentSettings() {
  const consent = analyticsConsent.useValue();
  if (!GA_ID) return <span>Bez reklamních trackerů.</span>;
  return (
    <span>
      Analytika jen se souhlasem ({consent === "granted" ? "povolena" : consent === "denied" ? "odmítnuta" : "nevybráno"}) ·{" "}
      <button
        className="underline hover:text-[var(--color-ink)]"
        onClick={() => (consent === "granted" ? setConsent("denied") : analyticsConsent.write(null))}
      >
        {consent === "granted" ? "Odvolat souhlas" : "Změnit volbu"}
      </button>
    </span>
  );
}
