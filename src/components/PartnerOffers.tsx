import { type PartnerKind, activePartners } from "@/lib/partners";

// "Před koupí" partner links next to a car (listing or model page). Renders nothing until at least
// one partner has its partner link configured in src/lib/partners.ts.
export function PartnerOffers({ kinds, className = "" }: { kinds?: PartnerKind[]; className?: string }) {
  const partners = activePartners(kinds);
  if (!partners.length) return null;
  return (
    <section className={`card p-4 ${className}`} aria-labelledby="partneri-nadpis">
      <h2 id="partneri-nadpis" className="font-bold">Před koupí</h2>
      <ul className="mt-3 space-y-3">
        {partners.map((p) => (
          <li key={p.key}>
            <a
              href={p.url}
              target="_blank"
              rel="sponsored noopener"
              className="group flex items-start justify-between gap-3 rounded-[10px] bg-[var(--color-field)] p-3 hover:ring-1 hover:ring-[var(--color-brand)]"
            >
              <span className="min-w-0">
                <span className="block font-semibold group-hover:text-[var(--color-brand)]">{p.title}</span>
                <span className="block text-sm text-[var(--color-muted)]">{p.text}</span>
                {p.kind === "credit" && p.disclosure && <span className="mt-1 block text-xs text-[var(--color-muted)]">{p.disclosure}</span>}
              </span>
              <span className="shrink-0 text-xs text-[var(--color-muted)]">{p.name} ↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Partnerské odkazy: když si u partnera službu objednáte, můžeme získat provizi. Vaši cenu to nemění a nic o vás ani o
        inzerátu partnerovi neposíláme.
      </p>
    </section>
  );
}
