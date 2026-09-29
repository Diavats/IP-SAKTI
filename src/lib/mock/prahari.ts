// Prahari's alert feed.
//
// WHAT IS REAL HERE: nothing about the window is stored. `earliestGrant`,
// `daysRemaining` and the urgency band are all computed from `publishedOn`
// by lib/opposition-window.ts, live, against today's date. That arithmetic is
// the product's one genuine claim and it is unit-tested.
//
// WHAT IS NOT REAL: the records themselves are a representative sample in
// Patent Office Journal format, not a live sweep. The Journal parser is Week 2
// work and does not exist yet. The UI labels this sample as such — do not
// remove that label.
//
// Stream split follows CLAUDE.md §9: the domestic Journal is the PRIMARY
// stream, foreign filings are the stretch stream. Six domestic to four foreign.
import type { Form7ADossier, PrahariAlert, PrahariAlertSeed } from "@/lib/types";
import { urgencyBand, windowStatus } from "@/lib/opposition-window";

/**
 * Raw records, as they would land from a Journal sweep.
 *
 * Publication dates are spread deliberately so the demo shows every urgency
 * band at once: two closing inside a month, two inside ninety days, four with
 * room, and two already lapsed. A feed where everything is green proves nothing.
 */
const prahariAlertSeeds: PrahariAlertSeed[] = [
  // ---- domestic stream (primary, per §9) ----------------------------------
  {
    id: "alert-in-001",
    stream: "domestic",
    applicationNo: "202641008734 A",
    title:
      "Polyherbal composition comprising Withania somnifera and Tinospora cordifolia for stress adaptation",
    ipc: "A61K36/185",
    applicant: "Meridian Life Sciences Pvt. Ltd.",
    applicantCountry: "India",
    publishedOn: "2026-04-05",
    riskScore: 84,
    matchedFormulationId: "dos-001",
    matchedSpecies: ["Withania somnifera", "Tinospora cordifolia"],
    status: "reviewing",
  },
  {
    id: "alert-in-002",
    stream: "domestic",
    applicationNo: "202611004512 A",
    title: "Curcuma longa extract formulation and process for dermal application",
    ipc: "A61K36/9066",
    applicant: "Hexa Botanicals Limited",
    applicantCountry: "India",
    publishedOn: "2026-04-22",
    riskScore: 79,
    matchedFormulationId: "dos-003",
    matchedSpecies: ["Curcuma longa"],
    status: "drafted",
  },
  {
    id: "alert-in-003",
    stream: "domestic",
    applicationNo: "202621019860 A",
    title: "Triphala-based composition for digestive regulation and method of preparation",
    ipc: "A61K36/45",
    applicant: "Sanjivani Herbals Pvt. Ltd.",
    applicantCountry: "India",
    publishedOn: "2026-05-14",
    riskScore: 71,
    matchedFormulationId: "dos-005",
    matchedSpecies: [
      "Terminalia chebula",
      "Terminalia bellirica",
      "Phyllanthus emblica",
    ],
    status: "new",
  },
  {
    id: "alert-in-004",
    stream: "domestic",
    applicationNo: "202631012093 A",
    title: "Bacopa monnieri standardised extract for cognitive support",
    ipc: "A61K36/28",
    applicant: "Aurex Nutraceuticals Pvt. Ltd.",
    applicantCountry: "India",
    publishedOn: "2026-06-30",
    riskScore: 66,
    matchedFormulationId: "dos-002",
    matchedSpecies: ["Bacopa monnieri"],
    status: "new",
  },
  {
    id: "alert-in-005",
    stream: "domestic",
    applicationNo: "202641021447 A",
    title: "Commiphora wightii oleoresin composition for lipid management",
    ipc: "A61K36/23",
    applicant: "Nirmaya Formulations Pvt. Ltd.",
    applicantCountry: "India",
    publishedOn: "2026-08-08",
    riskScore: 58,
    matchedFormulationId: "dos-004",
    matchedSpecies: ["Commiphora wightii"],
    status: "new",
  },
  {
    id: "alert-in-006",
    stream: "domestic",
    // Published on a 31st. Six months lands on 28 Feb 2027, not 3 March —
    // the month-end clamp in opposition-window.ts, visible in the UI.
    applicationNo: "202611027305 A",
    title: "Azadirachta indica leaf extract preparation for topical antimicrobial use",
    ipc: "A61K36/58",
    applicant: "Pravara Bioceuticals Pvt. Ltd.",
    applicantCountry: "India",
    publishedOn: "2026-08-31",
    riskScore: 49,
    matchedFormulationId: "dos-003",
    matchedSpecies: ["Azadirachta indica"],
    status: "new",
  },

  // ---- foreign stream (stretch, per §9) -----------------------------------
  {
    id: "alert-fr-001",
    stream: "foreign",
    applicationNo: "EP4218765 A1",
    title: "Herbal extract combination for cognitive support comprising Bacopa monnieri",
    ipc: "A61K36/28",
    applicant: "NordicaHerb GmbH",
    applicantCountry: "Germany",
    publishedOn: "2026-06-02",
    riskScore: 81,
    matchedFormulationId: "dos-002",
    matchedSpecies: ["Bacopa monnieri"],
    status: "reviewing",
  },
  {
    id: "alert-fr-002",
    stream: "foreign",
    applicationNo: "US2026/0184331 A1",
    title:
      "Topical composition comprising Curcuma longa and Azadirachta indica extracts for dermal use",
    ipc: "A61K36/00",
    applicant: "Verdant Biosciences Inc.",
    applicantCountry: "United States",
    publishedOn: "2026-07-17",
    riskScore: 76,
    matchedFormulationId: "dos-003",
    matchedSpecies: ["Curcuma longa", "Azadirachta indica"],
    status: "new",
  },
  {
    id: "alert-fr-003",
    stream: "foreign",
    applicationNo: "WO2026/154332 A1",
    title: "Withania somnifera root extract composition and method of use for stress reduction",
    ipc: "A61K36/185",
    applicant: "Solstice Wellness Corp.",
    applicantCountry: "United States",
    publishedOn: "2026-02-18",
    riskScore: 70,
    matchedFormulationId: "dos-001",
    matchedSpecies: ["Withania somnifera"],
    status: "filed",
  },
  {
    id: "alert-fr-004",
    stream: "foreign",
    applicationNo: "JP2026-098234 A",
    title: "Skin care composition containing plant extract of genus Commiphora",
    ipc: "A61K36/23",
    applicant: "Sakura Cosmetics K.K.",
    applicantCountry: "Japan",
    publishedOn: "2026-03-11",
    riskScore: 45,
    matchedFormulationId: "dos-004",
    matchedSpecies: ["Commiphora wightii"],
    status: "lapsed",
  },
];

