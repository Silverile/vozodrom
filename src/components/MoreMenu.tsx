"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitch } from "./Theme";

// "Další" dropdown, like Drom's "Ещё": tools and pages that do not fit the main nav.

const ITEMS: { href: string; label: string; note?: string }[] = [
  { href: "/kupni-smlouva/", label: "Kupní smlouva na auto", note: "vyplnit a vytisknout" },
  { href: "/prepis-vozidla/", label: "Přepis vozidla", note: "postup, doklady, poplatky" },
  { href: "/ucet/", label: "Můj účet", note: "náhled" },
  { href: "/pro-prodejce/", label: "Pro prodejce", note: "import inzerátů" },
  { href: "/soukromi/", label: "Soukromí a cookies" },
];

export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close after navigation, on outside click and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    // On phones the panel spans the header (positioned against it); from sm up it hangs under the button.
    <div ref={root} className="sm:relative">
      <button
        aria-expanded={open}
        aria-controls="more-menu"
        onClick={() => setOpen((o) => !o)}
        className="px-2 sm:px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap"
      >
        <span aria-hidden="true" className="sm:hidden">☰</span>
        <span className="sr-only sm:not-sr-only">Další {open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div id="more-menu" className="card absolute left-4 right-4 top-full mt-1 sm:left-auto sm:right-0 sm:mt-2 sm:w-72 p-2 shadow-2xl z-30">
          <ul>
            {ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-3 py-2 hover:bg-[var(--color-field)]">
                  <span className="block text-sm font-medium">{item.label}</span>
                  {item.note && <span className="block text-xs text-[var(--color-muted)]">{item.note}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--color-line)] mt-2 pt-3 px-3 pb-1">
            <p className="text-xs text-[var(--color-muted)] mb-2">Motiv</p>
            <ThemeSwitch />
          </div>
        </div>
      )}
    </div>
  );
}
