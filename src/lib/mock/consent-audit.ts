// MOCK DATA — stands in for Saima's lane: Supabase consent ledger and
// append-only audit log. Demoed here against a mock connector, same as
// the real build will be until a paid registry connector exists.
import type { AuditLogEntry, ConsentGrant } from "@/lib/types";

export const consentGrants: ConsentGrant[] = [
  {
    id: "consent-1",
    scope: "Read: National Biodiversity Authority ABS approval records (mock connector)",
    grantedOn: "2026-09-05",
    expiry: "2027-09-05",
    revoked: false,
    accessLog: [
      { accessedOn: "2026-09-08T10:12:00+05:30", actor: "Obligation Planner (Sahayak)" },
      { accessedOn: "2026-09-11T09:40:00+05:30", actor: "Obligation Planner (Sahayak)" },
    ],
  },
  {
    id: "consent-2",
    scope: "Read: GI Registry lookup (mock connector)",
    grantedOn: "2026-09-06",
    expiry: "2027-09-06",
    revoked: false,
    accessLog: [{ accessedOn: "2026-09-08T08:55:00+05:30", actor: "Cultivator View" }],
  },
  {
    id: "consent-3",
    scope: "Read: paid patent registry — PatentsView (subscription, not connected)",
    grantedOn: "2026-08-20",
    expiry: "2026-11-20",
    revoked: true,
    accessLog: [],
  },
];

export const auditLog: AuditLogEntry[] = [
  { id: "audit-1", timestamp: "2026-09-11T16:40:00+05:30", action: "dossier.classification.generated", actor: "Sahayak — Classifier", details: "dos-001 classified as classical_generic, confidence 0.91", corpusVersion: "2026-09-10" },
  { id: "audit-2", timestamp: "2026-09-11T09:40:00+05:30", action: "obligation.consent.accessed", actor: "Sahayak — Obligation Planner", details: "Read ABS approval records for dos-004 under consent-1", corpusVersion: "2026-09-10" },
  { id: "audit-3", timestamp: "2026-09-09T00:03:00+05:30", action: "prahari.sweep.completed", actor: "Prahari — Scheduler", details: "Patent Office Journal issue #37 parsed; 3 candidates matched above threshold", corpusVersion: "2026-09-10" },
  { id: "audit-4", timestamp: "2026-09-09T00:07:00+05:30", action: "prahari.dossier.filed", actor: "Human IP facilitator", details: "Form 7A for alert-1004 filed after manual review", corpusVersion: "2026-09-10" },
  { id: "audit-5", timestamp: "2026-09-08T14:12:00+05:30", action: "query.abstained", actor: "Verification Agent", details: "Query about Nepal jurisdiction abstained — below confidence threshold, escalated to human IP facilitator", corpusVersion: "2026-09-10" },
];
