// Self-check for the opposition-window maths.
//
// Plan §8.2 requires unit tests specifically for window computation, because
// this is the only arithmetic in the product a user could actually miss a
// legal deadline over. No test framework is installed on purpose; run with:
//
//   node --experimental-strip-types src/lib/opposition-window.test.ts
//
// Exits non-zero on the first failure.

import assert from "node:assert/strict";
import {
  addMonths,
  daysRemaining,
  earliestGrantDate,
  parseISODate,
  toISODate,
  urgencyBand,
  windowStatus,
} from "./opposition-window.ts";

let checks = 0;
function check(label: string, fn: () => void) {
  fn();
  checks++;
  console.log(`  ok  ${label}`);
}

console.log("opposition-window");

// --- month arithmetic -------------------------------------------------------

check("adds six months across a normal month", () => {
  assert.equal(toISODate(earliestGrantDate("2026-04-05")), "2026-10-05");
});

check("adds six months across a year boundary", () => {
  assert.equal(toISODate(earliestGrantDate("2026-08-08")), "2027-02-08");
});

// The case that breaks naive implementations: 31 August + 6 months is not
// 31 February, and must not silently roll into March.
check("clamps 31 Aug to 28 Feb in a non-leap year", () => {
  assert.equal(toISODate(earliestGrantDate("2026-08-31")), "2027-02-28");
});

check("clamps 31 Aug to 29 Feb in a leap year", () => {
  assert.equal(toISODate(earliestGrantDate("2027-08-31")), "2028-02-29");
});

check("clamps 31 Dec to 30 Jun", () => {
  assert.equal(toISODate(addMonths(parseISODate("2026-12-31"), 6)), "2027-06-30");
});

// --- day counting -----------------------------------------------------------

const today = parseISODate("2026-09-29");

check("counts days to an open window", () => {
  // 2026-07-17 publishes, grant barred until 2027-01-17, which is 110 days out.
  assert.equal(daysRemaining("2026-07-17", today), 110);
});

check("returns zero on the day the bar lifts", () => {
  assert.equal(daysRemaining("2026-03-29", today), 0);
});

check("goes negative once the window has lapsed", () => {
  // Published 2026-02-18, bar lifted 2026-08-18, 42 days ago.
  assert.equal(daysRemaining("2026-02-18", today), -42);
});

check("is timezone-independent", () => {
  // Same calendar day, different times of day, must give the same answer.
  const morning = new Date("2026-09-29T00:30:00Z");
  const night = new Date("2026-09-29T23:30:00Z");
  assert.equal(daysRemaining("2026-07-17", morning), daysRemaining("2026-07-17", night));
});

// --- banding ----------------------------------------------------------------

check("bands by the thresholds fixed in CLAUDE.md §9", () => {
  assert.equal(urgencyBand(-1), "closed");
  assert.equal(urgencyBand(0), "critical");
  assert.equal(urgencyBand(29), "critical");
  assert.equal(urgencyBand(30), "warning");
  assert.equal(urgencyBand(90), "warning");
  assert.equal(urgencyBand(91), "open");
});

// --- the shape the UI consumes ----------------------------------------------

check("describes an urgent window in plain language", () => {
  const s = windowStatus("2026-04-05", today);
  assert.equal(s.earliestGrant, "2026-10-05");
  assert.equal(s.daysRemaining, 6);
  assert.equal(s.band, "critical");
  assert.equal(s.label, "6 days left to file Form 7A");
});

check("says a lapsed window needs the post-grant route", () => {
  const s = windowStatus("2026-02-18", today);
  assert.equal(s.band, "closed");
  assert.match(s.label, /s\.25\(2\)/);
});

console.log(`\n${checks} checks passed`);
