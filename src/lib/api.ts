// MOCK SERVICE LAYER
// -------------------
// Every function here mirrors the shape a real call to services/brain
// (FastAPI + LangGraph) or Supabase will eventually have: an async
// function, a typed return, a simulated network delay. Components call
// this file exactly as they would a real API client — swapping the
// mock for a real `fetch`/SDK call is a change to this one file.
import {
  cultivatorAssessmentByDossier,
  dossiers as dossierFixtures,
  examinerObjectionsByDossier,
  ipVerdictsByDossier,
  obligationsByDossier,
} from "@/lib/mock/dossiers";
import { auditLog, consentGrants } from "@/lib/mock/consent-audit";
import { evalMetrics, retrievalBakeOff } from "@/lib/mock/evals";
import { graphEdges, graphNodes } from "@/lib/mock/graph";
import { form7ADossiers, prahariAlerts } from "@/lib/mock/prahari";
import { buildQueryResponse } from "@/lib/mock/queries";
import type {
  AuditLogEntry,
  ConsentGrant,
  CultivatorAssessment,
  EvalMetric,
  ExaminerObjection,
  Form7ADossier,
  FormulationDossier,
  GraphEdge,
  GraphNode,
  IPRegimeVerdict,
  ObligationItem,
  PrahariAlert,
  QueryDepth,
  QueryResponse,
} from "@/lib/types";

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getDossiers(): Promise<FormulationDossier[]> {
  return delay(dossierFixtures);
}

export async function getDossier(id: string): Promise<FormulationDossier | null> {
  return delay(dossierFixtures.find((d) => d.id === id) ?? null);
}

export interface DossierDetail {
  dossier: FormulationDossier;
  verdicts: IPRegimeVerdict[];
  obligations: ObligationItem[];
  examinerObjections: ExaminerObjection[] | null;
  cultivator: CultivatorAssessment | null;
}

export async function getDossierDetail(id: string): Promise<DossierDetail | null> {
  const dossier = dossierFixtures.find((d) => d.id === id);
  if (!dossier) return delay(null);
  return delay({
    dossier,
    verdicts: ipVerdictsByDossier[id] ?? [],
    obligations: obligationsByDossier[id] ?? [],
    examinerObjections: examinerObjectionsByDossier[id] ?? null,
    cultivator: cultivatorAssessmentByDossier[id] ?? null,
  });
}

export async function submitQuery(query: string, depth: QueryDepth = "quick"): Promise<QueryResponse> {
  return delay(buildQueryResponse(query, depth), 900);
}

// Synchronous preview of the same canned response, used only to drive the
// live "assembling…" panel while submitQuery's delay plays out — both read
// the same deterministic mock, so nothing here can drift from the real answer.
export function previewQuerySteps(query: string, depth: QueryDepth = "quick") {
  const r = buildQueryResponse(query, depth);
  return {
    agents: r.agents,
    agentReason: r.agentReason,
    assemblySteps: r.assemblySteps,
    prahariSteps: r.prahariSteps ?? [],
    abstained: r.abstained,
  };
}

export async function getPrahariAlerts(): Promise<PrahariAlert[]> {
  return delay(
    [...prahariAlerts].sort((a, b) => a.daysRemaining - b.daysRemaining)
  );
}

export async function getPrahariAlert(id: string): Promise<PrahariAlert | null> {
  return delay(prahariAlerts.find((a) => a.id === id) ?? null);
}

export async function getForm7ADossier(alertId: string): Promise<Form7ADossier | null> {
  return delay(form7ADossiers[alertId] ?? null);
}

// MOCK — stands in for Prahari's dossier generator (step 7 of the sweep
// pipeline: NLI claim matching -> Form 7A draft). Not persisted; a real
// generation would write back to Supabase and require the same human
// review before anything is marked filed.
export async function generateForm7ADossier(alert: PrahariAlert): Promise<Form7ADossier> {
  return delay(
    {
      alertId: alert.id,
      generatedOn: new Date().toISOString().slice(0, 10),
      citations: [
        "Ayurvedic Formulary of India, Part I — matching formulation entry",
        `Ayurvedic Pharmacopoeia of India — ${alert.matchedSpecies[0]} monograph`,
      ],
      summary: `Prior art potentially relevant to this application: ${alert.matchedSpecies.join(", ")} ${alert.matchedSpecies.length > 1 ? "are" : "is"} documented in classical Ayurvedic literature predating the priority date. This submits that documentation for examination; it does not accuse the applicant of misappropriation.`,
      draftText: `FORM 7A — REPRESENTATION FOR OPPOSITION TO GRANT OF PATENT\n(under Rule 55 of the Patents Rules 2003, in respect of Section 25(1))\n\nApplication opposed: ${alert.applicationNo}\n\nGrounds: The claimed use of ${alert.matchedSpecies.join(", ")} substantially overlaps with prior-published Ayurvedic literature. This representation submits the attached passages as prior art potentially relevant to examination of novelty and inventive step.\n\n[Draft — for human review before filing. No submission occurs automatically.]`,
    },
    800
  );
}

export async function getGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  return delay({ nodes: graphNodes, edges: graphEdges });
}

export async function getEvalMetrics(): Promise<EvalMetric[]> {
  return delay(evalMetrics);
}

export async function getRetrievalBakeOff() {
  return delay(retrievalBakeOff);
}

export async function getConsentGrants(): Promise<ConsentGrant[]> {
  return delay(consentGrants);
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  return delay(auditLog);
}
