"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ItemSection } from "@/lib/classifieds";
import { SECTIONS } from "@/lib/sections";
import { AddListingForm } from "./AddListingForm";
import { ItemForm } from "./ItemForm";

const ICONS: Record<string, string> = { auto: "🚗", technika: "🚛", moto: "🏍️", dily: "⚙️", pneu: "🛞" };

/** Section switch above the form; the choice lives in ?sekce= so sections can link here. */
export function AddListingTabs() {
  const requested = useSearchParams().get("sekce");
  const market = SECTIONS.filter((s) => s.group === "market");
  const active = market.find((s) => s.key === requested)?.key ?? "auto";
  return (
    <>
      <nav aria-label="Co prodáváte" className="mt-6 flex flex-wrap gap-2">
        {market.map((s) => (
          <Link
            key={s.key}
            href={s.key === "auto" ? "/pridat/" : `/pridat/?sekce=${s.key}`}
            replace
            scroll={false}
            className="pill !px-4 !py-2 text-sm"
            data-on={s.key === active}
            aria-current={s.key === active ? "page" : undefined}
          >
            <span aria-hidden="true">{ICONS[s.key]}</span> {s.label}
          </Link>
        ))}
      </nav>
      {active === "auto" ? <AddListingForm /> : <ItemForm key={active} section={active as ItemSection} />}
    </>
  );
}
