// Shared entity types for the SAMHITĀ frontend.
// These shapes are the contract `lib/api.ts` promises to keep when the mock
// service layer is swapped for the real FastAPI + LangGraph backend.

import type { UrgencyBand } from "@/lib/opposition-window";

export type { UrgencyBand };

export type Jurisdiction = "IN" | "INTL";

export type FormulationCategory =
  | "classical_generic"
  | "patent_or_proprietary"
  | "new_non_classical"
  | "phytopharmaceutical"
  | "ayurveda_aahar"
  | "cosmetic";

export type DossierStatus = "draft" | "classified" | "mapped" | "under_review";

export interface Classification {
  category: FormulationCategory;
  confidence: number; // 0-1
  citation: string;
}

export interface FormulationDossier {
  id: string;
  name: string;
  dravyaList: string[];
  sourcing: "wild_collected" | "cultivated" | "imported";
  claimedIndication: string;
  targetMarket: string[];
  classicalTextRef?: string;
  jurisdiction: Jurisdiction;
  classification: Classification;
  status: DossierStatus;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export type IPRegime =
  | "patent"
  | "trademark"
  | "geographical_indication"
  | "copyright"
  | "design"
  | "trade_secret"
  | "plant_variety";

export type Verdict = "open" | "barred" | "maybe_open";

export interface IPRegimeVerdict {
  regime: IPRegime;
  label: string;
  verdict: Verdict;
  citation: string;
  note: string;
}

export type ObligationCategory =
  | "licence"
  | "abs"
  | "advertising"
  | "labelling"
  | "fssai";

export interface ObligationItem {
  id: string;
  title: string;
  description: string;
  citation: string;
  category: ObligationCategory;
  status: "required" | "conditional" | "not_applicable";
}

export interface ExaminerObjection {
  section: "3(p)" | "3(e)" | "3(d)" | "novelty" | "inventive_step";
  title: string;
  argument: string;
  citation: string;
}

export interface CultivatorAssessment {
  species: string;
  district: string;
  giEligible: boolean;
  giNote: string;
  absPosture: string;
  ppvfrRoute: string;
}

export type AlertStatus = "new" | "reviewing" | "drafted" | "filed" | "lapsed";

/**
 * Which sweep found this. CLAUDE.md §9 fixes the domestic Patent Office Journal
 * as the primary stream; foreign filings are the stretch stream, because India
 * can act on a domestic application for the cost of a Form 7A and cannot act
 * nearly as cheaply on a foreign one.
 */
export type AlertStream = "domestic" | "foreign";

/**
 * One record as it lands from a sweep, before window arithmetic.
 *
 * Deliberately carries no `earliestGrant`, `daysRemaining` or `urgencyScore`.
 * Those are functions of today's date, so storing them would freeze a
 * countdown that is supposed to tick. See lib/opposition-window.ts.
 */
export interface PrahariAlertSeed {
  id: string;
  stream: AlertStream;
  applicationNo: string;
  title: string;
  ipc: string;
  applicant: string;
  applicantCountry: string;
  publishedOn: string;
  riskScore: number; // 0-100, how closely the claim tracks known prior art
  matchedFormulationId: string | null;
  matchedSpecies: string[];
  status: AlertStatus;
}

/** A seed plus everything derived from the clock. What the UI renders. */
export interface PrahariAlert extends PrahariAlertSeed {
  /** Publication + 6 months, per Rule 55(1A). */
  earliestGrant: string;
  /** Negative once the bar has lifted and only s.25(2) remains. */
  daysRemaining: number;
  /** Red under 30 days, amber 30–90, green beyond, grey once closed (§9). */
  band: UrgencyBand;
  /** Plain-language countdown. Never relies on colour alone. */
  windowLabel: string;
  urgencyScore: number; // 0-100, derived from daysRemaining
}

export interface Form7ADossier {
  alertId: string;
  generatedOn: string;
  citations: string[];
  summary: string;
  draftText: string;
}

export type GraphNodeType =
  | "Dravya"
  | "Formulation"
  | "Statute"
  | "Provision"
  | "Patent"
  | "GI"
  | "Taxon";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
}

export type GraphEdgeType =
  | "CONTAINS"
  | "GOVERNED_BY"
  | "BARRED_BY"
  | "CLAIMS_USE_OF"
  | "ANTICIPATED_BY"
  | "SYNONYM_OF";

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
  confidence: number;
  provenance: string;
}

export type EvalAxis =
  | "answer_accuracy"
  | "citation_correctness"
  | "safe_abstention"
  | "multilingual_quality";

export interface EvalMetric {
  axis: EvalAxis;
  label: string;
  value: number; // 0-1
  method: string;
  sampleSize: number;
  measuredOn: string;
}

export type QueryDepth = "quick" | "guided" | "deep";

export type AgentName = "sahayak" | "prahari";

export interface QueryCitation {
  label: string;
  source: string;
}

export interface DossierAssemblyStep {
  label: string;
  value: string;
}

export interface QueryResponse {
  id: string;
  query: string;
  depth: QueryDepth;
  agents: AgentName[];
  agentReason: string;
  answer: string;
  citations: QueryCitation[];
  confidence: number;
  evalScore: number;
  evalMethod: string;
  corpusVersion: string;
  abstained: boolean;
  abstainReason?: string;
  escalations: { label: string; depth: QueryDepth }[];
  assemblySteps: DossierAssemblyStep[];
  prahariSteps?: string[];
}

export interface ConsentGrant {
  id: string;
  scope: string;
  grantedOn: string;
  expiry: string;
  revoked: boolean;
  accessLog: { accessedOn: string; actor: string }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  corpusVersion: string;
}
