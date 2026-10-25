import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Analytics, ConsentSettings } from "@/components/Analytics";
import { LocationPicker } from "@/components/LocationPicker";
import { MoreMenu } from "@/components/MoreMenu";
import { ShortlistLink } from "@/components/ShortlistLink";
import { THEME_BOOTSTRAP, ThemeSync } from "@/components/Theme";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Vozodrom — auta, inzeráty a katalog", template: "%s · Vozodrom" },
  description: "Prototyp autoportálu: inzeráty, katalog modelů a data z technických kontrol na jednom místě.",
};

function Logo() {
  return (
    <Link href="/" aria-label="vozodrom — úvod" className="flex items-center gap-2 font-extrabold tracking-tight text-lg">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="var(--color-brand)" />
        <path d="M7 19c1.5-4 4-6 9-6s7.5 2 9 6" stroke="var(--color-brand-ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="11" cy="21" r="2.4" fill="var(--color-brand-ink)" />
        <circle cx="21" cy="21" r="2.4" fill="var(--color-brand-ink)" />
      </svg>
      <span className="hidden sm:inline">vozodrom</span>
    </Link>
  );
}

const NAV = [
  { href: "/inzeraty/", label: "Inzeráty" },
  // On phones the catalogue moves into the "Další" menu to keep the header on one line.
  { href: "/katalog/", label: "Katalog", wide: true },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by the bootstrap script before React hydrates.
    <html lang="cs" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="bg-[var(--color-warn-soft)] text-[var(--color-warn)] text-xs text-center py-1.5 px-4 print:hidden">
          Prototyp — všechny inzeráty, ceny a statistiky jsou smyšlená testovací data.
        </div>
        <header className="print:hidden sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-bg)]/90 backdrop-blur">
          <div className="relative mx-auto max-w-6xl px-4 h-16 flex items-center gap-1 sm:gap-6">
            <Logo />
            <Suspense>
              <LocationPicker />
            </Suspense>
            <nav className="flex items-center gap-0.5 sm:gap-1 text-sm overflow-x-auto">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className={`${"wide" in n ? "hidden sm:block " : ""}px-2 sm:px-3 py-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)]`}>
                  {n.label}
                </Link>
              ))}
              <ShortlistLink />
            </nav>
            <MoreMenu />
            <Link href="/prihlaseni/" aria-label="Přihlásit" className="ml-auto px-2 sm:px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap">
              <span aria-hidden="true" className="sm:hidden">👤</span>
              <span className="hidden sm:inline">Přihlásit</span>
            </Link>
            <Link href="/pridat/" className="btn-cta hidden sm:inline-flex text-sm">
              + Přidat inzerát zdarma
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="print:hidden border-t border-[var(--color-line)] mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--color-muted)] grid gap-2 sm:grid-cols-3">
            <span>© 2026 vozodrom.cz — prototyp</span>
            <span className="space-y-1">
              <ConsentSettings />
              <span className="block">
                <Link href="/soukromi/" className="hover:text-[var(--color-ink)] underline">Soukromí a cookies</Link> ·{" "}
                <Link href="/pro-prodejce/" className="hover:text-[var(--color-ink)] underline">Pro prodejce</Link>
              </span>
            </span>
            <span className="sm:text-right">Data v prototypu jsou smyšlená.</span>
          </div>
        </footer>
        <Analytics />
        <ThemeSync />
      </body>
    </html>
  );
}
