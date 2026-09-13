// MOCK DATA — stands in for the Orchestrator + Depth Controller +
// hybrid retrieval + generation + Verification Agent pipeline.
// Canned responses keyed by keyword match against the query text — one
// entry per demo scenario, hardcoded so the Ask tab never breaks mid-demo.
import type {
  AgentName,
  DossierAssemblyStep,
  QueryDepth,
  QueryResponse,
} from "@/lib/types";

interface CannedResponse {
  keywords: string[];
  agents: AgentName[];
  agentReason: string;
  answer: string;
  citations: { label: string; source: string }[];
  confidence: number;
  evalScore: number;
  evalMethod: string;
  assemblySteps: DossierAssemblyStep[];
  prahariSteps?: string[];
}

const canned: CannedResponse[] = [
  {
    keywords: ["patent", "ashwagandha", "turmeric", "guduchi", "polyherbal"],
    agents: ["sahayak"],
    agentReason: "formulation classification and IP-regime mapping requested",
    answer:
      "Patent protection is barred under Section 3(e) of the Patents Act 1970 — combining Ashwagandha, Guduchi and Turmeric without disclosed synergistic data reads as a mere admixture of known properties. But you have five open doors: trade mark, copyright, design, trade secret, and a conditional geographical indication — and here is the order to file them in.",
    citations: [
      { label: "Patents Act 1970, Sec 3(e)", source: "India Code" },
      { label: "AFI Part I, Formulation 112", source: "Ayurvedic Formulary of India" },
    ],
    confidence: 0.88,
    evalScore: 0.93,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Dravya list", value: "Withania somnifera, Tinospora cordifolia, Curcuma longa" },
      { label: "Formulary match", value: "AFI Part I, Formulation 112 (classical ratio)" },
      { label: "Classification", value: "Classical / generic — confidence 0.91" },
      { label: "Patent verdict", value: "Barred — Sec 3(e), mere admixture" },
      { label: "Open regimes", value: "Trade mark, copyright, design, trade secret, GI (conditional)" },
    ],
  },
  {
    keywords: ["trademark", "trade mark", "brand name"],
    agents: ["sahayak"],
    agentReason: "trademark regime lookup for a named formulation",
    answer:
      "Trade mark is open for a distinctive product name — it is almost always the real answer for a classical formulation, and the one most MSMEs never think of. A generic descriptor (e.g. \"Ashwagandha Tablets\") won't register; a coined or arbitrary name will.",
    citations: [{ label: "Trade Marks Act 1999, Sec 9", source: "India Code" }],
    confidence: 0.85,
    evalScore: 0.9,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Regime checked", value: "Trade mark (Trade Marks Act 1999)" },
      { label: "Distinctiveness test", value: "Sec 9 — descriptive marks refused" },
      { label: "Verdict", value: "Open, conditional on a coined/arbitrary mark" },
    ],
  },
  {
    keywords: ["licence", "license", "obligation", "manufacturing"],
    agents: ["sahayak"],
    agentReason: "obligation planner invoked for licensing requirements",
    answer:
      "For a classical/generic Ayurvedic formulation, you need a manufacturing licence under Schedule T of the Drugs & Cosmetics Rules 1945 (loan-licence or in-house). If any dravya is wild-collected rather than cultivated, check the ABS obligation separately — normally-traded commodities are exempt, but a rarer species may trigger a State Biodiversity Board filing.",
    citations: [
      { label: "Drugs & Cosmetics Rules 1945, Sched. T", source: "India Code" },
      { label: "Biological Diversity Act 2002, Sec 7", source: "India Code" },
    ],
    confidence: 0.82,
    evalScore: 0.88,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Obligation category", value: "Manufacturing licence" },
      { label: "Route", value: "Schedule T — loan-licence or in-house" },
      { label: "ABS check", value: "Conditional on wild-collected sourcing" },
    ],
  },
  {
    keywords: ["cosmetic", "skin", "neem"],
    agents: ["sahayak"],
    agentReason: "formulation classifier routing a topical claim",
    answer:
      "A topical neem-turmeric preparation classifies as a cosmetic, not an ASU drug, if its claimed use stays cosmetic (blemish support) rather than therapeutic. That routes it through the Cosmetics Rules, not Schedule T — a lighter licensing path, but patent is barred regardless: the neem-turmeric skin use is well-documented classical prior art under Sec 3(p).",
    citations: [
      { label: "Drugs & Cosmetics Act 1940, Ch. IV", source: "India Code" },
      { label: "Patents Act 1970, Sec 3(p)", source: "India Code" },
    ],
    confidence: 0.86,
    evalScore: 0.91,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Dravya list", value: "Azadirachta indica, Curcuma longa" },
      { label: "Classification", value: "Cosmetic — confidence 0.88" },
      { label: "Patent verdict", value: "Barred — Sec 3(p), classical prior art" },
    ],
  },
  {
    keywords: ["examiner", "3(e)", "3(d)", "objection", "attack"],
    agents: ["sahayak"],
    agentReason: "Examiner View fires — patent verdict is \"may be open\"",
    answer:
      "Running Examiner View against a proprietary Brahmi–Shankhpushpi extract: an examiner would raise Sec 3(d) (new form of a known substance without demonstrated enhanced efficacy), question novelty against already-published extraction ratios, and treat the combination as routine optimisation absent synergy data. These are grounded in the draft AYUSH patent guidelines — labelled draft until Himanshi confirms finalisation.",
    citations: [
      { label: "Patents Act 1970, Sec 3(d)", source: "India Code" },
      { label: "Draft AYUSH Patent Guidelines, 5 Feb 2025, §5.1", source: "IP Office (draft)" },
    ],
    confidence: 0.79,
    evalScore: 0.85,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Trigger", value: "Patent verdict: may be open" },
      { label: "Objections raised", value: "Sec 3(d), novelty, inventive step" },
      { label: "Guidance status", value: "Draft — unverified until Himanshi confirms" },
    ],
  },
  {
    keywords: ["gi", "geographical indication", "guggul", "cultivator", "rajasthan", "grow"],
    agents: ["sahayak"],
    agentReason: "Cultivator View — regional provenance and GI eligibility check",
    answer:
      "For Commiphora wightii sourced from Nagaur, Rajasthan: a geographical indication is open given documented distinct provenance. GI eligibility does not require a finished formulation — raw dravya with regional identity can qualify. A State Biodiversity Board Form I filing is required before commercial sale since it's wild-collected.",
    citations: [
      { label: "GI Act 1999, Sec 2(1)(e)", source: "India Code" },
      { label: "Biological Diversity Act 2002, Sec 7", source: "India Code" },
    ],
    confidence: 0.79,
    evalScore: 0.87,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Species", value: "Commiphora wightii" },
      { label: "District", value: "Nagaur, Rajasthan" },
      { label: "GI verdict", value: "Open — documented distinct provenance" },
      { label: "ABS posture", value: "Form I filing required, wild-collected" },
    ],
  },
  {
    keywords: ["export", "eu", "europe", "us market", "international", "jurisdiction"],
    agents: ["sahayak"],
    agentReason: "regulatory-profile engine — export market-access gap analysis",
    answer:
      "For the EU, traditional-use registration under the THMPD needs 30 years' evidence (15 within the EU) plus a quality, safety and bibliographic-efficacy dossier — no clinical trials required, but disease-treatment claims are prohibited. For the US, DSHEA/NDI governs supplement-style entry. Both are shown as separate answer sets from the Indian pathway — a translated statute is never blended with the source jurisdiction's own text.",
    citations: [{ label: "Directive 2004/24/EC, Art. 16c", source: "WIPO Lex / EU" }],
    confidence: 0.74,
    evalScore: 0.83,
    evalMethod: "Per-sentence NLI entailment against the cited statute span",
    assemblySteps: [
      { label: "Jurisdiction toggle", value: "International — EU profile" },
      { label: "Route", value: "Traditional Herbal Registration (THMPD)" },
      { label: "Evidence required", value: "30 years total, 15 within EU" },
    ],
  },
  {
    keywords: ["prahari", "watch", "watchlist", "biopiracy", "misappropriation"],
    agents: ["prahari"],
    agentReason: "watchlist status requested — Prahari's domain, not Sahayak's",
    answer:
      "Prahari is currently watching 5 published applications with claims over Indian-origin dravya. One (WO2026/154332 A1, Withania somnifera) has 6 days remaining before its earliest possible grant and has already been filed as a third-party observation after human review. None of these are accusations — each is prior art potentially relevant to the examiner's review.",
    citations: [
      { label: "Patents Act 1970, Sec 25(1)", source: "India Code" },
      { label: "Patent Office Journal, Issue #37", source: "ipindia.nic.in" },
    ],
    confidence: 0.92,
    evalScore: 0.94,
    evalMethod: "Precision on top-ranked candidates, human-reviewed",
    assemblySteps: [],
    prahariSteps: [
      "Patent Office Journal (weekly PDF)",
      "Species resolution — POWO / IPNI / GBIF",
      "Claim-vs-prior-art NLI matching",
      "Opposition-window computation",
    ],
  },
  {
    keywords: ["nepal", "bhutan", "sri lanka"],
    agents: ["sahayak"],
    agentReason: "query received, but routed to abstention before an answer was drafted",
    answer: "",
    citations: [],
    confidence: 0.31,
    evalScore: 0,
    evalMethod: "Calibrated abstention gate — below threshold",
    assemblySteps: [],
  },
];

