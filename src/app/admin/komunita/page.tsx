import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { carTitle } from "@/lib/garage";
import { type CarRow, type CommentRow, type EntryRow, openCommunityReports } from "@/lib/garage-store";
import { ModerateContent } from "./ModerateContent";

export const metadata: Metadata = { title: "Komunita" };

const KIND_LABEL = { car: "Auto v garáži", entry: "Zápis v deníku", comment: "Komentář" } as const;

/** Where the reported content is, and a short preview of it. */
function preview(kind: "car" | "entry" | "comment", target: CarRow | EntryRow | CommentRow) {
  if (kind === "car") {
    const car = target as CarRow;
    return { href: `/deniky/${car.id}/`, text: carTitle(car.data), body: car.data.story };
  }
  if (kind === "entry") {
    const entry = target as EntryRow;
    return { href: `/deniky/${entry.carId}/${entry.id}/`, text: entry.title, body: entry.body };
  }
  const comment = target as CommentRow;
  return { href: null, text: "Komentář", body: comment.body };
}

// Reports of garage cars, logbook entries and comments (signed-in users only), oldest first.
// Listings have their own DSA notices in "Hlášení (DSA)".
export default async function CommunityPage() {
  const reports = await openCommunityReports();
  // several reports of one thing are decided together
  const groups = new Map<string, typeof reports>();
  for (const r of reports) groups.set(`${r.report.kind}:${r.report.targetId}`, [...(groups.get(`${r.report.kind}:${r.report.targetId}`) ?? []), r]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Komunita</h1>
      <p className="text-sm text-[var(--color-muted)]">Nahlášená auta v garážích, zápisy v denících a komentáře. Skrytý obsah vidí jen jeho autor, s důvodem.</p>
      {groups.size === 0 ? (
        <div className="card p-6 text-sm text-[var(--color-muted)]">Žádná otevřená hlášení.</div>
      ) : (
        <ul className="space-y-4">
          {[...groups.values()].map((group) => {
            const { report, target } = group[0];
            const shown = target && preview(report.kind, target);
            return (
              <li key={`${report.kind}:${report.targetId}`} className="card p-5 space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {KIND_LABEL[report.kind]}:{" "}
                    {shown?.href ? <Link href={shown.href} className="text-[var(--color-brand)] hover:underline">{shown.text}</Link> : shown?.text ?? "smazáno"}
                  </p>
                  <span className="text-xs text-[var(--color-muted)]">{group.length}× nahlášeno</span>
                </div>
                {shown?.body && <p className="text-sm text-[var(--color-muted)] line-clamp-4 whitespace-pre-line">{shown.body}</p>}
                <ul className="text-sm space-y-1">
                  {group.map(({ report: r }) => (
                    <li key={r.id}><span className="text-[var(--color-muted)]">{formatDate(r.createdAt.toISOString())}:</span> {r.reason}</li>
                  ))}
                </ul>
                {target && <ModerateContent kind={report.kind} id={report.targetId} hidden={Boolean(target.hiddenReason)} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
