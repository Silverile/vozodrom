import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Vozodrom — auta, inzeráty a katalog", template: "%s · Vozodrom" },
  description: "Prototyp autoportálu: inzeráty, katalog modelů a data z technických kontrol na jednom místě.",
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="var(--color-brand)" />
        <path d="M7 19c1.5-4 4-6 9-6s7.5 2 9 6" stroke="var(--color-brand-ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="11" cy="21" r="2.4" fill="var(--color-brand-ink)" />
        <circle cx="21" cy="21" r="2.4" fill="var(--color-brand-ink)" />
      </svg>
      vozodrom
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="min-h-screen flex flex-col">
        <div className="bg-[var(--color-warn-soft)] text-[var(--color-warn)] text-xs text-center py-1.5 px-4">
          Prototyp — všechny inzeráty, ceny a statistiky jsou smyšlená testovací data.
        </div>
        <header className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-6">
            <Logo />
            <nav className="flex items-center gap-1 text-sm font-medium">
              <Link href="/inzeraty/" className="px-3 py-2 rounded-lg hover:bg-[var(--color-brand-soft)]">Inzeráty</Link>
              <Link href="/katalog/" className="px-3 py-2 rounded-lg hover:bg-[var(--color-brand-soft)]">Katalog</Link>
            </nav>
            <span
              className="ml-auto hidden sm:inline-flex items-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-4 py-2 text-sm font-semibold opacity-60 cursor-not-allowed"
              title="V prototypu zatím není k dispozici"
            >
              + Přidat inzerát
            </span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--color-line)] mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--color-muted)] flex flex-col sm:flex-row gap-2 sm:justify-between">
            <span>© 2026 vozodrom.cz — prototyp</span>
            <span>Data v prototypu jsou smyšlená a neslouží k rozhodování o koupi.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
