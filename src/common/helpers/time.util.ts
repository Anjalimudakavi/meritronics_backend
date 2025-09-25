// src/common/time.util.ts  (new file)
import { DateTime } from "luxon";

export function isoToUtc(iso?: string | null): Date | null {
  if (!iso) return null;
  // setZone:true => respect incoming offset (-07:00/-08:00 or anything)
  return DateTime.fromISO(iso, { setZone: true }).toUTC().toJSDate();
}

// Use this when a field is optional in update (undefined => "don't touch")
export function isoToUtcOrUndefined(iso?: string): Date | undefined {
  if (iso === undefined) return undefined;
  return isoToUtc(iso) ?? undefined; // <-- Fix: return undefined instead of null
}