/**
 * Derive the live view of the feed.
 *
 * Called per request rather than computed once at module load, so the
 * countdown is correct on a long-running server and cannot be baked in at
 * build time. `now` is injectable so tests and screenshots can pin a date.
 */
export function buildPrahariAlerts(now: Date = new Date()): PrahariAlert[] {
  return prahariAlertSeeds.map((seed) => {
    const window = windowStatus(seed.publishedOn, now);
    return {
      ...seed,
      earliestGrant: window.earliestGrant,
      daysRemaining: window.daysRemaining,
      band: window.band,
      windowLabel: window.label,
      // Urgency is a function of the clock, not a stored opinion. Risk is how
      // well the claim matches known prior art; urgency is how soon the door
      // shuts. Ranking uses urgency first — §2.3 of the plan is explicit that a
      // closing window outranks a marginally better match.
      urgencyScore: urgencyScoreFor(window.daysRemaining),
    };
  });
}

/**
 * Map days-remaining onto 0–100 for sorting and for the ring charts.
 *
 * Lapsed windows score 0 rather than a high number: there is nothing left to
 * act on, so they must not sit at the top of an action queue.
 */
function urgencyScoreFor(days: number): number {
  if (days < 0) return 0;
  if (days === 0) return 100;
  // 180 days is the full statutory window, so scale against that and clamp.
  const score = Math.round(100 - (days / 180) * 100);
  return Math.max(1, Math.min(100, score));
}

/** Re-exported for callers that only need the band thresholds. */
export { urgencyBand };

export const form7ADossiers: Record<string, Form7ADossier> = {
  "alert-in-002": {
    alertId: "alert-in-002",
    generatedOn: "2026-09-11",
    citations: [
      "Ayurvedic Formulary of India, Part I, Formulation 88",
      "Ayurvedic Pharmacopoeia of India, Part I, Vol. III — Curcuma longa monograph",
      "Sharangadhara Samhita, Madhyama Khanda 7/40–43",
    ],
    summary:
      "Prior art potentially relevant to this application. Topical use of Curcuma longa is documented in the Ayurvedic Formulary of India and in the Pharmacopoeia dravya monograph, both published well before the priority date. This submission places that documentation before the examiner. It makes no allegation against the applicant.",
    draftText:
      "FORM 7A — REPRESENTATION FOR OPPOSITION TO GRANT OF PATENT\n(under Rule 55 of the Patents Rules 2003, in respect of Section 25(1))\n\nApplication opposed: 202611004512 A\nPublished under Section 11A on: 2026-04-22\nEarliest permissible grant under Rule 55(1A): 2026-10-22\n\nGrounds: The claimed topical composition of Curcuma longa is anticipated by published Ayurvedic literature, specifically the Ayurvedic Formulary of India, Part I (Formulation 88) and Sharangadhara Samhita, Madhyama Khanda 7/40–43, both predating the priority date. The representation submits the attached passages as prior art potentially relevant to examination of novelty and inventive step.\n\n[Draft. Human review required before filing. No submission occurs automatically.]",
  },
  "alert-fr-003": {
    alertId: "alert-fr-003",
    generatedOn: "2026-09-08",
    citations: [
      "Ayurvedic Formulary of India, Part I, Formulation 112",
      "Ayurvedic Pharmacopoeia of India, Part I, Vol. I — Withania somnifera monograph",
    ],
    summary:
      "Prior art potentially relevant to this application. Withania somnifera root extract for stress and vitality support is a classical, widely published use. Filed as a third-party observation for the examiner's consideration.",
    draftText:
      "THIRD-PARTY OBSERVATION (PCT / WO2026-154332 A1)\n\nThe claimed composition and method of use substantially overlap with classical Ayurvedic preparations of Withania somnifera root, documented in the Ayurvedic Formulary of India (Formulation 112) and the Ayurvedic Pharmacopoeia of India monograph. Submitted as prior art potentially relevant to examination.\n\n[Draft. Filed 2026-09-09 after human review.]",
  },
};
