import Link from "next/link";
import { type Item, categoryOf } from "@/lib/classifieds";
import { formatAgo, formatPrice } from "@/lib/format";
import { Place } from "./Place";

const SECTION_PATH = { technika: "/technika/", moto: "/moto/", dily: "/dily/", pneu: "/pneumatiky/" } as const;

export function itemHref(item: Item) {
  return `${SECTION_PATH[item.section]}${item.id}/`;
}

/** Placeholder picture: the category icon on a tinted tile (the prototype has no photos). */
export function ItemImage({ item, className = "" }: { item: Item; className?: string }) {
  const icon = categoryOf(item.section, item.category)?.icon ?? "📦";
  return (
    <div
      className={`grid place-items-center bg-[var(--color-photo)] bg-[radial-gradient(circle_at_50%_45%,var(--color-brand-soft)_0%,transparent_62%)] ${className}`}
      role="img"
      aria-label={`Ilustrace: ${categoryOf(item.section, item.category)?.label}`}
    >
      <span className="text-5xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]" aria-hidden="true">{icon}</span>
    </div>
  );
}

/** Search-result row for non-car sections, styled like the car ListingRow. */
export function ItemRow({ item }: { item: Item }) {
  return (
    <article className="card relative grid grid-cols-[96px_1fr] sm:grid-cols-[160px_1fr_auto] gap-x-4 gap-y-2 p-3 hover:border-[var(--color-brand)] focus-within:border-[var(--color-brand)] transition-colors">
      <ItemImage item={item} className="row-span-2 sm:row-span-1 self-start rounded-[10px] aspect-[4/3]" />
      <div className="min-w-0">
        <h3 className="font-bold leading-tight">
          <Link href={itemHref(item)} className="after:absolute after:inset-0 after:rounded-[14px] focus:outline-none">{item.title}</Link>
        </h3>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          {item.specs.slice(0, 3).map(([, v]) => v).join(" · ")}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className={`chip ${item.condition === "nové" ? "bg-[var(--color-good-soft)] text-[var(--color-good)]" : "bg-[var(--color-field)] text-[var(--color-ink-soft)]"}`}>{item.condition}</span>
          {item.sellerType === "soukromý" && <span className="chip bg-[var(--color-field)] text-[var(--color-ink-soft)]">Soukromý prodejce</span>}
        </div>
      </div>
      <div className="col-start-2 sm:col-start-3 flex sm:flex-col items-baseline sm:items-end justify-between gap-1 sm:text-right">
        <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">{formatPrice(item.price)}</span>
        {item.tyre && item.tyre.count > 1 && <span className="text-xs text-[var(--color-muted)]">za {item.tyre.count} ks</span>}
        <span className="text-xs text-[var(--color-muted)] sm:mt-auto whitespace-nowrap">
          <Place city={item.city} fallback={item.region} /> · {formatAgo(item.postedAt)}
        </span>
      </div>
    </article>
  );
}
