// Opposition-window arithmetic — the one piece of Prahari that is real.
//
// Statutory basis (verified against the Patents Act 1970 and Patents Rules 2003):
//   s.11A        an application publishes at 18 months from priority, or earlier on Form 9.
//   Rule 55(1A)  no patent may be GRANTED before six months from that publication date.
//   s.25(1)      inside that period any person may oppose, on Form 7A, under Rule 55.
//
// So the earliest a patent can issue is publication + 6 months, and the days between
// now and that date are the days a Form 7A representation can still be filed.
// Everything else in this app is mocked. This file is not.

/** Urgency bands. Thresholds fixed in CLAUDE.md §9: red <30, amber 30–90, green >90. */
export type UrgencyBand = "critical" | "warning" | "open" | "closed";

/** Months between publication under s.11A and the earliest possible grant, per Rule 55(1A). */
export const GRANT_BAR_MONTHS = 6;

/**
 * Parse a YYYY-MM-DD string as a UTC midnight date.
 *
 * Deliberately UTC: `new Date("2026-04-30")` is already UTC-midnight, but
 * `new Date(2026, 3, 30)` is local-midnight, and mixing the two puts the
 * countdown off by a day for anyone east or west of UTC.
 */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Format a UTC date back to YYYY-MM-DD. */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Add whole months, clamping to the end of the target month.
 *
 * The clamp is the whole reason this is not a one-liner. Naive month addition
 * rolls 31 August + 6 months into 3 March, because 31 February does not exist
 * and JS silently overflows. A deadline that silently gains three days is
 * exactly the kind of bug nobody notices until it is missed.
 */
export function addMonths(date: Date, months: number): Date {
  const day = date.getUTCDate();
  // Start at day 1 so the month shift can never overflow on its own.
  const shifted = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  // Day 0 of the *next* month is the last day of this one.
  const lastDayOfTargetMonth = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0),
  ).getUTCDate();
  shifted.setUTCDate(Math.min(day, lastDayOfTargetMonth));
  return shifted;
}

/** Earliest date a patent may be granted: publication + 6 months (Rule 55(1A)). */
export function earliestGrantDate(publishedOn: string): Date {
  return addMonths(parseISODate(publishedOn), GRANT_BAR_MONTHS);
}

/**
 * Whole days left to file a Form 7A representation.
 *
 * Negative once the bar has lapsed, which matters: a lapsed window is not the
 * same as an urgent one, and the UI must not show them alike.
 */
export function daysRemaining(publishedOn: string, today: Date = new Date()): number {
  const grant = earliestGrantDate(publishedOn);
  // Normalise `today` to UTC midnight so a run at 23:00 doesn't lose a day.
  const now = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const MS_PER_DAY = 86_400_000;
  return Math.round((grant.getTime() - now) / MS_PER_DAY);
}

/** Band a day-count for colour and icon. Colour alone never carries this in the UI (§9). */
export function urgencyBand(days: number): UrgencyBand {
  if (days < 0) return "closed";
  if (days < 30) return "critical";
  if (days <= 90) return "warning";
  return "open";
}

/** Everything the UI needs about one application's window, derived in one pass. */
export interface WindowStatus {
  publishedOn: string;
  earliestGrant: string;
  daysRemaining: number;
  band: UrgencyBand;
  /** Plain-language line for the card. No jargon, no colour dependency. */
  label: string;
}

export function windowStatus(publishedOn: string, today: Date = new Date()): WindowStatus {
  const days = daysRemaining(publishedOn, today);
  const band = urgencyBand(days);
  const label =
    band === "closed"
      ? `Window closed ${Math.abs(days)} days ago — opposition now requires s.25(2)`
      : days === 0
        ? "Closes today"
        : `${days} days left to file Form 7A`;

  return {
    publishedOn,
    earliestGrant: toISODate(earliestGrantDate(publishedOn)),
    daysRemaining: days,
    band,
    label,
  };
}
