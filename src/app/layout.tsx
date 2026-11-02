import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { AccountLink } from "@/components/AccountLink";
import { AccountSync } from "@/components/AccountSync";
import { ChatConnection } from "@/components/ChatConnection";
import { SignInModal } from "@/components/SignInModal";
import { Analytics, ConsentSettings } from "@/components/Analytics";
import { AddListingButton, BrandLink, SectionTabs } from "@/components/Brand";
import { LocationPicker } from "@/components/LocationPicker";
import { MoreMenu } from "@/components/MoreMenu";
import { ShortlistLink } from "@/components/ShortlistLink";
import { THEME_BOOTSTRAP, ThemeSync } from "@/components/Theme";
import { asset } from "@/lib/format";
import { SOCIAL } from "@/lib/social";
import "./globals.css";

// Inter, self-hosted by next/font (no request to Google from the browser); latin-ext for Czech.
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Vozodrom — auta, inzeráty a katalog", template: "%s · Vozodrom" },
  description: "Prototyp autoportálu: inzeráty, katalog modelů a data z technických kontrol na jednom místě.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by the bootstrap script before React hydrates.
    <html lang="cs" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="bg-[var(--color-warn-soft)] text-[var(--color-warn)] text-xs text-center py-1.5 px-4 print:hidden">
          Prototyp — všechny inzeráty, ceny a statistiky jsou smyšlená testovací data.
        </div>
        <header className="print:hidden sticky top-0 z-20 bg-[var(--color-surface)]">
          <div className="relative mx-auto max-w-6xl px-4 h-14 flex items-center gap-1 sm:gap-4">
            <Suspense>
              <BrandLink />
            </Suspense>
            <Suspense>
              <LocationPicker />
            </Suspense>
            <div className="ml-auto flex items-center gap-0.5 sm:gap-1 text-sm">
              <ShortlistLink />
              <MoreMenu />
              <AccountLink />
            </div>
            <Suspense>
              <AddListingButton />
            </Suspense>
          </div>
          <div className="mx-auto max-w-6xl px-4">
            <Suspense>
              <SectionTabs />
            </Suspense>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="print:hidden bg-[var(--color-surface)] mt-24 sm:mt-32">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--color-muted)] grid gap-2 sm:grid-cols-3">
            <span>© 2026 vozodrom.cz — prototyp</span>
            <span className="space-y-1">
              <ConsentSettings />
              <span className="block">
                <Link href="/soukromi/" className="hover:text-[var(--color-ink)] underline">Soukromí a cookies</Link> ·{" "}
                <Link href="/pro-prodejce/" className="hover:text-[var(--color-ink)] underline">Pro prodejce</Link>
              </span>
            </span>
            <span className="sm:text-right space-y-1">
              {SOCIAL.length > 0 && (
                <span className="flex items-center gap-3 sm:justify-end">
                  Sledujte nás:
                  {SOCIAL.map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener" aria-label={s.name} title={s.name} className="rounded-full transition-opacity hover:opacity-80">
                      <img src={asset(s.icon)} alt="" width={32} height={32} className="size-8 rounded-full" />
                    </a>
                  ))}
                </span>
              )}
              <span className="block">Data v prototypu jsou smyšlená.</span>
            </span>
          </div>
        </footer>
        <Analytics />
        <ThemeSync />
        <AccountSync />
        <ChatConnection />
        <SignInModal />
      </body>
    </html>
  );
}
