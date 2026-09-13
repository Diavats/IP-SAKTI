// MOCK DATA — stands in for the live /evals scorecard computed from the
// gold set + BhashaBench-Ayur + the trained abstention gate. No target
// numbers appear here by design, per SAMHITA-PLAN.md §8 — only measured-
// looking values, clearly marked as illustrative in this build phase.
import type { EvalMetric } from "@/lib/types";

export const evalMetrics: EvalMetric[] = [
  {
    axis: "answer_accuracy",
    label: "Answer accuracy",
    value: 0.83,
    method: "LLM judge calibrated against human labels (Cohen's κ = 0.79, n = 54)",
    sampleSize: 260,
    measuredOn: "2026-09-11",
  },
  {
    axis: "citation_correctness",
    label: "Citation correctness",
    value: 0.91,
    method: "Per-sentence NLI entailment against the cited span",
    sampleSize: 260,
    measuredOn: "2026-09-11",
  },
  {
    axis: "safe_abstention",
    label: "Safe abstention",
    value: 0.86,
    method: "Precision on the out-of-scope subset; ECE = 0.04",
    sampleSize: 40,
    measuredOn: "2026-09-11",
  },
  {
    axis: "multilingual_quality",
    label: "Multilingual quality (Hindi)",
    value: 0.78,
    method: "Per-language delta vs. English on a translated subset",
    sampleSize: 60,
    measuredOn: "2026-09-10",
  },
];

export const retrievalBakeOff = [
  { method: "BM25", ndcg10: 0.52, recall20: 0.61 },
  { method: "Dense (bge-m3)", ndcg10: 0.64, recall20: 0.72 },
  { method: "Hybrid", ndcg10: 0.7, recall20: 0.78 },
  { method: "Hybrid + rerank", ndcg10: 0.76, recall20: 0.83 },
];
