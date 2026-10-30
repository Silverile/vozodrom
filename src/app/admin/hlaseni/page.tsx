import type { Metadata } from "next";
import Link from "next/link";
import { draftTitle } from "@/lib/listing-draft";
import { REPORT_CATEGORY_LABEL, STATUS_LABEL, STATUS_STYLE } from "@/lib/listing-status";
import { findListing } from "@/lib/listing-store";
import { openReports } from "@/lib/reports";
import { ReportDecision } from "./ReportDecision";

export const metadata: Metadata = { title: "Hlášení (DSA)" };

export default async function ReportsPage() {
  const reports = await openReports();
  // One decision per listing: group its open notices, oldest listing first.
  const byListing = new Map<string, typeof reports>();
  for (const r of reports) byListing.set(r.listingId, [...(byListing.get(r.listingId) ?? []), r]);
  const groups = await Promise.all([...byListing].map(async ([id, notices]) => ({ listing: await findListing(id), notices })));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hlášení (DSA) <span className="text-[var(--color-muted)] text-lg font-normal">{reports.length}</span></h1>
      <p className="text-sm text-[var(--color-muted)]">
        Hlášení od uživatelů k inzerátům. Tři otevřená hlášení inzerát skryjí do vašeho rozhodnutí. Oznamovatelé dostanou výsledek
        e-mailem; při stažení dostane autor zdůvodnění.
      </p>
      {groups.length === 0 && <p className="card p-6 text-sm text-[var(--color-muted)]">Žádná otevřená hlášení.</p>}
      <ul className="space-y-3">
        {groups.map(({ listing, notices }) =>
          listing ? (
            <li key={listing.id} className="card p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`chip ${STATUS_STYLE[listing.status]}`}>{STATUS_LABEL[listing.status]}</span>
                <Link href={`/inzerat/${listing.id}/`} className="font-bold hover:text-[var(--color-brand)]">{draftTitle(listing.data)}</Link>
                <span className="text-sm text-[var(--color-muted)]">{notices.length}× nahlášeno</span>
              </div>
              <ul className="space-y-2">
                {notices.map((n) => (
                  <li key={n.id} className="rounded-[10px] bg-[var(--color-field)] p-3 text-sm">
                    <p className="font-semibold">{REPORT_CATEGORY_LABEL[n.category]}</p>
                    <p className="whitespace-pre-line mt-1">{n.explanation}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      {n.notifierName} · {n.notifierEmail} · {n.createdAt.toLocaleString("cs-CZ")}{n.userId ? " · přihlášený uživatel" : ""}
                    </p>
                  </li>
                ))}
              </ul>
              <ReportDecision listingId={listing.id} />
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}
