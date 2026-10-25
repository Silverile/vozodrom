import type { Listing } from "./types";

export type StkSignal =
  | { kind: "none" }
  | { kind: "ok"; count: number }
  | { kind: "drop"; count: number; fromKm: number; toKm: number; date: string };

/**
 * Reads the dated odometer readings from STK records (newest first).
 * "ok" only means no reading went down between inspections; it does not
 * prove the current mileage.
 */
export function stkSignal(listing: Listing): StkSignal {
  const records = [...listing.stkHistory].reverse();
  if (records.length === 0) return { kind: "none" };
  for (let i = 1; i < records.length; i++) {
    if (records[i].odometerKm < records[i - 1].odometerKm) {
      return {
        kind: "drop",
        count: records.length,
        fromKm: records[i - 1].odometerKm,
        toKm: records[i].odometerKm,
        date: records[i].date,
      };
    }
  }
  return { kind: "ok", count: records.length };
}