const fallback: CannedResponse = {
  keywords: [],
  agents: ["sahayak"],
  agentReason: "general formulation question — default IP-map lookup",
  answer:
    "Based on the corpus, this formulation's classical-generic classification (AFI Part I match) keeps patent protection barred under Sec 3(p)/3(e), while trade mark, copyright, design and trade secret remain open. Open the full IP Protection Map for the section-by-section breakdown.",
  citations: [{ label: "AFI Part I", source: "Ayurvedic Formulary of India" }],
  confidence: 0.7,
  evalScore: 0.8,
  evalMethod: "Per-sentence NLI entailment against the cited statute span",
  assemblySteps: [
    { label: "Formulary match", value: "AFI Part I — partial match" },
    { label: "Patent verdict", value: "Barred — Sec 3(p)/3(e)" },
  ],
};

function pickCanned(query: string): CannedResponse {
  const lower = query.toLowerCase();
  return canned.find((c) => c.keywords.some((k) => lower.includes(k))) ?? fallback;
}

const escalationLadder: { depth: QueryDepth; label: string }[] = [
  { depth: "guided", label: "Show the full IP Protection Map" },
  { depth: "deep", label: "Search global patents" },
];

let queryCounter = 0;

export function buildQueryResponse(query: string, depth: QueryDepth): QueryResponse {
  queryCounter += 1;
  const match = pickCanned(query);
  const abstained = match.confidence < 0.5;
  return {
    id: `qr-${queryCounter}`,
    query,
    depth,
    agents: match.agents,
    agentReason: match.agentReason,
    answer: abstained
      ? "This falls outside the corpus SAMHITĀ currently covers — international jurisdictions beyond the US/EU regulatory profiles aren't yet verified, and the source material that does exist (WIPO Lex's general treaty text) doesn't resolve to a specific national procedure. Rather than infer a procedure from an adjacent jurisdiction's rules, this has been logged and routed to a human IP facilitator."
      : match.answer,
    citations: abstained ? [] : match.citations,
    confidence: match.confidence,
    evalScore: match.evalScore,
    evalMethod: match.evalMethod,
    corpusVersion: "2026-09-10",
    abstained,
    abstainReason: abstained
      ? "Insufficient verified source coverage for this jurisdiction — conflicting inference risk outweighs answering."
      : undefined,
    escalations:
      abstained || !match.agents.includes("sahayak")
        ? []
        : escalationLadder.filter((e) => e.depth !== depth || depth === "quick"),
    assemblySteps: match.assemblySteps,
    prahariSteps: match.prahariSteps,
  };
}
