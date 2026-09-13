// Shared entity types for the SAMHITĀ frontend.
// These shapes are the contract `lib/api.ts` promises to keep when the mock
// service layer is swapped for the real FastAPI + LangGraph backend.

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

export type AlertStatus = "new" | "reviewing" | "drafted" | "filed";

export interface PrahariAlert {
  id: string;
  applicationNo: string;
  title: string;
  ipc: string;
  applicant: string;
  applicantCountry: string;
  publishedOn: string;
  earliestGrant: string;
  daysRemaining: number;
  urgencyScore: number; // 0-100
  riskScore: number; // 0-100
  matchedFormulationId: string | null;
  matchedSpecies: string[];
  status: AlertStatus;
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
