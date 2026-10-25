"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SECTIONS, sectionOf } from "@/lib/sections";

/**
 * The mark: a bold "V" drawn as a tick, the promise of cars you can trust, with an
 * orange spark at its tip. Same geometry as app/icon.svg.
 */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="9" fill="var(--color-brand)" />
      <path d="M8.5 15.5 L14 23 L24 9" stroke="var(--color-brand-ink)" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="24.2" cy="8.8" r="2.6" fill="var(--color-accent)" />
    </svg>
  );
}

/**
 * Logo with the current section's sub-brand, e.g. "vozodrom AUTO". The logo always leads to
 * the home page; the sub-brand is a separate link to the section's own front page.
 */
export function BrandLink() {
  const section = sectionOf(usePathname());
  return (
    <span className="flex items-center gap-1.5 shrink-0 leading-none">
      <Link href="/" aria-label="vozodrom — úvodní stránka" className="flex items-center gap-2">
        <LogoMark />
        <span className="text-[1.05rem] sm:text-[1.3rem] font-extrabold tracking-[-0.045em]">vozodrom</span>
      </Link>
      {section && (
        <Link
          href={section.href}
          className="hidden min-[360px]:inline pt-[0.2em] text-[0.62rem] sm:text-[0.78rem] font-semibold tracking-[0.14em] text-[var(--color-brand)] hover:underline"
        >
          {section.brand}
        </Link>
      )}
    </span>
  );
}

/** Section tabs under the header bar, with the active section underlined. */
export function SectionTabs() {
  const pathname = usePathname();
  const active = sectionOf(pathname);
  const onCatalog = pathname.startsWith("/katalog");
  const nav = useRef<HTMLElement>(null);
  // On phones the tabs scroll sideways. Scroll only when the active tab is not fully visible,
  // and then just enough to show it, so the strip does not jump on every navigation.
  useEffect(() => {
    const strip = nav.current;
    const current = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !current) return;
    const left = current.offsetLeft;
    const right = left + current.offsetWidth;
    if (left < strip.scrollLeft) strip.scrollLeft = left - 12;
    else if (right > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = right - strip.clientWidth + 12;
  }, [pathname]);
  const tab = "relative whitespace-nowrap px-3 py-2.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] data-[on=true]:text-[var(--color-ink)] data-[on=true]:font-semibold data-[on=true]:after:absolute data-[on=true]:after:inset-x-3 data-[on=true]:after:bottom-0 data-[on=true]:after:h-0.5 data-[on=true]:after:rounded-full data-[on=true]:after:bg-[var(--color-brand)]";
  return (
    <nav ref={nav} aria-label="Sekce" className="relative flex overflow-x-auto -mx-3 [scrollbar-width:none]">
      {SECTIONS.filter((s) => s.group === "market").map((s) => {
        const on = active?.key === s.key && !onCatalog;
        return (
          <Link key={s.key} href={s.href} className={tab} data-on={on} aria-current={on ? "page" : undefined}>
            {s.label}
          </Link>
        );
      })}
      <Link href="/katalog/" className={tab} data-on={onCatalog} aria-current={onCatalog ? "page" : undefined}>
        Katalog modelů
      </Link>
      <span className="my-2.5 mx-1 w-px shrink-0 bg-[var(--color-line)]" aria-hidden="true" />
      {SECTIONS.filter((s) => s.group === "community").map((s) => {
        const on = active?.key === s.key;
        return (
          <Link key={s.key} href={s.href} className={tab} data-on={on} aria-current={on ? "page" : undefined}>
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Header call to action that opens the add-listing form for the current marketplace section. */
export function AddListingButton() {
  const section = sectionOf(usePathname());
  const key = section?.group === "market" && section.key !== "auto" ? section.key : null;
  return (
    <Link href={key ? `/pridat/?sekce=${key}` : "/pridat/"} className="btn-cta hidden md:inline-flex text-sm">
      + Přidat inzerát
    </Link>
  );
}
